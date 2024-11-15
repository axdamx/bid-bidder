// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Input } from "@/components/ui/input";
// // // import { useState } from "react";
// // // import { getCheckoutItems } from "./actions";
// // // import { auth } from "@/app/auth";
// // // import ItemImage from "@/app/items/[itemId]/image-component";
// // // import CartSummary from "./cart-summary";

// // // const CheckoutPage = async () => {
// // //   const session = await auth();
// // //   const userId = session?.user?.id;
// // //   const checkoutItems = await getCheckoutItems(userId!);

// // //   const shippingCost = 20;
// // //   const buyersPremium = checkoutItems?.currentBid! * 0.1;
// // //   const totalPrice = checkoutItems?.currentBid! + shippingCost + buyersPremium;

// // //   return (
// // //     <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
// // //       {/* Product Details Section */}
// // //       <div>
// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle>{checkoutItems?.name}</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="mb-4">
// // //               {checkoutItems && <ItemImage item={checkoutItems!} />}
// // //             </div>
// // //             <CartSummary
// // //               subtotal={checkoutItems?.currentBid}
// // //               shipping={shippingCost}
// // //               premium={buyersPremium}
// // //               totalPrice={totalPrice}
// // //             />
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       {/* Payment Details Section */}
// // //       <div>
// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle>Payment Details</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="flex justify-between items-center mb-4">
// // //               <img
// // //                 src="/icons/mastercard.svg"
// // //                 alt="MasterCard"
// // //                 className="h-8"
// // //               />
// // //               <img src="/icons/paypal.svg" alt="PayPal" className="h-8" />
// // //               <img src="/icons/visa.svg" alt="Visa" className="h-8" />
// // //             </div>
// // //             <form>
// // //               <div className="mb-4">
// // //                 <Input label="Email Address" placeholder="Email" />
// // //               </div>
// // //               <div className="mb-4">
// // //                 <Input label="Card Details" placeholder="000-00-000" />
// // //               </div>
// // //               <div className="mb-4">
// // //                 <Input label="Card Holder Name" placeholder="John" />
// // //               </div>
// // //               <div className="grid grid-cols-2 gap-4 mb-4">
// // //                 <Input label="Zip" placeholder="Zip" />
// // //                 <Input label="State" placeholder="State" />
// // //               </div>
// // //               <div className="mb-4">
// // //                 <Input label="Discount Code" placeholder="2423" />
// // //               </div>
// // //               <Button className="w-full">Pay ${totalPrice}</Button>
// // //             </form>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CheckoutPage;
// // "use client";
// // import React, { useEffect, useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// //   CardDescription,
// // } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Separator } from "@/components/ui/separator";
// // import {
// //   CreditCard,
// //   PlayIcon,
// //   Info,
// //   HelpCircle,
// //   Package,
// //   RotateCcw,
// //   ArrowRight,
// //   Link,
// //   ArrowLeft,
// // } from "lucide-react";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import CartSummary from "./cart-summary";
// // import ItemImage from "@/app/items/[itemId]/image-component";
// // import { getCheckoutItems } from "./actions";
// // import { auth } from "@/app/auth";
// // import { useSupabase } from "@/app/context/SupabaseContext";
// // import { formatCurrency } from "@/lib/utils";
// // import Image from "next/image";
// // import { useForm } from "react-hook-form";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Progress } from "@/components/ui/progress";
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// // // const CheckoutPage = () => {
// // //   // const session = await auth();
// // //   // const userId = session?.user?.id;
// // //   const { session } = useSupabase();
// // //   const user = session?.user;

// // //   // Add state for checkout items
// // //   const [checkoutItems, setCheckoutItems] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   // Add useEffect to fetch checkout items
// // //   useEffect(() => {
// // //     const fetchItems = async () => {
// // //       if (user?.id) {
// // //         try {
// // //           const items = await getCheckoutItems(user.id);
// // //           setCheckoutItems(items);
// // //         } catch (error) {
// // //           console.error("Error fetching checkout items:", error);
// // //         } finally {
// // //           setLoading(false);
// // //         }
// // //       }
// // //     };

// // //     fetchItems();
// // //   }, [user?.id]);

// // //   // const checkoutItems = await getCheckoutItems(userId!);
// // //   console.log("checkoutItems", checkoutItems);

