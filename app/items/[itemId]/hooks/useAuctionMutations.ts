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
    mutationFn: () => createBidAction(itemId, userId),
    onError: (error) => {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid. Please try again.");
    },
  });

  const { mutate: submitBuyItNow, isPending: isBuyItNowPending } = useMutation({
    mutationFn: () =>
      createOrderAction(itemId, userId, item.binPrice, item.users.id),
    onError: (error) => {
      console.error("Error processing Buy It Now:", error);
      toast.error("Failed to process Buy It Now. Please try again.");
    },
  });

  const router = useRouter();

  const { mutate: createOrder } = useMutation({
    mutationFn: () =>
      createOrderAction(item.id, userId, highestBid!, item.users.id),
    onError: (error) => {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order. Please contact support.");
    },
    onSuccess: (payload) => {
      router.push(`/checkout/${item.id}`);
    },
  });

  const { mutate: updateItemStatusMutate, isPending: isUpdating } = useMutation(
    {
      mutationFn: () => updateItemStatus(item.id, userId),
      onError: (error) => {
        console.error("Failed to update item status:", error);
        toast.error("Failed to proceed to checkout. Please try again.");
      },
      onSuccess: (data) => {
        createOrder();
      },
    }
  );

  const { mutate: updateBINItemStatusMutate, isPending: isUpdatingBINItem } =
    useMutation({
      mutationFn: () => updateBINItemStatus(item.id, userId),
      onError: (error) => {
        console.error("Failed to update item status:", error);
        toast.error("Failed to proceed to checkout. Please try again.");
      },
      onSuccess: (data) => {
        createOrder();
      },
    });

  return {
    updateBidAcknowledgment,
    submitBid,
    isBidPending,
    submitBuyItNow,
    isBuyItNowPending,
    updateItemStatusMutate,
    isUpdating,
    updateBINItemStatusMutate,
    isUpdatingBINItem,
  };
}
