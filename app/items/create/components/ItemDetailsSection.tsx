"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { RichTextEditor } from "@/app/components/RichTextEditor";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CreateItemFormData, DURATION_OPTIONS } from "../types";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { addDays, format } from "date-fns";

interface ItemDetailsSectionProps {
  register: UseFormRegister<CreateItemFormData>;
  errors: FieldErrors<CreateItemFormData>;
  watch: UseFormWatch<CreateItemFormData>;
  setValue: UseFormSetValue<CreateItemFormData>;
}

export function ItemDetailsSection({
  register,
  errors,
  watch,
  setValue
}: ItemDetailsSectionProps) {
  return (
    <AccordionItem value="details">
      <AccordionTrigger className="text-lg font-semibold">
        3. Item Details
      </AccordionTrigger>
      <AccordionContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="name">Item Name *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    onClick={(e) => e.preventDefault()}
                  >
                    <button type="button">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Enter a clear and descriptive name for your item
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter item name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="category">Category *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    onClick={(e) => e.preventDefault()}
                  >
                    <button type="button">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Select the category that best describes your item
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Living</SelectItem>
                <SelectItem value="sports">
                  Sports & Outdoors
                </SelectItem>
                <SelectItem value="collectibles">
                  Collectibles
                </SelectItem>
                <SelectItem value="books">Books & Media</SelectItem>
                <SelectItem value="art">Art & Crafts</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="startingPrice">
                Starting Price (RM) *
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    onClick={(e) => e.preventDefault()}
                  >
                    <button type="button">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set the initial bidding price for your item</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="startingPrice"
              type="number"
              {...register("startingPrice", { valueAsNumber: true })}
              placeholder="Enter starting price"
            />
            {errors.startingPrice && (
              <p className="text-sm text-red-500">
                {errors.startingPrice.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="bidInterval">Bid Interval (RM) *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    onClick={(e) => e.preventDefault()}
                  >
                    <button type="button">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Minimum amount that must be added to the current
                      bid (Bid Interval should not be greater than the
                      starting price)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="bidInterval"
              type="number"
              {...register("bidInterval", { valueAsNumber: true })}
              placeholder="Enter bid interval"
            />
            {errors.bidInterval && (
              <p className="text-sm text-red-500">
                {errors.bidInterval.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="binPrice">Buy It Now Price (RM)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    onClick={(e) => e.preventDefault()}
                  >
                    <button type="button">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set a fixed price for your item (optional)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="binPrice"
              type="number"
              {...register("binPrice", {
                setValueAs: (v) => {
                  const parsed = parseFloat(v);
                  return v === "" || isNaN(parsed) ? undefined : parsed;
                },
              })}
              placeholder="Enter buy it now price (optional)"
            />
            {errors.binPrice && (
              <p className="text-sm text-red-500">
                {errors.binPrice.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="description">Description *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    onClick={(e) => e.preventDefault()}
                  >
                    <button type="button">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter a detailed description of your item</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <RichTextEditor
              {...register("description")}
              value={watch("description") || ""}
              onChange={(value) => {
                // Check if the HTML content is empty or only contains whitespace/empty tags
                const isEmptyHtml = !value || 
                  value === "<p></p>" || 
                  value === "<p><br></p>" || 
                  value.replace(/<[^>]*>/g, '').trim() === "";
                
                // Set the value to empty string if it's empty HTML, otherwise use the value
                setValue(
                  "description", 
                  isEmptyHtml ? "" : value, 
                  { shouldValidate: true }
                );
              }}
              placeholder="Enter a detailed description of your item"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="endDate">End Date and Time *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    onClick={(e) => e.preventDefault()}
                  >
                    <button type="button">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Select the date and time when the auction ends
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((option) => (
                  <Button
                    key={option.days}
                    type="button"
                    variant="outline"
                    className={`flex-1 min-w-[100px] ${
                      watch("endDate") ===
                      format(
                        addDays(new Date(), option.days),
                        "yyyy-MM-dd'T'HH:mm"
                      )
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => {
                      const endDate = addDays(new Date(), option.days);
                      setValue(
                        "endDate",
                        format(endDate, "yyyy-MM-dd'T'HH:mm")
                      );
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="endDate"
                  type="datetime-local"
                  {...register("endDate", {
                    required: "End date is required",
                  })}
                  min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                />
              </div>
              {errors.endDate && (
                <p className="text-sm text-red-500">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
