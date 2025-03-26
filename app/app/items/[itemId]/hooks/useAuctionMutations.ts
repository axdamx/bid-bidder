import { useMutation } from "@tanstack/react-query";
import {
  updateBidAcknowledgmentAction,
  createBidAction,
  createOrderAction,
  updateItemStatus,
  updateBINItemStatus,
} from "../actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useAuctionMutations(
  itemId: number,
  userId: string,
  onBidAcknowledge: () => void,
  item: any,
  setShowDisclaimerModal: React.Dispatch<React.SetStateAction<boolean>>,
  highestBid: number
) {
  const router = useRouter();

  const { mutate: updateBidAcknowledgment } = useMutation({
    mutationFn: () => updateBidAcknowledgmentAction(item.id, userId),
    onSuccess: () => {
      // Parent will handle query invalidation via onBidAcknowledge
      onBidAcknowledge();
      // Continue with bid submission and UI updates
      submitBid();
      setShowDisclaimerModal(false);
    },
    onError: () => {
      toast.error("Failed to acknowledge bid");
    },
  });

  const { mutate: submitBid, isPending: isBidPending } = useMutation({
    mutationFn: () =>
      createBidAction(itemId, userId, false, {
        currentBid: item.currentBid,
        startingPrice: item.startingPrice,
        bidInterval: item.bidInterval,
        binPrice: item.binPrice,
      }),
    onError: (error) => {
      toast.error("Failed to place bid. Please try again.");
    },
  });

  const { mutate: createBinOrder, isPending: isCreatingBinOrder } = useMutation(
    {
      mutationFn: () =>
        createOrderAction(itemId, userId, item.binPrice, item.users.id),
      onSuccess: () => {
        navigateToCheckout();
      },
      onError: (error) => {
        toast.error("Failed to create order. Please try again.");
      },
    }
  );

  const { mutate: submitBuyItNow, isPending: isBuyItNowPending } = useMutation({
    mutationFn: () =>
      createBidAction(itemId, userId, true, {
        currentBid: item.currentBid,
        startingPrice: item.startingPrice,
        bidInterval: item.bidInterval,
        binPrice: item.binPrice,
      }),
    onSuccess: () => {
      createBinOrder();
    },
    onError: (error) => {
      toast.error("Failed to process Buy It Now. Please try again.");
    },
  });

  const { mutate: createOrder, isPending: isCreatingOrder } = useMutation({
    mutationFn: () =>
      createOrderAction(itemId, userId, highestBid, item.users.id),
    onSuccess: (data) => {
      // Order created successfully, now show winner dialog
      setShowDisclaimerModal(false);
    },
    onError: (error) => {
      toast.error("Failed to create order. Please try again.");
    },
  });

  const { mutate: navigateToCheckout } = useMutation({
    mutationFn: async () => {
      return router.push(`/app/checkout/${itemId}`);
    },
    onError: (error) => {
      toast.error("Failed to navigate to checkout. Please try again.");
    },
  });

  return {
    updateBidAcknowledgment,
    submitBid,
    isBidPending,
    submitBuyItNow,
    isBuyItNowPending,
    createOrder,
    isCreatingOrder,
    navigateToCheckout,
  };
}
