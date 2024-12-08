"use server";

// import { supabase } from "@/lib/utils";

import { createServerSupabase } from "@/lib/supabase/server";

export type Order = {
  id: number;
  itemId: number;
  buyerId: string;
  sellerId: string;
  amount: number;
  orderStatus: "pending" | "processing" | "delivered" | "cancelled" | "shipped";
  paymentStatus: "unpaid" | "paid" | "refunded";
  shippingStatus: "pending" | "processing" | "shipped" | "delivered";
  orderDate: string;
  // ... other fields ...
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
};
const supabase = createServerSupabase();

export async function getOrders(userId: string) {
  //   const supabase = createServerSupabaseClient();

  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        item:items(*)
      `
      )
      .or(`buyerId.eq.${userId},sellerId.eq.${userId}`)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    // Filter orders on the client side
    return {
      winningOrders: orders.filter((order) => order.buyerId === userId),
      sellingOrders: orders.filter((order) => order.sellerId === userId),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
  userId: string
) {
  //   const supabase = createServerSupabaseClient();

  try {
    // First verify that the user is the seller of this order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("sellerId")
      .eq("id", orderId)
      .single();

    if (fetchError) throw fetchError;
    if (order.sellerId !== userId) {
      throw new Error("Unauthorized: Only the seller can update order status");
    }

    // Update the order status
    const { data, error } = await supabase
      .from("orders")
      .update({ orderStatus: status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
