import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/app/components/OptimizedImage";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageGallery({ images }: { images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () =>
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );

  const slides = images.map((publicId) => ({
    src: `https://res.cloudinary.com/dmqhabag1/image/upload/${publicId}`,
  }));

  return (
    <div className="space-y-4">
      <div className="relative aspect-square">
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="cursor-pointer h-full"
        >
          <OptimizedImage
            width={800}
            height={600}
            src={images[currentImageIndex]}
            alt="Product image"
            className="w-full h-full object-cover rounded-lg"
            quality="eco"
          />
        </div>
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={slides}
          index={currentImageIndex}
        />
        <div className="absolute bottom-4 right-4 space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevImage}
            className="bg-background/80 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextImage}
            className="bg-background/80 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md",
              currentImageIndex === index && "ring-primary"
            )}
          >
            <OptimizedImage
              width={150}
              height={150}
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              className={cn(
                "rounded-lg object-cover cursor-pointer transition-all duration-200",
                currentImageIndex === index
                  ? "border-2 border-primary"
                  : "hover:opacity-75"
              )}
              quality="eco"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
