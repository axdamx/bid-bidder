"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { handleToyyibCallback } from "../actions";
import { Button } from "@/components/ui/button";

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
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto animate-bounce mt-6" />
              <h1 className="text-3xl font-bold mt-4 text-green-700">
                Payment Successful!
              </h1>
              <div className="space-y-4 mt-4">
                <p className="text-gray-600">
                  Great news! Your payment has been processed successfully.
                  We've recorded your transaction and your order is now
                  confirmed.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <h2 className="font-semibold text-gray-800">What's Next?</h2>
                  <ul className="text-gray-600 text-sm mt-2 space-y-2">
                    <li>• Track your order status in real-time</li>
                    <li>• View detailed transaction history</li>
                    <li>• Get updates on shipping and delivery</li>
                  </ul>
                </div>
              </div>
              <Button
                variant="default"
                onClick={() =>
                  router.push(
                    "/app/dashboard?tab=orders&refresh=" + new Date().getTime()
                  )
                }
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                View Order Details
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
              <XCircle className="h-16 w-16 text-red-500 mx-auto animate-bounce" />
              <h1 className="text-3xl font-bold mt-4 text-red-700">
                Payment Failed
              </h1>
              <div className="space-y-4 mt-4">
                <p className="text-gray-600">
                  We couldn't process your payment at this time. Don't worry -
                  this happens sometimes and it's usually easy to fix.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <h2 className="font-semibold text-gray-800">
                    Suggested Actions:
                  </h2>
                  <ul className="text-gray-600 text-sm mt-2 space-y-2">
                    <li>• Check your connection</li>
                    <li>• You may retry the payment in dashboard</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <Button
                  variant="default"
                  onClick={() =>
                    router.push(
                      "/app/dashboard?tab=orders&refresh=" +
                        new Date().getTime()
                    )
                  }
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  View Failed Order
                </Button>
                {/* <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full border-red-200 text-red-700 hover:bg-red-50 px-6 py-3 rounded-lg transition-all duration-200"
                >
                  Retry Payment
                </Button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
