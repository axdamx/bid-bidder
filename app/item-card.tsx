"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Item } from "@/src/db/schema";
import { format } from "date-fns";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import CountdownTimer from "./countdown-timer";
import { Clock, User } from "lucide-react";
import { ItemWithUser, User as UserType } from "./items";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
  item: ItemWithUser;
  user?: UserType;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, user }) => {
  console.log("item", item);

  const isItemEnded = isBidOver(item.endDate);
  function isBidOver(endDate: Date) {
    return new Date(endDate) < new Date();
  }

  function formatCurrency(value: number) {
    const absValue = Math.abs(value);
    let formattedValue;

    if (absValue >= 1e6) {
      formattedValue = (value / 1e6).toFixed(2) + "M";
    } else if (absValue >= 1e3) {
      formattedValue = (value / 1e3).toFixed(2) + "K";
    } else {
      formattedValue = value.toFixed(2);
    }

    return `RM${formattedValue}`;
  }

  return (
    <Card className="w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          {item.imageId && (
            <CldImage
              width="400"
              height="300"
              src={item.imageId}
              alt={item.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          )}
          <Badge
            variant={isItemEnded ? "destructive" : "default"}
            className="absolute top-2 right-2"
          >
            {isItemEnded ? "Ended" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-semibold break-words">
            {item.name}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground shrink-0">
            <User className="w-4 h-4 mr-1" />
            {item.user.name}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {isItemEnded ? "Final Bid" : "Current Bid"}
            </p>
            <p className="text-lg font-bold">
              {formatCurrency(item.currentBid)}
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          {!isItemEnded && (
            <p className="text-sm text-muted-foreground mb-1">Ends in</p>
          )}
          <CountdownTimer endDate={item.endDate} />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full"
          variant={isItemEnded ? "secondary" : "default"}
        >
          <Link href={`/items/${item.id}`}>
            {isItemEnded ? "View Details" : "Place Bid"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
