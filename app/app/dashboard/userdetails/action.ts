// server-actions/user.ts
"use server";

import { createServerSupabase } from "@/lib/supabase/server";
// import { supabase } from "@/lib/utils";
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
const supabase = createServerSupabase();

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
    const allowedFields = [
      "name",
      "email",
      "phone",
      "gender",
      "birthday",
      "image",
    ];
    if (!allowedFields.includes(field)) {
      return {
        success: false,
        error: "Invalid field",
      };
    }

    const { error } = await supabase
      .from("users")
      .update({ [field]: value })
      .eq("id", userId);

    if (error) {
      return {
        success: false,
        error: `Failed to update ${field}`,
      };
    }

    revalidatePath("/app/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Failed to update ${field}`,
    };
  }
}

export async function updateProfilePicture(
  userId: string,
  imageUrl: string
): Promise<ActionResponse> {
  try {
    if (!userId || !imageUrl) {
      return {
        success: false,
        error: "Missing user ID or image URL",
      };
    }

    const { error } = await supabase
      .from("users")
      .update({ image: imageUrl })
      .eq("id", userId);

    if (error) {
      return {
        success: false,
        error: "Failed to update profile picture",
      };
    }

    revalidatePath("/app/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update profile picture",
    };
  }
}
