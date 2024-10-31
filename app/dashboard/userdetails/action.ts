// server-actions/user.ts
"use server";

import { database } from "@/src/db/database";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
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

// Update name
export async function updateUserName(
  userId: string,
  name: string
): Promise<ActionResponse> {
  try {
    const validatedName = updateSchemas.name.parse(name);

    await database
      .update(users)
      .set({ name: validatedName })
      .where(eq(users.id, userId));

    revalidatePath("/profile"); // Adjust the path as needed
    return { success: true };
  } catch (error) {
    console.error("Error updating user name:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? "Invalid name format"
          : "Failed to update name",
    };
  }
}

// Update email
export async function updateUserEmail(
  userId: string,
  email: string
): Promise<ActionResponse> {
  try {
    const validatedEmail = updateSchemas.email.parse(email);

    await database
      .update(users)
      .set({ email: validatedEmail })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating user email:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? "Invalid email format"
          : "Failed to update email",
    };
  }
}

// Update phone
export async function updateUserPhone(
  userId: string,
  phone: string
): Promise<ActionResponse> {
  try {
    const validatedPhone = updateSchemas.phone.parse(phone);

    await database
      .update(users)
      .set({ phone: validatedPhone })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating user phone:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? "Invalid phone format"
          : "Failed to update phone",
    };
  }
}

// Update gender
export async function updateUserGender(
  userId: string,
  gender: string
): Promise<ActionResponse> {
  try {
    const validatedGender = updateSchemas.gender.parse(gender);

    await database
      .update(users)
      .set({ gender: validatedGender })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating user gender:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? "Invalid gender value"
          : "Failed to update gender",
    };
  }
}

// Update birthday
export async function updateUserBirthday(
  userId: string,
  birthday: string
): Promise<ActionResponse> {
  try {
    const validatedBirthday = updateSchemas.birthday.parse(birthday);

    await database
      .update(users)
      .set({ birthday: validatedBirthday })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating user birthday:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? "Invalid birthday format"
          : "Failed to update birthday",
    };
  }
}

// app/actions/user.ts
// 'use server'

// import { db } from '@/db';
// import { users } from '@/db/schema';
// import { eq } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';

// type ActionResponse = {
//   success: boolean;
//   error?: string;
// };

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

    await database
      .update(users)
      .set({ [field]: value })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error(`Error updating user ${field}:`, error);
    return {
      success: false,
      error: `Failed to update ${field}`,
    };
  }
}
