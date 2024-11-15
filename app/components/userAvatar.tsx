"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { handleSignOut, signOutWithGoogle } from "../action";
import { supabase } from "@/lib/utils";

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
            <span className="text-sm text-gray-500">{email}</span>
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.error("Error signing out:", error);
            } else {
              window.location.href = "/"; // Redirect to homepage
            }
          }}
        >
          <DropdownMenuItem asChild>
            <button type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
