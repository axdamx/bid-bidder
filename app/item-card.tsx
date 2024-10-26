"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Item } from "@/src/db/schema";
import { format } from "date-fns";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import CountdownTimer from "./countdown-timer";
import { Heading1 } from "lucide-react";

function ItemCard({ item }: { item: Item }) {
  function isBidOver(item: Item) {
    return item.endDate < new Date();
  }

  function formatCurrency(value) {
    const absValue = Math.abs(value);
    let formattedValue;

    if (absValue >= 1e6) {
      // Use the raw value divided by 1e6, and ensure it retains two decimal places
      formattedValue = (value / 1e6).toFixed(2) + "M"; // Millions
    } else if (absValue >= 1e3) {
      // Thousands
      formattedValue = (value / 1e3).toFixed(2) + "K";
    } else {
      // Less than thousand
      formattedValue = value.toFixed(2);
    }

    return `${formattedValue} MYR`;
  }

  return (
    <div className="w-full h-full">
      <Card
        key={item.id}
        className="h-[500px] flex flex-col justify-between overflow-hidden"
      >
        <CardContent className="p-0 h-60">
          {item.imageId && (
            <CldImage
              width="960"
              height="700"
              src={item.imageId}
              alt="Description of my image"
              className="w-full h-full object-cover" // Ensures the image covers the content area
            />
          )}
        </CardContent>
        <div className="flex justify-center mt-2">
          <CountdownTimer endDate={item.endDate} />
        </div>
        <CardFooter className="flex flex-col gap-2 p-4">
          <div>
            <h1 className="text-2xl font-semibold">{item.name}</h1>
            <p className="text-sm">
              {isBidOver(item) ? "Final Bid: " : "Current Bid: "}
              <span className="font-bold">
                {formatCurrency(item.currentBid)}
              </span>
            </p>
          </div>
          <Button
            asChild
            size="sm"
            variant={isBidOver(item) ? "default" : "outline"}
            className="mt-2"
          >
            <Link href={`/items/${item.id}`} passHref>
              {isBidOver(item) ? "View Bid" : "Bid Now"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ItemCard;
