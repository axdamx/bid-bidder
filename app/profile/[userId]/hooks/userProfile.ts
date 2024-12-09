import { useQueries } from "@tanstack/react-query";
import { fetchFollowData, fetchOwnedItems, fetchUser } from "../action";

const useProfileData = (ownerId: string, currentUserId: string) => {
  console.log(
    `useProfileData hook called with ownerId: ${ownerId}, currentUserId: ${currentUserId}`
  );

  const results = useQueries({
    queries: [
      {
        queryKey: ["user", ownerId],
        queryFn: () => {
          console.log(`Fetching user data for ownerId: ${ownerId}`);
          return fetchUser(ownerId);
        },
        // staleTime: 5 * 60 * 1000, // 5 minutes
        // cacheTime: 10 * 60 * 1000, // 10 minutes
      },
      {
        queryKey: ["followData", currentUserId, ownerId],
        queryFn: () => {
          console.log(
            `Fetching follow data for currentUserId: ${currentUserId}, ownerId: ${ownerId}`
          );
          return fetchFollowData(currentUserId, ownerId);
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        // cacheTime: 5 * 60 * 1000, // 5 minutes
      },
      {
        queryKey: ["ownedItems", ownerId],
        queryFn: () => {
          console.log(`Fetching owned items for ownerId: ${ownerId}`);
          return fetchOwnedItems(ownerId);
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        // cacheTime: 10 * 60 * 1000, // 10 minutes
        // keepPreviousData: true,
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
