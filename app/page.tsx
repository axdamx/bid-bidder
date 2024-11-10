import { Suspense } from "react";
import { LiveAuctions } from "./home/components/sections/LiveAuctions";
import { UpcomingAuctions } from "./home/components/sections/UpcomingAuctions";
import { EndedAuctions } from "./home/components/sections/EndedAuctions";
import HeroSection from "./home/components/sections/HeroSection";
import { Footer } from "./footer";

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

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-8 pb-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Live Auctions - Featured Section */}
        <section className="container px-4 md:px-6">
          {/* <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold md:text-3xl">Live Auctions</h2>
          <a href="/auctions" className="text-primary hover:text-primary/80">
            View all →
          </a>
        </div> */}
          <Suspense
            fallback={<LoadingSection message="Loading live auctions..." />}
          >
            <LiveAuctions />
          </Suspense>
        </section>

        {/* Upcoming Auctions - Notable Drops */}
        <section className="container px-4 md:px-6 bg-muted/30 py-12">
          <Suspense
            fallback={<LoadingSection message="Loading upcoming auctions..." />}
          >
            <UpcomingAuctions />
          </Suspense>
        </section>

        {/* Ended Auctions - Trending */}
        <section className="container px-4 md:px-6">
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
            <EndedAuctions />
          </Suspense>
        </section>
      </main>
    </>
  );
}
