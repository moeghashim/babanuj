import { finishCustomerLogin } from "lib/shopify/customer-account";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    const url = new URL("/account", request.url);
    url.searchParams.set("auth_error", error);
    return NextResponse.redirect(url);
  }

  if (!code || !state) {
    const url = new URL("/account", request.url);
    url.searchParams.set("auth_error", "missing_code");
    return NextResponse.redirect(url);
  }

  try {
    const returnTo = await finishCustomerLogin(code, state);
    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (err) {
    console.error("Customer login failed", err);
    const url = new URL("/account", request.url);
    url.searchParams.set("auth_error", "login_failed");
    return NextResponse.redirect(url);
  }
}
