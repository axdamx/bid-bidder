// // "use client";

// // import { useState, useEffect, useCallback } from "react";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { createBidAction, updateItemStatus } from "./actions";
// // import { formatDistance } from "date-fns";
// // import { io } from "socket.io-client";
// // import ItemImage from "./image-component";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import CountdownTimer from "@/app/countdown-timer";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { AlertCircle, Trophy } from "lucide-react";
// // import toast, { Toaster } from "react-hot-toast";
// // import { database } from "@/src/db/database";
// // import { eq } from "drizzle-orm";
// // import { users } from "@/src/db/schema";
// // import Link from "next/link";

// // function formatTimestamp(timestamp: Date) {
// //   return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
// // }

// // export default function AuctionItem({
// //   item,
// //   allBids,
// //   userId,
// // }: {
// //   item: any;
// //   allBids: any[];
// //   userId: string;
// // }) {
// //   const [highestBid, setHighestBid] = useState<number | null>(item.currentBid);
// //   const [bids, setBids] = useState(allBids);
// //   const [userCount, setUserCount] = useState<number>(0);
// //   const [showWinnerModal, setShowWinnerModal] = useState(false);

// //   const handleNewBid = useCallback((newBid: any) => {
// //     setHighestBid(newBid.newBid);
// //     setBids((prevBids) => [newBid.bidInfo, ...prevBids]);
// //   }, []);

// //   const handleAuctionEnd = useCallback(() => {
// //     setShowWinnerModal(true);
// //   }, []);

// //   const latestBidderName = bids.length > 0 && bids[0].user.name;
// //   const isWinner = bids.length > 0 && bids[0].userId === userId;

// //   useEffect(() => {
// //     const socket = io("http://localhost:8082", {
// //       withCredentials: true,
// //     });

// //     socket.on("connect", () => {
// //       console.log("Connected to Socket.IO server");
// //       socket.emit("joinItem", item.id);
// //     });

// //     socket.on("newBid", (newBid) => {
// //       console.log("Updating bid:", newBid);
// //       handleNewBid(newBid);
// //     });

// //     socket.on("userCount", (count) => {
// //       console.log("Connected users count:", count);
// //       setUserCount(count);
// //     });

// //     socket.on("disconnect", () => {
// //       console.log("Disconnected from Socket.IO server");
// //     });

// //     return () => {
// //       socket.emit("leaveItem", item.id);
// //       socket.disconnect();
// //     };
// //   }, [handleNewBid, item.id]);

// //   useEffect(() => {
// //     setHighestBid(item.currentBid);
// //     setBids(allBids);
// //   }, [item.currentBid, allBids]);

// //   const hasBids = bids.length > 0;
// //   const isBidOver = item.endDate < new Date();

// //   console.log("tem", item);
// //   // const notify = () =>
// //   //   toast(`You've succesfully bid ${item.currentBid + item.bidInterval}!`);
// //   function formatCurrency(value) {
// //     const absValue = Math.abs(value);
// //     let formattedValue;

// //     if (absValue >= 1e6) {
// //       // Use the raw value divided by 1e6, and ensure it retains two decimal places
// //       formattedValue = (value / 1e6).toFixed(2) + "M"; // Millions
// //     } else if (absValue >= 1e3) {
// //       // Thousands
// //       formattedValue = (value / 1e3).toFixed(2) + "K";
// //     } else {
// //       // Less than thousand
// //       formattedValue = value.toFixed(2);
// //     }

