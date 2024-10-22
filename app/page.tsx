import { database } from "@/src/db/database";
import ItemCard from "./item-card";

// export default async function HomePage() {
//   const allItems = await database.query.items.findMany();

//   return (
//     <main className="container mx-auto py-12">
//       <h2 className="text-2xl font-bold mb-4">Items For Sale</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {allItems.map((item) => (
//           <ItemCard key={item.id} item={item} />
//         ))}
//       </div>
//     </main>
//   );
// }

// pages/index.tsx
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const allItems = await database.query.items.findMany();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center h-[600px] text-white">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl font-bold">
            Join Exclusive Auction & Get The Finest
          </h1>
          <div className="mt-4 flex space-x-2">
            <Input
              required
              className="max-w-lg mb-4"
              name="name"
              placeholder="Search"
            />
            <Button>Search</Button>
          </div>
        </div>
      </section>

      {/* Live Auction Section */}
      <section className="bg-gray-100 py-10">
        <h2 className="text-center text-3xl font-bold mb-6">Live Auction</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          {/* <AuctionCard
            imageUrl="/images/auction1.jpg"
            title="Champagne Diamond & 29.47ct"
            currentBid="$89,000"
            timeLeft="2d 8h 11m"
          />
          <AuctionCard
            imageUrl="/images/auction2.jpg"
            title="Rare Sports Car"
            currentBid="$50,000"
            timeLeft="1d 3h 40m"
          /> */}
          {allItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {/* Add more cards */}
        </div>
      </section>

      {/* Upcoming Auctions Section */}
      <section className="py-10">
        <h2 className="text-center text-3xl font-bold mb-6">
          Upcoming Auctions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          {allItems.slice(0, 2).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Recent Auctions Section */}
      <section className="bg-gray-100 py-10">
        <h2 className="text-center text-3xl font-bold mb-6">Recent Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          {allItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {/* Add more cards */}
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Trusted By 500+ Businesses</h2>
        <div className="flex justify-center space-x-6">
          <Image src="/images/logo1.png" alt="Logo 1" width={100} height={50} />
          <Image src="/images/logo2.png" alt="Logo 2" width={100} height={50} />
          <Image src="/images/logo3.png" alt="Logo 3" width={100} height={50} />
          {/* Add more logos */}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-red-500 text-white py-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Join Us?</h2>
          <p className="mb-4">
            Join the largest marketplace for exclusive auctions and premium
            deals.
          </p>
          <div className="flex justify-center">
            <Input placeholder="Enter your email" className="w-64" />
            <Button className="ml-4 bg-white text-red-500">Sign Up</Button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 BidZone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
