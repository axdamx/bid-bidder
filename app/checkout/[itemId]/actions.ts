"use server";
// import { supabase } from "@/lib/utils";
import { createServerSupabase } from "@/lib/supabase/server";
// import { supabase } from "@/lib/utils";
// import { database } from "@/src/db/database";
// import { items } from "@/src/db/schema";
// import { and, eq } from "drizzle-orm";

// Function to get items for checkout
export async function getCheckoutItems(userId: string, itemId: string) {
  const supabase = createServerSupabase();

  try {
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("itemId", parseInt(itemId))
      .eq("buyerId", userId)
      .eq("orderStatus", "pending")
      .single();

    // Then get the item details
    const { data: itemDetails } = await supabase
      .from("items")
      .select("*")
      .eq("id", parseInt(itemId))
      .single();

    // Return both order and item details
    return {
      order,
      item: itemDetails,
    };
  } catch (error) {
    console.error("Error fetching checkout item:", error);
    return null;
  }
}

export async function updateOrderStatusToCancelled(orderId: number, userId: string) {
  const supabase = createServerSupabase();

  try {
    // First, get the order to verify the buyer
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify that the user is the buyer
    if (order.buyerId !== userId) {
      throw new Error("Unauthorized: User is not the buyer");
    }

    // Check if the order is already expired (more than 1 hour old)
    const created = new Date(order.createdAt);
    const deadline = new Date(created.getTime() + 60 * 60 * 1000); // 1 hour after creation
    const now = new Date();

    if (now > deadline) {
      // Update the order status to cancelled
      const { error } = await supabase
        .from("orders")
        .update({ orderStatus: "cancelled" })
        .eq("id", orderId);

      if (error) throw error;

      return { success: true, message: "Order cancelled successfully" };
    }

    return { success: false, message: "Order is not yet expired" };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
