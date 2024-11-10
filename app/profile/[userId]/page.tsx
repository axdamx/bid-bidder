import { database } from "@/src/db/database";
import { items, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import ItemCard from "@/app/item-card";
import { EmptyState } from "@/app/auctions/empty-state";

export default async function ProfilePage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const allItems = await database.query.items.findMany({
    where: eq(items.userId, userId),
  });

  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const session = await auth(); // Your auth implementation
  const currentUserId = session?.user?.id;

  const { isFollowing } = await getFollowStatus(currentUserId!, userId);
  const { followersCount, followingCount } = await getFollowCounts(userId);

  const { ownedItems, error } = await getItemsByUserId(userId);
  if (error) {
    // Handle error
  } else {
    // Use items
    // console.log("ownedItems", ownedItems);
  }

  // console.log("followersCount", followersCount);
  // console.log("followingCount", followingCount);

  if (!user) {
    return (
      <div className="space-y-4 justify-center flex items-center flex-col mt-8">
        <h1 className="text-2xl font-bold"> User Not Found! </h1>
      </div>
    );
  }

  // const numberOfItems = allItems.length;
  // console.log("numberOfItems", numberOfItems);

  return (
    <MotionGrid>
      <div className="container mx-auto p-4">
        <ProfileHeader user={user} />
        <div className="flex flex-col md:flex-row mt-6 gap-6">
          <div className="md:w-1/4 space-y-4">
            <Stats
              itemsCount={allItems.length}
              followersCount={followersCount}
              followingCount={followingCount}
              userId={userId}
              currentUserId={currentUserId}
              isFollowing={isFollowing}
            />
            <About />
            <SocialLinks />
          </div>
          <PostFeed ownedItems={ownedItems} />
        </div>
      </div>
    </MotionGrid>
  );
}
// ProfilePage.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FollowButton } from "./components/follow-button";
import { auth } from "@/app/auth";
import { getFollowCounts, getFollowStatus, getItemsByUserId } from "./action";
import { MotionGrid } from "@/app/components/motionGrid";

export function ProfileHeader({ user }) {
  console.log("user", user);
  return (
    <div
      className="relative w-full h-64 bg-cover bg-center rounded-lg overflow-hidden"
      style={{ backgroundImage: "url('/path/to/background-image.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-700 opacity-50" />
      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.image} alt="@shadcn" sizes="lg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>{" "}
        <div>
          <h1 variant="h5" className="text-white">
            {user.name}
          </h1>
          <h1 variant="subtitle2" className="text-gray-200">
            {user.email}
          </h1>
        </div>
      </div>
    </div>
  );
}

function Stats({
  itemsCount,
  followersCount,
  followingCount,
  userId,
  currentUserId,
  isFollowing,
}) {
  // const numberOfItems = items.length;
  return (
    <Card className="p-4 text-center space-y-2">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h1 variant="h6">{itemsCount}</h1>
          <h1 variant="body2" className="text-gray-500">
            Posts
          </h1>
        </div>
        <div>
          <h1 variant="h6">{followersCount}</h1>
          <h1 variant="body2" className="text-gray-500">
            Followers
          </h1>
        </div>
        <div>
          <h1 variant="h6">{followingCount}</h1>
          <h1 variant="body2" className="text-gray-500">
            Following
          </h1>
        </div>
        <div className="col-span-3">
          <FollowButton
            targetUserId={userId}
            currentUserId={currentUserId}
            initialIsFollowing={isFollowing}
          />
        </div>
      </div>
    </Card>
  );
}

function About() {
  return (
    <Card className="p-4">
      <h1 variant="h6">About me</h1>
      <h1 variant="body2" className="text-gray-700 mt-2">
        "Bla Bla Bla Bla Bla Bla Bla"
      </h1>
      <h1 variant="body2" className="text-gray-500 mt-4">
        Lives in KL, Malaysia
      </h1>
    </Card>
  );
}

function SocialLinks() {
  return (
    <Card className="p-4">
      <h1 variant="h6">Social Links</h1>
      <div className="flex space-x-4 mt-2">
        {/* <Icon name="dribbble" />
        <Icon name="instagram" />
        <Icon name="facebook" /> */}
        <h1> Facebook </h1>
        <h1> Instagram </h1>
        <h1> Tiktok </h1>
      </div>
    </Card>
  );
}

function PostFeed({ ownedItems }) {
  const hasItems = ownedItems.length > 0;
  return (
    <>
      {hasItems ? (
        <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownedItems.map((item, index) => (
            <MotionGrid
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <ItemCard key={item.id} item={item} />
            </MotionGrid>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState />
        </div>
      )}
    </>
    // <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
    //   {allItems.map((item) => (
    //     <ItemCard key={item.id} item={item} />
    //   ))}
    // </div>
  );
}

// {hasItems ? (
//   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
//     {allItems.map((item) => (
//       <ItemCard key={item.id} item={item} />
//     ))}
//   </div>
// ) : (
//   <EmptyState />
// )}
