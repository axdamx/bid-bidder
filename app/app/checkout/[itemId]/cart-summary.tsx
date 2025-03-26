import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const CartSummary = ({
  subtotal = 2767.35,
  shipping = 20,
  premium = 20,
  totalPrice = 0,
}) => {
  return (
    <div className="w-full p-6 bg-gray-50 rounded-lg">
      <div className="space-y-4">
        {/* Gift Code Input */}
        {/* <div className="flex gap-2">
          <Input placeholder="Enter your gift code here" className="bg-white" />
          <Button>Apply</Button>
        </div> */}

        {/* Summary Items */}
        <div className="space-y-3 text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-red-500">
            <span>Buyer Premium (7%)</span>
            <span>{formatCurrency(premium)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatCurrency(shipping)}</span>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between font-medium text-lg text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
