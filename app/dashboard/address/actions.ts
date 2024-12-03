'use server'

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addressSchema = z.object({
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postcode: z.string().min(2, "Postcode must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export async function getUserAddresses(userId: string) {
  const supabase = createServerSupabase();

  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("userId", userId)
      .order('isDefault', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      return { error: 'Failed to fetch addresses' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getUserAddresses:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function setDefaultAddress(addressId: string, userId: string) {
  const supabase = createServerSupabase();

  try {
    // First, set all addresses for this user to non-default
    const { error: resetError } = await supabase
      .from("addresses")
      .update({ isDefault: false })
      .eq("userId", userId);

    if (resetError) throw resetError;

    // Then set the selected address as default
    const { error: updateError } = await supabase
      .from("addresses")
      .update({ isDefault: true })
      .eq("id", addressId);

    if (updateError) throw updateError;

    revalidatePath('/dashboard/address');
    return { success: true };
  } catch (error) {
    console.error('Error in setDefaultAddress:', error);
    return { error: 'Failed to update default address' };
  }
}

export async function addAddress(userId: string, data: AddressFormData) {
  const supabase = createServerSupabase();

  try {
    const validatedData = addressSchema.parse(data);

    const { data: addresses } = await supabase
      .from("addresses")
      .select("id")
      .eq("userId", userId);

    const isFirstAddress = !addresses || addresses.length === 0;

    const { error } = await supabase
      .from("addresses")
      .insert([{
        userId,
        ...validatedData,
        isDefault: isFirstAddress // Set as default if it's the first address
      }]);

    if (error) throw error;

    revalidatePath('/dashboard/address');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid address data', details: error.errors };
    }
    console.error('Error in addAddress:', error);
    return { error: 'Failed to add address' };
  }
}

export async function updateAddress(addressId: string, data: AddressFormData) {
  const supabase = createServerSupabase();

  try {
    const validatedData = addressSchema.parse(data);

    const { error } = await supabase
      .from("addresses")
      .update(validatedData)
      .eq("id", addressId);

    if (error) throw error;

    revalidatePath('/dashboard/address');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid address data', details: error.errors };
    }
    console.error('Error in updateAddress:', error);
    return { error: 'Failed to update address' };
  }
}
