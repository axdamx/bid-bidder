"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createItemAction } from "./actions";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { useState } from "react";

type UploadResult = {
  info: {
    public_id: string;
  };
  event: "success";
};

export default function CreatePage() {
  const [imageId, setImageId] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false); // Track upload status

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isImageUploaded) {
      e.preventDefault(); // Prevent form submission if image is not uploaded
      alert("Please upload an image before submitting!");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Add New Listing</h1>
        <form
          className="w-full"
          action={createItemAction}
          method="POST"
          onSubmit={handleSubmit}
        >
          {/* Photo Upload Section */}
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2">Photo Upload</h2>

            <CldUploadWidget
              uploadPreset="jzhhmoah"
              onSuccess={(results: UploadResult) => {
                setImageId(results?.info?.public_id); // Set image ID when upload is successful
                setIsImageUploaded(true); // Enable form submission after upload
              }}
            >
              {({ open }) => {
                return (
                  <Button
                    type="button" // Important to set this button type to avoid form submission
                    className="ml-4"
                    onClick={() => open()}
                  >
                    Upload Photos
                  </Button>
                );
              }}
            </CldUploadWidget>

            {imageId && (
              <CldImage
                width="960"
                height="600"
                src={imageId}
                sizes="100vw"
                alt="Uploaded image"
              />
            )}
          </div>

          {/* Vehicle Description Section */}
          <h2 className="text-2xl font-semibold mb-4">Listing Description</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Help buyers know more about the item you're listing.
          </p>

          <p className="text-sm text-muted-foreground mb-6">Listing Name</p>
          <Input
            required
            className="max-w-lg mb-4"
            name="name"
            // placeholder="Listing Title"
          />
          <p className="text-sm text-muted-foreground mb-6">Starting Price</p>

          <Input
            required
            className="max-w-lg mb-4"
            name="startingPrice"
            type="number"
            // placeholder="Starting Bid"
          />
          <p className="text-sm text-muted-foreground mb-6">Bid Interval</p>

          <Input
            required
            className="max-w-lg mb-4"
            name="bidInterval"
            type="number"
            // placeholder="Interval"
          />
          <p className="text-sm text-muted-foreground mb-6">End Date</p>

          <Input
            required
            className="max-w-lg mb-4"
            name="endDate"
            type="datetime-local" // For both date and time input
            // placeholder="End Date and Time"
          />

          <p className="text-sm text-muted-foreground mb-6">Description</p>

          <Textarea
            className="max-w-lg mb-4"
            name="description"
            // placeholder="Extended Description"
          />

          {/* Hidden input to include the imageId in form submission */}
          <input type="hidden" name="imageId" value={imageId || ""} />

          {/* Buttons */}
          <div className="flex justify-between">
            <Button type="submit" disabled={!isImageUploaded}>
              Submit Listing
            </Button>
            {/* <Button type="button" variant="secondary">
            Save as Draft
          </Button> */}
            <Button type="button" variant="destructive">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
