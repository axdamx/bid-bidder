import { Suspense } from "react";
import { LiveAuctions } from "./home/components/sections/LiveAuctions";
import { UpcomingAuctions } from "./home/components/sections/UpcomingAuctions";
import { EndedAuctions } from "./home/components/sections/EndedAuctions";
import { HeroSection } from "./home/components/sections/HeroSection";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Auction Sections */}
      <Suspense fallback={<div>Loading live auctions...</div>}>
        <LiveAuctions />
      </Suspense>

      <Suspense fallback={<div>Loading upcoming auctions...</div>}>
        <UpcomingAuctions />
      </Suspense>

      <Suspense fallback={<div>Loading recent auctions...</div>}>
        <EndedAuctions />
      </Suspense>

      {/* Rest of your sections */}
      {/* <TrustedBySection />
      <JoinUsSection />
      <Footer /> */}
    </div>
  );
}
