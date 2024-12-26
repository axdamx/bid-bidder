"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetOptions,
} from "next-cloudinary";
import { createItemAction } from "./actions";
import { Loader2, X, ImageIcon, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MotionGrid } from "@/app/components/motionGrid";
import { useAtom } from "jotai";
import { userAtom } from "@/app/atom/userAtom";
import { z } from "zod";
import { LoadingModal } from "@/app/components/LoadingModal";
import { OptimizedImage } from "@/app/components/OptimizedImage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShippingPriceFields } from "./components/ShippingPriceFields";
import { addDays, format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type UploadResult = {
  info: { public_id: string };
  event: "success";
};

interface ExtendedCloudinaryUploadWidgetOptions
  extends CloudinaryUploadWidgetOptions {
  transformation?: {
    quality?: string;
    fetch_format?: string;
    width?: number;
    height?: number;
    crop?: string;
    format?: string;
    flags?: string;
    dpr?: string;
  };
  eager?: Array<{
    quality?: string;
    fetch_format?: string;
    width?: number;
    height?: number;
    crop?: string;
    format?: string;
    flags?: string;
  }>;
  eager_async?: boolean;
  eager_notification_url?: boolean;
}

export type CreateItemFormData = {
  name: string;
  startingPrice: number;
  bidInterval: number;
  binPrice?: number | null;
  description?: string;
  endDate: string;
  images: string[];
  category: string;
  dealingMethodType: "COD" | "SHIPPING";
  dealingMethodPrice?: number;
  westMalaysiaShippingPrice?: number;
  eastMalaysiaShippingPrice?: number;
  dealingMethodLocation?: string;
};

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    startingPrice: z.number().min(1, "Starting price must be greater than 0"),
    bidInterval: z.number().min(1, "Bid interval must be greater than 0"),
    binPrice: z.number().min(0, "Buy it now price must be positive").optional(),
    description: z.string().optional(),
    endDate: z.string().min(1, "End date is required"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    category: z.string().min(1, "Category is required"),
    dealingMethodType: z.enum(["COD", "SHIPPING"]),
    dealingMethodPrice: z.number().optional(),
    westMalaysiaShippingPrice: z.number().optional(),
    eastMalaysiaShippingPrice: z.number().optional(),
    dealingMethodLocation: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.dealingMethodType === "SHIPPING") {
        return (
          data.westMalaysiaShippingPrice != null &&
          data.eastMalaysiaShippingPrice != null
        );
      }
      return true;
    },
    {
      message: "Shipping requires both West and East Malaysia shipping prices",
    }
  )
  .refine(
    (data) => {
      if (data.dealingMethodType === "COD") {
        return (
          data.dealingMethodLocation != null &&
          data.dealingMethodLocation.length > 0
        );
      }
      return true;
    },
    {
      message: "COD requires a meeting location",
    }
  );

const DURATION_OPTIONS = [
  { label: "1 Day", days: 1 },
  { label: "3 Days", days: 3 },
  { label: "5 Days", days: 5 },
  { label: "7 Days", days: 7 },
] as const;

