"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { handleToyyibCallback } from "../actions";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"success" | "failed" | "loading">(
    "loading"
  );

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const status_id = searchParams.get("status_id");
        const billcode = searchParams.get("billcode");
        const msg = searchParams.get("msg");
        const transaction_id = searchParams.get("transaction_id");
        const order_id = searchParams.get("order_id");

        // Call the callback handler with the URL parameters
        if (billcode) {
          const result = await handleToyyibCallback({
            refno: billcode,
            status: status_id,
            reason: msg,
            billcode,
            order_id,
            transaction_id,
          });

          if (result.success && status_id === "1" && msg === "ok") {
            setStatus("success");
          } else {
            setStatus("failed");
          }
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        setStatus("failed");
      }
    };

    updatePaymentStatus();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        {status === "loading" ? (
          <div className="animate-pulse">
            <div className="h-12 w-12 rounded-full bg-gray-200 mx-auto" />
            <div className="h-4 w-32 bg-gray-200 mx-auto mt-4" />
          </div>
        ) : status === "success" ? (
          <div>
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold mt-4">Payment Successful!</h1>
            <p className="text-gray-600 mt-2">
              Your payment has been processed successfully. You can now view
              your order details below.
            </p>
            <button
              onClick={() => router.push("/dashboard?tab=orders")}
              className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Orders
            </button>
          </div>
        ) : (
          <div>
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold mt-4">Payment Failed</h1>
            <p className="text-gray-600 mt-2">
              Sorry, we couldn't process your payment. Please try again.
            </p>
            <button
              onClick={() => router.push("/dashboard?tab=orders")}
              className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
