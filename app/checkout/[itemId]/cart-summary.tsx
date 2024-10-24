import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CartSummary = ({
  subtotal = 2767.35,
  shipping = 20,
  premium = 20,
  totalPrice = 0,
}) => {
  return (
    <div className="w-full max-w-md p-6 bg-gray-50 rounded-lg">
      <div className="space-y-4">
        {/* Gift Code Input */}
        <div className="flex gap-2">
          <Input placeholder="Enter your gift code here" className="bg-white" />
          <Button>Apply</Button>
        </div>

        {/* Summary Items */}
        <div className="space-y-3 text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-pink-500">
            <span>Buyer Premium (10%)</span>
            <span>${premium}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping}</span>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between font-medium text-lg text-gray-900">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
