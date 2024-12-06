"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  CreditCard,
  HelpCircle,
  Package,
  RotateCcw,
  Wallet2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSupabase } from "@/app/context/SupabaseContext";
import { getCheckoutItems, createPayment } from "./actions";
import { CldImage } from "next-cloudinary";
import { formatCurrency } from "@/lib/utils";
import CheckoutSkeleton from "../components/CheckoutSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom } from "@/app/atom/userAtom";
import CountdownTimer from "../components/CheckoutCountdownTimer";
import toast from "react-hot-toast";

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  marketing: z.enum(["yes", "no"]),
});

const billingSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Invalid card number"),
  expiry: z.string().min(5, "Invalid expiry date"),
  cvc: z.string().min(3, "Invalid CVC"),
  paymentMethod: z.object({
    type: z.enum(["credit_card", "online_transfer", "e_wallet"]),
    // Credit Card Fields
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    // Online Transfer Fields
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    // E-wallet Fields
    walletProvider: z.string().optional(),
    walletId: z.string().optional(),
  }),
});

type FormData = z.infer<typeof addressSchema> &
  z.infer<typeof billingSchema> &
  z.infer<typeof paymentSchema>;

export default function CheckoutPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const [step, setStep] = useState<"address" | "billing" | "payment">(
    "address"
  );
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [user] = useAtom(userAtom);
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  const { data: checkoutItems, isLoading } = useQuery({
    queryKey: ["checkoutItems", user?.id],
    queryFn: () => getCheckoutItems(user?.id!, itemId),
    enabled: !!user?.id, // Only run query when user.id exists
  });

  const steps = [
    { id: "address", label: "Address" },
    { id: "billing", label: "Billing" },
    { id: "payment", label: "Payment" },
  ];

  const currentSchema = {
    address: addressSchema,
    billing: billingSchema,
    payment: paymentSchema,
  }[step];

  const form = useForm<Partial<FormData>>({
    resolver: zodResolver(currentSchema),
    defaultValues: formData,
  });

  const progress =
    ((steps.findIndex((s) => s.id === step) + 1) / steps.length) * 100;

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  const { order, item } = checkoutItems || {};

  // console.log("checkoutItems", checkoutItems); // Add check for buyer ID
  if (!order && isTimerExpired) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-xl font-semibold">NO orders found</h2>
        <p className="mt-2 text-muted-foreground">You cannot view this page.</p>
      </div>
    );
  }

  const shippingCost = 20;
  const buyersPremium = item?.currentBid! * 0.06;
  const totalPrice = item?.currentBid! + shippingCost + buyersPremium;

  const onSubmit = async (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });

    if (step === "address") {
      setStep("billing");
    } else if (step === "billing") {
      setStep("payment");
    } else if (step === "payment") {
      try {
        // Initialize CHIP-IN payment using server action
        const { checkout_url } = await createPayment({
          itemId,
          amount: totalPrice,
          customerDetails: {
            email: formData.email!,
            phone: formData.phone!,
            firstName: formData.firstName!,
            lastName: formData.lastName!,
          },
        });

        if (checkout_url) {
          // Redirect to CHIP-IN checkout page
          window.location.href = checkout_url;
        } else {
          toast.error("Failed to initialize payment");
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Payment initialization failed");
      }
    }
  };

  if (isTimerExpired) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-xl font-semibold">Order Expired</h2>
        <p className="mt-2 text-muted-foreground">
          Your order has expired. Please place a new order.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 rounded-xl">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:justify-center sm:space-x-8 sm:space-y-0">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className="relative flex items-center text-center"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step === s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="ml-2 font-medium">{s.label}</span>
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-10 h-8 w-px -translate-x-1/2 bg-muted sm:static sm:left-auto sm:top-auto sm:ml-8 sm:h-px sm:w-8 sm:translate-x-0" />
                )}
              </div>
            ))}
          </div>
          {checkoutItems?.order && (
            <CountdownTimer
              createdAt={checkoutItems.order.createdAt}
              orderId={checkoutItems.order.id}
              userId={user?.id!}
              onTimerExpired={() => setIsTimerExpired(true)}
            />
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {step === "address" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter first name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter last name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter email address"
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
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
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
                        name="marketing"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marketing Preferences</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="yes" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Yes, I&apos;d like to receive exclusive
                                    offers and updates
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    No, I don&apos;t want to receive marketing
                                    communications
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {step === "billing" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter street address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
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
                          name="postcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postcode</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter postcode"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {step === "payment" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="paymentMethod.type"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-3 gap-4"
                                >
                                  <FormItem>
                                    <FormControl>
                                      <div>
                                        <RadioGroupItem
                                          value="credit_card"
                                          id="credit_card"
                                          className="peer sr-only"
                                        />
                                        <FormLabel
                                          htmlFor="credit_card"
                                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                          <CreditCard className="mb-3 h-6 w-6" />
                                          Credit Card
                                        </FormLabel>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                  <FormItem>
                                    <FormControl>
                                      <div>
                                        <RadioGroupItem
                                          value="online_transfer"
                                          id="online_transfer"
                                          className="peer sr-only"
                                        />
                                        <FormLabel
                                          htmlFor="online_transfer"
                                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                          <Building className="mb-3 h-6 w-6" />
                                          Bank Transfer
                                        </FormLabel>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                  <FormItem>
                                    <FormControl>
                                      <div>
                                        <RadioGroupItem
                                          value="e_wallet"
                                          id="e_wallet"
                                          className="peer sr-only"
                                        />
                                        <FormLabel
                                          htmlFor="e_wallet"
                                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                          <Wallet2 className="mb-3 h-6 w-6" />
                                          E-Wallet
                                        </FormLabel>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("paymentMethod.type") === "credit_card" && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Enter your card details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <FormField
                                control={form.control}
                                name="paymentMethod.cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter card number"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid gap-4 sm:grid-cols-3">
                                <FormField
                                  control={form.control}
                                  name="paymentMethod.expiryDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Expiry Date</FormLabel>
                                      <FormControl>
                                        <Input placeholder="MM/YY" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="paymentMethod.cvv"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>CVC</FormLabel>
                                      <FormControl>
                                        <Input placeholder="CVC" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {form.watch("paymentMethod.type") ===
                          "online_transfer" && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Enter your bank details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div className="grid gap-4">
                                <FormField
                                  control={form.control}
                                  name="paymentMethod.bankName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Bank Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter bank name"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="paymentMethod.accountNumber"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Account Number</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter account number"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {form.watch("paymentMethod.type") === "e_wallet" && (
                          <Card>
                            <CardHeader>
                              <CardTitle>
                                Choose your ewallet provider
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div className="grid gap-4">
                                <FormField
                                  control={form.control}
                                  name="paymentMethod.walletProvider"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Ewallet Provider Name
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter provider name"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="paymentMethod.accountNumber"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Wallet ID</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter wallet ID"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (step === "billing") setStep("address");
                      if (step === "payment") setStep("billing");
                    }}
                    disabled={step === "address"}
                  >
                    Previous
                  </Button>
                  <Button type="submit">
                    {step === "payment" ? "Place Order" : "Continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-4">
                  <CldImage
                    src={item?.imageId}
                    alt="Alana Double Bed"
                    className="h-36 w-36 rounded-md object-cover"
                    width={96}
                    height={96}
                  />
                  <div>
                    <h3 className="font-medium">{item?.name}</h3>
                    {/* <p className="text-sm text-muted-foreground">Qty: 1</p> */}
                    {/* <p className="mt-1 font-medium">£399.00</p> */}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sold Price</span>
                    <span>{formatCurrency(item?.currentBid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee (6%)</span>
                    <span>{formatCurrency(buyersPremium)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(shippingCost)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <HelpCircle className="mx-auto h-6 w-6" />
                <h3 className="mt-2 font-medium">Help</h3>
                <p className="mt-1 text-muted-foreground">Mon-Fri: 8am-9pm</p>
                <p className="text-muted-foreground">Sat-Sun: 10am-6pm</p>
              </div>
              <div>
                <Package className="mx-auto h-6 w-6" />
                <h3 className="mt-2 font-medium">Delivery</h3>
                <p className="mt-1 text-muted-foreground">
                  Track your order in real time
                </p>
              </div>
              <div>
                <RotateCcw className="mx-auto h-6 w-6" />
                <h3 className="mt-2 font-medium">Returns</h3>
                <p className="mt-1 text-muted-foreground">
                  14 day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
