"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// import { useState } from "react";
// import Link from "next/link";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { User, Settings } from "lucide-react";

// export default function UserAvatar({
//   name = "John Doe",
//   imageUrl = "https://github.com/shadcn.png",
//   email = "john@example.com",
//   userId = "1",
// }: {
//   name?: string;
//   imageUrl?: string;
//   email?: string;
//   userId?: string;
// }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   const handleLinkClick = () => {
//     setIsOpen(false);
//   };

//   return (
//     <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative h-8 w-8 rounded-full gap-4">
//           <Avatar className="h-8 w-8">
//             <AvatarImage src={imageUrl} alt={name} />
//             <AvatarFallback>{initials}</AvatarFallback>
//           </Avatar>
//           <span className="text-sm font-medium">{name}</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end">
//         <div className="flex items-center justify-start gap-2 p-2">
//           <div className="flex flex-col space-y-1 leading-none">
//             <p className="font-medium">{name}</p>
//             <p className="w-[200px] truncate text-sm text-muted-foreground">
//               {email}
//             </p>
//           </div>
//         </div>
//         <DropdownMenuItem asChild>
//           <Link
//             href={`/profile/${userId}`}
//             className="flex w-full cursor-pointer items-center"
//             onClick={handleLinkClick}
//           >
//             <User className="mr-2 h-4 w-4" />
//             <span>Profile</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <Settings className="mr-2 h-4 w-4" />
//           <span>Dashboard</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

export default function UserAvatar({
  name = "John Doe",
  imageUrl = "https://github.com/shadcn.png",
  email = "john@example.com",
  userId = "1",
}: {
  name?: string;
  imageUrl?: string;
  email?: string;
  userId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLinkClick = () => {
    setIsOpen(false);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 focus:outline-none">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={imageUrl}
              alt={"hey"}
              className="w-12 h-12 rounded-full"
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col text-left">
            <span className="font-medium">{name}</span>
            {/* <span className="text-sm text-gray-500">{email}</span> */}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50">
        <DropdownMenuItem onClick={() => console.log("Go to Profile")} asChild>
          <Link
            href={`/profile/${userId}`}
            className="flex w-full cursor-pointer items-center"
            onClick={handleLinkClick}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => console.log("Go to Dashboard")}
          asChild
        >
          <Link
            href={"/dashboard"}
            className="flex w-full cursor-pointer items-center"
            onClick={handleLinkClick}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// export default UserAvatarDropdown;
