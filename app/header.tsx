import SignIn from "@/components/ui/sign-in";
import { SignOut } from "@/components/ui/sign-out";
import Image from "next/image";
import { auth } from "./auth";
import Link from "next/link";

export async function Header() {
  const session = await auth();

  return (
    <div className="bg-gray-50 py-4">
      <div className="container flex justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <Image src="/public/next.svg" width="50" height="50" alt="Logo" />
            All Auction
          </Link>

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
        </div>

        <div className="flex items-center gap-4">
          <div>{session?.user?.name}</div>
          <div>{session ? <SignOut /> : <SignIn />}</div>
        </div>
      </div>
    </div>
  );
}
