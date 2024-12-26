import { z } from "zod";

// Types
export type OrderStatus = "pending";
export type PaymentStatus = "unpaid";
export type ShippingStatus = "pending";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  phone: string | null;
  gender: string | null;
  birthday: string | null;
  createdAt: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
  role: string | null;
  about: string | null;
  onboardingCompleted: boolean;
  hasSeenOnboarding: boolean;
}

export interface Item {
  id: number;
  userId: string;
  name: string;
  currentBid: number;
  startingPrice: number;
  imageId: string | null;
  bidInterval: number;
  endDate: string;
  description: string | null;
  status: string | null;
  winnerId: string | null;
  createdAt: string;
  binPrice: number | null;
  isBoughtOut: boolean;
  dealingMethodType: string | null;
  dealingMethodPrice: number | null;
  dealingMethodLocation: string | null;
}

export interface Bid {
  id: number;
  amount: number;
  itemId: number;
  userId: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  itemId: number | null;
  itemTitle: string;
  message: string;
  createdAt: string | null;
  read: boolean;
  followerId: string | null;
  followerName: string | null;
}

export interface Order {
  id: string;
  itemId: number;
  buyerId: string;
  sellerId: string;
  amount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  shippingAddress: string | null;
  trackingNumber: string | null;
  paymentMethod: string | null;
  paymentIntentId: string | null;
  orderDate: string | null;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// Zod Schemas
export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startingPrice: z.number().min(0, "Price must be positive"),
  bidInterval: z.number().min(0, "Bid interval must be positive"),
  endDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "End date must be in the future",
  }),
  description: z.string().optional(),
  binPrice: z
    .union([
      z.number().min(0, "BIN price must be positive"),
      z.literal(null),
      z.undefined(),
    ])
    .optional(),
  dealingMethodType: z.enum(["COD", "SHIPPING"]),
  dealingMethodPrice: z.number().optional(),
  westMalaysiaShippingPrice: z.number().optional(),
  eastMalaysiaShippingPrice: z.number().optional(),
  dealingMethodLocation: z.string().optional(),
  images: z
    .array(z.string())
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
  category: z.string().min(1, "Category is required"),
});

export type CreateItemFormData = z.infer<typeof createItemSchema>;
