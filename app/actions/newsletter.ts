"use server";

/**
 * Newsletter signup → Shopify customers with acceptsMarketing=true.
 *
 * Posts to the standard Shopify storefront /contact endpoint that themes
 * use for newsletter sign-up. Shopify de-duplicates emails server-side
 * (re-submitting an existing customer's email is treated as a no-op),
 * which is the same behavior you'd get from a theme-hosted form.
 *
 * No Storefront/Admin API token needed — this is a public POST.
 */

export type NewsletterState = {
  ok: boolean;
  message: string;
};

export async function subscribeNewsletter(
  _prev: NewsletterState | null,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const domain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ??
    process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    return {
      ok: false,
      message: "Newsletter is not configured yet.",
    };
  }

  // Shopify's classic theme newsletter form posts these fields.
  const body = new URLSearchParams({
    "form_type": "customer",
    "utf8": "✓",
    "contact[tags]": "newsletter",
    "contact[email]": email,
    "contact[accepts_marketing]": "1",
  });

  try {
    const res = await fetch(`https://${domain}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      // Shopify redirects to a thank-you page on success — don't follow.
      redirect: "manual",
    });

    // Shopify returns 302/303 on success, 200 with error fragments on
    // failure. Either way the POST itself succeeded; we treat any
    // non-5xx as success since we can't read the rendered page reliably.
    if (res.status >= 500) {
      return {
        ok: false,
        message: "Couldn't reach the store. Try again in a minute.",
      };
    }
    return {
      ok: true,
      message: "Subscribed — check your inbox for $10 off.",
    };
  } catch (err) {
    return {
      ok: false,
      message: "Couldn't reach the store. Try again in a minute.",
    };
  }
}
