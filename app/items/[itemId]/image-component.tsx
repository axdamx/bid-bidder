"use client";

import { Item } from "@/src/db/schema";
import { CldImage } from "next-cloudinary";

export default function ItemImage({ item }: { item: Item }) {
  return (
    <div>
      {item.imageId && (
        <CldImage
          width="460"
          height="400"
          src={item.imageId}
          alt="Description of my image"
          className="rounded-xl gap-8" // Ensure the image covers the content area
        />
      )}
    </div>
  );
}
