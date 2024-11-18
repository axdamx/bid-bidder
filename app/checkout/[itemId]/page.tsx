"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Package,
  RotateCcw,
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
import { getCheckoutItems } from "./actions";
import { CldImage } from "next-cloudinary";
import { formatCurrency } from "@/lib/utils";
import CheckoutSkeleton from "../components/CheckoutSkeleton";
import { useQuery } from "@tanstack/react-query";

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
  const { session } = useSupabase();
  const user = session?.user;

  console.log("user", user);

  // Add state for checkout items
  // const [checkoutItems, setCheckoutItems] = useState(null);
  // const [loading, setLoading] = useState(true);

  // Add useEffect to fetch checkout items
  // useEffect(() => {
  //   const fetchItems = async () => {
  //     setLoading(true);
  //     if (user?.id) {
  //       try {
  //         const items = await getCheckoutItems(user.id);
  //         console.log("items dalam checkout", items);
  //         setCheckoutItems(items);
  //       } catch (error) {
  //         console.error("Error fetching checkout items:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchItems();
  // }, [user?.id]);
  const { data: checkoutItems, isLoading } = useQuery({
    queryKey: ["checkoutItems", user?.id],
    queryFn: () => getCheckoutItems(user?.id!, itemId),
    enabled: !!user?.id, // Only run query when user.id exists
  });

  console.log("checkoutItems", checkoutItems);

  const shippingCost = 20;
  const buyersPremium = checkoutItems?.currentBid! * 0.07;
  const totalPrice = checkoutItems?.currentBid! + shippingCost + buyersPremium;

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

  const onSubmit = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
    if (step === "address") setStep("billing");
    else if (step === "billing") setStep("payment");
  };

  const progress =
    ((steps.findIndex((s) => s.id === step) + 1) / steps.length) * 100;

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <Progress
            value={progress}
            className="h-2 w-full"
            indicatorClassName="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-center space-x-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
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
                  <div className="ml-8 h-px w-8 bg-muted" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {step === "address" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Contact</CardTitle>
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
                                    Yes, I'd like to receive exclusive offers
                                    and updates
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    No, I don't want to receive marketing
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
                      <FormField
                        control={form.control}
                        name="cardNumber"
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
                          name="expiry"
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
                          name="cvc"
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
                    src={checkoutItems?.imageId}
                    alt="Alana Double Bed"
                    className="h-36 w-36 rounded-md object-cover"
                    width={96}
                    height={96}
                  />
                  <div>
                    <h3 className="font-medium">{checkoutItems?.name}</h3>
                    {/* <p className="text-sm text-muted-foreground">Qty: 1</p> */}
                    {/* <p className="mt-1 font-medium">£399.00</p> */}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sold Price</span>
                    <span>{formatCurrency(checkoutItems?.currentBid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee (7%)</span>
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
