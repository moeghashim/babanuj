import "server-only";

import { ensureStartsWith, baseUrl } from "lib/utils";
import { cookies } from "next/headers";

const AUTH_COOKIE = "ba_customer_auth";
const STATE_COOKIE = "ba_customer_oauth_state";
const VERIFIER_COOKIE = "ba_customer_oauth_verifier";
const NONCE_COOKIE = "ba_customer_oauth_nonce";
const RETURN_COOKIE = "ba_customer_oauth_return";

const CUSTOMER_SCOPE = "openid email customer-account-api:full";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const OAUTH_MAX_AGE = 60 * 10;

type OAuthDiscovery = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
};

type CustomerApiDiscovery = {
  graphql_api: string;
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
};

export type CustomerSession = {
  accessToken: string;
  expiresAt: number;
  idToken?: string;
  refreshToken?: string;
};

export type CustomerAccountConfig = {
  clientId: string;
  redirectUri: string;
  shopDomain: string;
  sessionSecret: string;
};

export type CustomerMoney = {
  amount: string;
  currencyCode: string;
};

export type CustomerAddress = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  zoneCode?: string | null;
  country?: string | null;
  territoryCode?: string | null;
  zip?: string | null;
  phoneNumber?: string | null;
  formatted?: string[];
};

export type CustomerOrder = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  statusPageUrl?: string;
  totalPrice: CustomerMoney;
  lineItems: {
    nodes: {
      title: string;
      quantity: number;
      totalPrice?: CustomerMoney | null;
    }[];
  };
  shippingAddress?: CustomerAddress | null;
};

export type CustomerAccount = {
  id: string;
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: {
    emailAddress?: string | null;
  } | null;
  defaultAddress?: CustomerAddress | null;
  addresses: {
    nodes: CustomerAddress[];
  };
  orders: {
    nodes: CustomerOrder[];
  };
};

type CustomerGraphqlResponse<T> = {
  data?: T;
  errors?: {
    message: string;
  }[];
};

export function getCustomerAccountConfig(): CustomerAccountConfig | undefined {
  const shopDomain =
    process.env.SHOPIFY_STORE_DOMAIN ??
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!shopDomain || !clientId || !sessionSecret) {
    return undefined;
  }

  return {
    clientId,
    sessionSecret,
    shopDomain: ensureStartsWith(shopDomain, "https://").replace(
      /^https:\/\//,
      "",
    ),
    redirectUri:
      process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI ??
      `${baseUrl}/account/authorize`,
  };
}

export function isCustomerAccountConfigured() {
  return Boolean(getCustomerAccountConfig());
}

export async function beginCustomerLogin(returnTo: string, requestUrl: string) {
  const config = getCustomerAccountConfig();

  if (!config) {
    return {
      configured: false as const,
      redirectUrl: new URL("/account", requestUrl),
    };
  }

  const discovery = await getOAuthDiscovery(config.shopDomain);
  const state = randomBase64Url(32);
  const nonce = randomBase64Url(32);
  const verifier = randomBase64Url(64);
  const challenge = await sha256Base64Url(verifier);
  const url = new URL(discovery.authorization_endpoint);

  url.searchParams.set("scope", CUSTOMER_SCOPE);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  const store = await cookies();
  const options = cookieOptions(OAUTH_MAX_AGE);
  store.set(STATE_COOKIE, state, options);
  store.set(VERIFIER_COOKIE, verifier, options);
  store.set(NONCE_COOKIE, nonce, options);
  store.set(RETURN_COOKIE, sanitizeReturnPath(returnTo), options);

  return {
    configured: true as const,
    redirectUrl: url,
  };
}

export async function finishCustomerLogin(code: string, state: string) {
  const config = getCustomerAccountConfig();

  if (!config) {
    throw new Error("Customer Account API is not configured.");
  }

  const store = await cookies();
  const expectedState = store.get(STATE_COOKIE)?.value;
  const verifier = store.get(VERIFIER_COOKIE)?.value;

  if (!expectedState || expectedState !== state || !verifier) {
    throw new Error("Customer login could not be verified.");
  }

  const discovery = await getOAuthDiscovery(config.shopDomain);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code,
    code_verifier: verifier,
  });

  const response = await fetch(discovery.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Babanuj storefront",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Shopify rejected customer login (${response.status}).`);
  }

  const token = (await response.json()) as TokenResponse;
  const session: CustomerSession = {
    accessToken: token.access_token,
    expiresAt: Date.now() + Math.max(0, token.expires_in - 60) * 1000,
    idToken: token.id_token,
    refreshToken: token.refresh_token,
  };

  store.set(AUTH_COOKIE, await encryptSession(session, config.sessionSecret), {
    ...cookieOptions(SESSION_MAX_AGE),
    maxAge: SESSION_MAX_AGE,
  });
  const returnTo = sanitizeReturnPath(store.get(RETURN_COOKIE)?.value);
  clearOAuthCookies(store);

  return returnTo;
}

