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
        queryFn: () => {
          console.log(`Fetching user data for ownerId: ${memoizedOwnerId}`);
          return fetchUser(memoizedOwnerId);
        },
        // staleTime: 5 * 60 * 1000, // 5 minutes
      },
      {
        queryKey: ["followData", memoizedCurrentUserId, memoizedOwnerId],
        queryFn: () => {
          console.log(
            `Fetching follow data for currentUserId: ${memoizedCurrentUserId}, ownerId: ${memoizedOwnerId}`
          );
          return fetchFollowData(memoizedCurrentUserId, memoizedOwnerId);
        },
        // staleTime: 5 * 60 * 1000, // 5 minutes
      },
      {
        queryKey: ["ownedItems", memoizedOwnerId],
        queryFn: () => {
          console.log(`Fetching owned items for ownerId: ${memoizedOwnerId}`);
          return fetchOwnedItems(memoizedOwnerId);
        },
        // staleTime: 5 * 60 * 1000, // 5 minutes
      },
    ],
  });

  const [userQuery, followDataQuery, ownedItemsQuery] = results;

  console.log(
    `Query states - User: ${userQuery.status}, Follow: ${followDataQuery.status}, OwnedItems: ${ownedItemsQuery.status}`
  );

  return {
    userQuery,
    followDataQuery,
    ownedItemsQuery,
    isLoading: results.some((query) => query.isLoading),
    isFetching: results.some((query) => query.isFetching),
  };
};

export { useProfileData };
