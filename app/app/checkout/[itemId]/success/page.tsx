"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Order, Item } from "@/src/db/schema";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface OrderDetails extends Order {
  item: Item;
}

export default function PaymentSuccessPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${itemId}`);
        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [itemId]);

  if (loading) {
    return <div className="container mx-auto py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center">Thanks for your order!</CardTitle>
          <p className="text-center text-muted-foreground">
            The order confirmation has been sent to your email
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {orderDetails && (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold">Transaction Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Transaction Date
                  </span>
                  <span>
                    {new Date(orderDetails.orderDate!).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">Payment Method</span>
                  <span>{orderDetails.paymentMethod}</span>
                  <span className="text-muted-foreground">Shipping Method</span>
                  <span>Express delivery (1-3 business days)</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold">Your Order</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{orderDetails.item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: 1
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(orderDetails.amount)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderDetails.amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Applied discount code</span>
                  <span>20% OFF</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Discount</span>
                  <span>
                    -{formatCurrency(orderDetails.amount * 0.2)} (20% OFF)
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipment cost</span>
                  <span>-{formatCurrency(22.5)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Grand total</span>
                  <span>
                    {formatCurrency(orderDetails.amount * 0.8 - 22.5)}
                  </span>
                </div>
              </div>

              <Button
                variant="default"
                className="w-full mt-4"
                onClick={() => router.push("/")}
              >
                Continue shopping
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
