import { Card } from "@/components/ui/card";
import { FollowButton } from "./follow-button";

export const Stats = ({
  itemsCount,
  followersCount,
  followingCount,
  userId,
  currentUserId,
  isFollowing,
}) => {
  // const numberOfItems = items.length;
  return (
    <Card className="p-4 text-center" style={{ overflowWrap: "break-word" }}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h1 className="text-xl font-semibold">{itemsCount}</h1>
          <h1 className="text-gray-500 text-sm">Posts</h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold">{followersCount}</h1>
          <h1 className="text-gray-500 text-sm">Followers</h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold">{followingCount}</h1>
          <h1 className="text-gray-500 text-sm">Following</h1>
        </div>
        <div className="col-span-3">
          {currentUserId && (
            <FollowButton
              targetUserId={userId}
              currentUserId={currentUserId}
              initialIsFollowing={isFollowing}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
