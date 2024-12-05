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
import {
  Camera,
  DollarSign,
  Clock,
  Calendar,
  FileText,
  Loader2,
  X,
} from "lucide-react";
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
import { CreateItemFormData, createItemSchema } from "@/src/db/schema";
import { DateTimePicker } from "./components/DateTimePicker";
import { LoadingModal } from "@/app/components/LoadingModal";
import { OptimizedImage } from "@/app/components/OptimizedImage";

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

export default function CreatePage() {
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAtom(userAtom);
  const [isNavigating, setIsNavigating] = useState(false); // Add this line near other state declarations

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    trigger, // Add this
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [],
    },
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
      if (key !== "images") {
        formData.append(key, value?.toString() || "");
      }
    });
    imageIds.forEach((id) => formData.append("images[]", id));

    try {
      const response = await createItemAction(formData, user?.id || "");

      if (!response.success) {
        setError(response.error || "Failed to create item");
        return;
      }

      setNewItemId(response.id!);
      setShowSuccessModal(true);

      reset({
        name: "",
        startingPrice: undefined,
        bidInterval: undefined,
        description: "",
        endDate: "",
        images: [],
        binPrice: undefined,
      });
      setImageIds([]);
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Failed to create item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Your listing has been created successfully.</p>
            <div className="flex justify-center">
              <Button
                onClick={async () => {
                  setIsNavigating(true);
                  setShowSuccessModal(false);
                  await router.push(`/items/${newItemId}`);
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

      <Dialog open={isNavigating} modal>
        <DialogTitle className="[&>button]:hidden" />
        <DialogContent className="[&>button]:hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Redirecting to your listing...</p>
          </div>
        </DialogContent>
      </Dialog>

      <MotionGrid>
        <h1 className="text-3xl font-bold text-center mb-8">
          Create New Listing
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <LoadingModal isOpen={isUploading} message="Uploading image..." />
          <div className="mb-8">
            <Label className="text-lg font-medium">Photos (Max 5)</Label>
            <div className="mt-2 space-y-2">
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
                    const newImageIds = [...prev, uploadResult.info.public_id];
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open()}
                    disabled={imageIds.length >= 5}
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    <span>
                      {imageIds.length >= 5
                        ? "Maximum images reached"
                        : `Upload Photos (${imageIds.length}/5)`}
                    </span>
                  </Button>
                )}
              </CldUploadWidget>
              <div
                className={`grid gap-4 mt-4 ${
                  imageIds.length === 1
                    ? "grid-cols-1 max-w-2xl mx-auto" // Added max-width and center alignment for single image
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Listing Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter listing title"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="startingPrice">Starting Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="startingPrice"
                    {...register("startingPrice", { valueAsNumber: true })}
                    type="number"
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
                {errors.startingPrice && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.startingPrice.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bidInterval">Bid Interval</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="bidInterval"
                    {...register("bidInterval", { valueAsNumber: true })}
                    type="number"
                    className="pl-10"
                    placeholder="Enter bid interval"
                  />
                </div>
                {errors.bidInterval && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.bidInterval.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="binPrice">Buy It Now Price (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="binPrice"
                    type="number"
                    className="pl-8"
                    {...register("binPrice", {
                      setValueAs: (value: string) => {
                        const num = parseFloat(value);
                        return value === "" ? null : isNaN(num) ? null : num;
                      },
                    })}
                    placeholder="0.00"
                  />
                </div>
                {errors.binPrice && (
                  <p className="text-sm text-red-500">
                    {errors.binPrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <DateTimePicker
                    onChange={(date: Date | undefined) => {
                      setValue("endDate", date ? date.toISOString() : "", {
                        shouldValidate: true,
                      });
                      trigger(); // Add this to re-validate the form
                    }}
                  />
                </div>
                {errors.endDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" />
                  <Textarea
                    id="description"
                    {...register("description")}
                    className="pl-10"
                    placeholder="Enter detailed description"
                    rows={10}
                  />
                </div>
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={!isValid || imageIds.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Listing"
              )}
            </Button>
          </div>
        </form>
      </MotionGrid>
    </div>
  );
}