// //     return `${formattedValue} MYR`;
// //   }
// //   const WinnerDialog = () => {
// //     return (
// //       <>
// //         <DialogTitle className="flex items-center gap-2">
// //           <Trophy className="w-6 h-6 text-yellow-500" />
// //           Congratulations! You Won!
// //         </DialogTitle>
// //         <DialogDescription className="space-y-4">
// //           <div className="p-4 bg-green-50 rounded-lg mt-4 text-center">
// //             <h1 className="font-medium text-green-700">
// //               Youve won this auction!
// //             </h1>
// //             <h1 className="text-sm text-green-600 mt-2">
// //               You won {item.name} with a final bid of ${item.currentBid}
// //             </h1>
// //             <h1 className="text-sm text-green-600 mt-2">
// //               The seller will contact you soon with payment and delivery
// //               details.
// //             </h1>
// //             <form action={async () => await updateItemStatus(item.id, userId)}>
// //               <Button type="submit" className="mt-8">
// //                 Proceed to Checkout
// //               </Button>
// //             </form>
// //           </div>
// //         </DialogDescription>
// //       </>
// //     );
// //   };

// //   const LoserDialog = () => {
// //     return (
// //       <>
// //         <DialogTitle className="flex items-center gap-2">
// //           <AlertCircle className="w-6 h-6 text-blue-500" />
// //           Auction Ended
// //         </DialogTitle>
// //         <DialogDescription className="space-y-4">
// //           <div className="p-4 bg-blue-50 rounded-lg mt-4 text-center">
// //             <h1 className="font-medium text-blue-700">
// //               This auction has ended
// //             </h1>
// //             <h1 className="text-sm text-blue-600 mt-2">
// //               The winning bid was ${item.currentBid} by {latestBidderName}
// //             </h1>
// //             <h1 className="text-sm text-blue-600 mt-2">
// //               Better luck next time! Check out our other active auctions.
// //             </h1>
// //           </div>
// //         </DialogDescription>
// //       </>
// //     );
// //   };

// //   return (
// //     <div className="container mx-auto py-12">
// //       {/* Back to previous */}
// //       {/* <Button variant="link" className="mb-4 text-sm">
// //         ← Back to previous
// //       </Button> */}
// //       <Toaster position="bottom-right" reverseOrder={false} />

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //         {/* Item Image */}
// //         <div>
// //           <ItemImage item={item} />
// //         </div>

// //         {/* Auction Details */}
// //         <div>
// //           <Card>
// //             <CardHeader>
// //               <div className="space-y-2">
// //                 <Card className="mb-4">
// //                   <CardHeader>
// //                     <CardTitle className="text-xl">
// //                       Created by:{" "}
// //                       <Link
// //                         href={`/profile/${item.itemWithUser.id}`}
// //                         className="hover:underline flex items-center gap-1"
// //                       >
// //                         {item.itemWithUser.name}
// //                       </Link>
// //                     </CardTitle>
// //                   </CardHeader>
// //                 </Card>
// //               </div>
// //               <CardTitle className="text-xl">
// //                 Auction for: {item.name}
// //               </CardTitle>
// //               {isWinner && (
// //                 <CardDescription className="text-gray-600">
// //                   You are currently winning this bid!
// //                 </CardDescription>
// //               )}
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               <div className="space-y-2">
// //                 <h3 className="text-md font-semibold">Auction Details</h3>
// //                 <p>Bids: {bids.length}</p>
// //                 <p>
// //                   Current Bid:{" "}
// //                   <span className="font-bold">
// //                     {formatCurrency(highestBid)}
// //                   </span>
// //                 </p>
// //                 <p>Starting Price: {formatCurrency(item.startingPrice)}</p>
// //                 <p>
// //                   Bid Interval:{" "}
// //                   <span className="font-bold">
// //                     {formatCurrency(item.bidInterval)}
// //                   </span>
// //                 </p>
// //                 <p>Details: {item.description}</p>
// //                 <p>Connected users: {userCount}</p>
// //               </div>

// //               {!isBidOver && (
// //                 <form action={createBidAction.bind(null, item.id)}>
// //                   <Button className="w-full" disabled={isWinner}>
// //                     {isWinner
// //                       ? "You are currently winning this bid!"
// //                       : "Place Bid"}
// //                   </Button>
// //                 </form>
// //               )}

