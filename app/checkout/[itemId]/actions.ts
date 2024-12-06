"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { timingSafeEqual, createHmac } from "crypto";

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

    const { data: itemDetails } = await supabase
      .from("items")
      .select("*")
      .eq("id", parseInt(itemId))
      .single();

    return {
      order,
      item: itemDetails,
    };
  } catch (error) {
    console.error("Error fetching checkout item:", error);
    return null;
  }
}

interface CreatePaymentParams {
  itemId: string;
  amount: number;
  customerDetails: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
}

export async function createPayment(params: CreatePaymentParams) {
  const supabase = createServerSupabase();

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const reference = `BID-${params.itemId}-${Date.now()}`;

    const paymentData = {
      amount: params.amount * 100,
      currency: "MYR",
      product: {
        name: `Payment for Bid Item #${params.itemId}`,
        description: "Bid payment",
      },
      customer: {
        email: params.customerDetails.email,
        phone: params.customerDetails.phone,
        full_name: `${params.customerDetails.firstName} ${params.customerDetails.lastName}`,
      },
      reference,
      success_callback: `${baseUrl}/api/payments/callback`,
      cancel_callback: `${baseUrl}/api/payments/callback`,
      success_redirect: `${baseUrl}/checkout/${params.itemId}/success`,
      cancel_redirect: `${baseUrl}/checkout/${params.itemId}/cancel`,
      send_email: true,
      brand_id: process.env.CHIP_BRAND_ID,
    };

    const CHIP_API_ENDPOINT =
      process.env.NODE_ENV === "production"
        ? "https://gate.chip-in.asia/api/v1"
        : "https://gate.sandbox.chip-in.asia/api/v1";

    const response = await fetch(`${CHIP_API_ENDPOINT}/purchases/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHIP_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment");
    }

    const payment = await response.json();

    // Store payment information
    await supabase.from("payments").insert({
      item_id: params.itemId,
      payment_id: payment.id,
      reference,
      amount: params.amount,
      status: "pending",
      customer_email: params.customerDetails.email,
    });

    return { checkout_url: payment.checkout_url };
  } catch (error) {
    console.error("Payment creation error:", error);
    throw new Error("Failed to create payment");
  }
}

export async function updateOrderStatusToCancelled(
  orderId: number,
  userId: string
) {
  const supabase = createServerSupabase();

  try {
    const { data: order } = await supabase
      .from("orders")
      .select("*, items(*)")
      .eq("id", orderId)
      .single();

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.buyerId !== userId) {
      throw new Error("Unauthorized: User is not the buyer");
    }

    const created = new Date(order.createdAt);
    const deadline = new Date(created.getTime() + 60 * 60 * 1000); // 1 hour after creation
    const now = new Date();

    if (now > deadline) {
      // Update order status to cancelled
      const { error: orderError } = await supabase
        .from("orders")
        .update({ orderStatus: "cancelled" })
        .eq("id", orderId);

      if (orderError) throw orderError;

      // Update item status to cancelled
      // Remove winnerId from the item
      const { error: itemError } = await supabase
        .from("items")
        .update({ winnerId: null, status: "CANCELLED" })
        .eq("id", order.itemId);

      if (itemError) throw itemError;

      return { success: true, message: "Order cancelled successfully" };
    }

    return { success: false, message: "Order is not yet expired" };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function handlePaymentCallback(
  signature: string | null,
  payload: string
) {
  const supabase = createServerSupabase();

  try {
    if (!signature) {
      throw new Error("Missing signature");
    }

    const hmac = createHmac("sha256", process.env.CHIP_WEBHOOK_SECRET || "");
    const calculatedSignature = hmac.update(payload).digest("hex");

    if (
      !timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))
    ) {
      throw new Error("Invalid signature");
    }

    const { event, data } = JSON.parse(payload);

    if (event === "payment.paid") {
      await supabase
        .from("payments")
        .update({
          status: "completed",
          paid_at: new Date().toISOString(),
        })
        .eq("payment_id", data.id);

      const { data: paymentRecord } = await supabase
        .from("payments")
        .select("item_id")
        .eq("payment_id", data.id)
        .single();

      if (paymentRecord) {
        await supabase
          .from("items")
          .update({ status: "sold" })
          .eq("id", paymentRecord.item_id);
      }
    } else if (event === "payment.failed") {
      await supabase
        .from("payments")
        .update({
          status: "failed",
          error_message: data.failure_reason,
        })
        .eq("payment_id", data.id);
    }

    return { success: true };
  } catch (error) {
    console.error("Webhook processing error:", error);
    throw error;
  }
}
