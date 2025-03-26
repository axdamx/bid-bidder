"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { OptimizedImage } from "@/app/components/OptimizedImage";
import { LoadingModal } from "@/app/components/LoadingModal";
import { ExtendedCloudinaryUploadWidgetOptions, UploadResult } from "../types";
import { Dispatch, SetStateAction } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { CreateItemFormData } from "../types";

interface ImageUploadSectionProps {
  imageIds: string[];
  setImageIds: Dispatch<SetStateAction<string[]>>;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  coverImageId: string;
  setCoverImageId: Dispatch<SetStateAction<string>>;
  isMaxImages: boolean;
  setValue: UseFormSetValue<CreateItemFormData>;
  errors: FieldErrors<CreateItemFormData>;
}

export function ImageUploadSection({
  imageIds,
  setImageIds,
  isUploading,
  setIsUploading,
  coverImageId,
  setCoverImageId,
  isMaxImages,
  setValue,
  errors,
}: ImageUploadSectionProps) {
  return (
    <AccordionItem value="images">
      <AccordionTrigger className="text-lg font-semibold">
        1. Upload Images (Max 5)
      </AccordionTrigger>
      <AccordionContent className="p-4 space-y-4">
        <div className="mt-2 space-y-2">
          <LoadingModal isOpen={isUploading} message="Uploading image..." />
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_API_PRESET}
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
              setIsUploading(false);
            }}
          >
            {({ open }) => (
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => open?.()}
                  disabled={isMaxImages}
                  className="relative w-full h-[160px] border-2 border-dashed hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-4">
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium">
                        {isMaxImages
                          ? "Maximum images reached"
                          : "Upload an image"}
                      </p>
                      {!isMaxImages && (
                        <p className="text-xs text-muted-foreground">
                          Supports png, jpg, jpeg ({imageIds.length}/5).
                          <br />
                          Max 5MB per image
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              </div>
            )}
          </CldUploadWidget>
          <div
            className={`grid gap-6 mt-6 rounded-xl ${
              imageIds.length === 1
                ? "grid-cols-1 max-w-2xl"
                : imageIds.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {imageIds.map((id, index) => (
              <div
                key={id}
                className={`group relative  w-full bg-muted/10 rounded-xl p-2 ${
                  imageIds.length === 1 ? "cursor-default" : "cursor-pointer"
                } 
                  ${
                    coverImageId === id
                      ? "ring-2 ring-primary"
                      : imageIds.length > 1
                      ? "hover:ring-2 hover:ring-primary/50"
                      : ""
                  }
                  ${
                    imageIds.length > 2 && index === 0
                      ? "md:col-span-1 lg:col-span-1"
                      : ""
                  }
                `}
                onClick={() => {
                  if (imageIds.length > 1) {
                    setCoverImageId(id);
                  }
                }}
              >
                <OptimizedImage
                  width="400"
                  height="300"
                  src={id}
                  alt="Uploaded image"
                  className={`w-full h-full rounded-lg ${
                    imageIds.length === 1 ||
                    (imageIds.length > 2 && index === 0)
                      ? "object-contain"
                      : "object-cover"
                  }`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newImageIds = imageIds.filter(
                      (imgId) => imgId !== id
                    );
                    setImageIds(newImageIds);
                    setValue("images", newImageIds);
                    if (coverImageId === id && newImageIds.length > 0) {
                      setCoverImageId(newImageIds[0]);
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                {imageIds.length > 1 ? (
                  <div
                    className={`absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-medium 
                      ${
                        coverImageId === id
                          ? "bg-primary text-primary-foreground"
                          : "bg-background/80 text-foreground"
                      } transition-colors`}
                  >
                    {coverImageId === id
                      ? "Cover Image"
                      : "Click to set as cover"}
                  </div>
                ) : (
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground">
                    Cover Image
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.images && (
            <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
