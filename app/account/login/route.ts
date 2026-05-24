import {
  beginCustomerLogin,
  sanitizeReturnPath,
} from "lib/shopify/customer-account";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const returnTo = sanitizeReturnPath(
    request.nextUrl.searchParams.get("redirect"),
  );
  const login = await beginCustomerLogin(returnTo, request.url);

  return NextResponse.redirect(login.redirectUrl);
}