export async function getCustomerSession(): Promise<
  CustomerSession | undefined
> {
  const config = getCustomerAccountConfig();
  if (!config) return undefined;

  const encrypted = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!encrypted) return undefined;

  const session = await decryptSession(encrypted, config.sessionSecret).catch(
    () => undefined,
  );

  if (!session || session.expiresAt <= Date.now()) {
    return undefined;
  }

  return session;
}

export async function clearCustomerSession() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  clearOAuthCookies(store);
}

export async function getCustomerLogoutUrl(fallbackUrl: string) {
  const config = getCustomerAccountConfig();
  const session = await getCustomerSession();

  if (!config || !session?.idToken) {
    return fallbackUrl;
  }

  try {
    const discovery = await getOAuthDiscovery(config.shopDomain);
    if (!discovery.end_session_endpoint) return fallbackUrl;

    const url = new URL(discovery.end_session_endpoint);
    url.searchParams.set("id_token_hint", session.idToken);
    url.searchParams.set("post_logout_redirect_uri", fallbackUrl);
    return url.toString();
  } catch {
    return fallbackUrl;
  }
}

export async function getCustomerAccount(session: CustomerSession) {
  const response = await customerAccountFetch<{ customer: CustomerAccount }>(
    session,
    ACCOUNT_QUERY,
  );

  return response.customer;
}

export async function getCustomerOrders(session: CustomerSession) {
  const response = await customerAccountFetch<{
    customer: Pick<CustomerAccount, "displayName" | "orders">;
  }>(session, ORDERS_QUERY);

  return response.customer;
}

export async function getCustomerOrder(
  session: CustomerSession,
  orderId: string,
) {
  const response = await customerAccountFetch<{ order: CustomerOrder | null }>(
    session,
    ORDER_QUERY,
    { id: orderId },
  );

  return response.order;
}

export async function getCustomerAddresses(session: CustomerSession) {
  const response = await customerAccountFetch<{
    customer: Pick<
      CustomerAccount,
      "displayName" | "defaultAddress" | "addresses"
    >;
  }>(session, ADDRESSES_QUERY);

  return response.customer;
}

export async function getCustomerProfile(session: CustomerSession) {
  const response = await customerAccountFetch<{
    customer: Pick<
      CustomerAccount,
      "displayName" | "firstName" | "lastName" | "emailAddress"
    >;
  }>(session, PROFILE_QUERY);

  return response.customer;
}

export async function updateCustomerProfile(
  session: CustomerSession,
  input: { firstName?: string; lastName?: string },
) {
  return customerAccountFetch<{
    customerUpdate: {
      userErrors: ShopifyUserError[];
    };
  }>(session, UPDATE_PROFILE_MUTATION, { input });
}

export async function createCustomerAddress(
  session: CustomerSession,
  address: CustomerAddressInput,
  defaultAddress: boolean,
) {
  return customerAccountFetch<{
    customerAddressCreate: {
      userErrors: ShopifyUserError[];
    };
  }>(session, CREATE_ADDRESS_MUTATION, { address, defaultAddress });
}

export async function updateCustomerAddress(
  session: CustomerSession,
  addressId: string,
  address: CustomerAddressInput,
  defaultAddress: boolean,
) {
  return customerAccountFetch<{
    customerAddressUpdate: {
      userErrors: ShopifyUserError[];
    };
  }>(session, UPDATE_ADDRESS_MUTATION, {
    addressId,
    address,
    defaultAddress,
  });
}

export async function deleteCustomerAddress(
  session: CustomerSession,
  addressId: string,
) {
  return customerAccountFetch<{
    customerAddressDelete: {
      userErrors: ShopifyUserError[];
    };
  }>(session, DELETE_ADDRESS_MUTATION, { addressId });
}

export function collectUserErrorMessage(errors: ShopifyUserError[] = []) {
  if (errors.length === 0) return undefined;
  return errors
    .map((error) => {
      const path = error.field?.join(".");
      return path ? `${path}: ${error.message}` : error.message;
    })
    .join("; ");
}

export function sanitizeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }

  return value;
}

async function customerAccountFetch<T>(
  session: CustomerSession,
  query: string,
  variables?: Record<string, unknown>,
) {
  const config = getCustomerAccountConfig();
  if (!config) {
    throw new Error("Customer Account API is not configured.");
  }

  const endpoint = await getCustomerGraphqlEndpoint(config.shopDomain);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: session.accessToken,
      "User-Agent": "Babanuj storefront",
    },
    body: JSON.stringify({ query, variables: variables ?? {} }),
    cache: "no-store",
  });

  const json = (await response.json()) as CustomerGraphqlResponse<T>;
  if (!response.ok || json.errors?.length) {
    throw new Error(
      json.errors?.map((error) => error.message).join("; ") ??
        `Customer Account API request failed (${response.status}).`,
    );
  }

  if (!json.data) {
    throw new Error("Customer Account API returned no data.");
  }

  return json.data;
}

