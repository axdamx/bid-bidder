"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateItemFormData } from "@/src/db/schema";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface ShippingPriceFieldsProps {
  register: UseFormRegister<CreateItemFormData>;
  errors: FieldErrors<CreateItemFormData>;
}

export function ShippingPriceFields({
  register,
  errors,
}: ShippingPriceFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>West Malaysia Shipping Price *</Label>
        <Input
          type="number"
          {...register("westMalaysiaShippingPrice", {
            valueAsNumber: true,
            required: "West Malaysia shipping price is required",
          })}
          placeholder="Enter West Malaysia shipping price"
        />
        {errors.westMalaysiaShippingPrice && (
          <p className="text-sm text-red-500">
            {errors.westMalaysiaShippingPrice.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label>East Malaysia Shipping Price *</Label>
        <Input
          type="number"
          {...register("eastMalaysiaShippingPrice", {
            valueAsNumber: true,
            required: "East Malaysia shipping price is required",
          })}
          placeholder="Enter East Malaysia shipping price"
        />
        {errors.eastMalaysiaShippingPrice && (
          <p className="text-sm text-red-500">
            {errors.eastMalaysiaShippingPrice.message}
          </p>
        )}
      </div>
    </>
  );
}
