// import { getEndedAuctions } from "@/app/action";
// import ItemCard from "@/app/item-card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export async function HeroSection() {
//   return (
//     <section className="bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center h-[600px] text-white">
//       <div className="flex flex-col items-center justify-center h-full text-center">
//         <h1 className="text-4xl font-bold">
//           Join Exclusive Auction & Get The Finest
//         </h1>
//         <div className="mt-4 flex space-x-2">
//           <Input
//             required
//             className="max-w-lg mb-4"
//             name="name"
//             placeholder="Search"
//           />
//           <Button>Search</Button>
//         </div>
//       </div>
//     </section>
//   );
// }
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
        {/* Left content */}
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight">
              Discover the{" "}
              <span className="relative">
                largest
                <span className="absolute bottom-1 left-0 w-full h-[0.2em] bg-red-200 -z-10"></span>
              </span>{" "}
              auction marketplace
              <br />
              with exclusive, rare finds
              <br />
              waiting for your bid
            </h1>
            <p className="text-gray-600 text-lg">
              Unique collectibles and digital assets, all just a bid away
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <Button size="lg" className="bg-red-500 hover:bg-red-600">
              Explore
            </Button>
            <Button variant="ghost" className="gap-2">
              Learn more <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-2xl font-bold text-red-500">50k+</p>
              <p className="text-gray-600">Artwork</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">30k+</p>
              <p className="text-gray-600">Artist</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">20k+</p>
              <p className="text-gray-600">Auction</p>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <div className="w-full max-w-md mx-auto aspect-square rounded-full relative overflow-hidden">
            {/* Stylized background */}
            <div className="absolute inset-0 bg-slate-900">
              {/* Abstract shapes */}
              <div className="absolute inset-0 opacity-80">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-400/40 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-red-500/30 to-transparent rounded-full blur-2xl" />
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
              </div>

              {/* Scattered dots/specs */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-red-400 rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-300 rounded-full" />
                <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-red-200 rounded-full" />
                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/50 rounded-full" />
              </div>
            </div>

            {/* Bid information card */}
            {/* <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white rounded-lg shadow-lg p-4 w-[90%]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="text-sm text-gray-600">@samanthaw</p>
                    <p className="font-medium">Artwork #01</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Bid</p>
                  <p className="font-bold">1.00 ETH</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-red-500 hover:bg-red-600">
                  Bid Now
                </Button>
                <Button variant="outline" className="flex-1">
                  View Artwork
                </Button>
              </div>
            </div> */}
          </div>

          {/* Stats floating at the bottom */}
          {/* <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-8 text-sm">
            <div>
              <p className="text-xl font-bold text-red-500">50k+</p>
              <p className="text-gray-600">Artwork</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-500">30k+</p>
              <p className="text-gray-600">Artist</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-500">20k+</p>
              <p className="text-gray-600">Auction</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