// // //   const shippingCost = 20;
// // //   const buyersPremium = checkoutItems?.currentBid! * 0.07;
// // //   const totalPrice = checkoutItems?.currentBid! + shippingCost + buyersPremium;

// // //   return (
// // //     <div className="container mx-auto py-8">
// // //       <h1 className="text-3xl font-bold mb-8">Checkout</h1>

// // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// // //         {/* Left Column - Order Summary */}
// // //         <div className="space-y-6">
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle>Order Summary</CardTitle>
// // //               <CardDescription>Review your item details</CardDescription>
// // //             </CardHeader>
// // //             <CardContent>
// // //               <div className="space-y-6">
// // //                 {/* Item Details */}
// // //                 <div className="flex gap-4">
// // //                   <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
// // //                     {checkoutItems && <ItemImage item={checkoutItems} />}
// // //                   </div>
// // //                   <div>
// // //                     <h3 className="font-medium">{checkoutItems?.name}</h3>
// // //                     <p className="text-sm text-gray-500">Lot #123456</p>
// // //                     <p className="text-sm font-medium mt-2">
// // //                       {formatCurrency(checkoutItems?.currentBid)}
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 <Separator />

// // //                 {/* Cost Breakdown */}
// // //                 <CartSummary
// // //                   subtotal={checkoutItems?.currentBid}
// // //                   shipping={shippingCost}
// // //                   premium={buyersPremium}
// // //                   totalPrice={totalPrice}
// // //                 />
// // //               </div>
// // //             </CardContent>
// // //           </Card>
// // //         </div>

// // //         {/* Right Column - Payment Details */}
// // //         <div className="space-y-6">
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle>Payment Method</CardTitle>
// // //               <CardDescription>Choose how you want to pay</CardDescription>
// // //             </CardHeader>
// // //             <CardContent>
// // //               <Tabs defaultValue="card" className="w-full">
// // //                 <TabsList className="grid w-full grid-cols-2 mb-4">
// // //                   <TabsTrigger value="card">Credit Card</TabsTrigger>
// // //                   <TabsTrigger value="paypal">PayPal</TabsTrigger>
// // //                 </TabsList>

// // //                 <TabsContent value="card">
// // //                   <form className="space-y-4">
// // //                     <div className="space-y-2">
// // //                       <Label htmlFor="email">Email</Label>
// // //                       <Input
// // //                         id="email"
// // //                         type="email"
// // //                         placeholder="you@example.com"
// // //                       />
// // //                     </div>

// // //                     <div className="space-y-2">
// // //                       <Label htmlFor="card">Card Information</Label>
// // //                       <div className="relative">
// // //                         <Input id="card" placeholder="1234 1234 1234 1234" />
// // //                         <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
// // //                           <CreditCard className="h-4 w-4 text-gray-400" />
// // //                         </div>
// // //                       </div>
// // //                       <div className="grid grid-cols-2 gap-4">
// // //                         <Input placeholder="MM / YY" />
// // //                         <Input placeholder="CVC" />
// // //                       </div>
// // //                     </div>

// // //                     <div className="space-y-2">
// // //                       <Label htmlFor="name">Name on Card</Label>
// // //                       <Input id="name" placeholder="John Doe" />
// // //                     </div>

// // //                     <div className="grid grid-cols-2 gap-4">
// // //                       <div className="space-y-2">
// // //                         <Label htmlFor="country">Country</Label>
// // //                         <Select>
// // //                           <SelectTrigger id="country">
// // //                             <SelectValue placeholder="Select" />
// // //                           </SelectTrigger>
// // //                           <SelectContent>
// // //                             <SelectItem value="us">United States</SelectItem>
// // //                             <SelectItem value="uk">United Kingdom</SelectItem>
// // //                             <SelectItem value="ca">Canada</SelectItem>
// // //                           </SelectContent>
// // //                         </Select>
// // //                       </div>
// // //                       <div className="space-y-2">
// // //                         <Label htmlFor="zip">ZIP / Postal Code</Label>
// // //                         <Input id="zip" placeholder="12345" />
// // //                       </div>
// // //                     </div>

