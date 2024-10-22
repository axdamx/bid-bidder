// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { createBidAction } from "./actions";
// import { formatDistance } from "date-fns";
// import { io } from "socket.io-client"; // Import Socket.IO client
// import ItemImage from "./image-component";

// function formatTimestamp(timestamp: Date) {
//   return formatDistance(new Date(timestamp), new Date(), {
//     addSuffix: true,
//   });
// }

// export default function ItemPageClient({
//   item,
//   allBids,
// }: {
//   item: any;
//   allBids: any[];
// }) {
//   const [highestBid, setHighestBid] = useState<number | null>(item.currentBid);
//   const [bids, setBids] = useState(allBids);
//   const [userCount, setUserCount] = useState<number>(0);

//   const handleNewBid = useCallback((newBid: any) => {
//     setHighestBid(newBid.newBid);
//     setBids((prevBids) => [newBid.bidInfo, ...prevBids]);
//   }, []);

//   useEffect(() => {
//     const socket = io("http://localhost:8082", {
//       withCredentials: true, // Ensure credentials are allowed if necessary
//     });

//     socket.on("connect", () => {
//       console.log("Connected to Socket.IO server");
//       socket.emit("joinItem", item.id); // Client joins room
//     });

//     socket.on("newBid", (newBid) => {
//       console.log("Updating bid:", newBid);
//       handleNewBid(newBid);
//     });

//     socket.on("userCount", (count) => {
//       console.log("Connected users count:", count);
//       setUserCount(count);
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected from Socket.IO server");
//     });

//     return () => {
//       socket.emit("leaveItem", item.id); // Optional: Emit leave on unmount
//       socket.disconnect(); // Clean up on unmount
//     };
//   }, [handleNewBid, item.id]);

//   // Update local state when props change (after revalidation)
//   useEffect(() => {
//     setHighestBid(item.currentBid);
//     setBids(allBids);
//   }, [item.currentBid, allBids]);

//   const hasBids = bids.length > 0;

//   return (
//     <main className="container mx-auto py-12">
//       <div className="flex gap-8">
//         <div>
//           <h1 className="text-4xl font-bold mb-4">Auction for: {item.name}</h1>
//           <ItemImage item={item} />
//           <div className="text-xl mt-8 space-y-4">
//             <h1 className="text-2xl font-bold">Current Bid: ${highestBid}</h1>
//             <h1 className="text-2xl font-bold">
//               Starting Price of ${item.startingPrice}
//             </h1>
//             <h1 className="text-2xl font-bold">
//               Bid Interval of ${item.bidInterval}
//             </h1>
//             <h2>Connected users: {userCount}</h2>
//           </div>
//         </div>
//         <div className="space-y-4 flex-1">
//           <div className="flex justify-between">
//             <h2 className="text-2xl font-bold">Current Bids</h2>
//             {hasBids && (
//               // <form onSubmit={handleSubmit}>
//               <form action={createBidAction.bind(null, item.id)}>
//                 <Button> Place A Bid </Button>
//               </form>
//             )}
//           </div>

//           {hasBids ? (
//             <ul className="space-y-4">
//               {bids.map((bid) => (
//                 <li key={bid.id} className="bg-gray-100 rounded-xl p-8">
//                   <div>
//                     <span className="font-bold">${bid.amount}</span> by{" "}
//                     <span className="font-bold">{bid.user.name}</span>{" "}
//                     <span>{formatTimestamp(bid.timestamp)}</span>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="flex flex-col items-center gap-8 bg-gray-100 rounded-xl p-12">
//               <h2 className="text-2xl font-bold"> No Bids Yet! </h2>
//               <form action={createBidAction.bind(null, item.id)}>
//                 <Button> Place A Bid </Button>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//       <h2>
//         Current highest bid: {highestBid ? `$${highestBid}` : "No bids yet"}
//       </h2>
//     </main>
//   );
// }

// components/AuctionItem.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBidAction } from "./actions";
import { formatDistance } from "date-fns";
import { io } from "socket.io-client";
import ItemImage from "./image-component";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Car } from "lucide-react";

function formatTimestamp(timestamp: Date) {
  return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
}

export default function AuctionItem({
  item,
  allBids,
}: {
  item: any;
  allBids: any[];
}) {
  const [highestBid, setHighestBid] = useState<number | null>(item.currentBid);
  const [bids, setBids] = useState(allBids);
  const [userCount, setUserCount] = useState<number>(0);

  const handleNewBid = useCallback((newBid: any) => {
    setHighestBid(newBid.newBid);
    setBids((prevBids) => [newBid.bidInfo, ...prevBids]);
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8082", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socket.emit("joinItem", item.id);
    });

    socket.on("newBid", (newBid) => {
      console.log("Updating bid:", newBid);
      handleNewBid(newBid);
    });

    socket.on("userCount", (count) => {
      console.log("Connected users count:", count);
      setUserCount(count);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.emit("leaveItem", item.id);
      socket.disconnect();
    };
  }, [handleNewBid, item.id]);

  useEffect(() => {
    setHighestBid(item.currentBid);
    setBids(allBids);
  }, [item.currentBid, allBids]);

  const hasBids = bids.length > 0;

  return (
    <div className="container mx-auto py-12">
      {/* Back to previous */}
      <Button variant="link" className="mb-4 text-sm">
        ← Back to previous
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Item Image */}
        <div>
          <ItemImage item={item} />
        </div>

        {/* Auction Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Auction for: {item.name}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Estimate From{" "}
                <span className="font-bold">
                  ${item.startingPrice} - ${item.bidInterval}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-md font-semibold">Auction Details</h3>
                <p>Bids: {bids.length}</p>
                <p>
                  Current Bid: <span className="font-bold">${highestBid}</span>
                </p>
                <p>Starting Price: ${item.startingPrice}</p>
                <p>Connected users: {userCount}</p>
              </div>

              <form action={createBidAction.bind(null, item.id)}>
                <Button className="w-full">Place a Bid</Button>
              </form>

              {/* Product Details */}
              <div className="space-y-2">
                <h3 className="text-md font-semibold">Product Details</h3>
                <p>{item.artist}</p>
                <p>{item.title}</p>
                <p>{item.medium}</p>
                <p>{item.dimensions}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Bottom Section: Bid History Table */}
      <Card className="mt-5">
        <div className="mt-8 w-full px-12">
          <h2 className="text-xl font-bold mb-4">Bid History</h2>
          {hasBids ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left py-2 px-4">
                      Bidder Name
                    </TableHead>
                    <TableHead className="text-left py-2 px-4">
                      Bid Amount
                    </TableHead>
                    <TableHead className="text-left py-2 px-4">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell className="py-2 px-4">
                        {bid.user.name}
                      </TableCell>
                      <TableCell className="py-2 px-4">${bid.amount}</TableCell>
                      <TableCell className="py-2 px-4">
                        {formatTimestamp(bid.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No bids yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
