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

  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "USD",
  });

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
                {formatter.format(item.currentBid)}
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

// design 2
//   <Card key={item.id} className="overflow-hidden">
//     <CardHeader className="p-0 w-full">
//       {item.imageId && (
//         <CldImage
//           width="960"
//           height="600"
//           src={item.imageId}
//           alt="Description of my image"
//           className="w-full h-full object-cover" // Ensure the image covers the content area
//         />
//       )}
//     </CardHeader>
//     <CardContent className="mt-2 space-y-2">
//       <h3 className="text-xl font-bold">{item.name}</h3>
//       {/* {timeLeft && <p>Time left: {timeLeft}</p>} */}
//       <p>
//         Current Bid: <span className="font-bold">${item.currentBid}</span>
//       </p>
//     </CardContent>

//     <CardFooter>
//       <Button>Place Bid</Button>
//     </CardFooter>
//   </Card>
// );
export default ItemCard;
