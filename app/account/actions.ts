"use server";

import {
  collectUserErrorMessage,
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerSession,
  updateCustomerAddress,
  updateCustomerProfile,
  type CustomerAddressInput,
} from "lib/shopify/customer-account";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AccountActionState = {
  ok: boolean;
  message: string;
};

export async function saveProfile(
  _prev: AccountActionState | null,
  formData: FormData,
): Promise<AccountActionState> {
  const session = await requireCustomerSession();
  const firstName = clean(formData.get("firstName"));
  const lastName = clean(formData.get("lastName"));

  try {
    const result = await updateCustomerProfile(session, {
      firstName,
      lastName,
    });
    const error = collectUserErrorMessage(result.customerUpdate.userErrors);
    if (error) return { ok: false, message: error };

    revalidatePath("/account");
    revalidatePath("/account/profile");
    return { ok: true, message: "Profile updated." };
  } catch (err) {
    console.error("Error updating customer profile", err);
    return { ok: false, message: "Could not update profile." };
  }
}

export async function saveAddress(
  _prev: AccountActionState | null,
  formData: FormData,
): Promise<AccountActionState> {
  const session = await requireCustomerSession();
  const addressId = clean(formData.get("addressId"));
  const defaultAddress = formData.get("defaultAddress") === "on";
  const address = addressInputFromForm(formData);

  try {
    const errors = addressId
      ? (
          await updateCustomerAddress(
            session,
            addressId,
            address,
            defaultAddress,
          )
        ).customerAddressUpdate.userErrors
      : (await createCustomerAddress(session, address, defaultAddress))
          .customerAddressCreate.userErrors;
    const error = collectUserErrorMessage(errors);
    if (error) return { ok: false, message: error };

    revalidatePath("/account");
    revalidatePath("/account/addresses");
    return {
      ok: true,
      message: addressId ? "Address updated." : "Address added.",
    };
  } catch (err) {
    console.error("Error saving customer address", err);
    return { ok: false, message: "Could not save address." };
  }
}

export async function removeAddress(formData: FormData) {
  const session = await requireCustomerSession();
  const addressId = clean(formData.get("addressId"));

  if (!addressId) return;

  try {
    const result = await deleteCustomerAddress(session, addressId);
    const error = collectUserErrorMessage(
      result.customerAddressDelete.userErrors,
    );

    if (error) {
      console.error("Error deleting customer address", error);
      return;
    }

    revalidatePath("/account");
    revalidatePath("/account/addresses");
  } catch (err) {
    console.error("Error deleting customer address", err);
  }
}

export async function setDefaultAddress(formData: FormData) {
  const session = await requireCustomerSession();
  const addressId = clean(formData.get("addressId"));

  if (!addressId) return;

  try {
    const result = await updateCustomerAddress(session, addressId, {}, true);
    const error = collectUserErrorMessage(
      result.customerAddressUpdate.userErrors,
    );

    if (error) {
      console.error("Error setting default address", error);
      return;
    }

    revalidatePath("/account");
    revalidatePath("/account/addresses");
  } catch (err) {
    console.error("Error setting default address", err);
  }
}

async function requireCustomerSession() {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");
  return session;
}

function addressInputFromForm(formData: FormData): CustomerAddressInput {
  return {
    firstName: clean(formData.get("firstName")),
    lastName: clean(formData.get("lastName")),
    company: clean(formData.get("company")),
    address1: clean(formData.get("address1")),
    address2: clean(formData.get("address2")),
    city: clean(formData.get("city")),
    territoryCode: clean(formData.get("territoryCode")) || "US",
    zoneCode: clean(formData.get("zoneCode")),
    zip: clean(formData.get("zip")),
    phoneNumber: clean(formData.get("phoneNumber")),
  };
}

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}