// //               {/* Product Details */}
// //               <div className="space-y-2">
// //                 <CountdownTimer
// //                   endDate={item.endDate}
// //                   onExpire={handleAuctionEnd}
// //                 />
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Dialog Modal */}
// //         <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
// //           <DialogContent className="sm:max-w-md">
// //             <DialogHeader>
// //               {isWinner ? <WinnerDialog /> : <LoserDialog />}
// //               <div className="flex justify-end mt-4">
// //                 <Button
// //                   onClick={() => setShowWinnerModal(false)}
// //                   className="mt-2"
// //                 >
// //                   Close
// //                 </Button>
// //               </div>
// //             </DialogHeader>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       {/* Bottom Section: Bid History Table */}
// //       <Card className="mt-5">
// //         <div className="mt-8 mb-8 w-full px-12">
// //           <h2 className="text-xl font-bold mb-4">Bid History</h2>
// //           {hasBids ? (
// //             <div className="overflow-x-auto">
// //               <Table className="min-w-full">
// //                 <TableHeader>
// //                   <TableRow>
// //                     <TableHead className="text-left py-2 px-4">
// //                       Bidder Name
// //                     </TableHead>
// //                     <TableHead className="text-left py-2 px-4">
// //                       Bid Amount
// //                     </TableHead>
// //                     <TableHead className="text-left py-2 px-4">Time</TableHead>
// //                   </TableRow>
// //                 </TableHeader>
// //                 <TableBody>
// //                   {bids.slice(0, 10).map((bid) => (
// //                     <TableRow key={bid.id}>
// //                       <TableCell className="py-2 px-4">
// //                         {bid.user.name}
// //                       </TableCell>
// //                       <TableCell className="py-2 px-4">
// //                         {formatCurrency(bid.amount)}
// //                       </TableCell>
// //                       <TableCell className="py-2 px-4">
// //                         {formatTimestamp(bid.timestamp)}
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //           ) : (
// //             <p>No bids yet.</p>
// //           )}
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { createBidAction, updateItemStatus } from "./actions";
// import { formatDistance } from "date-fns";
// import { io } from "socket.io-client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import CountdownTimer from "@/app/countdown-timer";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertCircle,
//   Trophy,
//   ChevronLeft,
//   ChevronRight,
//   User,
// } from "lucide-react";
// import { Toaster } from "react-hot-toast";
// import Link from "next/link";

// function formatTimestamp(timestamp: Date) {
//   return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
// }

// function formatCurrency(value: number) {
//   const absValue = Math.abs(value);
//   let formattedValue;

//   if (absValue >= 1e6) {
//     formattedValue = (value / 1e6).toFixed(2) + "M";
//   } else if (absValue >= 1e3) {
//     formattedValue = (value / 1e3).toFixed(2) + "K";
//   } else {
//     formattedValue = value.toFixed(2);
//   }

//   return `${formattedValue} MYR`;
// }

// export default function AuctionItem({
//   item,
//   allBids,
//   userId,
// }: {
//   item: any;
//   allBids: any[];
//   userId: string;
// }) {
//   const [highestBid, setHighestBid] = useState<number | null>(item.currentBid);
//   const [bids, setBids] = useState(allBids);
//   const [userCount, setUserCount] = useState<number>(0);
//   const [showWinnerModal, setShowWinnerModal] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const handleNewBid = useCallback((newBid: any) => {
//     setHighestBid(newBid.newBid);
//     setBids((prevBids) => [newBid.bidInfo, ...prevBids]);
//   }, []);

//   const handleAuctionEnd = useCallback(() => {
//     setShowWinnerModal(true);
//   }, []);

//   const latestBidderName = bids.length > 0 && bids[0].user.name;
//   const isWinner = bids.length > 0 && bids[0].userId === userId;

//   useEffect(() => {
//     const socket = io("http://localhost:8082", {
//       withCredentials: true,
//     });

//     socket.on("connect", () => {
//       console.log("Connected to Socket.IO server");
//       socket.emit("joinItem", item.id);
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
//       socket.emit("leaveItem", item.id);
//       socket.disconnect();
//     };
//   }, [handleNewBid, item.id]);

