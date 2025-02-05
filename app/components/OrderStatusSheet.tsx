"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Package, Truck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { OptimizedImage } from "./OptimizedImage";
import { Order } from "@/app/types/order";
import { useState } from "react";
import { confirmDelivery } from "../dashboard/orders/action";
import { userAtom } from "../atom/userAtom";
import { useAtom } from "jotai";
import { useToast } from "@/hooks/use-toast";

interface OrderStatusSheetProps {
  order: Order;
  disabled?: boolean;
}

export function OrderStatusSheet({ order, disabled }: OrderStatusSheetProps) {
  const [user] = useAtom(userAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: confirmDeliveryMutation, isPending } = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      return await confirmDelivery(order.id, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Status Updated",
        description: "Delivery confirmed successfully",
      });
    },
    onError: (error) => {
      console.error("Error confirming delivery:", error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Error confirming delivery",
        });
      }
    },
  });

  const handleConfirmDelivery = () => {
    if (!user?.id) return;
    confirmDeliveryMutation();
  };

  const steps = [
    {
      status: "pending",
      title: "Pending",
      icon: Clock,
    },
    // {
    //   status: "processing",
    //   title: "Processing",
    //   icon: Package,
    // },
    {
      status: "shipped",
      title: "Shipped",
      icon: Truck,
    },
    {
      status: "delivered",
      title: "Delivered",
      icon: CheckCircle2,
    },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.status === order.shippingStatus
  );

  const serviceTax = order.amount * 0.06;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={disabled}
        >
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Order Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-medium">#{order.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Sold Price</p>
                <p className="font-medium">{formatCurrency(order.amount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Service Tax Price</p>
                <p className="font-medium">{formatCurrency(serviceTax)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Price</p>
                <p className="font-medium">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Status</p>
                <p className="font-medium capitalize">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Shipping Status</p>
                <p className="font-medium capitalize">{order.shippingStatus}</p>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Item Details</h3>
            <div className="rounded-lg border p-4">
              <div className="flex gap-4 items-center">
                {order.item.imageId && (
                  <div className="relative h-20 w-20 rounded-md overflow-hidden">
                    <OptimizedImage
                      width={200}
                      height={200}
                      src={order.item.imageId}
                      alt={order.item.name}
                      className="object-contain"
                      quality="eco"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium">{order.item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Item #{order.itemId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          {
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Order Status</h3>
              <div className="relative space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.status} className="flex items-center gap-4">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full border flex items-center justify-center",
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : "bg-background",
                          isCurrent && "ring-2 ring-primary ring-offset-2"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            "font-medium",
                            isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.title}
                        </p>
                        {isCurrent &&
                          step.status === "shipped" &&
                          order.courierService &&
                          order.trackingNumber && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p>Courier: {order.courierService}</p>
                              <p>Tracking: {order.trackingNumber}</p>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          }

          {/* Delivery Confirmation Section */}
          {order.shippingStatus === "shipped" && order.buyerId === user?.id && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-semibold text-lg">Delivery Confirmation</h3>
              <p className="text-sm text-muted-foreground">
                Have you received your item? Please confirm the delivery once
                you have received it.
              </p>
              <Button
                onClick={handleConfirmDelivery}
                disabled={isPending}
                className="w-full"
              >
                {isPending ? "Confirming..." : "Confirm Delivery"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