// // //                     <div className="space-y-2">
// // //                       <Label htmlFor="promo">Promo Code</Label>
// // //                       <div className="flex gap-2">
// // //                         <Input id="promo" placeholder="Enter code" />
// // //                         <Button variant="outline">Apply</Button>
// // //                       </div>
// // //                     </div>

// // //                     <div className="pt-4">
// // //                       <Button className="w-full" size="lg">
// // //                         Pay {formatCurrency(totalPrice)}
// // //                       </Button>
// // //                       <p className="text-xs text-gray-500 text-center mt-2">
// // //                         You will not be charged until the auction ends
// // //                       </p>
// // //                     </div>
// // //                   </form>
// // //                 </TabsContent>

// // //                 <TabsContent value="paypal">
// // //                   <div className="text-center py-8">
// // //                     <PlayIcon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
// // //                     <p className="text-gray-600">
// // //                       You will be redirected to PayPal to complete your payment
// // //                     </p>
// // //                     <Button className="mt-4" variant="outline">
// // //                       Continue with PayPal
// // //                     </Button>
// // //                   </div>
// // //                 </TabsContent>
// // //               </Tabs>
// // //             </CardContent>
// // //           </Card>

// // //           {/* Security Notice */}
// // //           <div className="flex items-center gap-2 text-sm text-gray-500">
// // //             <Info className="h-4 w-4" />
// // //             <p>All transactions are secure and encrypted</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CheckoutPage;

// // const addressSchema = z.object({
// //   firstName: z.string().min(1, "First name is required"),
// //   lastName: z.string().min(1, "Last name is required"),
// //   email: z.string().email("Invalid email address"),
// //   phone: z.string().min(1, "Phone number is required"),
// //   marketing: z.enum(["yes", "no"]),
// // });

// // const billingSchema = z.object({
// //   address: z.string().min(1, "Address is required"),
// //   city: z.string().min(1, "City is required"),
// //   postcode: z.string().min(1, "Postcode is required"),
// // });

// // const paymentSchema = z.object({
// //   cardNumber: z.string().min(16, "Invalid card number"),
// //   expiry: z.string().min(5, "Invalid expiry date"),
// //   cvc: z.string().min(3, "Invalid CVC"),
// // });

// // const formSchema = z.object({
// //   address: addressSchema,
// //   billing: billingSchema,
// //   payment: paymentSchema,
// // });

// // type FormData = z.infer<typeof formSchema>;

// // export default function CheckoutPage() {
// //   const [step, setStep] = useState<"address" | "billing" | "payment">(
// //     "address"
// //   );

// //   const form = useForm<FormData>({
// //     resolver: zodResolver(formSchema),
// //     defaultValues: {
// //       address: {
// //         firstName: "",
// //         lastName: "",
// //         email: "",
// //         phone: "",
// //         marketing: "no",
// //       },
// //       billing: {
// //         address: "",
// //         city: "",
// //         postcode: "",
// //       },
// //       payment: {
// //         cardNumber: "",
// //         expiry: "",
// //         cvc: "",
// //       },
// //     },
// //   });

// //   const steps = [
// //     { id: "address", label: "Address" },
// //     { id: "billing", label: "Billing" },
// //     { id: "payment", label: "Payment" },
// //   ];

// //   const onSubmit = (data: FormData) => {
// //     if (step === "address") setStep("billing");
// //     else if (step === "billing") setStep("payment");
// //     else if (step === "payment") {
// //       console.log("Order placed:", data);
// //       // Here you would typically send the data to your server
// //     }
// //   };

// //   const progress =
// //     ((steps.findIndex((s) => s.id === step) + 1) / steps.length) * 100;

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <header className="border-b bg-white">
// //         <div className="mx-auto max-w-6xl px-4 py-4">
// //           <Link href="/" className="text-2xl font-bold">
// //             MADE
// //           </Link>
// //         </div>
// //       </header>

// //       <main className="mx-auto max-w-6xl px-4 py-8">
// //         <Link
// //           href="/basket"
// //           className="mb-8 flex items-center text-sm text-muted-foreground hover:text-primary"
// //         >
// //           <ArrowLeft className="mr-2 h-4 w-4" />
// //           Back to basket
// //         </Link>

// //         <div className="mb-8">
// //           <Progress value={progress} className="h-2 w-full" />
// //         </div>

