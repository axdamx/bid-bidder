import { z } from "zod";

export type CreateItemFormData = {
  name: string;
  startingPrice: number;
  bidInterval: number;
  binPrice?: number | null;
  description?: string;
  endDate: string;
  images: string[];
  category: string;
  dealingMethodType: "COD" | "SHIPPING";
  dealingMethodPrice?: number;
  westMalaysiaShippingPrice?: number;
  eastMalaysiaShippingPrice?: number;
  dealingMethodLocation?: string;
};

export interface ExtendedCloudinaryUploadWidgetOptions {
  maxFiles?: number;
  clientAllowedFormats?: string[];
  maxFileSize?: number;
  transformation?: {
    quality?: string;
    fetch_format?: string;
    width?: number;
    height?: number;
    crop?: string;
    format?: string;
    flags?: string;
    dpr?: string;
  };
  eager?: Array<{
    quality?: string;
    fetch_format?: string;
    width?: number;
    height?: number;
    crop?: string;
    format?: string;
    flags?: string;
  }>;
  eager_async?: boolean;
  eager_notification_url?: boolean;
}

export type UploadResult = {
  info: { public_id: string };
  event: "success";
};

export const DURATION_OPTIONS = [
  { label: "1 Day", days: 1 },
  { label: "3 Days", days: 3 },
  { label: "5 Days", days: 5 },
  { label: "7 Days", days: 7 },
] as const;

export const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    startingPrice: z.number().min(1, "Starting price must be greater than 0"),
    bidInterval: z.number().min(1, "Bid interval must be greater than 0"),
    binPrice: z.number().min(0, "Buy it now price must be positive").optional(),
    description: z.string().min(1, "Description is required"),
    endDate: z.string().min(1, "End date is required"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    category: z.string().min(1, "Category is required"),
    dealingMethodType: z.enum(["COD", "SHIPPING"]),
    dealingMethodPrice: z.number().optional(),
    westMalaysiaShippingPrice: z.number().optional(),
    eastMalaysiaShippingPrice: z.number().optional(),
    dealingMethodLocation: z.string().optional(),
  })
  .refine((data) => data.bidInterval <= data.startingPrice, {
    message: "Bid interval cannot be greater than starting price",
    path: ["bidInterval"],
  })
  .refine((data) => !data.binPrice || data.binPrice >= data.startingPrice, {
    message: "Buy it now price cannot be less than starting price",
    path: ["binPrice"],
  })
  .refine(
    (data) => {
      if (data.dealingMethodType === "SHIPPING") {
        return (
          data.westMalaysiaShippingPrice != null &&
          data.eastMalaysiaShippingPrice != null
        );
      }
      return true;
    },
    {
      message: "Shipping requires both West and East Malaysia shipping prices",
    }
  )
  .refine(
    (data) => {
      if (data.dealingMethodType === "COD") {
        return (
          data.dealingMethodLocation != null &&
          data.dealingMethodLocation.length > 0
        );
      }
      return true;
    },
    {
      message: "COD requires a meeting location",
    }
  );
