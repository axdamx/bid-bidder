// import { Suspense } from "react";
// import { LiveAuctions } from "./home/components/sections/LiveAuctions";
// import { UpcomingAuctions } from "./home/components/sections/UpcomingAuctions";
// import { EndedAuctions } from "./home/components/sections/EndedAuctions";
// import { HeroSection } from "./home/components/sections/HeroSection";

// export default function Home() {
//   return (
//     <div>
//       {/* Hero Section */}
//       <HeroSection />

//       {/* Auction Sections */}
//       <Suspense fallback={<div>Loading live auctions...</div>}>
//         <LiveAuctions />
//       </Suspense>

//       <Suspense fallback={<div>Loading upcoming auctions...</div>}>
//         <UpcomingAuctions />
//       </Suspense>

//       <Suspense fallback={<div>Loading recent auctions...</div>}>
//         <EndedAuctions />
//       </Suspense>

//       {/* Rest of your sections */}
//       {/* <TrustedBySection />
//       <JoinUsSection />
//       <Footer /> */}
//     </div>
//   );
// }

import { Suspense } from "react";
import { LiveAuctions } from "./home/components/sections/LiveAuctions";
import { UpcomingAuctions } from "./home/components/sections/UpcomingAuctions";
import { EndedAuctions } from "./home/components/sections/EndedAuctions";
import HeroSection from "./home/components/sections/HeroSection";
// import { HeroSection } from "./home/components/sections/HeroSection";

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
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Auction Sections */}
      <section>
        {/* <h2 className="text-2xl font-bold mb-4">Live Auctions</h2> */}
        <Suspense
          fallback={<LoadingSection message="Loading live auctions..." />}
        >
          <LiveAuctions />
        </Suspense>
      </section>

      <section>
        {/* <h2 className="text-2xl font-bold mb-4">Upcoming Auctions</h2> */}
        <Suspense
          fallback={<LoadingSection message="Loading upcoming auctions..." />}
        >
          <UpcomingAuctions />
        </Suspense>
      </section>

      <section>
        {/* <h2 className="text-2xl font-bold mb-4">Ended Auctions</h2> */}
        <Suspense
          fallback={<LoadingSection message="Loading ended auctions..." />}
        >
          <EndedAuctions />
        </Suspense>
      </section>

      {/* Rest of your sections */}
      {/* <TrustedBySection />
      <JoinUsSection />
      <Footer /> */}
    </div>
  );
}
