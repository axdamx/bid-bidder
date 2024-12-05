"use client";

import { CldImage, CldImageProps } from "next-cloudinary";

interface OptimizedImageProps extends Omit<CldImageProps, "src"> {
  src: string;
  quality?: "eco" | "best";
}

export const OptimizedImage = ({
  src,
  quality = "eco",
  ...props
}: OptimizedImageProps) => {
  return (
    <CldImage
      {...props}
      src={src}
      format="webp"
      quality={`auto:${quality}`}
      crop="limit"
      dpr="auto"
    />
  );
};
