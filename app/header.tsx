"use client";
import SignIn from "@/components/ui/sign-in";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "./components/userAvatar";
import SearchCommand from "./components/headerSearch";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignOut } from "@/components/ui/sign-out";
import { useEffect, useState } from "react";
import { useSupabase } from "./context/SupabaseContext";
import { fetchUser } from "./profile/[userId]/action";

export function Header() {
  const { session } = useSupabase();
  const userId = session?.user?.id || "";
  const [initialUser, setInitialUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const fetchedUser = await fetchUser(userId);
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
    <header className="sticky top-0 z-50 w-full bg-gray-50/80 backdrop-blur-sm py-4 shadow-sm">
      <div className="container px-4 mx-auto">
        <nav className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Section: Logo and Navigation */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/renown-high-resolution-logo-transparent.png"
                width={50}
                height={50}
                alt="Logo"
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {session && (
                <Link
                  href="/items/create"
                  className="hover:underline whitespace-nowrap"
                >
                  Create Auction
                </Link>
              )}
            </div>
          </div>

          {/* Center Section: Search */}
          <div className="flex-1 max-w-[300px] sm:max-w-xl mx-auto">
            <SearchCommand />
          </div>

          {/* Right Section: User Controls */}
          <div className="flex items-center gap-4">
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
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-4 mt-4">
                  {session ? (
                    <nav className="flex flex-col space-y-4">
                      <Link
                        href="/items/create"
                        className="px-2 py-1 hover:bg-gray-100 rounded-md"
                      >
                        Create Auction
                      </Link>
                      {/* <div className="px-2">
                        <SignOut />
                      </div> */}
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
        </nav>
      </div>
    </header>
  );
}
