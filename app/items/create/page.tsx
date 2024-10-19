"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [imageId, setImageId] = useState();
  const [isImageUploaded, setIsImageUploaded] = useState(false); // Track upload status

  console.log("image", imageId);

  const handleSubmit = (e) => {
    if (!isImageUploaded) {
      e.preventDefault(); // Prevent form submission if image is not uploaded
      alert("Please upload an image before submitting!");
    }
  };

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-4">Post an Item</h1>
      <form
        className="border p-8 rounded-xl mb-4 max-w-lg"
        action={createItemAction}
        method="POST"
        onSubmit={handleSubmit}
      >
        <Input
          required
          className="max-w-lg mb-4"
          name="name"
          placeholder="Name your Item"
        />
        <Input
          required
          className="max-w-lg mb-4"
          name="startingPrice"
          type="number"
          placeholder="Start Price"
        />

        {/* Hidden input to include the imageId in form submission */}
        <input type="hidden" name="imageId" value={imageId || ""} />

        {/* Disable submit button until image is uploaded */}
        <Button type="submit" disabled={!isImageUploaded}>
          Place Bid
        </Button>

        <CldUploadWidget
          uploadPreset="jzhhmoah"
          onSuccess={(results) => {
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
                Upload an Image
              </Button>
            );
          }}
        </CldUploadWidget>
      </form>

      {imageId && (
        <CldImage
          width="960"
          height="600"
          src={imageId}
          sizes="100vw"
          alt="Description of my image"
        />
      )}
    </main>
  );
}
