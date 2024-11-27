"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { handleSignOut, signOutWithGoogle } from "../action";
import { createClientSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { userAtom } from "../atom/userAtom";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { set } from "date-fns";
// import { supabase } from "@/lib/utils";

export default function UserAvatar({
  name = "John Doe",
  imageUrl = "https://github.com/shadcn.png",
  email = "john@example.com",
  userId = "1",
}: {
  name: string;
  imageUrl?: string;
  email: string;
  userId: string;
}) {
  // console.log("name", name);
  const supabase = createClientSupabase();
  const [, setUser] = useAtom(userAtom);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const initials =
    name ||
    ""
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // Add this effect to reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
    setIsOpen(false);
  }, [pathname]);

  const handleLinkClick = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setIsOpen(false);
    // Don't navigate if we're already on the target path
    if (path === pathname) {
      return;
    }
    setIsNavigating(true);
    await router.push(path);
  };

  return (
    <>
      <Dialog open={isNavigating} modal>
        <DialogContent className="[&>button]:hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading...</p>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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
          <DropdownMenuItem
            // onClick={() => handleNavigation(`/profile/${userId}`)}
            asChild
          >
            <Link
              href={`/profile/${userId}`}
              className="flex w-full cursor-pointer items-center"
              onClick={(e) => handleLinkClick(e, `/profile/${userId}`)}
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
              onClick={(e) => handleLinkClick(e, "/dashboard")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;

                // Clear any local storage items if needed
                // localStorage.removeItem("supabase.auth.token");
                setUser(null);

                // Force reload to clear all state
                window.location.href = "/";
              } catch (error) {
                console.error("Error signing out:", error);
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
          {/* <DropdownMenuItem asChild>
          <Button
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                console.error("Error signing out:", error);
              } else {
                window.location.href = "/"; // Redirect to homepage
              }
            }}
            className="flex w-full cursor-pointer items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
