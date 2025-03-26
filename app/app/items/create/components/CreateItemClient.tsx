"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/app/components/RichTextEditor";
import { CldUploadWidget } from "next-cloudinary";
import { createItemAction } from "../actions";
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
import { ShippingPriceFields } from "./ShippingPriceFields";
import { addDays, format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { captureEvent } from "@/lib/posthog";
import {
  CreateItemFormData,
  DURATION_OPTIONS,
  ExtendedCloudinaryUploadWidgetOptions,
  UploadResult,
  formSchema,
} from "../types";
import { ImageUploadSection } from "./ImageUploadSection";
import { DealingMethodSection } from "./DealingMethodSection";
import { ItemDetailsSection } from "./ItemDetailsSection";
import { SubmitButton } from "./SubmitButton";

export function CreateItemClient() {
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [coverImageId, setCoverImageId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAtom(userAtom);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (imageIds.length === 1) {
      setCoverImageId(imageIds[0]);
    } else if (imageIds.length === 0) {
      setCoverImageId("");
    }
  }, [imageIds]);

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

    // Reorder images array to put cover image first
    const reorderedImages = [
      coverImageId,
      ...imageIds.filter((id) => id !== coverImageId),
    ];

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "images" && value != null) {
        formData.append(key, value.toString());
      }
    });
    // Use reordered images array instead of original imageIds
    reorderedImages.forEach((id) => formData.append("images[]", id));

    try {
      const response = await createItemAction(formData, user?.id || "");
      if (!response.success) {
        setError(response.error || "Failed to create item");
        return;
      }

      // Track item creation in PostHog
      captureEvent("item_created", {
        // Item details
        itemId: response.id,
        itemName: data.name,
        startingPrice: data.startingPrice,
        bidInterval: data.bidInterval,
        binPrice: data.binPrice,
        category: data.category,
        endDate: data.endDate,
        description: data.description,
        // Dealing method details
        dealingMethodType: data.dealingMethodType,
        dealingMethodLocation: data.dealingMethodLocation,
        westMalaysiaShippingPrice: data.westMalaysiaShippingPrice,
        eastMalaysiaShippingPrice: data.eastMalaysiaShippingPrice,
        // Creator details
        creatorId: user?.id,
        creatorName: user?.name,
        creatorEmail: user?.email,
        // Image details
        numberOfImages: reorderedImages.length,
        // Metadata
        timestamp: new Date().toISOString(),
      });

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMaxImages = imageIds.length >= 5;

  return (
    <div className="container mx-auto p-6">
      <SuccessDialog
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        newItemId={newItemId}
        isNavigating={isNavigating}
        setIsNavigating={setIsNavigating}
        router={router}
      />

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
            <ImageUploadSection
              imageIds={imageIds}
              setImageIds={setImageIds}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              coverImageId={coverImageId}
              setCoverImageId={setCoverImageId}
              isMaxImages={isMaxImages}
              setValue={setValue}
              errors={errors}
            />

            <DealingMethodSection
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />

            <ItemDetailsSection
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          </Accordion>

          <SubmitButton
            isSubmitting={isSubmitting}
            errors={errors}
            watch={watch}
            imageIds={imageIds}
          />
        </form>
      </MotionGrid>
    </div>
  );
}

// Split the component into smaller components
interface SuccessDialogProps {
  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
  newItemId: string | null;
  isNavigating: boolean;
  setIsNavigating: (isNavigating: boolean) => void;
  router: ReturnType<typeof useRouter>;
}

function SuccessDialog({
  showSuccessModal,
  setShowSuccessModal,
  newItemId,
  isNavigating,
  setIsNavigating,
  router,
}: SuccessDialogProps) {
  return (
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
                  await router.push(`/app/items/${newItemId}`);
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
  );
}
