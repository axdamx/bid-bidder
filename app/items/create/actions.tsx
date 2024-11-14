"use server";

import { images, items } from "@/src/db/schema";
import { revalidatePath } from "next/cache";
import { database } from "@/src/db/database";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/utils";
import { useSupabase } from "@/app/context/SupabaseContext";

type CreateItemResponse = {
  success: boolean;
  id?: string;
  error?: string;
};

export async function createItemAction(
  formData: FormData,
  userId: string
): Promise<CreateItemResponse> {
  try {
    // const { session, supabase } = useSupabase();

    // console.log("data", data.session);

    // if (error || !data || !data.session?.user) {
    //   return {
    //     success: false,
    //     error: "Unauthorized",
    //   };
    // }

    // const user = userId;
    const imageIds = formData.getAll("images[]") as string[];

    // Create the item object WITHOUT any id field
    const itemData = {
      name: formData.get("name") as string,
      startingPrice: parseFloat(formData.get("startingPrice") as string),
      userId: userId,
      bidInterval: parseFloat(formData.get("bidInterval") as string),
      endDate: new Date(formData.get("endDate") as string).toISOString(),
      description: formData.get("description") as string,
      imageId: imageIds[0],
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    // Let Supabase handle the ID sequence
    const { data: newItem, error: itemError } = await supabase
      .from("items")
      .insert(itemData)
      .select()
      .single();

    if (itemError) throw itemError;

    if (imageIds.length > 0) {
      const { error: imagesError } = await supabase.from("images").insert(
        imageIds.map((publicId) => ({
          itemId: newItem.id,
          publicId,
        }))
      );

      if (imagesError) throw imagesError;
    }

    revalidatePath("/");

    return {
      success: true,
      id: newItem.id,
    };
  } catch (error: any) {
    console.error("Error creating item:", error);
    return {
      success: false,
      error: error.message || "Failed to create item",
    };
  }
}
