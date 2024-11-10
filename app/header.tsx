import SignIn from "@/components/ui/sign-in";
import { SignOut } from "@/components/ui/sign-out";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "./components/userAvatar";
import SearchCommand from "./components/headerSearch";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header({ session }: { session: any }) {
  const user = session?.user;

  return (
    <div className="bg-gray-50 py-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center gap-4">
          {/* Left Section: Logo and Navigation */}
          <div className="flex items-center gap-8">
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
                  <Link
                    href="/auctions"
                    className="hover:underline flex items-center gap-1"
                  >
                    My Auction
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Center Section: Search */}
          <div className="flex-1 flex justify-center max-w-md">
            <SearchCommand />
          </div>

          {/* Right Section: User Controls */}
          <div className="flex items-center gap-4">
            {user && (
              <UserAvatar
                name={user.name!}
                imageUrl={user.image!}
                email={user.email!}
                userId={user.id!}
              />
            )}

            {/* Desktop Sign In/Out */}
            <div className="hidden md:block">
              {session ? <SignOut /> : <SignIn />}
            </div>

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
