export const SUPPORT_EMAIL = "support@babanuj.com";
export const WHOLESALE_EMAIL = "wholesale@babanuj.com";

const WHOLESALE_BODY = [
  "Hi Babanuj, we're interested in wholesale pricing for:",
  "",
  "Store name:",
  "Channel (Grocery/Specialty/Foodservice):",
  "Estimated monthly volume:",
  "Lines of interest:",
].join("\n");

export function emailHref(
  email: string,
  subject: string,
  body?: string,
): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${email}?${params.toString()}`;
}

export function wholesaleMailto(subject = "Wholesale inquiry"): string {
  return emailHref(WHOLESALE_EMAIL, subject, WHOLESALE_BODY);
}

export function supportMailto(subject = "Babanuj support request"): string {
  return emailHref(SUPPORT_EMAIL, subject);
}
