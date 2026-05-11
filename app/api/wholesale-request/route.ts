import { NextResponse } from "next/server";

type WholesaleRequest = {
  businessName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  companyType?: string;
  requestedProducts?: string;
  message?: string;
  website?: string;
};

const requiredFields: Array<keyof WholesaleRequest> = [
  "businessName",
  "contactName",
  "email",
  "phone",
  "companyType",
];

export async function POST(request: Request) {
  let body: WholesaleRequest;

  try {
    body = (await request.json()) as WholesaleRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const missingField = requiredFields.find((field) => !body[field]?.trim());

  if (missingField) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  if (!body.email?.includes("@")) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.WHOLESALE_REQUEST_TO || "info@babanuj.com";
  const fromEmail =
    process.env.WHOLESALE_REQUEST_FROM || "Babanuj <onboarding@resend.dev>";

  const text = [
    "New Babanuj wholesale request",
    "",
    `Business: ${body.businessName}`,
    `Contact: ${body.contactName}`,
    `Email: ${body.email}`,
    `Phone: ${body.phone}`,
    `Company type: ${body.companyType}`,
    `Requested products: ${body.requestedProducts || "Not specified"}`,
    "",
    body.message || "No message provided.",
  ].join("\n");

  if (!resendApiKey) {
    console.info(text);
    return NextResponse.json({
      ok: true,
      delivery: "logged",
      message: "Request logged. Configure RESEND_API_KEY to send email.",
    });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `Wholesale request from ${body.businessName}`,
      text,
      reply_to: body.email,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Resend wholesale request failed", errorText);
    return NextResponse.json(
      { error: "Unable to send request right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivery: "email" });
}
