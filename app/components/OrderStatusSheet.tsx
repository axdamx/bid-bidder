"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { OptimizedImage } from "./OptimizedImage";
import { Order } from "@/app/types/order";
import { useState, useMemo, useEffect } from "react";
import { userAtom } from "../atom/userAtom";
import { useAtom } from "jotai";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ReviewModal } from "./ReviewModal";
import {
  confirmDelivery,
  nudgeSellerToShip,
} from "../app/dashboard/orders/action";
import { formatDateWithTime } from "../app/items/[itemId]/utils/formatters";

interface OrderStatusSheetProps {
  order: Order;
  disabled?: boolean;
}

export function OrderStatusSheet({ order, disabled }: OrderStatusSheetProps) {
  const [user] = useAtom(userAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isNudging, setIsNudging] = useState(false);

  // Calculate time remaining until nudge is available
  const timeRemainingForNudge = useMemo(() => {
    if (!order.orderDate) return { hours: 24, minutes: 0, canNudge: false };

    const orderDate = new Date(order.orderDate);
    const currentDate = new Date();

    // Calculate time difference
    const diffTime = currentDate.getTime() - orderDate.getTime();

    // If order is less than 24 hours old, calculate remaining time
    if (diffTime < 24 * 60 * 60 * 1000) {
      const remainingMs = 24 * 60 * 60 * 1000 - diffTime;
      const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainingMinutes = Math.floor(
        (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
      );

      return {
        hours: remainingHours,
        minutes: remainingMinutes,
        canNudge: false,
      };
    }

    // If order is older than 24 hours, nudge is available
    return { hours: 0, minutes: 0, canNudge: true };
  }, [order.orderDate]);

  // Check if order is at least 1 day old
  const isOrderOlderThanOneDay = useMemo(() => {
    return timeRemainingForNudge.canNudge;
  }, [timeRemainingForNudge]);

  // Calculate time remaining since last nudge
  const timeRemainingSinceLastNudge = useMemo(() => {
    if (!order.lastNudgedAt) return { hours: 0, minutes: 0, canNudge: true };

    const lastNudgeDate = new Date(order.lastNudgedAt);
    const currentDate = new Date();

    // Calculate time difference
    const diffTime = currentDate.getTime() - lastNudgeDate.getTime();

    // If last nudge was less than 24 hours ago, calculate remaining time
    if (diffTime < 24 * 60 * 60 * 1000) {
      const remainingMs = 24 * 60 * 60 * 1000 - diffTime;
      const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainingMinutes = Math.floor(
        (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
      );

      return {
        hours: remainingHours,
        minutes: remainingMinutes,
        canNudge: false,
      };
    }

    // If last nudge was more than 24 hours ago, nudge is available
    return { hours: 0, minutes: 0, canNudge: true };
  }, [order.lastNudgedAt]);

  // Check if user can nudge seller (based on lastNudgedAt)
  const canNudgeSeller = useMemo(() => {
    return timeRemainingSinceLastNudge.canNudge;
  }, [timeRemainingSinceLastNudge]);

  const { mutate: nudgeSellerMutation } = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      return await nudgeSellerToShip(order.id, user.id);
    },
    onMutate: () => {
      setIsNudging(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Seller Nudged",
        description: "The seller has been notified to ship your item.",
      });
      setIsNudging(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Error nudging seller",
          variant: "destructive",
        });
      }
      setIsNudging(false);
    },
  });

  const handleNudgeSeller = () => {
    if (!user?.id) return;
    nudgeSellerMutation();
  };

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
      setConfirmDialogOpen(false);
      setShowReviewModal(true);
    },
    onError: (error) => {
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

  const currentStepIndex = useMemo(() => {
    if (
      order.orderStatus === "delivered" &&
      order.shippingStatus === "delivered"
    ) {
      return 3; // Show all steps as completed for delivered orders
    }
    if (
      order.paymentStatus === "unpaid" &&
      order.shippingStatus === "pending"
    ) {
      return 0; // Show first step as active for pending unpaid orders
    }
    if (order.shippedAt) return 2;
    if (order.paymentStatus === "paid") return 1;
    return 0;
  }, [
    order.paymentStatus,
    order.shippedAt,
    order.shippingStatus,
    order.orderStatus,
  ]);

  const steps = [
    {
      status: "paid",
      title:
        order.paymentStatus === "unpaid"
          ? "Pending Payment"
          : "Payment Completed",
      icon: DollarSign,
    },
    {
      status: "pending",
      title: "Pending",
      icon: Clock,
    },
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

  const serviceTax = order.amount * 0.06;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
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
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6 pb-6 px-6">
            {/* Order Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-medium">#{order.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dealing Method</p>
                  {order.item.dealingMethodType === "SHIPPING" ? (
                    <p className="font-medium capitalize">
                      {order.item.dealingMethodType}
                    </p>
                  ) : (
                    <p className="font-medium">
                      {order.item.dealingMethodType} at{" "}
                      {order.item.dealingMethodLocation}
                    </p>
                  )}
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
                  <p className="text-muted-foreground">Buyer's Premium</p>
                  <p className="font-medium">{formatCurrency(serviceTax)}</p>
                </div>
                {order.item.dealingMethodType === "SHIPPING" && (
                  <div>
                    <p className="text-muted-foreground">Shipping Cost</p>
                    <p className="font-medium">
                      {order.totalAmount && order.amount
                        ? formatCurrency(
                            order.totalAmount - order.amount - serviceTax
                          )
                        : "N/A"}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Total Amount Paid</p>
                  <p className="font-medium">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Status</p>
                  <p className="font-medium capitalize">
                    {order.paymentStatus}
                  </p>
                </div>
                {order.item.dealingMethodType === "SHIPPING" && (
                  <div>
                    <p className="text-muted-foreground">Shipping Status</p>
                    <p className="font-medium capitalize">
                      {order.shippingStatus}
                    </p>
                  </div>
                )}
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
                  {steps
                    .filter(
                      (step) =>
                        !(
                          order.item.dealingMethodType === "COD" &&
                          step.status === "shipped"
                        )
                    )
                    .map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStepIndex;

                      return (
                        <div
                          key={step.status}
                          className="flex items-center gap-4"
                        >
                          <div
                            className={cn(
                              "h-8 w-8 rounded-full border flex items-center justify-center",
                              isCompleted
                                ? "bg-primary text-primary-foreground"
                                : "bg-background"
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
                            {step.status === "paid" && order.updatedAt && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                <p>
                                  {order.paidAt && (
                                    <>
                                      Paid on:{" "}
                                      {formatDateWithTime(order.updatedAt)}
                                    </>
                                  )}
                                </p>
                              </div>
                            )}
                            {step.status === "pending" &&
                              order.item.dealingMethodType === "COD" && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <p>Payment Method: Cash on Delivery</p>
                                  {/* {order.customerName && ( */}
                                  <>
                                    <p>Customer: {order.customerName}</p>
                                    <p>
                                      Phone: {order.customerPhone}{" "}
                                      {order.item.dealingMethodType === "COD" &&
                                        order.paymentStatus === "paid" && (
                                          <a
                                            href={`https://wa.me/+6${order.customerPhone?.replace(
                                              /\D/g,
                                              ""
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center ml-2"
                                          >
                                            <Image
                                              src="/whatsapp-icon.svg"
                                              alt="WhatsApp"
                                              width={20}
                                              height={20}
                                              className="inline"
                                            />
                                          </a>
                                        )}
                                    </p>
                                    <p>Email: {order.customerEmail}</p>
                                  </>
                                  {/* )} */}
                                </div>
                              )}
                            {step.status === "pending" &&
                              order.item.dealingMethodType === "SHIPPING" && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <>
                                    <p>Customer Name: {order.customerName}</p>
                                    <p>Phone: {order.customerPhone}</p>
                                    <p>Email: {order.customerEmail}</p>
                                    <p>Address: {order.shippingAddress}</p>
                                  </>
                                </div>
                              )}
                            {step.status === "delivered" &&
                              order.deliveredAt && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <p>
                                    Delivered on:{" "}
                                    {formatDateWithTime(order.deliveredAt)}
                                  </p>
                                </div>
                              )}
                            {step.status === "shipped" &&
                              order.shippedAt &&
                              order.courierService &&
                              order.trackingNumber && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <p>Courier: {order.courierService}</p>
                                  <p>Tracking: {order.trackingNumber}</p>
                                  <p>
                                    Shipped on:{" "}
                                    {formatDateWithTime(order.shippedAt)}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            }

            {/* Nudge Seller Section - Only show for buyers when shipping status is pending */}
            {order.item.dealingMethodType === "SHIPPING" &&
              order.shippingStatus === "pending" &&
              order.buyerId === user?.id &&
              order.paymentStatus === "paid" && (
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Shipping Reminder</h3>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Waiting for seller to ship your item
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          {isOrderOlderThanOneDay
                            ? canNudgeSeller
                              ? "You can send a friendly reminder to the seller to ship your item."
                              : `You've already sent a reminder. You can send another reminder in ${timeRemainingSinceLastNudge.hours}h ${timeRemainingSinceLastNudge.minutes}m.`
                            : `You can send a reminder in ${timeRemainingForNudge.hours}h ${timeRemainingForNudge.minutes}m.`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-900"
                      onClick={handleNudgeSeller}
                      disabled={
                        !isOrderOlderThanOneDay || !canNudgeSeller || isNudging
                      }
                    >
                      {isNudging
                        ? "Sending reminder..."
                        : "Send Shipping Reminder"}
                    </Button>
                  </div>
                </div>
              )}

            {/* Delivery Confirmation Section */}
            {((order.shippingStatus === "shipped" &&
              order.buyerId === user?.id) ||
              (order.item.dealingMethodType === "COD" &&
                order.shippingStatus.toLowerCase() === "pending" &&
                order.buyerId === user?.id)) && (
              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-semibold text-lg">Delivery Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  Have you received your item? Please confirm the delivery once
                  you have received it.
                </p>
                <Dialog
                  open={confirmDialogOpen}
                  onOpenChange={setConfirmDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full">Confirm Delivery</Button>
                  </DialogTrigger>
                  <DialogContent className="[&>button]:hidden">
                    <DialogHeader>
                      <DialogTitle>Confirm Delivery</DialogTitle>
                      <DialogDescription>
                        By confirming delivery, you acknowledge that:
                        <div className="bg-gray-100 p-4 rounded-lg mt-2">
                          <ul className="text-gray-600 text-sm space-y-2">
                            <li>• You have received the item</li>
                            <li>• The item is in good condition</li>
                            <li>
                              • The item matches the description provided by the
                              seller
                            </li>
                          </ul>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setConfirmDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConfirmDelivery}
                        disabled={isPending}
                      >
                        {isPending ? "Confirming..." : "Yes, Confirm Delivery"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Review Modal */}
      <ReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        orderId={order.id}
        sellerId={order.sellerId!}
        sellerName={order.seller?.name || "Seller"}
        sellerImage={order.seller?.image}
        itemName={order.item.name}
        itemImage={order.item.imageId}
      />
    </>
  );
}
