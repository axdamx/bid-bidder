"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { logInfo, logError } from "@/lib/logging";

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
  buyersPremium: number;
  shippingCost: number;
  shippingRegion: "EAST" | "WEST";
  itemName: string;
  customerDetails: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    country: string;
    city?: string;
    state?: string;
    zipCode?: string;
    addressLine1?: string;
    addressLine2?: string;
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
      .select("buyerId, id")
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
      billDescription: `Renown Payment`,
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

    console.log("Data after bill creation:", order);

    // Create transaction with all details including bill code
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        itemId: parseInt(params.itemId),
        orderId: order.id, // Store as UUID directly, no need for toString()
        buyerId: order.buyerId,
        amount: params.amount,
        status: "pending",
        customerEmail: params.customerDetails.email,
        customerPhone: params.customerDetails.phone,
        customerName: `${params.customerDetails.firstName} ${params.customerDetails.lastName}`,
        customerCountry: params.customerDetails.country,
        customerCity: params.customerDetails.city,
        customerState: params.customerDetails.state,
        customerZipCode: params.customerDetails.zipCode,
        customerAddressLine1: params.customerDetails.addressLine1,
        customerAddressLine2: params.customerDetails.addressLine2,
        paymentProvider: "toyyibpay",
        billCode: bill[0].BillCode,
        buyersPremium: params.buyersPremium,
        shippingCost: params.shippingCost,
        shippingRegion: params.shippingRegion,
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

  const { billcode, billCode, status, reason, order_id, transaction_id } = data;

  const finalBillCode = billCode || billcode;

  if (!finalBillCode) {
    await logError("TOYYIB_CALLBACK_NO_BILLCODE", { data });
    throw new Error("Bill code not found in callback data");
  }

  await logInfo("TOYYIB_CALLBACK_RECEIVED", {
    billCode: finalBillCode,
    status,
    reason,
    orderId: order_id,
    transactionId: transaction_id,
  });

  // Verify the transaction exists
  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .select("*")
    .eq("billCode", finalBillCode)
    .single();

  if (transactionError || !transaction) {
    await logError("TOYYIB_CALLBACK_TRANSACTION_NOT_FOUND", {
      billCode: finalBillCode,
      error: transactionError,
    });
    throw new Error("Transaction not found");
  }

  console.log("[HANDLE CALLBACK] Found transaction:", transaction);

  // Determine payment status first
  const paymentStatus =
    status === "1" ? "success" : status === "2" ? "pending" : "failed";
  console.log("[HANDLE CALLBACK] Payment status determined as:", paymentStatus);

  // Update payment records regardless of payment status
  updatePaymentRecords(
    supabase,
    transaction,
    transaction_id,
    paymentStatus
  ).catch((error) => {
    console.error("[BACKGROUND UPDATE ERROR]", error);
    // Here you might want to implement some retry logic or notification system
  });

  // If payment failed, return failure response
  if (paymentStatus === "failed") {
    return { success: false, error: "Payment failed", status: paymentStatus };
  }

  return { success: true, status: paymentStatus };
}

// Separate function to handle all database updates
async function updatePaymentRecords(
  supabase: any,
  transaction: any,
  transaction_id: string,
  paymentStatus: string
) {
  try {
    console.log("transaction object:", transaction);
    console.log("transaction Id:", transaction_id);

    // Update transaction status
    console.log("Attempting to update transaction with:", {
      id: transaction.id,
      transaction_id,
      status: paymentStatus,
    });

    const { data: updatedTransaction, error: updateTransactionError } =
      await supabase
        .from("transactions")
        .update({
          status: paymentStatus,
          transactionId: transaction_id,
          updatedAt: new Date().toISOString(),
          orderId: transaction.orderId,
        })
        .eq("id", transaction.id)
        .select()
        .single();

    if (updateTransactionError) {
      console.error("Error updating transaction:", updateTransactionError);
      throw updateTransactionError;
    }

    console.log("Updated transaction result:", updatedTransaction);

    // Update order status
    const paymentStatusUpdate =
      paymentStatus === "success"
        ? "paid"
        : paymentStatus === "pending"
        ? "pending"
        : "failed";
    // Only update order status if payment is successful
    const orderStatusUpdate = paymentStatus === "success" ? "paid" : undefined;

    const updateData: any = {
      paymentStatus: paymentStatusUpdate,
      updatedAt: new Date().toISOString(),
      totalAmount: transaction.amount,
      customerName: transaction.customerName,
      customerEmail: transaction.customerEmail,
      customerPhone: transaction.customerPhone,
      shippingAddress: `${transaction.customerAddressLine1}, ${transaction.customerAddressLine2}, ${transaction.customerCity}, ${transaction.customerState}, ${transaction.customerZipCode}, ${transaction.customerCountry}`,
      paidAt: paymentStatus === "success" ? new Date().toISOString() : null,
      buyersPremium: transaction.buyersPremium,
      shippingCost: transaction.shippingCost,
      shippingRegion: transaction.shippingRegion,
    };

    // Only include orderStatus in the update if it's defined
    if (orderStatusUpdate !== undefined) {
      updateData.orderStatus = orderStatusUpdate;
    }

    const { error: updateOrderError } = await supabase
      .from("orders")
      .update(updateData)
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
