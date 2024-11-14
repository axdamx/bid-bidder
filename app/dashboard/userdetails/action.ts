// server-actions/user.ts
"use server";

import { supabase } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod"; // If you want to add validation

// Validation schemas for each field
const updateSchemas = {
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
} as const;

// Generic error type
type ActionResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

export async function updateUserField(
  userId: string,
  field: string,
  value: string
): Promise<ActionResponse> {
  try {
    if (!userId || !field || value === undefined) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Only allow updating specific fields
    const allowedFields = ["name", "email", "phone", "gender", "birthday"];
    if (!allowedFields.includes(field)) {
      return {
        success: false,
        error: "Invalid field",
      };
    }

    const { error } = await supabase
      .from('users')
      .update({ [field]: value })
      .eq('id', userId);

    if (error) {
      console.error(`Error updating user ${field}:`, error);
      return {
        success: false,
        error: `Failed to update ${field}`,
      };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(`Unexpected error updating user ${field}:`, error);
    return {
      success: false,
      error: `Failed to update ${field}`,
    };
  }
}
