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
      .select(
        `
        *,
        winner:users!inner(id, name, email)
      `
      )
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (itemsError) throw itemsError;

    // Get winner information for items with winnerId
    const itemsWithWinners = await Promise.all(
      items.map(async (item) => {
        if (!item.winnerId) return { ...item, winner: null };

        const { data: winner } = await supabase
          .from("users")
          .select("id, name, email")
          .eq("id", item.winnerId)
          .single();

        return { ...item, winner };
      })
    );

    // Then get all orders for these items
    const itemIds = itemsWithWinners.map((item) => item.id);
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("itemId, orderStatus")
      .in("itemId", itemIds);

    if (ordersError) throw ordersError;

    // Create a map of itemId to orderStatus
    const orderStatusMap: { [key: number]: string | null } = orders.reduce(
      (acc, order) => {
        acc[order.itemId] = order.orderStatus;
        return acc;
      },
      {} as { [key: number]: string | null }
    );

    // Combine the data
    const processedData = itemsWithWinners.map((item) => ({
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

    // First get the item to get its starting price
    const { data: item, error: fetchError } = await supabase
      .from("items")
      .select("startingPrice")
      .eq("id", itemId)
      .single();

    if (fetchError) throw fetchError;

    // Delete all existing bids for this item
    const { error: deleteBidsError } = await supabase
      .from("bids")
      .delete()
      .eq("itemId", itemId);

    if (deleteBidsError) throw deleteBidsError;

    // Then update the item with all reset values
    const { error } = await supabase
      .from("items")
      .update({
        endDate,
        status: "LIVE",
        winnerId: null,
        isBoughtOut: false,
        currentBid: 0, // Reset current bid to 0
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
