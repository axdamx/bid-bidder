import { useQueries } from "@tanstack/react-query";
import { fetchFollowData, fetchOwnedItems, fetchUser } from "../action";
import { useMemo } from "react";

const useProfileData = (ownerId: string, currentUserId: string) => {
  console.log(
    `useProfileData hook called with ownerId: ${ownerId}, currentUserId: ${currentUserId}`
  );

  const memoizedOwnerId = useMemo(() => ownerId, [ownerId]);
  const memoizedCurrentUserId = useMemo(() => currentUserId, [currentUserId]);

  const results = useQueries({
    queries: [
      {
        queryKey: ["user", memoizedOwnerId],
        queryFn: () => fetchUser(memoizedOwnerId),
        // staleTime: 30000, // 30 seconds
        // retry: 1,
      },
      {
        queryKey: ["followData", memoizedCurrentUserId, memoizedOwnerId],
        queryFn: () => fetchFollowData(memoizedCurrentUserId, memoizedOwnerId),
        // staleTime: 30000,
        // retry: 1,
      },
      {
        queryKey: ["ownedItems", memoizedOwnerId],
        queryFn: () => fetchOwnedItems(memoizedOwnerId),
        // staleTime: 30000,
        // retry: 1,
      },
    ],
  });

  const [userQuery, followDataQuery, ownedItemsQuery] = results;

  return {
    userQuery,
    followDataQuery,
    ownedItemsQuery,
    isLoading: userQuery.isLoading, // Only consider user data for initial loading
    isFetching: results.some((query) => query.isFetching),
  };
};

export { useProfileData };