//   useEffect(() => {
//     setHighestBid(item.currentBid);
//     setBids(allBids);
//   }, [item.currentBid, allBids]);

//   const hasBids = bids.length > 0;
//   const isBidOver = item.endDate < new Date();

//   // Mock image URLs for the carousel
//   const mockImages = [
//     "/placeholder.svg?height=400&width=600",
//     "/placeholder.svg?height=400&width=600",
//     "/placeholder.svg?height=400&width=600",
//   ];

//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mockImages.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex(
//       (prevIndex) => (prevIndex - 1 + mockImages.length) % mockImages.length
//     );
//   };

//   const WinnerDialog = () => (
//     <>
//       <DialogTitle className="flex items-center gap-2">
//         <Trophy className="w-6 h-6 text-yellow-500" />
//         Congratulations! You Won!
//       </DialogTitle>
//       <DialogDescription className="space-y-4">
//         <div className="p-4 bg-green-50 rounded-lg mt-4 text-center">
//           <h1 className="font-medium text-green-700">
//             You've won this auction!
//           </h1>
//           <h1 className="text-sm text-green-600 mt-2">
//             You won {item.name} with a final bid of{" "}
//             {formatCurrency(item.currentBid)}
//           </h1>
//           <h1 className="text-sm text-green-600 mt-2">
//             The seller will contact you soon with payment and delivery details.
//           </h1>
//           <form action={async () => await updateItemStatus(item.id, userId)}>
//             <Button type="submit" className="mt-8">
//               Proceed to Checkout
//             </Button>
//           </form>
//         </div>
//       </DialogDescription>
//     </>
//   );

//   const LoserDialog = () => (
//     <>
//       <DialogTitle className="flex items-center gap-2">
//         <AlertCircle className="w-6 h-6 text-blue-500" />
//         Auction Ended
//       </DialogTitle>
//       <DialogDescription className="space-y-4">
//         <div className="p-4 bg-blue-50 rounded-lg mt-4 text-center">
//           <h1 className="font-medium text-blue-700">This auction has ended</h1>
//           <h1 className="text-sm text-blue-600 mt-2">
//             The winning bid was {formatCurrency(item.currentBid)} by{" "}
//             {latestBidderName}
//           </h1>
//           <h1 className="text-sm text-blue-600 mt-2">
//             Better luck next time! Check out our other active auctions.
//           </h1>
//         </div>
//       </DialogDescription>
//     </>
//   );

//   return (
//     <div className="container mx-auto py-12">
//       <Toaster position="bottom-right" reverseOrder={false} />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Item Image Carousel */}
//         <div className="relative">
//           <div className="overflow-hidden rounded-lg shadow-lg">
//             <img
//               src={mockImages[currentImageIndex]}
//               alt={`Item image ${currentImageIndex + 1}`}
//               className="w-full h-[400px] object-cover"
//             />
//           </div>
//           <Button
//             variant="outline"
//             size="icon"
//             className="absolute top-1/2 left-4 transform -translate-y-1/2"
//             onClick={prevImage}
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="absolute top-1/2 right-4 transform -translate-y-1/2"
//             onClick={nextImage}
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>

