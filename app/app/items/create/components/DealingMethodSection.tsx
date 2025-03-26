"use client";

import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ShippingPriceFields } from "./ShippingPriceFields";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CreateItemFormData } from "../types";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

interface DealingMethodSectionProps {
  register: UseFormRegister<CreateItemFormData>;
  errors: FieldErrors<CreateItemFormData>;
  watch: UseFormWatch<CreateItemFormData>;
  setValue: UseFormSetValue<CreateItemFormData>;
}

export function DealingMethodSection({
  register,
  errors,
  watch,
  setValue
}: DealingMethodSectionProps) {
  return (
    <AccordionItem value="dealingMethod">
      <AccordionTrigger className="text-lg font-semibold">
        2. Dealing Method
      </AccordionTrigger>
      <AccordionContent className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Dealing Method *</Label>
            <Select
              onValueChange={(value: "COD" | "SHIPPING") => {
                setValue("dealingMethodType", value);
                if (value === "COD") {
                  setValue("dealingMethodPrice", undefined);
                  setValue("westMalaysiaShippingPrice", undefined);
                  setValue("eastMalaysiaShippingPrice", undefined);
                }
              }}
              value={watch("dealingMethodType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dealing method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">Cash on Delivery</SelectItem>
                <SelectItem value="SHIPPING">Shipping</SelectItem>
              </SelectContent>
            </Select>
            {errors.dealingMethodType && (
              <p className="text-sm text-red-500">
                {errors.dealingMethodType.message}
              </p>
            )}
          </div>

          {watch("dealingMethodType") === "SHIPPING" && (
            <ShippingPriceFields register={register} errors={errors} />
          )}

          {watch("dealingMethodType") === "COD" && (
            <>
              <div className="space-y-2">
                <Label>Meeting Location *</Label>
                <Input
                  type="text"
                  {...register("dealingMethodLocation", {
                    required: "Meeting location is required",
                  })}
                  placeholder="Enter meeting location"
                />
                {errors.dealingMethodLocation && (
                  <p className="text-sm text-red-500">
                    {errors.dealingMethodLocation.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
