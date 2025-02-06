"use server";

import { createServerSupabase } from "@/lib/supabase/server";

// Function to get items for checkout
export async function getCheckoutItems(userId: string, itemId: string) {
  const supabase = createServerSupabase();

  try {
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("itemId", parseInt(itemId))
      .eq("buyerId", userId)
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
    const deadline = new Date(created.getTime() + 30 * 60 * 1000); // 30 mins after creation
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

// Create payment with Toyyib Pay
export async function createToyyibPayment(params: CreatePaymentParams) {
  console.log("Creating payment with params:", params);
  const supabase = createServerSupabase();

  try {
    // Get the order to get the buyer_id
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("buyerId")
      .eq("itemId", parseInt(params.itemId))
      .eq("orderStatus", "pending")
      .single();

    if (orderError) {
      console.error("Order fetch error:", orderError);
      throw new Error("Could not find the order");
    }

    // Prepare Toyyib Pay bill details
    const billDetails = {
      userSecretKey: process.env.TOYYIB_SECRET_KEY,
      categoryCode: process.env.TOYYIB_CATEGORY_ID,
      billName: `Payment for Item #${params.itemId}`,
      billDescription: `Bid Bidder Payment`,
      billPriceSetting: 1,
      billPayorInfo: 0,
      billAmount: Math.round(params.amount * 100).toString(), // Convert to cents
      billReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${params.itemId}/status`,
      billCallbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/toyyib-callback`,
      billExpiryDays: 1,
      billPaymentChannel: "0", // FPX
      billPaymentCharge: "0",
    };

    console.log("Bill details:", billDetails);

    const formData = new FormData();
    Object.entries(billDetails).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (!process.env.TOYYIB_URL) {
      throw new Error("TOYYIB_URL environment variable is not set");
    }

    // Create bill at Toyyib Pay
    const response = await fetch(
      `${process.env.TOYYIB_URL}/index.php/api/createBill`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Toyyib API error:", errorText);
      throw new Error(`Toyyib API error: ${response.status} ${errorText}`);
    }

    const bill = (await response.json()) as { BillCode: string }[];
    console.log("Toyyib bill created:", bill);

    if (!bill || !bill[0] || !bill[0].BillCode) {
      throw new Error("Invalid response from Toyyib Pay");
    }

    // Create transaction with all details including bill code
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        itemId: parseInt(params.itemId),
        buyerId: order.buyerId,
        amount: params.amount,
        status: "completed",
        customerEmail: params.customerDetails.email,
        customerPhone: params.customerDetails.phone,
        customerName: `${params.customerDetails.firstName} ${params.customerDetails.lastName}`,
        paymentProvider: "toyyibpay",
        billCode: bill[0].BillCode,
        paymentUrl: `${process.env.TOYYIB_URL}/${bill[0].BillCode}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (transactionError) {
      console.error("Transaction creation error:", transactionError);
      throw transactionError;
    }

    console.log("Transaction created:", transaction);

    return {
      success: true,
      billCode: bill[0].BillCode,
      paymentUrl: `${process.env.TOYYIB_URL}/${bill[0].BillCode}`,
    };
  } catch (error) {
    console.error("[CREATE PAYMENT ERROR]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create payment",
    };
  }
}

// Handle Toyyib Pay callback
export async function handleToyyibCallback(data: any) {
  const supabase = createServerSupabase();
  console.log("[HANDLE CALLBACK] Starting to process callback data:", data);

  try {
    const {
      refno: billCode, // from redirect
      billcode, // from callback
      status,
      reason,
      order_id,
      transaction_id,
    } = data;

    const finalBillCode = billCode || billcode;

    if (!finalBillCode) {
      throw new Error("Bill code not found in callback data");
    }

    console.log("[HANDLE CALLBACK] Processing bill code:", finalBillCode);

    // Verify the transaction exists
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("billCode", finalBillCode)
      .single();

    if (transactionError) {
      console.error(
        "[HANDLE CALLBACK] Transaction not found:",
        transactionError
      );
      throw new Error("Transaction not found");
    }

    console.log("[HANDLE CALLBACK] Found transaction:", transaction);

    // Determine payment status first
    const paymentStatus = status === "1" ? "COMPLETED" : "FAILED";
    console.log(
      "[HANDLE CALLBACK] Payment status determined as:",
      paymentStatus
    );

    // If payment failed, we can return early
    if (paymentStatus === "FAILED") {
      return { success: false, error: "Payment failed", status: paymentStatus };
    }

    // For successful payments, trigger background updates and return success immediately
    // We'll handle any update errors in the background
    updatePaymentRecords(
      supabase,
      transaction,
      transaction_id,
      paymentStatus
    ).catch((error) => {
      console.error("[BACKGROUND UPDATE ERROR]", error);
      // Here you might want to implement some retry logic or notification system
    });

    return { success: true, status: paymentStatus };
  } catch (error) {
    console.error("[PAYMENT CALLBACK ERROR]", error);
    return { success: false, error: "Failed to process payment callback" };
  }
}

// Separate function to handle all database updates
async function updatePaymentRecords(
  supabase: any,
  transaction: any,
  transaction_id: string,
  paymentStatus: string
) {
  try {
    // Update transaction status
    const { error: updateTransactionError } = await supabase
      .from("transactions")
      .update({
        status: paymentStatus,
        transactionId: transaction_id,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", transaction.id);

    if (updateTransactionError) {
      throw updateTransactionError;
    }

    // Update order status
    const paymentStatusUpdate =
      paymentStatus === "COMPLETED" ? "paid" : "pending";
    const orderStatusUpdate =
      paymentStatus === "COMPLETED" ? "paid" : "pending";
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({
        orderStatus: orderStatusUpdate,
        paymentStatus: paymentStatusUpdate,
        updatedAt: new Date().toISOString(),
        totalAmount: Math.round(transaction.amount),
      })
      .eq("itemId", transaction.itemId);

    if (updateOrderError) {
      throw updateOrderError;
    }

    // Update item status
    const { error: updateItemError } = await supabase
      .from("items")
      .update({
        status: "ENDED",
        statusUpdatedAt: new Date().toISOString(),
      })
      .eq("id", transaction.itemId);

    if (updateItemError) {
      throw updateItemError;
    }

    console.log("[BACKGROUND UPDATE] Successfully completed all updates");
  } catch (error) {
    console.error("[BACKGROUND UPDATE ERROR] Failed to update records:", error);
    throw error;
  }
}
