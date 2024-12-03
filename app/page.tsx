"use client";

import { Suspense } from "react";
import { LiveAuctions } from "./home/components/sections/LiveAuctions";
import { UpcomingAuctions } from "./home/components/sections/UpcomingAuctions";
import { EndedAuctions } from "./home/components/sections/EndedAuctions";
import HeroSection from "./home/components/sections/HeroSection";
import { Footer } from "./footer";
import { getEndedAuctions } from "./action";
import { TopBidsClient } from "./home/components/sections/TopSection";
// import { supabase } from "@/lib/utils";
import CategoryCarousell from "./home/components/sections/CategoryCarousell";
import { useAtom } from "jotai";
import { userAtom } from "./atom/userAtom";
import { Gavel, Trophy, Users } from "lucide-react";

function LoadingSection({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center min-h-[200px] w-full">
      <div className="bg-background border border-border rounded-lg shadow-sm p-4 min-w-[200px] text-center">
        <div
          className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// export async function TopBids() {
//   const items = (await getEndedAuctions()).slice(0, 3);

//   return <TopBidsClient initialItems={items} />;
// }

export default function Home() {
  return (
    <>
      <main className="flex flex-col">
        {/* Hero Section */}
        <HeroSection />
        {/* Top Bids Section */}
        {/* <Suspense fallback={<LoadingSection message="Loading top bids..." />}>
          <TopBids />
        </Suspense> */}

        {/* <CategoryCarousell /> */}

        {/* Live Auctions - Featured Section */}
        <section className="w-full px-0 sm:container">
          <div className="w-full">
            <Suspense
              fallback={<LoadingSection message="Loading live auctions..." />}
            >
              <LiveAuctions />
            </Suspense>
          </div>
        </section>

        <section className="border-t bg-muted/50 my-6">
          <div className="container py-12 md:py-24">
            <div className="grid gap-8 md:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    How It Works
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl">
                    Start buying or selling in three simple steps
                  </p>
                </div>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Create an Account</h3>
                  <p className="text-muted-foreground">
                    Sign up for free and join our community of buyers and
                    sellers.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Gavel className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Place Bids</h3>
                  <p className="text-muted-foreground">
                    Browse listings and bid on items you're interested in.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Win & Collect</h3>
                  <p className="text-muted-foreground">
                    Win auctions and receive your items through secure payment
                    method and shipping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Auctions - Notable Drops */}
        {/* <section className="container px-4 md:px-6">
          <Suspense
            fallback={<LoadingSection message="Loading upcoming auctions..." />}
          >
            <UpcomingAuctions />
          </Suspense>
        </section> */}

        {/* Ended Auctions - Trending */}
        <section className="w-full px-0 sm:container mb-6">
          {/* <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Past Auctions</h2>
            <p className="text-muted-foreground mt-1">Recently sold items</p>
          </div>
          <a href="/ended" className="text-primary hover:text-primary/80">
            View all →
          </a>
        </div> */}
          <Suspense
            fallback={<LoadingSection message="Loading ended auctions..." />}
          >
            <EndedAuctions limit={3} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
