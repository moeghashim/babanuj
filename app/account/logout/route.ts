import {
  clearCustomerSession,
  getCustomerLogoutUrl,
} from "lib/shopify/customer-account";
import { baseUrl } from "lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const returnUrl = new URL("/", baseUrl).toString();
  const logoutUrl = await getCustomerLogoutUrl(returnUrl);

  await clearCustomerSession();

  return NextResponse.redirect(new URL(logoutUrl, request.url));
}
