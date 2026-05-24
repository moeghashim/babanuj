import type {
  CustomerAddress,
  CustomerMoney,
} from "lib/shopify/customer-account";

export function formatCustomerMoney(money?: CustomerMoney | null) {
  if (!money) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

export function formatCustomerDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatAddress(address?: CustomerAddress | null) {
  return address?.formatted?.length
    ? address.formatted
    : [
        address?.name,
        address?.company,
        address?.address1,
        address?.address2,
        [address?.city, address?.zoneCode, address?.zip]
          .filter(Boolean)
          .join(", "),
        address?.country,
      ].filter((line): line is string => Boolean(line));
}

export function titleCaseStatus(status?: string | null) {
  if (!status) return "Pending";
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
