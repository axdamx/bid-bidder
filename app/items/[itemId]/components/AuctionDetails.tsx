import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Loader2, Share2 } from "lucide-react";
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

        {/* User Rating Section */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <Link
            href={`/profile/${item.users.id}`}
            onClick={(e) => handleLinkClick(e, `/profile/${item.users.id}`)}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 group hover:opacity-90 transition-opacity relative"
          >
            <div className="flex-shrink-0 mb-2 sm:mb-0">
              {item.users?.image ? (
                <Image
                  src={item.users.image}
                  width={64}
                  height={64}
                  alt={`${item.users.name}'s profile picture`}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              )}
            </div>
            <div className="flex-1 w-full pr-6 sm:pr-0">
              <div className="flex items-start justify-between w-full">
                <h3 className="text-base sm:text-lg font-semibold">
                  {item.users.name}
                </h3>
                <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors sm:ml-2 hidden sm:block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = item.users.reviewSummary?.averageRating || 0;
                    return (
                      <svg
                        key={star}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          star <= Math.round(rating)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    );
                  })}
                </div>
                <span className="text-xs sm:text-sm font-medium ml-1">
                  {item.users.reviewSummary?.averageRating.toFixed(1) || "0.0"}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                  ({item.users.reviewSummary?.totalReviews || 0} reviews)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                {/* <div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Items Sold
                  </span>
                  <p className="text-sm sm:font-medium">128</p>
                </div> */}
                <div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Member Since
                  </span>
                  <p className="text-sm sm:font-medium">
                    {new Date(item.users.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors sm:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </Link>
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
          <h3 className="text-xl font-semibold mb-3">Buyer's Premium (6%)</h3>
          <div className="text-muted-foreground">
            <p className="text-base leading-relaxed">
              The Buyer's Premium is charged in addition to the sale price and
              is payable directly to Renown.
            </p>
          </div>
        </div>

        {/* Social Sharing Section */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-3">Share This Listing</h3>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(
                  `Check out this auction: ${item.name}`
                );
                window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
              }}
            >
              <span className="sr-only">WhatsApp</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                  "_blank"
                );
              }}
            >
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </Button>
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