//         {/* Auction Details */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold">{item.name}</CardTitle>
//               <CardDescription className="text-lg">
//                 Created by:{" "}
//                 <Link
//                   href={`/profile/${item.itemWithUser.id}`}
//                   className="hover:underline flex items-center gap-1"
//                 >
//                   <User className="h-4 w-4" />
//                   {item.itemWithUser.name}
//                 </Link>
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Current Bid</p>
//                   <p className="text-2xl font-bold">
//                     {formatCurrency(highestBid)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Bid Interval</p>
//                   <p className="text-lg">{formatCurrency(item.bidInterval)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     Starting Price
//                   </p>
//                   <p className="text-lg">
//                     {formatCurrency(item.startingPrice)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Bids</p>
//                   <p className="text-lg">{bids.length}</p>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">Description</h3>
//                 <p className="text-muted-foreground">{item.description}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">
//                   Connected users: {userCount}
//                 </p>
//               </div>
//               <CountdownTimer
//                 endDate={item.endDate}
//                 onExpire={handleAuctionEnd}
//               />
//               {!isBidOver && (
//                 <form action={createBidAction.bind(null, item.id)}>
//                   <Button className="w-full" disabled={isWinner}>
//                     {isWinner
//                       ? "You are currently winning this bid!"
//                       : "Place Bid"}
//                   </Button>
//                 </form>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Bid History Table */}
//       <Card className="mt-8">
//         <CardHeader>
//           <CardTitle>Bid History</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {hasBids ? (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Bidder Name</TableHead>
//                     <TableHead>Bid Amount</TableHead>
//                     <TableHead>Time</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {bids.slice(0, 10).map((bid) => (
//                     <TableRow key={bid.id}>
//                       <TableCell>{bid.user.name}</TableCell>
//                       <TableCell>{formatCurrency(bid.amount)}</TableCell>
//                       <TableCell>{formatTimestamp(bid.timestamp)}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           ) : (
//             <p>No bids yet.</p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Winner/Loser Dialog */}
//       <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             {isWinner ? <WinnerDialog /> : <LoserDialog />}
//           </DialogHeader>
//           <div className="flex justify-end mt-4">
//             <Button onClick={() => setShowWinnerModal(false)} className="mt-2">
//               Close
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBidAction, updateItemStatus } from "./actions";
import { formatDistance } from "date-fns";
import { io } from "socket.io-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CountdownTimer from "@/app/countdown-timer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Trophy,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ItemImage from "./image-component";
import { CldImage } from "next-cloudinary";

function formatTimestamp(timestamp: Date) {
  return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
}

function formatCurrency(value: number) {
  const absValue = Math.abs(value);
  let formattedValue;

  if (absValue >= 1e6) {
    formattedValue = (value / 1e6).toFixed(2) + "M";
  } else if (absValue >= 1e3) {
    formattedValue = (value / 1e3).toFixed(2) + "K";
  } else {
    formattedValue = value.toFixed(2);
  }

  return `${formattedValue} MYR`;
}

