"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fetchUserItems(userId: string) {
  if (!userId) return { items: [] };

  try {
    const supabase = createServerSupabase();
    // First get all items for the user
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (itemsError) throw itemsError;

    // Then get all orders for these items
    const itemIds = items.map((item) => item.id);
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("itemId, orderStatus")
      .in("itemId", itemIds);

    if (ordersError) throw ordersError;

    // Create a map of itemId to orderStatus
    const orderStatusMap = orders.reduce((acc, order) => {
      acc[order.itemId] = order.orderStatus;
      return acc;
    }, {});

    // Combine the data
    const processedData = items.map((item) => ({
      ...item,
      orderStatus: orderStatusMap[item.id] || null,
    }));

    return { items: processedData };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { items: [], error: "Failed to fetch items" };
  }
}

export async function updateItemEndDate(itemId: number, endDate: string) {
  try {
    const supabase = createServerSupabase();
    const { error } = await supabase
      .from("items")
      .update({
        endDate,
        status: "ACTIVE",
        winnerId: null,
      })
      .eq("id", itemId);

    if (error) throw error;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating end date:", error);
    return { success: false, error: "Failed to update item" };
  }
}
