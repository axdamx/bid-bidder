"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import CountdownTimer from "./countdown-timer";
import { ItemWithUser, User as UserType } from "./items";
import { formatCurrency } from "@/lib/utils";

interface ItemCardProps {
  item: ItemWithUser;
  user?: UserType;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, user }) => {
  const isItemEnded = isBidOver(item.endDate);

  function isBidOver(endDate: Date) {
    return new Date(endDate + "Z") < new Date();
  }

  return (
    <Card className="w-full h-full overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
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
      <CardContent className="p-4 flex-1">
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
      </CardContent>
      <div className="mt-auto p-4 pt-0">
        <div className="text-center mb-4">
          {!isItemEnded && (
            <p className="text-sm text-muted-foreground mb-1">Ends in</p>
          )}
          <CountdownTimer endDate={item.endDate} />
        </div>
        <Button
          asChild
          className="w-full"
          variant={isItemEnded ? "secondary" : "default"}
        >
          <Link href={`/items/${item.id}`}>
            {isItemEnded ? "View Details" : "Place Bid"}
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default ItemCard;
