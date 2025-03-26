"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CreateItemFormData } from "../types";
import { FieldErrors, UseFormWatch } from "react-hook-form";

interface SubmitButtonProps {
  isSubmitting: boolean;
  errors: FieldErrors<CreateItemFormData>;
  watch: UseFormWatch<CreateItemFormData>;
  imageIds: string[];
}

export function SubmitButton({
  isSubmitting,
  errors,
  watch,
  imageIds
}: SubmitButtonProps) {
  return (
    <div className="flex justify-end mt-8">
      <Button
        type="submit"
        disabled={
          isSubmitting ||
          Object.keys(errors).length > 0 ||
          !watch("name") ||
          !watch("startingPrice") ||
          !watch("bidInterval") ||
          !watch("endDate") ||
          !watch("description") ||
          !watch("dealingMethodType") ||
          (watch("dealingMethodType") === "SHIPPING" &&
            (!watch("westMalaysiaShippingPrice") ||
              !watch("eastMalaysiaShippingPrice"))) ||
          (watch("dealingMethodType") === "COD" &&
            !watch("dealingMethodLocation")) ||
          imageIds.length === 0
        }
        className="w-full md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Listing"
        )}
      </Button>
    </div>
  );
}
