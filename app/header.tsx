"use client";
import SignIn from "@/components/ui/sign-in";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "./components/userAvatar";
import SearchCommand from "./components/headerSearch";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MotionGrid } from "./components/motionGrid";
import { SignOut } from "@/components/ui/sign-out";
import { supabase } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSupabase } from "./context/SupabaseContext";
import { getUserById } from "./action";

export function Header({}: {}) {
  const { session } = useSupabase(); // Use the hook to get session data
  const userId = session?.user?.id || ""; // Extract user ID from session
  const [initialUser, setInitialUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const fetchedUser = await getUserById(userId);
        setInitialUser(fetchedUser);
      } catch (err) {
        setError(err);
      }
    }

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return (
    <div className="sticky top-0 z-50 bg-gray-50/80 backdrop-blur-sm py-4 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section: Logo and Navigation */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <Image
                src="/renown-high-resolution-logo-transparent.png"
                width="50"
                height="50"
                alt="Logo"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {session && (
                <>
                  <Link
                    href="/items/create"
                    className="hover:underline flex items-center gap-1"
                  >
                    Create Auction
                  </Link>
                  {/* <Link
                    href="/auctions"
                    className="hover:underline flex items-center gap-1"
                  >
                    My Auction
                  </Link> */}
                </>
              )}
            </div>
          </div>

          {/* Center Section: Search */}
          <div className="flex-1 flex justify-center max-w-xl">
            <SearchCommand />
          </div>

          {/* Right Section: User Controls */}
          <div className="flex items-center gap-8 flex-shrink-0">
            {initialUser && (
              <UserAvatar
                name={initialUser.name!}
                imageUrl={initialUser.image!}
                email={initialUser.email!}
                userId={initialUser.id!}
              />
            )}

            {/* Desktop Sign In/Out */}
            <div className="hidden md:block">{!session && <SignIn />}</div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger className="md:hidden">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-4">
                  {session ? (
                    <nav className="flex flex-col space-y-4">
                      <Link
                        href="/items/create"
                        className="px-2 py-1 hover:bg-gray-100 rounded-md"
                      >
                        Create Auction
                      </Link>
                      <Link
                        href="/auctions"
                        className="px-2 py-1 hover:bg-gray-100 rounded-md"
                      >
                        My Auction
                      </Link>
                      <div className="px-2">
                        <SignOut />
                      </div>
                    </nav>
                  ) : (
                    <div className="px-2">
                      <SignIn />
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
