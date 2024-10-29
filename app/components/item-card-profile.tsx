// app/components/ItemCardProfile.tsx
"use server"; // Ensures this component is treated as a server component

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "../action";

export default async function ItemCardProfile({ userId }: { userId: string }) {
  const user = await getUserById(userId);

  if (!user) {
    return <div className="text-white">User not found</div>;
  }

  return (
    <div className="relative w-full h-64 bg-cover bg-center rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-700 opacity-50" />
      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={user.avatarUrl || "https://github.com/shadcn.png"}
            alt={`@${user.name}`}
            sizes="lg"
          />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-white text-lg font-semibold">{user.name}</h1>
          <h2 className="text-gray-200 text-sm">{user.title || "BoomBayah"}</h2>
        </div>
      </div>
    </div>
  );
}
