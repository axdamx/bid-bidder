import SignIn from "@/components/ui/sign-in";
import { SignOut } from "@/components/ui/sign-out";
import Image from "next/image";
import { auth } from "./auth";
import Link from "next/link";
import UserAvatar from "./components/userAvatar";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-4">
      <div className="container flex justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <Image
              src="/renown-high-resolution-logo-transparent.png"
              width="50"
              height="50"
              alt="Logo"
            />
          </Link>

          {session && (
            <div className="flex items-center gap-8">
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
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <UserAvatar
            name={user.name!}
            imageUrl={user.image!}
            email={user.email!}
            userId={user.id!}
          />
          <div className="ml-2">{session ? <SignOut /> : <SignIn />}</div>
        </div>
      </div>
    </div>
  );
}
