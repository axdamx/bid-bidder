import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getCheckoutItems } from "./actions";
import { auth } from "@/app/auth";
import ItemImage from "@/app/items/[itemId]/image-component";
import CartSummary from "./cart-summary";

const CheckoutPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const checkoutItems = await getCheckoutItems(userId!);

  const shippingCost = 20;
  const buyersPremium = checkoutItems?.currentBid! * 0.1;
  const totalPrice = checkoutItems?.currentBid! + shippingCost + buyersPremium;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
      {/* Product Details Section */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{checkoutItems?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              {checkoutItems && <ItemImage item={checkoutItems!} />}
            </div>
            <CartSummary
              subtotal={checkoutItems?.currentBid}
              shipping={shippingCost}
              premium={buyersPremium}
              totalPrice={totalPrice}
            />
          </CardContent>
        </Card>
      </div>

      {/* Payment Details Section */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <img
                src="/icons/mastercard.svg"
                alt="MasterCard"
                className="h-8"
              />
              <img src="/icons/paypal.svg" alt="PayPal" className="h-8" />
              <img src="/icons/visa.svg" alt="Visa" className="h-8" />
            </div>
            <form>
              <div className="mb-4">
                <Input label="Email Address" placeholder="Email" />
              </div>
              <div className="mb-4">
                <Input label="Card Details" placeholder="000-00-000" />
              </div>
              <div className="mb-4">
                <Input label="Card Holder Name" placeholder="John" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input label="Zip" placeholder="Zip" />
                <Input label="State" placeholder="State" />
              </div>
              <div className="mb-4">
                <Input label="Discount Code" placeholder="2423" />
              </div>
              <Button className="w-full">Pay ${totalPrice}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
