import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  image: string;
  name: string;
  email: string;
}

export const ProfileHeader = ({ user }: { user: User }) => {
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
          <h1 className="text-xl font-semibold text-white">{user.name}</h1>
          <h1 className="text-sm text-gray-200">{user.email}</h1>
        </div>
      </div>
    </div>
  );
};