// //         <div className="mb-8">
// //           <div className="flex justify-center space-x-8">
// //             {steps.map((s, i) => (
// //               <div key={s.id} className="flex items-center">
// //                 <div
// //                   className={`flex h-8 w-8 items-center justify-center rounded-full ${
// //                     step === s.id
// //                       ? "bg-primary text-primary-foreground"
// //                       : "bg-muted text-muted-foreground"
// //                   }`}
// //                 >
// //                   {i + 1}
// //                 </div>
// //                 <span className="ml-2 font-medium">{s.label}</span>
// //                 {i < steps.length - 1 && (
// //                   <div className="ml-8 h-px w-8 bg-muted" />
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         <div className="grid gap-8 lg:grid-cols-3">
// //           <div className="lg:col-span-2">
// //             <Form {...form}>
// //               <form onSubmit={form.handleSubmit(onSubmit)}>
// //                 {step === "address" && (
// //                   <Card>
// //                     <CardHeader>
// //                       <CardTitle>Delivery Contact</CardTitle>
// //                     </CardHeader>
// //                     <CardContent className="space-y-6">
// //                       <div className="grid gap-4 sm:grid-cols-2">
// //                         <FormField
// //                           control={form.control}
// //                           name="address.firstName"
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>First Name</FormLabel>
// //                               <FormControl>
// //                                 <Input
// //                                   placeholder="Enter first name"
// //                                   {...field}
// //                                 />
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />
// //                         <FormField
// //                           control={form.control}
// //                           name="address.lastName"
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>Last Name</FormLabel>
// //                               <FormControl>
// //                                 <Input
// //                                   placeholder="Enter last name"
// //                                   {...field}
// //                                 />
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />
// //                       </div>
// //                       <FormField
// //                         control={form.control}
// //                         name="address.email"
// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel>Email Address</FormLabel>
// //                             <FormControl>
// //                               <Input
// //                                 type="email"
// //                                 placeholder="Enter email address"
// //                                 {...field}
// //                               />
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                       <FormField
// //                         control={form.control}
// //                         name="address.phone"
// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel>Phone</FormLabel>
// //                             <FormControl>
// //                               <Input
// //                                 type="tel"
// //                                 placeholder="Enter phone number"
// //                                 {...field}
// //                               />
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                       <FormField
// //                         control={form.control}
// //                         name="address.marketing"
// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel>Marketing Preferences</FormLabel>
// //                             <FormControl>
// //                               <RadioGroup
// //                                 onValueChange={field.onChange}
// //                                 defaultValue={field.value}
// //                                 className="flex flex-col space-y-1"
// //                               >
// //                                 <FormItem className="flex items-center space-x-3 space-y-0">
// //                                   <FormControl>
// //                                     <RadioGroupItem value="yes" />
// //                                   </FormControl>
// //                                   <FormLabel className="font-normal">
// //                                     Yes, I'd like to receive exclusive offers
// //                                     and updates
// //                                   </FormLabel>
// //                                 </FormItem>
// //                                 <FormItem className="flex items-center space-x-3 space-y-0">
// //                                   <FormControl>
// //                                     <RadioGroupItem value="no" />
// //                                   </FormControl>
// //                                   <FormLabel className="font-normal">
// //                                     No, I don't want to receive marketing
// //                                     communications
// //                                   </FormLabel>
// //                                 </FormItem>
// //                               </RadioGroup>
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                     </CardContent>
// //                   </Card>
// //                 )}

// //                 {step === "billing" && (
// //                   <Card>
// //                     <CardHeader>
// //                       <CardTitle>Billing Address</CardTitle>
// //                     </CardHeader>
// //                     <CardContent className="space-y-6">
// //                       <FormField
// //                         control={form.control}
// //                         name="billing.address"
// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel>Street Address</FormLabel>
// //                             <FormControl>
// //                               <Input
// //                                 placeholder="Enter street address"
// //                                 {...field}
// //                               />
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                       <div className="grid gap-4 sm:grid-cols-2">
// //                         <FormField
// //                           control={form.control}
// //                           name="billing.city"
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>City</FormLabel>
// //                               <FormControl>
// //                                 <Input placeholder="Enter city" {...field} />
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />
// //                         <FormField
// //                           control={form.control}
// //                           name="billing.postcode"
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>Postcode</FormLabel>
// //                               <FormControl>
// //                                 <Input
// //                                   placeholder="Enter postcode"
// //                                   {...field}
// //                                 />
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />
// //                       </div>
// //                     </CardContent>
// //                   </Card>
// //                 )}

