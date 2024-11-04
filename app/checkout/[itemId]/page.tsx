// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { getCheckoutItems } from "./actions";
// import { auth } from "@/app/auth";
// import ItemImage from "@/app/items/[itemId]/image-component";
// import CartSummary from "./cart-summary";

// const CheckoutPage = async () => {
//   const session = await auth();
//   const userId = session?.user?.id;
//   const checkoutItems = await getCheckoutItems(userId!);

//   const shippingCost = 20;
//   const buyersPremium = checkoutItems?.currentBid! * 0.1;
//   const totalPrice = checkoutItems?.currentBid! + shippingCost + buyersPremium;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
//       {/* Product Details Section */}
//       <div>
//         <Card>
//           <CardHeader>
//             <CardTitle>{checkoutItems?.name}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="mb-4">
//               {checkoutItems && <ItemImage item={checkoutItems!} />}
//             </div>
//             <CartSummary
//               subtotal={checkoutItems?.currentBid}
//               shipping={shippingCost}
//               premium={buyersPremium}
//               totalPrice={totalPrice}
//             />
//           </CardContent>
//         </Card>
//       </div>

//       {/* Payment Details Section */}
//       <div>
//         <Card>
//           <CardHeader>
//             <CardTitle>Payment Details</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex justify-between items-center mb-4">
//               <img
//                 src="/icons/mastercard.svg"
//                 alt="MasterCard"
//                 className="h-8"
//               />
//               <img src="/icons/paypal.svg" alt="PayPal" className="h-8" />
//               <img src="/icons/visa.svg" alt="Visa" className="h-8" />
//             </div>
//             <form>
//               <div className="mb-4">
//                 <Input label="Email Address" placeholder="Email" />
//               </div>
//               <div className="mb-4">
//                 <Input label="Card Details" placeholder="000-00-000" />
//               </div>
//               <div className="mb-4">
//                 <Input label="Card Holder Name" placeholder="John" />
//               </div>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <Input label="Zip" placeholder="Zip" />
//                 <Input label="State" placeholder="State" />
//               </div>
//               <div className="mb-4">
//                 <Input label="Discount Code" placeholder="2423" />
//               </div>
//               <Button className="w-full">Pay ${totalPrice}</Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, PlayIcon, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CartSummary from "./cart-summary";
import ItemImage from "@/app/items/[itemId]/image-component";
import { getCheckoutItems } from "./actions";
import { auth } from "@/app/auth";

const CheckoutPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const checkoutItems = await getCheckoutItems(userId!);

  const shippingCost = 20;
  const buyersPremium = checkoutItems?.currentBid! * 0.1;
  const totalPrice = checkoutItems?.currentBid! + shippingCost + buyersPremium;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your item details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Item Details */}
                <div className="flex gap-4">
                  <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
                    {checkoutItems && <ItemImage item={checkoutItems} />}
                  </div>
                  <div>
                    <h3 className="font-medium">{checkoutItems?.name}</h3>
                    <p className="text-sm text-gray-500">Lot #123456</p>
                    <p className="text-sm font-medium mt-2">
                      ${checkoutItems?.currentBid}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Cost Breakdown */}
                <CartSummary
                  subtotal={checkoutItems?.currentBid}
                  shipping={shippingCost}
                  premium={buyersPremium}
                  totalPrice={totalPrice}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                </TabsList>

                <TabsContent value="card">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card">Card Information</Label>
                      <div className="relative">
                        <Input id="card" placeholder="1234 1234 1234 1234" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM / YY" />
                        <Input placeholder="CVC" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select>
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP / Postal Code</Label>
                        <Input id="zip" placeholder="12345" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promo">Promo Code</Label>
                      <div className="flex gap-2">
                        <Input id="promo" placeholder="Enter code" />
                        <Button variant="outline">Apply</Button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full" size="lg">
                        Pay ${totalPrice.toFixed(2)}
                      </Button>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        You will not be charged until the auction ends
                      </p>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="paypal">
                  <div className="text-center py-8">
                    <PlayIcon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">
                      You will be redirected to PayPal to complete your payment
                    </p>
                    <Button className="mt-4" variant="outline">
                      Continue with PayPal
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info className="h-4 w-4" />
            <p>All transactions are secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