export default function AuctionItem({
  item,
  allBids,
  userId,
}: {
  item: any;
  allBids: any[];
  userId: string;
}) {
  const [highestBid, setHighestBid] = useState<number | null>(item.currentBid);
  const [bids, setBids] = useState(allBids);
  const [userCount, setUserCount] = useState<number>(0);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock multiple images for the gallery
  const mockImages = [
    item.imageId,
    item.imageId,
    item.imageId,
    item.imageId,
    item.imageId,
  ];

  const prevUserCountRef = useRef(0);

  const handleNewBid = useCallback((newBid: any) => {
    setHighestBid(newBid.newBid);
    setBids((prevBids) => [newBid.bidInfo, ...prevBids]);
    toast(
      `New bid: ${formatCurrency(newBid.newBid)} by ${newBid.bidInfo.user.name}`
    );
  }, []);

  const handleAuctionEnd = useCallback(() => {
    setShowWinnerModal(true);
  }, []);

  const latestBidderName = bids.length > 0 && bids[0].user.name;
  const isWinner = bids.length > 0 && bids[0].userId === userId;

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
      // Show toast notification when a new user enters
      // if (count > prevUserCountRef.current) {
      //   toast("A new user has joined the auction");
      // }

      // // Update the ref and state
      // prevUserCountRef.current = count;
      // setUserCount(count);
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
  const isBidOver = item.endDate < new Date();

  const WinnerDialog = () => (
    <>
      <DialogTitle className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Congratulations! You Won!
      </DialogTitle>
      <DialogDescription className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg mt-4 text-center">
          <h1 className="font-medium text-green-700">
            You've won this auction!
          </h1>
          <h1 className="text-sm text-green-600 mt-2">
            You won {item.name} with a final bid of{" "}
            {formatCurrency(item.currentBid)}
          </h1>
          <h1 className="text-sm text-green-600 mt-2">
            The seller will contact you soon with payment and delivery details.
          </h1>
          <form action={async () => await updateItemStatus(item.id, userId)}>
            <Button type="submit" className="mt-8">
              Proceed to Checkout
            </Button>
          </form>
        </div>
      </DialogDescription>
    </>
  );

  const LoserDialog = () => (
    <>
      <DialogTitle className="flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-blue-500" />
        Auction Ended
      </DialogTitle>
      <DialogDescription className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg mt-4 text-center">
          <h1 className="font-medium text-blue-700">This auction has ended</h1>
          <h1 className="text-sm text-blue-600 mt-2">
            The winning bid was {formatCurrency(item.currentBid)} by{" "}
            {latestBidderName}
          </h1>
          <h1 className="text-sm text-blue-600 mt-2">
            Better luck next time! Check out our other active auctions.
          </h1>
        </div>
      </DialogDescription>
    </>
  );

  return (
    <div className="container mx-auto py-12">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-square">
            {/* <ItemImage item={item} /> */}
            {/* <img
              src={mockImages[selectedImage]}
              alt={`${item.name} - View ${selectedImage + 1}`}
              className="w-full h-full object-cover rounded-lg"
            /> */}
            <CldImage
              width="460"
              height="400"
              src={item.imageId}
              alt="Description of my image"
              // className="rounded-xl gap-8" // Ensure the image covers the content area
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-4 right-4 space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSelectedImage(
                    (prev) => (prev - 1 + mockImages.length) % mockImages.length
                  )
                }
                className="bg-background/80 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSelectedImage((prev) => (prev + 1) % mockImages.length)
                }
                className="bg-background/80 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {mockImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md",
                  selectedImage === index && "ring-2 ring-primary"
                )}
              >
                {/* <img
                  src={image}
                  alt={`${item.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                /> */}
                <CldImage
                  width="460"
                  height="400"
                  src={image}
                  alt="Description of my image"
                  // className="rounded-xl gap-8" // Ensure the image covers the content area
                  // className="w-full h-full object-cover rounded-lg"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Auction Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-2xl font-bold">{item.name}</CardTitle>
              <CardDescription className="text-lg">
                Created by:{" "}
                <Link
                  href={`/profile/${item.itemWithUser.id}`}
                  className="hover:underline flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  {item.itemWithUser.name}
                </Link>
              </CardDescription> */}
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">
                  {item.name}
                </CardTitle>
                <CountdownTimer
                  endDate={item.endDate}
                  onExpire={handleAuctionEnd}
                  className="text-sm"
                />
              </div>
              <CardDescription className="text-lg">
                Created by:{" "}
                <Link
                  href={`/profile/${item.itemWithUser.id}`}
                  className="hover:underline flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  {item.itemWithUser.name}
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Bid</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(highestBid)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bid Interval</p>
                  <p className="text-lg">{formatCurrency(item.bidInterval)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Starting Price
                  </p>
                  <p className="text-lg">
                    {formatCurrency(item.startingPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bids</p>
                  <p className="text-lg">{bids.length}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Connected users: {userCount}
                </p>
              </div>
              {/* <CountdownTimer
                endDate={item.endDate}
                onExpire={handleAuctionEnd}
              /> */}
              {!isBidOver && (
                <form action={createBidAction.bind(null, item.id)}>
                  <Button className="w-full" disabled={isWinner}>
                    {isWinner
                      ? "You are currently winning this bid!"
                      : "Place Bid"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bid History Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Bid History</CardTitle>
        </CardHeader>
        <CardContent>
          {hasBids ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bidder Name</TableHead>
                    <TableHead>Bid Amount</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids.slice(0, 10).map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell>{bid.user.name}</TableCell>
                      <TableCell>{formatCurrency(bid.amount)}</TableCell>
                      <TableCell>{formatTimestamp(bid.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No bids yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Winner/Loser Dialog */}
      <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {isWinner ? <WinnerDialog /> : <LoserDialog />}
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowWinnerModal(false)} className="mt-2">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
