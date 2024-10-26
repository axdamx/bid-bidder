import { database } from "@/src/db/database";
import { items, bids, users, Item } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/app/auth";
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

  const hasItems = allItems.length > 0;

  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  });

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
    <>
      <div className="container mx-auto p-4">
        <ProfileHeader user={user} />
        <div className="flex flex-col md:flex-row mt-6 gap-6">
          <div className="md:w-1/4 space-y-4">
            <Stats items={allItems} />
            <About />
            <SocialLinks />
          </div>
          <PostFeed allItems={allItems} />
        </div>
      </div>
    </>
  );
}
// ProfilePage.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
// import { HeartIcon, ChatIcon, ShareIcon } from "@heroicons/react/outline"; // Example icons

// export default function ProfilePage() {
//   return (
//     <div className="container mx-auto p-4">
//       <ProfileHeader />
//       <div className="flex flex-col md:flex-row mt-6 gap-6">
//         <div className="md:w-1/4 space-y-4">
//           <Stats />
//           <About />
//           <SocialLinks />
//         </div>
//         <PostFeed />
//       </div>
//     </div>
//   );
// }

function ProfileHeader({ user }) {
  return (
    <div
      className="relative w-full h-64 bg-cover bg-center rounded-lg overflow-hidden"
      style={{ backgroundImage: "url('/path/to/background-image.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-700 opacity-50" />
      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            sizes="lg"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>{" "}
        <div>
          <h1 variant="h5" className="text-white">
            {user.name}
          </h1>
          <h1 variant="subtitle2" className="text-gray-200">
            BoomBayah
          </h1>
        </div>
      </div>
    </div>
  );
}

function Stats({ items }) {
  const numberOfItems = items.length;
  return (
    <Card className="p-4 text-center space-y-2">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h1 variant="h6">{numberOfItems}</h1>
          <h1 variant="body2" className="text-gray-500">
            Posts
          </h1>
        </div>
        <div>
          <h1 variant="h6">1.3m</h1>
          <h1 variant="body2" className="text-gray-500">
            Followers
          </h1>
        </div>
        <div>
          <h1 variant="h6">923</h1>
          <h1 variant="body2" className="text-gray-500">
            Following
          </h1>
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

function PostFeed({ allItems }) {
  return (
    <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {allItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