// //                 {step === "payment" && (
// //                   <Card>
// //                     <CardHeader>
// //                       <CardTitle>Payment Details</CardTitle>
// //                     </CardHeader>
// //                     <CardContent className="space-y-6">
// //                       <FormField
// //                         control={form.control}
// //                         name="payment.cardNumber"
// //                         render={({ field }) => (
// //                           <FormItem>
// //                             <FormLabel>Card Number</FormLabel>
// //                             <FormControl>
// //                               <Input
// //                                 placeholder="Enter card number"
// //                                 {...field}
// //                               />
// //                             </FormControl>
// //                             <FormMessage />
// //                           </FormItem>
// //                         )}
// //                       />
// //                       <div className="grid gap-4 sm:grid-cols-3">
// //                         <FormField
// //                           control={form.control}
// //                           name="payment.expiry"
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>Expiry Date</FormLabel>
// //                               <FormControl>
// //                                 <Input placeholder="MM/YY" {...field} />
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />
// //                         <FormField
// //                           control={form.control}
// //                           name="payment.cvc"
// //                           render={({ field }) => (
// //                             <FormItem>
// //                               <FormLabel>CVC</FormLabel>
// //                               <FormControl>
// //                                 <Input placeholder="CVC" {...field} />
// //                               </FormControl>
// //                               <FormMessage />
// //                             </FormItem>
// //                           )}
// //                         />
// //                       </div>
// //                     </CardContent>
// //                   </Card>
// //                 )}

// //                 <div className="mt-6 flex justify-between">
// //                   <Button
// //                     type="button"
// //                     variant="outline"
// //                     onClick={() => {
// //                       if (step === "billing") setStep("address");
// //                       if (step === "payment") setStep("billing");
// //                     }}
// //                     disabled={step === "address"}
// //                   >
// //                     Previous
// //                   </Button>
// //                   <Button type="submit">
// //                     {step === "payment" ? "Place Order" : "Continue"}
// //                     <ArrowRight className="ml-2 h-4 w-4" />
// //                   </Button>
// //                 </div>
// //               </form>
// //             </Form>
// //           </div>

// //           <div>
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Order Summary</CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-6">
// //                 <div className="flex space-x-4">
// //                   <Image
// //                     src="/placeholder.svg"
// //                     alt="Alana Double Bed"
// //                     className="h-24 w-24 rounded-md object-cover"
// //                     width={96}
// //                     height={96}
// //                   />
// //                   <div>
// //                     <h3 className="font-medium">Alana Double Bed, Copper</h3>
// //                     <p className="text-sm text-muted-foreground">Qty: 1</p>
// //                     <p className="mt-1 font-medium">£399.00</p>
// //                   </div>
// //                 </div>
// //                 <Separator />
// //                 <div className="space-y-2">
// //                   <div className="flex justify-between">
// //                     <span>Subtotal</span>
// //                     <span>£399.00</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>Delivery</span>
// //                     <span>£25.00</span>
// //                   </div>
// //                   <Separator />
// //                   <div className="flex justify-between font-medium">
// //                     <span>Total to pay</span>
// //                     <span>£424.00</span>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
// //               <div>
// //                 <HelpCircle className="mx-auto h-6 w-6" />
// //                 <h3 className="mt-2 font-medium">Help</h3>
// //                 <p className="mt-1 text-muted-foreground">Mon-Fri: 8am-9pm</p>
// //                 <p className="text-muted-foreground">Sat-Sun: 10am-6pm</p>
// //               </div>
// //               <div>
// //                 <Package className="mx-auto h-6 w-6" />
// //                 <h3 className="mt-2 font-medium">Delivery</h3>
// //                 <p className="mt-1 text-muted-foreground">
// //                   Track your order in real time
// //                 </p>
// //               </div>
// //               <div>
// //                 <RotateCcw className="mx-auto h-6 w-6" />
// //                 <h3 className="mt-2 font-medium">Returns</h3>
// //                 <p className="mt-1 text-muted-foreground">
// //                   14 day money-back guarantee
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   ArrowLeft,
//   ArrowRight,
//   HelpCircle,
//   Package,
//   RotateCcw,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// const addressSchema = z.object({
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().min(1, "Phone number is required"),
//   marketing: z.enum(["yes", "no"]),
// });

