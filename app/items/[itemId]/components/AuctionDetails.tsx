import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CountdownTimer from "@/app/countdown-timer";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import cn from "classnames";
import { formatCurrency, getDateInfo } from "../utils/formatters";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function AuctionDetails({
  item,
  highestBid,
  bids,
  isOwner,
  isBidOver,
  isWinner,
  handleBidSubmit,
  handleBuyItNowSubmit,
  handleBinClick,
  isPending,
  isBuyItNowPending,
  handleAuctionEnd,
  handleLinkClick,
  isDescriptionExpanded,
  setIsDescriptionExpanded,
  setShowBuyItNowModal,
}: {
  item: any;
  highestBid: number;
  bids: any[];
  isOwner: boolean;
  isBidOver: boolean;
  isWinner: boolean;
  handleBidSubmit: () => void;
  handleBuyItNowSubmit: () => void;
  handleBinClick: () => void;
  isPending: boolean;
  isBuyItNowPending: boolean;
  handleAuctionEnd: () => void;
  handleLinkClick: (e: React.MouseEvent, path: string) => void;
  isDescriptionExpanded: boolean;
  setIsDescriptionExpanded: (expanded: boolean) => void;
  setShowBuyItNowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const DealMethodDisplay = ({ item }: { item: any }) => {
    switch (item.dealingMethodType) {
      case "COD":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                {item.dealingMethodType}
              </span>
            </div>
            <p className="text-base">
              Pickup at{" "}
              <span className="font-medium">{item.dealingMethodLocation}</span>
            </p>
          </div>
        );
      case "SHIPPING":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                {item.dealingMethodType}
              </span>
            </div>
            {(item.westMalaysiaShippingPrice ||
              item.eastMalaysiaShippingPrice) && (
              <div className="space-y-1">
                {item.westMalaysiaShippingPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-base">West Malaysia</span>
                    <span className="font-medium">
                      {formatCurrency(item.westMalaysiaShippingPrice)}
                    </span>
                  </div>
                )}
                {item.eastMalaysiaShippingPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-base">East Malaysia</span>
                    <span className="font-medium">
                      {formatCurrency(item.eastMalaysiaShippingPrice)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return (
          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
            {item.dealingMethodType}
          </span>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl md:text-2xl font-bold break-words flex items-center gap-2">
            {item.name}
            <Badge variant="secondary">LOT #{item.id}</Badge>
          </CardTitle>
        </div>
        <CardDescription className="text-base md:text-lg">
          Created by:{" "}
          <Link
            href={`/profile/${item.users.id}`}
            className="hover:underline flex items-center gap-1"
            onClick={(e) => handleLinkClick(e, `/profile/${item.users.id}`)}
          >
            {item.users?.image ? (
              <Image
                src={item.users.image}
                width={16}
                height={16}
                alt={`${item.users.name}'s profile picture`}
                className="w-8 h-8 mr-1 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 mr-1" />
            )}
            {item.users.name}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Primary Auction Info */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">
                {item.status !== "LIVE" ? "Final Bid" : "Current Bid"}
              </p>
              <p className="text-3xl font-bold">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={highestBid}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formatCurrency(highestBid ?? 0)}
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>
            {item.binPrice && (
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  Buy It Now Price
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(item.binPrice)}
                </p>
              </div>
            )}
          </div>

          {/* Auction Stats */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Bids
                  </p>
                  <p className="text-xl">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={bids.length}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {bids.length}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Starting Price
                  </p>
                  <p className="text-xl">
                    {formatCurrency(item.startingPrice)}
                  </p>
                </div>
                {item.category && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Category
                    </p>
                    <p className="text-xl">{item.category.toUpperCase()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Bid Interval
                  </p>
                  <p className="text-xl">{formatCurrency(item.bidInterval)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Delivery Method
              </p>
              <DealMethodDisplay item={item} />
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">End Date</p>
              <p className="text-xl font-medium">
                {getDateInfo(item.endDate).formattedDate}
              </p>
              <p className="text-lg text-muted-foreground">
                {getDateInfo(item.endDate).formattedTime}
              </p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-3">Description</h3>
          <div
            className={cn(
              "text-muted-foreground relative",
              !isDescriptionExpanded &&
                item.description.length > 500 &&
                "max-h-[240px] overflow-hidden"
            )}
            style={{ overflowWrap: "break-word" }}
          >
            <p className="text-base leading-relaxed">{item.description}</p>
            {!isDescriptionExpanded && item.description.length > 500 && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
            )}
          </div>
          {item.description.length > 500 && (
            <Button
              variant="link"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="p-0 h-auto mt-2"
            >
              {isDescriptionExpanded ? "Show Less" : "Read More"}
            </Button>
          )}
        </div>

        {/* Buyer's Premium Section */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-3">Buyer's Premium</h3>
          <div className="text-muted-foreground">
            <p className="text-base leading-relaxed">
              The Buyer's Premium is charged in addition to the sale price and
              is payable directly to Renown.
            </p>
            <p className="text-base leading-relaxed mt-2 font-medium">
              Buyer's premium rate: 6.0%
            </p>
          </div>
        </div>

        <div className="border-t pt-6" />
        {item.status === "LIVE" && (
          <CountdownTimer
            endDate={item.endDate}
            onExpire={handleAuctionEnd}
            className="text-sm"
            isOver={isBidOver}
          />
        )}
        {!isBidOver && !isOwner && (
          <>
            <Button
              className="w-full"
              disabled={isPending || isBidOver || item.isBoughtOut || isWinner}
              onClick={handleBidSubmit}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isWinner ? (
                "You are currently winning this bid!"
              ) : (
                "Place Bid"
              )}
            </Button>
            {!item.isBoughtOut && item.binPrice !== null && (
              <>
                {item.currentBid >= item.binPrice ? (
                  <>
                    <Button
                      className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-not-allowed"
                      disabled
                    >
                      Current BID price is higher than BIN price
                    </Button>
                    <p className="text-sm text-destructive text-center mt-2">
                      Current Bid: {formatCurrency(item.currentBid)} | BIN
                      Price: {formatCurrency(item.binPrice)}
                    </p>
                  </>
                ) : (
                  <MovingBorderButton
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    containerClassName="w-full"
                    disabled={isBuyItNowPending}
                    onClick={handleBinClick}
                    variant="destructive"
                    size="lg"
                    borderRadius="1.75rem"
                  >
                    {isBuyItNowPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `BIN Price: ${formatCurrency(item.binPrice)}`
                    )}
                  </MovingBorderButton>
                )}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