async function getOAuthDiscovery(shopDomain: string): Promise<OAuthDiscovery> {
  const response = await fetch(
    `https://${shopDomain}/.well-known/openid-configuration`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load Shopify customer authentication settings.");
  }

  return response.json();
}

async function getCustomerGraphqlEndpoint(shopDomain: string) {
  const response = await fetch(
    `https://${shopDomain}/.well-known/customer-account-api`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load Shopify Customer Account API settings.");
  }

  const discovery = (await response.json()) as CustomerApiDiscovery;
  return discovery.graphql_api;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function clearOAuthCookies(store: Awaited<ReturnType<typeof cookies>>) {
  store.delete(STATE_COOKIE);
  store.delete(VERIFIER_COOKIE);
  store.delete(NONCE_COOKIE);
  store.delete(RETURN_COOKIE);
}

function randomBase64Url(byteLength: number) {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(byteLength)));
}

async function sha256Base64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes: Uint8Array) {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function normalizeSecret(secret: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
}

async function getEncryptionKey(secret: string) {
  const keyBytes = await normalizeSecret(secret);
  return crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

async function encryptSession(session: CustomerSession, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getEncryptionKey(secret);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(session)),
  );

  return `${base64UrlEncode(iv)}.${base64UrlEncode(new Uint8Array(encrypted))}`;
}

async function decryptSession(value: string, secret: string) {
  const [encodedIv, encodedCiphertext] = value.split(".");
  if (!encodedIv || !encodedCiphertext) return undefined;

  const iv = base64UrlDecode(encodedIv);
  const ciphertext = base64UrlDecode(encodedCiphertext);
  const key = await getEncryptionKey(secret);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  return JSON.parse(new TextDecoder().decode(decrypted)) as CustomerSession;
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return new Uint8Array(Buffer.from(padded, "base64"));
}

type ShopifyUserError = {
  field?: string[] | null;
  message: string;
};

export type CustomerAddressInput = {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  territoryCode?: string;
  zoneCode?: string;
  zip?: string;
  phoneNumber?: string;
};

const ADDRESS_FRAGMENT = /* GraphQL */ `
  fragment CustomerAddressFields on CustomerAddress {
    id
    firstName
    lastName
    name
    company
    address1
    address2
    city
    province
    zoneCode
    country
    territoryCode
    zip
    phoneNumber
    formatted(withName: true, withCompany: true)
  }
`;

const ORDER_FRAGMENT = /* GraphQL */ `
  fragment CustomerOrderFields on Order {
    id
    name
    processedAt
    financialStatus
    fulfillmentStatus
    statusPageUrl
    totalPrice {
      amount
      currencyCode
    }
    lineItems(first: 5) {
      nodes {
        title
        quantity
        totalPrice {
          amount
          currencyCode
        }
      }
    }
    shippingAddress {
      ...CustomerAddressFields
    }
  }
  ${ADDRESS_FRAGMENT}
`;

const ACCOUNT_QUERY = /* GraphQL */ `
  query CustomerAccount {
    customer {
      id
      displayName
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      defaultAddress {
        ...CustomerAddressFields
      }
      addresses(first: 12) {
        nodes {
          ...CustomerAddressFields
        }
      }
      orders(first: 5, reverse: true, sortKey: PROCESSED_AT) {
        nodes {
          ...CustomerOrderFields
        }
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

const ORDERS_QUERY = /* GraphQL */ `
  query CustomerOrders {
    customer {
      displayName
      orders(first: 25, reverse: true, sortKey: PROCESSED_AT) {
        nodes {
          ...CustomerOrderFields
        }
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

const ORDER_QUERY = /* GraphQL */ `
  query CustomerOrder($id: ID!) {
    order(id: $id) {
      ...CustomerOrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

const ADDRESSES_QUERY = /* GraphQL */ `
  query CustomerAddresses {
    customer {
      displayName
      defaultAddress {
        ...CustomerAddressFields
      }
      addresses(first: 25) {
        nodes {
          ...CustomerAddressFields
        }
      }
    }
  }
  ${ADDRESS_FRAGMENT}
`;

const PROFILE_QUERY = /* GraphQL */ `
  query CustomerProfile {
    customer {
      displayName
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`;

const UPDATE_PROFILE_MUTATION = /* GraphQL */ `
  mutation CustomerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_ADDRESS_MUTATION = /* GraphQL */ `
  mutation CustomerAddressCreate(
    $address: CustomerAddressInput!
    $defaultAddress: Boolean
  ) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_ADDRESS_MUTATION = /* GraphQL */ `
  mutation CustomerAddressUpdate(
    $addressId: ID!
    $address: CustomerAddressInput
    $defaultAddress: Boolean
  ) {
    customerAddressUpdate(
      addressId: $addressId
      address: $address
      defaultAddress: $defaultAddress
    ) {
      userErrors {
        field
        message
      }
    }
  }
`;

const DELETE_ADDRESS_MUTATION = /* GraphQL */ `
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      userErrors {
        field
        message
      }
    }
  }
`;
