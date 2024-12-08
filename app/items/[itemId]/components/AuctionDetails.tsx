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

export function AuctionDetails({
  item,
  highestBid,
  bids,
  isOwner,
  isBidOver,
  isWinner,
  handleBidSubmit,
  handleBuyItNowSubmit,
  isPending,
  isBuyItNowPending,
  handleAuctionEnd,
  handleLinkClick,
  isDescriptionExpanded,
  setIsDescriptionExpanded,
}: {
  item: any;
  highestBid: number;
  bids: any[];
  isOwner: boolean;
  isBidOver: boolean;
  isWinner: boolean;
  handleBidSubmit: () => void;
  handleBuyItNowSubmit: () => void;
  isPending: boolean;
  isBuyItNowPending: boolean;
  handleAuctionEnd: () => void;
  handleLinkClick: (e: React.MouseEvent, path: string) => void;
  isDescriptionExpanded: boolean;
  setIsDescriptionExpanded: (expanded: boolean) => void;
}) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl md:text-2xl font-bold break-words">
            {item.name}
          </CardTitle>
        </div>
        <CardDescription className="text-base md:text-lg">
          Created by:{" "}
          <Link
            href={`/profile/${item.users.id}`}
            className="hover:underline flex items-center gap-1"
            onClick={(e) => handleLinkClick(e, `/profile/${item.users.id}`)}
          >
            <User className="h-4 w-4" />
            {item.users.name}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-12">
        {/* Auction details grid */}
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="break-words">
            <p className="text-sm text-muted-foreground">Current Bid</p>
            <p className="text-2xl font-bold">
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
          <div className="break-words">
            <p className="text-sm text-muted-foreground">Bid Interval</p>
            <p className="text-lg">{formatCurrency(item.bidInterval)}</p>
          </div>
          <div className="break-words">
            <p className="text-sm text-muted-foreground">Starting Price</p>
            <p className="text-lg">{formatCurrency(item.startingPrice)}</p>
          </div>
          <div className="break-words">
            <p className="text-sm text-muted-foreground">Total Bids</p>
            <p className="text-lg">
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
          <div className="break-words">
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="text-lg">
              {getDateInfo(item.endDate + "Z").formattedDate}
            </p>
            <p className="text-lg">
              {getDateInfo(item.endDate + "Z").formattedTime}
            </p>
          </div>
          {item.binPrice && (
            <div className="break-words">
              <p className="text-sm text-muted-foreground">BIN Price</p>
              <p className="text-lg">{formatCurrency(item.binPrice)}</p>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <div
            className={cn(
              "text-muted-foreground relative",
              !isDescriptionExpanded &&
                item.description.length > 500 &&
                "max-h-[240px] overflow-hidden"
            )}
            style={{ overflowWrap: "break-word" }}
          >
            <p>{item.description}</p>
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
        {/* Description */}
        <div>{/* ... (description content) */}</div>
        <CountdownTimer
          endDate={item.endDate}
          onExpire={handleAuctionEnd}
          className="text-sm"
          isOver={isBidOver}
        />
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
            {/* {!item.isBoughtOut && item.currentBid < item.binPrice && (
              <MovingBorderButton
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                containerClassName="w-full"
                disabled={isBuyItNowPending}
                onClick={handleBuyItNowSubmit}
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
                  `BIN Price ${formatCurrency(item.binPrice)}`
                )}
              </MovingBorderButton>
            )} */}
          </>
        )}
      </CardContent>
    </Card>
  );
}
