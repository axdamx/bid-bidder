import { z } from "zod";

// User details schema
export const userDetailsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email(),
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

// User role schema
export const userRoleSchema = z.object({
  role: z.enum(["seller", "bidder", "both", "none"]),
  bankName: z
    .string()
    .min(2, { message: "Bank name must be at least 2 characters" })
    .optional(),
  accountNumber: z
    .string()
    .min(5, { message: "Account number must be at least 5 characters" })
    .optional(),
  accountHolder: z
    .string()
    .min(2, { message: "Account holder name must be at least 2 characters" })
    .optional(),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" })
    .optional(),
});

// User profile schema
export const userProfileSchema = z.object({
  image: z.string().optional(),
  about: z.string(),
});

// Types based on schemas
export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;
export type UserRoleFormData = z.infer<typeof userRoleSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;

// Props for the OnboardingFlow component
export interface OnboardingFlowProps {
  user: any;
  onComplete: () => void;
  setUser: (user: any) => void;
}

// Alert state type
export interface AlertState {
  isOpen: boolean;
  title: string;
  description: string;
  type: "success" | "error";
  action?: "complete" | "upload" | undefined;
}
