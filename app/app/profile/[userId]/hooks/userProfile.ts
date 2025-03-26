import { useQueries } from "@tanstack/react-query";
import { fetchFollowData, fetchOwnedItems, fetchUser } from "../action";
import { useMemo } from "react";
import { User, FollowData, Item, ProfileData } from "../types";

/**
 * Custom hook to fetch and manage profile data
 * @param ownerId ID of the profile owner
 * @param currentUserId ID of the current logged-in user
 * @returns Profile data including user info, follow data, and owned items
 */
const useProfileData = (ownerId: string, currentUserId: string): ProfileData => {
  // Memoize IDs to prevent unnecessary re-renders
  const memoizedOwnerId = useMemo(() => ownerId, [ownerId]);
  const memoizedCurrentUserId = useMemo(() => currentUserId, [currentUserId]);

  // Use React Query's useQueries to batch multiple queries
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
    userQuery: {
      data: userQuery.data as User | null,
      isLoading: userQuery.isLoading,
      error: userQuery.error
    },
    followDataQuery: {
      data: followDataQuery.data as FollowData | null,
      isLoading: followDataQuery.isLoading,
      error: followDataQuery.error
    },
    ownedItemsQuery: {
      data: ownedItemsQuery.data as Item[] | null,
      isLoading: ownedItemsQuery.isLoading,
      error: ownedItemsQuery.error
    },
    isLoading: userQuery.isLoading, // Only consider user data for initial loading
    isFetching: results.some((query) => query.isFetching),
  };
};

export { useProfileData };
