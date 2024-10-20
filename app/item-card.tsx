"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Item } from "@/src/db/schema";
import { format } from "date-fns";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

function ItemCard({ item }: { item: Item }) {
  function isBidOver(item: Item) {
    return item.endDate < new Date();
  }

  return (
    <div>
      <Card key={item.id} className="overflow-hidden">
        <CardContent className="p-0 w-full h-48">
          {item.imageId && (
            <CldImage
              width="960"
              height="600"
              src={item.imageId}
              alt="Description of my image"
              className="w-full h-full object-cover" // Ensure the image covers the content area
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center mt-4">
          <div>
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">
              Starting price : ${item.startingPrice}
            </p>
            {isBidOver(item) ? (
              <h2> Bidding is Over </h2>
            ) : (
              <h2> Ends on {format(new Date(item.endDate), "d/M/yyyy")}</h2>
            )}
          </div>
          <Button
            asChild
            size="sm"
            variant={isBidOver(item) ? "default" : "outline"}
          >
            <Link href={`items/${item.id}`}>
              {isBidOver(item) ? "View Bid" : "Bid Now"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ItemCard;
