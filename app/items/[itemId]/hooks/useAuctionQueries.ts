import { useQuery } from "@tanstack/react-query";
import { checkExistingOrder } from "../actions";

export function useAuctionQueries(
  itemId: number,
  userId: string,
  isBidOver: boolean,
  isWinner: boolean
) {
  const { data: orderExists } = useQuery({
    queryKey: ["order", itemId, userId],
    queryFn: () => checkExistingOrder(itemId, userId),
    enabled: !!userId && isBidOver && isWinner,
  });

  return { orderExists };
}
