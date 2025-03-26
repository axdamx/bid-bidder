"use client";

import SignIn from "@/components/ui/sign-in";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "./components/userAvatar";
import SearchCommand from "./components/headerSearch";
import { ArrowRight, Loader2, LogOut, Menu } from "lucide-react";
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
import dynamic from "next/dynamic";

// Client-side only component for the mobile menu button with tooltip
const MobileMenuButton = dynamic(
  () =>
    Promise.resolve(
      ({}: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
        const [showMenuHint, setShowMenuHint] = useState(false);
        const [user] = useAtom(userAtom);

        // Check if we should show the menu hint for logged-in users
        useEffect(() => {
          if (typeof window !== "undefined" && user) {
            // Only show the hint if the user is logged in and hasn't seen it before
            const menuHintShown = localStorage.getItem("headerMenuHintShown");
            if (menuHintShown !== "true") {
              setShowMenuHint(true);
              // Set a timer to automatically hide the hint after 5 seconds
              const timer = setTimeout(() => {
                setShowMenuHint(false);
                localStorage.setItem("headerMenuHintShown", "true");
              }, 5000);

              return () => clearTimeout(timer);
            }
          }
        }, [user]);

        return (
          <div className="relative md:hidden">
            {showMenuHint && user && (
              <div className="absolute top-10 right-0 bg-popover text-popover-foreground text-xs rounded-md py-1.5 px-3 shadow-md whitespace-nowrap z-50 animate-fade-in-out border">
                Tap to access your profile
                <div className="absolute -top-1 right-2 w-2 h-2 bg-popover rotate-45 border-t border-l"></div>
              </div>
            )}
            <SheetTrigger className="relative">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-md border shadow-sm flex items-center justify-center animate-subtle-pulse"
                onClick={() => {
                  if (showMenuHint && typeof window !== "undefined") {
                    setShowMenuHint(false);
                    localStorage.setItem("headerMenuHintShown", "true");
                  }
                }}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </div>
        );
      }
    ),
  { ssr: false }
); // Disable SSR for this component

export function Header() {
  const [user, setUser] = useAtom(userAtom);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientSupabase();

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
    router.push(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-gray-50/80 backdrop-blur-sm py-2 shadow-sm">
        <Dialog open={isNavigating} modal>
          <DialogTitle className="[&>button]:hidden" />
          <DialogContent
            aria-describedby="success-message"
            aria-labelledby="success-title"
            className="[&>button]:hidden"
          >
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
                href="/app"
                className="flex-shrink-0"
                onClick={(e) => handleLinkClick(e, "/app")}
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
                  <>
                    <Link
                      href="/app/items/create"
                      className="hover:underline whitespace-nowrap"
                      onClick={(e) => handleLinkClick(e, "/app/items/create")}
                    >
                      <Button>Create Auction</Button>
                    </Link>
                    <Link
                      href="/app/active"
                      className="hover:underline whitespace-nowrap"
                      onClick={(e) => handleLinkClick(e, "/app/active")}
                    >
                      <Button variant="outline">Your Bids</Button>
                    </Link>
                  </>
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
              <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
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
                                <div className="flex flex-col max-w-[180px]">
                                  <p
                                    className="font-medium truncate"
                                    title={user.name}
                                  >
                                    {user.name}
                                  </p>
                                  <p
                                    className="text-sm text-muted-foreground truncate"
                                    title={user.email}
                                  >
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
                              href={`/app/profile/${user.id}`}
                              className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent"
                              onClick={(e) =>
                                handleLinkClick(e, `/app/profile/${user.id}`)
                              }
                            >
                              <span>Profile</span>
                            </Link>
                            <Link
                              href="/app/dashboard"
                              className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent"
                              onClick={(e) =>
                                handleLinkClick(e, "/app/dashboard")
                              }
                            >
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              href="/app/items/create"
                              className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent"
                              onClick={(e) =>
                                handleLinkClick(e, "/app/items/create")
                              }
                            >
                              <span>Create Auction</span>
                            </Link>
                            <Link
                              href="/app/active"
                              className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-accent"
                              onClick={(e) => handleLinkClick(e, "/app/active")}
                            >
                              <span>Active Bids</span>
                            </Link>
                          </div>

                          {/* Sign Out Section */}
                          <div className="px-4 py-2 border-t mt-auto">
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                  const { error } =
                                    await supabase.auth.signOut();
                                  if (error) throw error;

                                  // Clear any local storage items if needed
                                  // localStorage.removeItem("supabase.auth.token");
                                  setUser(null);

                                  // Force reload to clear all state
                                  window.location.href = "/app";
                                } catch (error) {}
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
      <div className="sticky top-[64px] z-40 w-full overflow-hidden">
        {/* Aurora gradient background */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-500 bg-[length:300%_300%] animate-aurora"
          style={{
            willChange: "background-position",
            transform: "translateZ(0)", // Force GPU acceleration
          }}
        />

        {/* Overlay with radial gradient for aurora effect */}
        <div className="absolute inset-0 bg-black/10">
          <div
            className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-70 mix-blend-overlay"
            style={{
              willChange: "opacity",
              transform: "translateZ(0)", // Force GPU acceleration
            }}
          />
        </div>

        <div className="container relative z-10 flex h-10 items-center justify-center">
          <Link
            href="/app/how-auction-work"
            className="text-sm font-medium text-white hover:underline drop-shadow-md px-1 py-1 rounded-full bg-black/20 backdrop-blur-sm transition-all hover:bg-black/30"
          >
            ✨ Learn how our auction platform works{" "}
            <ArrowRight className="inline-block ml-1" size={16} />
          </Link>
        </div>
      </div>
    </>
  );
}
