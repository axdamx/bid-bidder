"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const dealingMethodSchema = z
  .object({
    dealingMethodType: z.enum(["COD", "SHIPPING"]),
    dealingMethodPrice: z.number().optional(), // For backward compatibility
    westMalaysiaShippingPrice: z.number().optional(),
    eastMalaysiaShippingPrice: z.number().optional(),
    dealingMethodLocation: z.string().optional(),
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
      message: "Shipping method requires both West and East Malaysia prices",
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

type CreateItemResponse = {
  success: boolean;
  error?: string;
  id?: string;
};

const supabase = createServerSupabase();

export async function createItemAction(
  formData: FormData,
  userId: string
): Promise<CreateItemResponse> {
  try {
    const imageIds = formData.getAll("images[]") as string[];
    const dealingMethodType = formData.get("dealingMethodType") as
      | "COD"
      | "SHIPPING";
    const dealingMethodPrice = formData.get("dealingMethodPrice")
      ? parseFloat(formData.get("dealingMethodPrice") as string)
      : undefined;
    const westMalaysiaShippingPrice = formData.get("westMalaysiaShippingPrice")
      ? parseFloat(formData.get("westMalaysiaShippingPrice") as string)
      : undefined;
    const eastMalaysiaShippingPrice = formData.get("eastMalaysiaShippingPrice")
      ? parseFloat(formData.get("eastMalaysiaShippingPrice") as string)
      : undefined;
    const dealingMethodLocation = formData.get(
      "dealingMethodLocation"
    ) as string;

    // Validate dealing method data
    try {
      dealingMethodSchema.parse({
        dealingMethodType,
        dealingMethodPrice,
        westMalaysiaShippingPrice,
        eastMalaysiaShippingPrice,
        dealingMethodLocation,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.errors[0].message,
        };
      }
      throw error;
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const startingPrice = parseFloat(formData.get("startingPrice") as string);
    const bidInterval = parseFloat(formData.get("bidInterval") as string);
    const binPrice = formData.get("binPrice")
      ? parseFloat(formData.get("binPrice") as string)
      : null;
    const endDate = formData.get("endDate") as string;
    const category = formData.get("category") as string;

    // The endDate is already in UTC from the form
    // Just need to append Z to make it explicit
    const utcEndDate = endDate + "Z";

    const itemData = {
      name,
      description,
      startingPrice,
      userId,
      bidInterval,
      binPrice,
      endDate: utcEndDate,
      imageId: imageIds[0],
      status: "LIVE",
      createdAt: new Date().toISOString(),
      dealingMethodType,
      dealingMethodPrice: dealingMethodPrice || null,
      westMalaysiaShippingPrice: westMalaysiaShippingPrice || null,
      eastMalaysiaShippingPrice: eastMalaysiaShippingPrice || null,
      dealingMethodLocation,
      category,
    };

    // Let Supabase handle the ID sequence
    const { data: newItem, error: itemError } = await supabase
      .from("items")
      .insert(itemData)
      .select()
      .single();

    if (itemError) {
      throw itemError;
    }

    if (!newItem) {
      throw new Error("Failed to create item");
    }

    if (imageIds.length > 0) {
      const { error: imagesError } = await supabase.from("images").insert(
        imageIds.map((publicId) => ({
          itemId: newItem.id,
          publicId,
        }))
      );

      if (imagesError) {
        throw imagesError;
      }
    }

    return {
      success: true,
      id: newItem.id.toString(),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create item",
    };
  }
}
