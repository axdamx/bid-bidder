"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OptimizedImage } from "@/app/components/OptimizedImage";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom } from "@/app/atom/userAtom";
import { createToyyibPayment, getCheckoutItems } from "./actions";
import CheckoutSkeleton from "../components/CheckoutSkeleton";
import CountdownTimer from "../components/CheckoutCountdownTimer";
import { formatCurrency } from "@/lib/utils";

const checkoutFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  shippingRegion: z.enum(["WEST", "EAST"]).optional(),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [selectedShippingRegion, setSelectedShippingRegion] = useState<"WEST" | "EAST">("WEST");

  const handleGoToDashboard = () => {
    router.push("/dashboard?tab=orders");
  };

  const calculateTotalAmount = (item: any, shippingRegion: "WEST" | "EAST") => {
    if (!item) return 0;
    const shippingCost = shippingRegion === "WEST" 
      ? item.westMalaysiaShippingPrice 
      : item.eastMalaysiaShippingPrice;
    return item.currentBid + (shippingCost || 0) + (item.currentBid * 0.06);
  };

  const handlePayment = async (formData: CheckoutFormData) => {
    try {
      setError(null);
      setIsSubmitting(true);

      // Split full name into first and last name
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ");

      const totalAmount = calculateTotalAmount(item, selectedShippingRegion);

      console.log("Creating payment with:", {
        itemId,
        amount: totalAmount,
        customerDetails: {
          email: formData.email,
          phone: formData.phone,
          firstName,
          lastName,
        },
      });

      const paymentResult = await createToyyibPayment({
        itemId,
        amount: totalAmount,
        customerDetails: {
          email: formData.email,
          phone: formData.phone,
          firstName: firstName || "",
          lastName: lastName || firstName || "",
        },
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Failed to create payment");
      }

      // Redirect to Toyyib Pay payment page
      if (!paymentResult.paymentUrl) {
        throw new Error("Payment URL is missing");
      }
      window.location.href = paymentResult.paymentUrl;
    } catch (error) {
      console.error("[PAYMENT ERROR]", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while processing your payment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: checkoutItems, isLoading } = useQuery({
    queryKey: ["checkoutItems", user?.id, itemId],
    queryFn: () => getCheckoutItems(user?.id!, itemId),
    enabled: !!user?.id,
    staleTime: 0, // Don't cache the data
    gcTime: 0, // Remove data from cache immediately
  });

  // Show timer dialog when component mounts
  useEffect(() => {
    if (checkoutItems?.order && !isTimerExpired) {
      setShowTimerDialog(true);
    }
  }, [checkoutItems?.order, isTimerExpired]);

  // Handle timer expiration
  useEffect(() => {
    if (isTimerExpired) {
      setShowTimerDialog(false);
      setShowExpiredDialog(true);
    }
  }, [isTimerExpired]);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      state: "",
      zipCode: "",
      shippingRegion: "WEST",
    },
  });

  // Debug form state
  console.log("Form State:", {
    values: form.getValues(),
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
  });

  if (!user?.id) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-xl font-semibold">Please login to continue</h2>
        <p className="mt-2 text-muted-foreground">
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  const { order, item } = checkoutItems || {};

  console.log("isTimerExpired", isTimerExpired);

  return (
    <>
      {!isTimerExpired && (
        <Dialog open={showTimerDialog} onOpenChange={setShowTimerDialog}>
          <DialogContent className="[&>button]:hidden">
            <DialogHeader>
              <DialogTitle>Time Remaining to Complete Checkout</DialogTitle>
              <DialogDescription>
                Please complete your checkout before the timer expires:
              </DialogDescription>
            </DialogHeader>
            {checkoutItems?.order && (
              <div className="py-4">
                <CountdownTimer
                  createdAt={checkoutItems.order.createdAt}
                  orderId={checkoutItems.order.id}
                  userId={user.id!}
                  onTimerExpired={() => setIsTimerExpired(true)}
                />
              </div>
            )}
            <div className="flex justify-center">
              <Button onClick={() => setShowTimerDialog(false)}>
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Order Expired</DialogTitle>
            <DialogDescription>
              You have missed the checkout window. This order has been
              cancelled.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={handleGoToDashboard}>Go to Orders</Button>
          </div>
        </DialogContent>
      </Dialog>

      {!isTimerExpired && (
        <>
          {!order || !item ? (
            <div className="container mx-auto py-12 text-center">
              <h2 className="text-xl font-semibold">No orders found</h2>
              <p className="mt-2 text-muted-foreground">
                You cannot view this page.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-4">
              <div className="space-y-8">
                {checkoutItems?.order && (
                  <div className="mb-8">
                    <CountdownTimer
                      createdAt={checkoutItems.order.createdAt}
                      orderId={checkoutItems.order.id}
                      userId={user?.id!}
                      onTimerExpired={() => setIsTimerExpired(true)}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{item?.name}</h1>
                    <span className="text-xl">
                      {formatCurrency(item?.currentBid)}
                    </span>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] bg-black border border-gray-200 rounded-lg">
                        <OptimizedImage
                          width={800}
                          height={600}
                          src={item?.imageId}
                          alt={item?.name}
                          className="object-contain"
                          quality="eco"
                        />
                        {/* <button className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white rounded-full">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white rounded-full">
                          <ChevronRight className="h-4 w-4" />
                        </button> */}
                      </div>
                      {/* Add thumbnail gallery here if you have multiple images */}
                    </CardContent>
                  </Card>

                  {/* <p className="text-gray-600">{item?.description}</p> */}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Payment Details
                  </h2>
                  <p className="text-gray-600">
                    Complete your purchase by providing your payment details.
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handlePayment)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing address</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="my">Malaysia</SelectItem>
                              <SelectItem value="gb">United Kingdom</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ZIP code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(item?.currentBid)}</span>
                      </div>
                      {item?.dealingMethodType === "SHIPPING" && (
                        <>
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Shipping Region</span>
                            <div className="flex gap-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="shippingRegion"
                                  value="WEST"
                                  checked={selectedShippingRegion === "WEST"}
                                  onChange={(e) => {
                                    setSelectedShippingRegion("WEST");
                                    form.setValue("shippingRegion", "WEST");
                                  }}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm">
                                  West Malaysia (RM {item?.westMalaysiaShippingPrice})
                                </span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="shippingRegion"
                                  value="EAST"
                                  checked={selectedShippingRegion === "EAST"}
                                  onChange={(e) => {
                                    setSelectedShippingRegion("EAST");
                                    form.setValue("shippingRegion", "EAST");
                                  }}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm">
                                  East Malaysia (RM {item?.eastMalaysiaShippingPrice})
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Shipping Cost</span>
                            <span>
                              {formatCurrency(
                                selectedShippingRegion === "WEST"
                                  ? item?.westMalaysiaShippingPrice
                                  : item?.eastMalaysiaShippingPrice
                              )}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Service Fee (6%)</span>
                        <span>{formatCurrency(item?.currentBid! * 0.06)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>
                          {formatCurrency(
                            calculateTotalAmount(item, selectedShippingRegion)
                          )}
                        </span>
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
                        {error}
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      type="submit"
                      disabled={!form.formState.isValid || isSubmitting}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : `Pay ${formatCurrency(
                            calculateTotalAmount(item, selectedShippingRegion)
                          )}`}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Lock className="h-4 w-4" />
                      Payments are secure and encrypted
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <span>Powered by Toyyib Pay</span>
                      <span>·</span>
                      <a href="#" className="hover:underline">
                        Terms
                      </a>
                      <span>·</span>
                      <a href="#" className="hover:underline">
                        Privacy
                      </a>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