// const billingSchema = z.object({
//   address: z.string().min(1, "Address is required"),
//   city: z.string().min(1, "City is required"),
//   postcode: z.string().min(1, "Postcode is required"),
// });

// const paymentSchema = z.object({
//   cardNumber: z.string().min(16, "Invalid card number"),
//   expiry: z.string().min(5, "Invalid expiry date"),
//   cvc: z.string().min(3, "Invalid CVC"),
// });

// const formSchema = z.object({
//   address: addressSchema,
//   billing: billingSchema,
//   payment: paymentSchema,
// });

// type FormData = z.infer<typeof formSchema>;

// export default function CheckoutPage() {
//   const [step, setStep] = useState<"address" | "billing" | "payment">(
//     "address"
//   );

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     mode: "onChange",
//     defaultValues: {
//       address: {
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         marketing: "no",
//       },
//       billing: {
//         address: "",
//         city: "",
//         postcode: "",
//       },
//       payment: {
//         cardNumber: "",
//         expiry: "",
//         cvc: "",
//       },
//     },
//   });

//   const steps = [
//     { id: "address", label: "Address" },
//     { id: "billing", label: "Billing" },
//     { id: "payment", label: "Payment" },
//   ];

//   const onSubmit = (data: FormData) => {
//     if (step === "address") setStep("billing");
//     else if (step === "billing") setStep("payment");
//     else if (step === "payment") {
//       console.log("Order placed:", data);
//       // Here you would typically send the data to your server
//     }
//   };

//   const isStepValid = (stepName: "address" | "billing" | "payment") => {
//     const stepFields = Object.keys(form.getValues()[stepName]);
//     return stepFields.every(
//       (field) =>
//         form.getFieldState(`${stepName}.${field}`).isDirty &&
//         !form.getFieldState(`${stepName}.${field}`).invalid
//     );
//   };

//   const progress =
//     ((steps.findIndex((s) => s.id === step) + 1) / steps.length) * 100;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="border-b bg-white">
//         <div className="mx-auto max-w-6xl px-4 py-4">
//           <Link href="/" className="text-2xl font-bold">
//             MADE
//           </Link>
//         </div>
//       </header>

//       <main className="mx-auto max-w-6xl px-4 py-8">
//         <Link
//           href="/basket"
//           className="mb-8 flex items-center text-sm text-muted-foreground hover:text-primary"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to basket
//         </Link>

//         <div className="mb-8">
//           <Progress value={progress} className="h-2 w-full" />
//         </div>

//         <div className="mb-8">
//           <div className="flex justify-center space-x-8">
//             {steps.map((s, i) => (
//               <div key={s.id} className="flex items-center">
//                 <div
//                   className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                     step === s.id
//                       ? "bg-primary text-primary-foreground"
//                       : "bg-muted text-muted-foreground"
//                   }`}
//                 >
//                   {i + 1}
//                 </div>
//                 <span className="ml-2 font-medium">{s.label}</span>
//                 {i < steps.length - 1 && (
//                   <div className="ml-8 h-px w-8 bg-muted" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           <div className="lg:col-span-2">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)}>
//                 {step === "address" && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Delivery Contact</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                       <div className="grid gap-4 sm:grid-cols-2">
//                         <FormField
//                           control={form.control}
//                           name="address.firstName"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>First Name</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Enter first name"
//                                   {...field}
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="address.lastName"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Last Name</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Enter last name"
//                                   {...field}
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                       <FormField
//                         control={form.control}
//                         name="address.email"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Email Address</FormLabel>
//                             <FormControl>
//                               <Input
//                                 type="email"
//                                 placeholder="Enter email address"
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="address.phone"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Phone</FormLabel>
//                             <FormControl>
//                               <Input
//                                 type="tel"
//                                 placeholder="Enter phone number"
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="address.marketing"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Marketing Preferences</FormLabel>
//                             <FormControl>
//                               <RadioGroup
//                                 onValueChange={field.onChange}
//                                 defaultValue={field.value}
//                                 className="flex flex-col space-y-1"
//                               >
//                                 <FormItem className="flex items-center space-x-3 space-y-0">
//                                   <FormControl>
//                                     <RadioGroupItem value="yes" />
//                                   </FormControl>
//                                   <FormLabel className="font-normal">
//                                     Yes, I'd like to receive exclusive offers
//                                     and updates
//                                   </FormLabel>
//                                 </FormItem>
//                                 <FormItem className="flex items-center space-x-3 space-y-0">
//                                   <FormControl>
//                                     <RadioGroupItem value="no" />
//                                   </FormControl>
//                                   <FormLabel className="font-normal">
//                                     No, I don't want to receive marketing
//                                     communications
//                                   </FormLabel>
//                                 </FormItem>
//                               </RadioGroup>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>
//                 )}

