"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const payoutMethodSchema = z.object({
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  accountNumber: z
    .string()
    .min(5, "Account number must be at least 5 characters"),
  accountHolder: z
    .string()
    .min(2, "Account holder name must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export type PayoutMethodFormData = z.infer<typeof payoutMethodSchema>;

export async function getUserPayoutMethods(userId: string) {
  const supabase = createServerSupabase();

  try {
    const { data, error } = await supabase
      .from("payoutMethods")
      .select("*")
      .eq("userId", userId)
      .order("isDefault", { ascending: false });

    if (error) {
      return { error: "Failed to fetch payout methods" };
    }

    return { success: true, data };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}

export async function setDefaultPayoutMethod(
  payoutMethodId: string,
  userId: string
) {
  const supabase = createServerSupabase();

  try {
    // First verify that the payout method belongs to the user
    const { data: payoutMethod, error: verifyError } = await supabase
      .from("payoutMethods")
      .select("id")
      .eq("id", payoutMethodId)
      .eq("userId", userId)
      .single();

    if (verifyError || !payoutMethod) {
      return { error: "Payout method not found" };
    }

    // First, set all payout methods for this user to non-default
    const { error: resetError } = await supabase
      .from("payoutMethods")
      .update({ isDefault: false })
      .eq("userId", userId);

    if (resetError) throw resetError;

    // Then set the selected payout method as default
    const { error: updateError } = await supabase
      .from("payoutMethods")
      .update({ isDefault: true })
      .eq("id", payoutMethodId)
      .eq("userId", userId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    return { error: "Failed to update default payout method" };
  }
}

export async function addPayoutMethod(
  userId: string,
  data: PayoutMethodFormData
) {
  const supabase = createServerSupabase();

  try {
    const validatedData = payoutMethodSchema.parse(data);

    const { data: payoutMethods } = await supabase
      .from("payoutMethods")
      .select("id")
      .eq("userId", userId);

    if (payoutMethods && payoutMethods.length >= 3) {
      return { error: "Maximum number of payout methods (3) reached" };
    }

    const isFirstMethod = !payoutMethods || payoutMethods.length === 0;

    const { error } = await supabase.from("payoutMethods").insert([
      {
        userId,
        ...validatedData,
        isDefault: isFirstMethod,
      },
    ]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid payout method data" };
    }
    return { error: "Failed to add payout method" };
  }
}

export async function deletePayoutMethod(
  payoutMethodId: string,
  userId: string
) {
  const supabase = createServerSupabase();

  try {
    // First verify that the payout method belongs to the user and get its default status
    const { data: payoutMethod, error: verifyError } = await supabase
      .from("payoutMethods")
      .select("id, isDefault")
      .eq("id", payoutMethodId)
      .eq("userId", userId)
      .single();

    if (verifyError || !payoutMethod) {
      return { error: "Payout method not found" };
    }

    // If this was the default method, find another method to make default
    if (payoutMethod.isDefault) {
      const { data: otherMethod, error: fetchError } = await supabase
        .from("payoutMethods")
        .select("id")
        .eq("userId", userId)
        .neq("id", payoutMethodId) // Exclude the method being deleted
        .limit(1)
        .single();

      if (!fetchError && otherMethod) {
        // Set the other method as default before deleting
        const { error: updateError } = await supabase
          .from("payoutMethods")
          .update({ isDefault: true })
          .eq("id", otherMethod.id)
          .eq("userId", userId);

        if (updateError) throw updateError;
      }
    }

    // Delete the payout method
    const { error: deleteError } = await supabase
      .from("payoutMethods")
      .delete()
      .eq("id", payoutMethodId)
      .eq("userId", userId);

    if (deleteError) {
      throw deleteError;
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete payout method" };
  }
}
