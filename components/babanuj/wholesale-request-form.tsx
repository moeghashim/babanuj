"use client";

import { useState } from "react";

type Status =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function WholesaleRequestForm({
  requestedProduct = "",
}: {
  requestedProduct?: string;
}) {
  const [status, setStatus] = useState<Status>({
    type: "idle",
    message: "",
  });
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/wholesale-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit request.");
      }

      form.reset();
      setStatus({
        type: "success",
        message: "Your request was received. Babanuj will follow up shortly.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to submit request.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input type="text" name="website" className="hidden" tabIndex={-1} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Business name" name="businessName" required />
        <Field label="Contact name" name="contactName" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#25251f]">
          Company type
          <select
            name="companyType"
            required
            className="h-12 rounded-md border border-[#d7d0c3] bg-white px-3 text-sm font-medium text-[#25251f] outline-none focus:border-[#294621] focus:ring-2 focus:ring-[#294621]/20"
            defaultValue=""
          >
            <option value="" disabled>
              Select one
            </option>
            <option>Grocery / Market</option>
            <option>Specialty Retail</option>
            <option>Distributor</option>
            <option>Foodservice</option>
            <option>Online Retail</option>
            <option>Other</option>
          </select>
        </label>
        <Field
          label="Requested brands/products"
          name="requestedProducts"
          defaultValue={requestedProduct}
        />
      </div>
      <label className="grid gap-2 text-sm font-semibold text-[#25251f]">
        Message
        <textarea
          name="message"
          rows={5}
          className="rounded-md border border-[#d7d0c3] bg-white px-3 py-3 text-sm font-medium text-[#25251f] outline-none focus:border-[#294621] focus:ring-2 focus:ring-[#294621]/20"
          placeholder="Tell us what you are looking for, estimated volume, and delivery market."
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-md bg-[#294621] px-5 text-sm font-bold text-white transition hover:bg-[#1f3619] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Request Wholesale Catalog"}
      </button>
      {status.message ? (
        <p
          className={
            status.type === "success"
              ? "text-sm font-semibold text-[#294621]"
              : "text-sm font-semibold text-red-700"
          }
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#25251f]">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="h-12 rounded-md border border-[#d7d0c3] bg-white px-3 text-sm font-medium text-[#25251f] outline-none focus:border-[#294621] focus:ring-2 focus:ring-[#294621]/20"
      />
    </label>
  );
}