//                 {step === "billing" && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Billing Address</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                       <FormField
//                         control={form.control}
//                         name="billing.address"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Street Address</FormLabel>
//                             <FormControl>
//                               <Input
//                                 placeholder="Enter street address"
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <div className="grid gap-4 sm:grid-cols-2">
//                         <FormField
//                           control={form.control}
//                           name="billing.city"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>City</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="Enter city" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="billing.postcode"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Postcode</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Enter postcode"
//                                   {...field}
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {step === "payment" && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Payment Details</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                       <FormField
//                         control={form.control}
//                         name="payment.cardNumber"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Card Number</FormLabel>
//                             <FormControl>
//                               <Input
//                                 placeholder="Enter card number"
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <div className="grid gap-4 sm:grid-cols-3">
//                         <FormField
//                           control={form.control}
//                           name="payment.expiry"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Expiry Date</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="MM/YY" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={form.control}
//                           name="payment.cvc"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>CVC</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="CVC" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//                 <div className="mt-6 flex justify-between">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       if (step === "billing") setStep("address");
//                       if (step === "payment") setStep("billing");
//                     }}
//                     disabled={step === "address"}
//                   >
//                     Previous
//                   </Button>
//                   <Button type="submit" disabled={!isStepValid(step)}>
//                     {step === "payment" ? "Place Order" : "Continue"}
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </div>

//           <div>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="flex space-x-4">
//                   <Image
//                     src="/placeholder.svg"
//                     alt="Alana Double Bed"
//                     className="h-24 w-24 rounded-md object-cover"
//                     width={96}
//                     height={96}
//                   />
//                   <div>
//                     <h3 className="font-medium">Alana Double Bed, Copper</h3>
//                     <p className="text-sm text-muted-foreground">Qty: 1</p>
//                     <p className="mt-1 font-medium">£399.00</p>
//                   </div>
//                 </div>
//                 <Separator />
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span>£399.00</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Delivery</span>
//                     <span>£25.00</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between font-medium">
//                     <span>Total to pay</span>
//                     <span>£424.00</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
//               <div>
//                 <HelpCircle className="mx-auto h-6 w-6" />
//                 <h3 className="mt-2 font-medium">Help</h3>
//                 <p className="mt-1 text-muted-foreground">Mon-Fri: 8am-9pm</p>
//                 <p className="text-muted-foreground">Sat-Sun: 10am-6pm</p>
//               </div>
//               <div>
//                 <Package className="mx-auto h-6 w-6" />
//                 <h3 className="mt-2 font-medium">Delivery</h3>
//                 <p className="mt-1 text-muted-foreground">
//                   Track your order in real time
//                 </p>
//               </div>
//               <div>
//                 <RotateCcw className="mx-auto h-6 w-6" />
//                 <h3 className="mt-2 font-medium">Returns</h3>
//                 <p className="mt-1 text-muted-foreground">
//                   14 day money-back guarantee
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

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

export default function CheckoutPage() {
  const [step, setStep] = useState<"address" | "billing" | "payment">(
    "address"
  );
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const { session } = useSupabase();
  const user = session?.user;

  // Add state for checkout items
  const [checkoutItems, setCheckoutItems] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add useEffect to fetch checkout items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      if (user?.id) {
        try {
          const items = await getCheckoutItems(user.id);
          setCheckoutItems(items);
        } catch (error) {
          console.error("Error fetching checkout items:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchItems();
  }, [user?.id]);

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

  if (loading) {
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
