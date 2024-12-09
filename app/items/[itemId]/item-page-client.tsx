"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuctionQueries } from "./hooks/useAuctionQueries";
import { useAuctionMutations } from "./hooks/useAuctionMutations";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { userAtom } from "@/app/atom/userAtom";
import { ImageGallery } from "./components/ImageGallery";
import { AuctionDetails } from "./components/AuctionDetails";
import { BidHistory } from "./components/BidHistory";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Trophy } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import AuthModals from "@/app/components/AuthModal";
import ChatComponent from "./components/ChatComponents";
import { formatCurrency } from "./utils/formatters";
import { createClientSupabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { set } from "date-fns";
import { ShoppingBag } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import AuthModalV2 from "@/app/components/AuthModalV2";

export default function AuctionItem({
  item,
  allBids,
  userId,
  hasAcknowledgedBid,
  onBidAcknowledge,
}: {
  item: any;
  allBids: any[];
  userId: string;
  hasAcknowledgedBid: boolean;
  onBidAcknowledge: () => void;
}) {
  const [highestBid, setHighestBid] = useState<number | null>(item.currentBid);
  const [bids, setBids] = useState(allBids);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showBuyItNowModal, setShowBuyItNowModal] = useState(false);
  const [isAuthModalsOpen, setIsAuthModalsOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<
    "log-in" | "sign-up" | "forgot-password"
  >("log-in");
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // Added state
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [currentTab, setCurrentTab] = useState("history");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [showBinDisclaimerModal, setShowBinDisclaimerModal] = useState(false);
  const [showBinWinnerModal, setShowBinWinnerModal] = useState(false);

  const [user] = useAtom(userAtom);
  const router = useRouter();
  const pathname = usePathname();

  console.log("item", item);
  const isBidOver =
    new Date(item.endDate + "Z") < new Date() || item.isBoughtOut;

  // Check BIN winner first, then auction winner if not bought out
  const isWinner = item.isBoughtOut
    ? item.winnerId === userId // If bought out, only winnerId matters
    : bids.length > 0 && bids[0].userId === userId; // If not bought out, check highest bidder

  const isOwner = item.users.id === userId;

  console.log("item fuh", item);
  const { orderExists } = useAuctionQueries(
    item.id,
    userId,
    isBidOver,
    isWinner
  );
  const {
    updateBidAcknowledgment,
    submitBid,
    isBidPending,
    submitBuyItNow,
    isBuyItNowPending,
    updateItemStatusMutate,
    isUpdating,
  } = useAuctionMutations(
    item.id,
    userId,
    onBidAcknowledge,
    item,
    setShowDisclaimerModal,
    highestBid!
  );

  useEffect(() => {
    setHighestBid(item.currentBid);
    setBids(allBids);
  }, [item.currentBid, allBids]);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClientSupabase();

    // Fetch initial messages
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from("chatMessages")
          .select("*")
          .eq("itemId", Number(item.id))
          .order("createdAt", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();

    // Setup real-time subscription
    const channel = supabase
      .channel(`room:${item.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chatMessages",
          filter: `itemId=eq.${Number(item.id)}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          setMessages((current) => {
            const isDuplicate = current.some((msg) => msg.id === newMessage.id);
            if (isDuplicate) return current;
            return [...current, newMessage];
          });
          if (newMessage.userId !== userId && currentTab !== "chat") {
            setHasNewMessage(true);
            setUnreadMessageCount((prev) => Math.min(prev + 1, 99));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [item.id, userId, currentTab]);

  const handleLinkClick = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (path === pathname) return;
    setIsNavigating(true);
    await router.push(path);
  };

  const handleBidSubmit = async () => {
    if (!userId) {
      setIsAuthModalsOpen(true);
      return;
    }

    if (!hasAcknowledgedBid) {
      setShowDisclaimerModal(true);
      return;
    }
    submitBid();
  };

  const handleBuyItNowSubmit = async () => {
    if (!userId) {
      setIsAuthModalsOpen(true);
      return;
    }

    submitBuyItNow();
  };

  const handleBuyItNowConfirm = () => {
    setShowBuyItNowModal(false);
    setShowWinnerModal(true);
    // updateItemStatusMutate();
  };

  const handleDisclaimerConfirm = () => {
    updateBidAcknowledgment();
  };

  const handleAuctionEnd = useCallback(() => {
    if (orderExists) return;

    setShowWinnerModal(true);
  }, [orderExists]);

  const handleBinClick = () => {
    if (!userId) {
      setAuthModalView("log-in");
      setIsAuthModalsOpen(true);
      return;
    }
    setShowBinDisclaimerModal(true);
  };

  const handleBinDisclaimerConfirm = () => {
    setShowBinDisclaimerModal(false);
    submitBuyItNow();
    setShowBinWinnerModal(true);
  };

  const handleBinCheckout = async () => {
    await updateItemStatusMutate();
    router.push(`/checkout/${item.id}`);
  };

  return (
    <div className="container w-full px-4 py-8 md:py-12 overflow-x-hidden">
      <Dialog open={isNavigating} modal>
        <DialogContent className="[&>button]:hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading...</p>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <ImageGallery
          images={item.images.map((img: { publicId: string }) => img.publicId)}
        />
        <AuctionDetails
          item={item}
          highestBid={highestBid!}
          bids={bids}
          isOwner={isOwner}
          isBidOver={isBidOver}
          isWinner={isWinner}
          handleBidSubmit={handleBidSubmit}
          handleBuyItNowSubmit={handleBuyItNowSubmit}
          handleBinClick={handleBinClick}
          isPending={isBidPending}
          isBuyItNowPending={isBuyItNowPending}
          handleAuctionEnd={handleAuctionEnd}
          handleLinkClick={handleLinkClick}
          isDescriptionExpanded={isDescriptionExpanded}
          setIsDescriptionExpanded={setIsDescriptionExpanded}
          setShowBuyItNowModal={setShowBuyItNowModal}
        />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <Tabs
            defaultValue="history"
            className="w-full"
            onValueChange={(value) => {
              setCurrentTab(value);
              if (value === "chat") {
                setHasNewMessage(false);
                setUnreadMessageCount(0);
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Bid History</TabsTrigger>
              <TabsTrigger
                value="chat"
                disabled={isBidOver}
                className="relative"
              >
                Live Chat
                {hasNewMessage && currentTab !== "chat" && (
                  <Badge
                    className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center p-0"
                    variant="destructive"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={unreadMessageCount}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {unreadMessageCount > 10 ? "10+" : unreadMessageCount}
                      </motion.span>
                    </AnimatePresence>
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="history">
              <BidHistory bids={bids} handleLinkClick={handleLinkClick} />
            </TabsContent>
            <TabsContent value="chat">
              {userId ? (
                <ChatComponent
                  itemId={item.id}
                  userId={userId}
                  userName={user?.name || ""}
                  itemOwnerId={item.users.id}
                  onNewMessage={setHasNewMessage}
                  existingMessages={messages}
                  isLoadingMessages={isLoadingMessages}
                />
              ) : (
                <div className="text-center py-4">
                  <p>Please log in to participate in the chat</p>
                  <Button
                    onClick={() => setIsAuthModalsOpen(true)}
                    className="mt-2"
                  >
                    Log In
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      <Dialog open={showBuyItNowModal} onOpenChange={setShowBuyItNowModal}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Important Notice About Buy It Now</DialogTitle>
            <DialogDescription className="pt-4">
              By placing a bid, you are entering into a binding commitment to
              purchase the item if you win. Your bid represents a legal
              obligation to buy the item at the bid price if you are the winning
              bidder.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBuyItNowModal(false)}
              disabled={isBidPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuyItNowConfirm}
              disabled={isBuyItNowPending}
            >
              {isBuyItNowPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "I Understand"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Important Notice About Bidding</DialogTitle>
            <DialogDescription className="pt-4">
              By placing a bid, you are entering into a binding commitment to
              purchase the item if you win. Your bid represents a legal
              obligation to buy the item at the bid price if you are the winning
              bidder.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDisclaimerModal(false)}
              disabled={isBidPending}
            >
              Cancel
            </Button>
            <Button onClick={handleDisclaimerConfirm} disabled={isBidPending}>
              {isBidPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "I Understand"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showBinDisclaimerModal}
        onOpenChange={setShowBinDisclaimerModal}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Instant Purchase Confirmation
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-xl font-semibold text-center">
                {formatCurrency(item.binPrice)}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Please confirm that:</h4>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>This is a final sale at the shown price</li>
                <li>The auction will end immediately</li>
                <li>You agree to complete the purchase</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBinDisclaimerModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBinDisclaimerConfirm}
              disabled={isBuyItNowPending}
              className="bg-primary hover:bg-primary/90"
            >
              {isBuyItNowPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Purchase"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBinWinnerModal} onOpenChange={setShowBinWinnerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Purchase Successful!
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="bg-green-50 p-4 rounded-lg text-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="font-semibold text-green-700">Congratulations!</h3>
              <p className="text-green-600">
                You have successfully purchased {item.name} for{" "}
                {formatCurrency(item.binPrice)}
              </p>
            </div>
            <p className="text-center text-muted-foreground">
              Please proceed to checkout to complete your purchase
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleBinCheckout}
              disabled={isUpdating}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Checkout...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {isWinner ? (
              <WinnerDialog
                item={item}
                highestBid={item.isBoughtOut ? item.binPrice : highestBid!}
                orderExists={orderExists!}
                updateItemStatusMutate={() => {
                  updateItemStatusMutate();
                  router.push(`/checkout/${item.id}`);
                }}
                isUpdating={isUpdating}
              />
            ) : bids.length > 0 ? (
              <LoserDialog
                item={item}
                latestBidderName={
                  item.isBoughtOut ? "another buyer" : bids[0].users.name
                }
                finalPrice={item.isBoughtOut ? item.binPrice : item.currentBid}
              />
            ) : (
              <NoWinnerDialog />
            )}
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowWinnerModal(false)} className="mt-2">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* <AuthModals
        isOpen={isAuthModalsOpen}
        setIsOpen={setIsAuthModalsOpen}
        view={authModalView}
        setView={setAuthModalView}
      /> */}
      <AuthModalV2 isOpen={isAuthModalsOpen} setIsOpen={setIsAuthModalsOpen} />
    </div>
  );
}

function WinnerDialog({
  item,
  highestBid,
  orderExists,
  updateItemStatusMutate,
  isUpdating,
}: {
  item: any;
  highestBid: number;
  orderExists: boolean;
  updateItemStatusMutate: () => void;
  isUpdating: boolean;
}) {
  const router = useRouter();

  return (
    <>
      <DialogTitle className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Congratulations! You Won!
      </DialogTitle>
      <DialogDescription className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg mt-4 text-center">
          <h1 className="font-medium text-green-700">
            You've won this auction!
          </h1>
          <h1 className="text-sm text-green-600 mt-2">
            {item.name} for{" "}
            {item.isBoughtOut
              ? formatCurrency(item.binPrice)
              : formatCurrency(highestBid)}
          </h1>
          {orderExists ? (
            <h1 className="text-sm text-green-600 mt-2">
              You can view your order in your dashboard
            </h1>
          ) : (
            <h1 className="text-sm text-green-600 mt-2">
              You can proceed to checkout to complete your purchase
            </h1>
          )}
        </div>
        <div className="text-center justify-center">
          {orderExists ? (
            <Button
              type="button"
              className="mt-8"
              onClick={() => {
                router.push("/dashboard?tab=orders");
              }}
            >
              View Order
            </Button>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateItemStatusMutate();
              }}
            >
              <Button type="submit" className="mt-8" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogDescription>
    </>
  );
}

function LoserDialog({
  item,
  latestBidderName,
  finalPrice,
}: {
  item: any;
  latestBidderName: string;
  finalPrice: number;
}) {
  return (
    <>
      <DialogTitle className="flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-blue-500" />
        Auction Ended
      </DialogTitle>
      <DialogDescription className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg mt-4 text-center">
          <h1 className="font-medium text-blue-700">This auction has ended</h1>
          <h1 className="text-sm text-blue-600 mt-2">
            The winning bid was {formatCurrency(finalPrice)} by{" "}
            {latestBidderName}
          </h1>
          <h1 className="text-sm text-blue-600 mt-2">
            Better luck next time! Check out our other active auctions.
          </h1>
        </div>
      </DialogDescription>
    </>
  );
}

function NoWinnerDialog() {
  return (
    <>
      <DialogTitle className="flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-red-500" />
        Auction Ended
      </DialogTitle>
      <DialogDescription className="space-y-4">
        <div className="p-4 bg-red-50 rounded-lg mt-4 text-center">
          <h1 className="font-medium text-red-700">No bids were placed</h1>
          <h1 className="text-sm text-red-600 mt-2">
            Unfortunately, this auction ended without any bids.
          </h1>
          <h1 className="text-sm text-red-600 mt-2">
            Please check out our other active auctions.
          </h1>
        </div>
      </DialogDescription>
    </>
  );
}
