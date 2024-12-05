"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { z } from "zod";

// Validation schema for the onboarding form
const onboardingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  addressLine1: z
    .string()
    .min(5, { message: "Address line 1 must be at least 5 characters" }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  postcode: z
    .string()
    .min(2, { message: "Postcode must be at least 2 characters" }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export async function updateUserAndAddress(
  userId: string,
  formData: OnboardingFormData
) {
  const supabase = createServerSupabase();

  try {
    // Validate the input data
    const validatedData = onboardingSchema.parse(formData);

    // Update user name
    const { error: userError } = await supabase
      .from("users")
      .update({ name: validatedData.name })
      .eq("id", userId);

    if (userError) {
      console.error("Error updating user:", userError);
      return { error: "Failed to update user name" };
    }

    // Create address
    const { data: address, error: addressError } = await supabase
      .from("addresses")
      .insert([
        {
          userId,
          addressLine1: validatedData.addressLine1,
          addressLine2: validatedData.addressLine2 || null,
          city: validatedData.city,
          state: validatedData.state,
          postcode: validatedData.postcode,
          country: validatedData.country,
          isDefault: true,
        },
      ])
      .select()
      .single();

    if (addressError) {
      console.error("Error creating address:", addressError);
      return { error: "Failed to create address" };
    }

    return {
      success: true,
      data: {
        user: { id: userId, name: validatedData.name },
        address,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid form data", details: error.errors };
    }
    console.error("Error in updateUserAndAddress:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function updateHasSeenOnboarding(userId: string) {
  const supabase = createServerSupabase();

  try {
    const { error } = await supabase
      .from("users")
      .update({ hasSeenOnboarding: true })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating hasSeenOnboarding:", error);
    return { success: false, error };
  }
}
