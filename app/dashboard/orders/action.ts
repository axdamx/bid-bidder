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

export async function updateOrderShippingStatus(
  orderId: number,
  status: string,
  userId: string,
  shippingDetails?: { courier: string; trackingNumber: string }
) {
  try {
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("sellerId")
      .eq("id", orderId)
      .single();

    if (fetchError) throw fetchError;
    if (order.sellerId !== userId) {
      throw new Error("Unauthorized: Only the seller can update order status");
    }

    // Update the shipping status and details if provided
    const updateData = {
      shippingStatus: status,
      ...(shippingDetails && {
        courierService: shippingDetails.courier,
        trackingNumber: shippingDetails.trackingNumber,
      }),
    };

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
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

export async function confirmDelivery(
  orderId: number,
  userId: string
) {
  try {
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("buyerId")
      .eq("id", orderId)
      .single();

    if (fetchError) throw fetchError;
    if (order.buyerId !== userId) {
      throw new Error("Unauthorized: Only the buyer can confirm delivery");
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        shippingStatus: "delivered",
        orderStatus: "delivered"
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error confirming delivery:", error);
    throw error;
  }
}