export default function CreatePage() {
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAtom(userAtom);
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
    setValue,
    reset,
    trigger,
    watch,
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [],
      category: "",
      dealingMethodType: undefined,
      dealingMethodPrice: undefined,
      westMalaysiaShippingPrice: undefined,
      eastMalaysiaShippingPrice: undefined,
      dealingMethodLocation: "",
      startingPrice: undefined,
      bidInterval: undefined,
      binPrice: undefined,
      endDate: "",
    },
    mode: "all",
  });

  const onSubmit = async (data: CreateItemFormData) => {
    setIsSubmitting(true);
    setError(null);

    if (imageIds.length === 0) {
      setValue("images", [], { shouldValidate: true });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "images" && value != null) {
        formData.append(key, value.toString());
      }
    });
    imageIds.forEach((id) => formData.append("images[]", id));

    try {
      const response = await createItemAction(formData, user?.id || "");
      console.log("Create item response:", response);

      if (!response.success) {
        setError(response.error || "Failed to create item");
        return;
      }

      // Reset form first
      reset({
        name: "",
        startingPrice: undefined,
        bidInterval: undefined,
        description: "",
        endDate: "",
        images: [],
        binPrice: undefined,
        category: "",
        dealingMethodType: undefined,
        dealingMethodPrice: undefined,
        westMalaysiaShippingPrice: undefined,
        eastMalaysiaShippingPrice: undefined,
        dealingMethodLocation: "",
      });
      setImageIds([]);

      // Then show success modal and set new item ID
      if (response.id) {
        setNewItemId(response.id);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Failed to create item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMaxImages = imageIds.length >= 5;

  return (
    <div className="container mx-auto p-6">
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent
          aria-describedby="success-message"
          aria-labelledby="success-title"
        >
          <DialogHeader>
            <DialogTitle id="success-title">Success!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p id="success-message">
              Your listing has been created successfully.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={async () => {
                  if (newItemId) {
                    setIsNavigating(true);
                    await router.push(`/items/${newItemId}`);
                  }
                }}
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  "View Listing"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isNavigating}>
        <DialogContent
          aria-describedby="loading-message"
          aria-labelledby="loading-title"
        >
          <DialogHeader>
            <DialogTitle id="loading-title">Please Wait</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p id="loading-message">Redirecting to your listing...</p>
          </div>
        </DialogContent>
      </Dialog>

      <MotionGrid>
        <h1 className="text-3xl font-bold text-center mb-8">
          Create New Listing
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="images">
              <AccordionTrigger className="text-lg font-semibold">
                Upload Images (Max 5)
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                <div className="mt-2 space-y-2">
                  <LoadingModal
                    isOpen={isUploading}
                    message="Uploading image..."
                  />
                  <CldUploadWidget
                    uploadPreset="jzhhmoah"
                    options={
                      {
                        maxFiles: 5,
                        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                        maxFileSize: 5000000,
                        eager: [
                          {
                            quality: "auto:eco",
                            fetch_format: "auto",
                            width: 800,
                            height: 800,
                            crop: "limit",
                            format: "webp",
                            flags: "preserve_transparency",
                          },
                        ],
                        eager_async: true,
                        eager_notification_url: true,
                        transformation: {
                          quality: "auto:eco",
                          fetch_format: "auto",
                          width: 800,
                          height: 800,
                          crop: "limit",
                          format: "webp",
                          flags: "preserve_transparency",
                          dpr: "auto",
                        },
                      } as ExtendedCloudinaryUploadWidgetOptions
                    }
                    onUpload={() => setIsUploading(true)}
                    onSuccess={(result) => {
                      setIsUploading(false);
                      const uploadResult = result as UploadResult;
                      setImageIds((prev) => {
                        if (prev.length >= 5) return prev;
                        const newImageIds = [
                          ...prev,
                          uploadResult.info.public_id,
                        ];
                        setValue("images", newImageIds);
                        return newImageIds;
                      });
                    }}
                    onError={(error) => {
                      console.error("Upload error:", error);
                      setIsUploading(false);
                    }}
                  >
                    {({ open }) => (
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => open()}
                          disabled={isMaxImages}
                          className={`w-64 h-34 border-2 border-dashed hover:border-dashed hover:border-primary/50`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-4">
                              <ImageIcon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-lg font-medium text-center">
                              {isMaxImages
                                ? "Maximum images reached"
                                : "Upload an image"}
                            </span>
                            <span className="text-sm text-muted-foreground text-center">
                              {!isMaxImages &&
                                `Supports png, jpg, jpeg (${imageIds.length}/5)`}
                            </span>
                          </div>
                        </Button>
                      </div>
                    )}
                  </CldUploadWidget>
                  <div
                    className={`grid gap-4 mt-4 ${
                      imageIds.length === 1
                        ? "grid-cols-1 max-w-2xl mx-auto"
                        : imageIds.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
                    {imageIds.map((id) => (
                      <div key={id} className="relative">
                        <OptimizedImage
                          width="400"
                          height="200"
                          src={id}
                          alt="Uploaded image"
                          className={`rounded-lg object-cover w-full ${
                            imageIds.length === 1
                              ? "max-h-[400px] object-contain"
                              : imageIds.length === 2
                              ? "min-h-[300px]"
                              : "min-h-[200px]"
                          }`}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1"
                          onClick={() => {
                            setImageIds((prev) =>
                              prev.filter((imgId) => imgId !== id)
                            );
                            setValue(
                              "images",
                              imageIds.filter((imgId) => imgId !== id)
                            );
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                {errors.images && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.images.message}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dealingMethod">
              <AccordionTrigger className="text-lg font-semibold">
                Dealing Method
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

            <AccordionItem value="details">
              <AccordionTrigger className="text-lg font-semibold">
                Item Details
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="name">Item Name</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
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
                      <Label htmlFor="category">Category</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
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
                      <Label htmlFor="startingPrice">Starting Price (RM)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
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
                      <Label htmlFor="bidInterval">Bid Interval (RM)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                            <button type="button">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Minimum amount that must be added to the current
                              bid
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
                          <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
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
                      <Label htmlFor="description">Description</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                            <button type="button">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Enter a detailed description of your item
                              (optional)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Enter item description (optional)"
                      className="min-h-[100px]"
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
                          <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
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
                                ) &&
                              "bg-primary text-primary-foreground hover:bg-primary/90"
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
          </Accordion>

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
        </form>
      </MotionGrid>
    </div>
  );
}
