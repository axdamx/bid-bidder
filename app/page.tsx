import { database } from "@/src/db/database";
import ItemCard from "./item-card";

export default async function HomePage() {
  const allItems = await database.query.items.findMany();

  return (
    <main className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">Items For Sale</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {allItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}

// components/AuctionItem.tsx
// "use client";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// // import {
// //   Popover,
// //   PopoverTrigger,
// //   PopoverContent,
// // } from "@/components/ui/popover";
// import Image from "next/image";
// import { useState } from "react";

// const AuctionItem = () => {
//   const [currentBid, setCurrentBid] = useState(150);
//   const [bids, setBids] = useState(15);
//   const [closingTime, setClosingTime] = useState("1d 6h 36m");

//   const handleBid = () => {
//     // Logic to handle the bid
//     setBids(bids + 1);
//     setCurrentBid(currentBid + 10); // Example bid increment
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {/* Back to previous */}
//       <Button variant="link" className="mb-4 text-sm">
//         ← Back to previous
//       </Button>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Image */}
//         <div>
//           <Image
//             src="/path-to-image.jpg" // Replace with Cloudinary URL or actual path
//             alt="Auction Item"
//             width={500}
//             height={500}
//             className="rounded-lg"
//           />
//         </div>

//         {/* Auction Details */}
//         <div>
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-xl">
//                 REBECCA ACKROYD (B. 1987)
//               </CardTitle>
//               <CardDescription className="text-gray-600">
//                 Estimate From <span className="font-bold">$200 - $300</span>
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <h3 className="text-md font-semibold">Auction Details</h3>
//                 <p>Bids: {bids}</p>
//                 <p>
//                   Current Bid: <span className="font-bold">${currentBid}</span>
//                 </p>
//                 <p>Closing: {closingTime}</p>
//               </div>

//               <Button onClick={handleBid} className="w-full">
//                 Place a Bid
//               </Button>
//               <Button variant="outline" className="w-full">
//                 Follow
//               </Button>

//               {/* Product Details */}
//               <div className="space-y-2">
//                 <h3 className="text-md font-semibold">Product Details</h3>
//                 <p>GIDEON APPAH (B. 1987)</p>
//                 <p>Lonely Stallion</p>
//                 <p>Oil and acrylic on canvas</p>
//                 <p>78⅞ x 78⅞ in. (200 x 200.4 cm)</p>
//                 <p>Painted in 2020-2021.</p>
//               </div>

//               {/* Bid History Popover */}
//               {/* <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="link" className="text-sm">
//                     Bid History
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent>
//                   <p>No bids yet</p>
//                 </PopoverContent>
//               </Popover> */}

//               {/* Terms and Conditions */}
//               {/* <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="link" className="text-sm">
//                     Terms and Conditions
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent>
//                   <p>Terms and conditions of the auction...</p>
//                 </PopoverContent>
//               </Popover> */}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuctionItem;
