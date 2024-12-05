"use client";

import SignIn from "@/components/ui/sign-in";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "./components/userAvatar";
import SearchCommand from "./components/headerSearch";
import { Loader2, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSupabase } from "./context/SupabaseContext";
import { fetchUser } from "./profile/[userId]/action";
import { userAtom } from "./atom/userAtom";
import { useAtom } from "jotai";
import { NotificationDropdown } from "./NotificationDropdown";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "./action";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import SignInMobileButton from "@/components/ui/sign-in-mobile";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { createClientSupabase } from "@/lib/supabase/client";

export function Header() {
  const [user, setUser] = useAtom(userAtom);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // const supabase = useSupabase();
  const supabase = createClientSupabase();

  // Fetch user data from Supabase, when user first login
  // const { data: dbUser } = useQuery({
  //   queryKey: ["getUserById", user?.id],
  //   queryFn: () => getUserById(user?.id || ""),
  //   enabled: !!user?.id, // Only run query when we have a user ID
  //   staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  //   onSuccess: (data) => {
  //     if (data) {
  //       setUser((currentUser) => ({
  //         ...currentUser,
  //         ...data,
  //       }));
  //     }
  //   },
  // });

  // console.log("user header", user);
  // console.log("initialUser header", dbUser);

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
    <header className="sticky top-0 z-50 w-full bg-gray-50/80 backdrop-blur-sm py-2 shadow-sm">
      <Dialog open={isNavigating} modal>
        <DialogTitle className="[&>button]:hidden" />
        <DialogContent className="[&>button]:hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading...</p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container px-4 mx-auto">
        <nav className="flex items-center justify-between gap-2">
          {/* Left Section: Logo and Navigation */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link
              href="/"
              className="flex-shrink-0"
              onClick={(e) => handleLinkClick(e, "/")}
            >
              <Image
                src="/renown-high-resolution-logo-transparent.png"
                width={75}
                height={75}
                alt="Logo"
                className="w-20 h-20" // Smaller logo
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {user && (
                <Link
                  href="/items/create"
                  className="hover:underline whitespace-nowrap"
                  onClick={(e) => handleLinkClick(e, "/items/create")}
                >
                  <Button>Create Auction</Button>
                  {/* <div>
                    <MovingBorderButton
                      borderRadius="1.75rem"
                      className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                      Create Auction
                    </MovingBorderButton>
                  </div> */}
                  {/* Create Auction */}
                </Link>
              )}
            </div>
          </div>

          {/* Center Section: Search */}
          <div className="flex-1 max-w-[200px] sm:max-w-xl mx-auto flex justify-center">
            <SearchCommand />
          </div>

          {/* Right Section: User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                {/* <Link
                  href="/items/create"
                  className="hover:underline whitespace-nowrap text-sm"
                  onClick={(e) => handleLinkClick(e, "/items/create")}
                >
                  Create Auction
                </Link> */}
                <UserAvatar
                  name={user.name!}
                  imageUrl={user.image!}
                  email={user.email!}
                  userId={user.id!}
                />
                <NotificationDropdown />
              </>
            )}
            {!user && <SignIn />}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                {/* Header Section */}
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Renown</h2>
                </div>

                {/* Navigation Content */}
                <div className="flex-1 overflow-auto py-4">
                  {/* <div className="px-4 mb-4"><SearchCommand /></div> */}

                  <nav className="space-y-2">
                    {user ? (
                      <>
                        {/* User Profile Section */}
                        <div className="px-4 py-3 mb-2 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={user?.image} />
                                <AvatarFallback>
                                  {user?.name?.charAt(0) ||
                                    user?.email?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <NotificationDropdown />
                          </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="px-2 py-2">
                          <Link
                            href={`/profile/${user.id}`}
                            className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent"
                            onClick={(e) =>
                              handleLinkClick(e, `/profile/${user.id}`)
                            }
                          >
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/dashboard"
                            className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent"
                            onClick={(e) => handleLinkClick(e, "/dashboard")}
                          >
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/items/create"
                            className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent"
                            onClick={(e) => handleLinkClick(e, "/items/create")}
                          >
                            <span>Create Auction</span>
                          </Link>
                        </div>

                        {/* Sign Out Section */}
                        <div className="px-4 py-2 border-t mt-auto">
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
                            <button
                              type="submit"
                              className="flex items-center space-x-2 w-full px-2 py-2 rounded-md hover:bg-accent"
                            >
                              <LogOut className="h-4 w-4" />
                              <span>Sign Out</span>
                            </button>
                          </form>
                        </div>
                      </>
                    ) : (
                      <div className="px-4">
                        <SignInMobileButton />
                      </div>
                    )}
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
