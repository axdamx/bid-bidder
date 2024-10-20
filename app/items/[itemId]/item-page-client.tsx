"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { createBidAction } from "./actions";
import { formatDistance } from "date-fns";
import { useRouter } from "next/navigation";

function formatTimestamp(timestamp: Date) {
  return formatDistance(new Date(timestamp), new Date(), {
    addSuffix: true,
  });
}

export default function ItemPageClient({
  item,
  allBids,
}: {
  item: any;
  allBids: any[];
}) {
  const [highestBid, setHighestBid] = useState<number | null>(item.currentBid);
  const [bids, setBids] = useState(allBids);
  const [userCount, setUserCount] = useState<number>(0);
  const router = useRouter();

  const handleNewBid = useCallback((newBid: any) => {
    setHighestBid(newBid.newBid);
    setBids((prevBids) => [newBid.bidInfo, ...prevBids]);
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8082");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      console.log("Raw data:", event.data);
      const message = JSON.parse(event.data);
      console.log("Parsed message:", message);
      //   const message = JSON.parse(event.data);
      console.log("Received message:", message);

      if (message.type === "newBid" && message.itemId === item.id) {
        console.log("Updating bid:", message);
        handleNewBid(message);
      }

      if (message.type === "userCount") {
        setUserCount(message.count);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [item.id, router]);

  // Update local state when props change (after revalidation)
  useEffect(() => {
    setHighestBid(item.currentBid);
    setBids(allBids);
  }, [item.currentBid, allBids]);

  const hasBids = bids.length > 0;

  return (
    <main className="container mx-auto py-12">
      <div className="flex gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Auction for: {item.name}</h1>
          <div className="text-xl mt-8 space-y-4">
            <h1 className="text-2xl font-bold">Current Bid: ${highestBid}</h1>
            <h1 className="text-2xl font-bold">
              Starting Price of ${item.startingPrice}
            </h1>
            <h1 className="text-2xl font-bold">
              Bid Interval of ${item.bidInterval}
            </h1>
            <h2>Connected users: {userCount}</h2>
          </div>
        </div>
        <div className="space-y-4 flex-1">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Current Bids</h2>
            {hasBids && (
              <form action={createBidAction.bind(null, item.id)}>
                <Button> Place A Bid </Button>
              </form>
            )}
          </div>

          {hasBids ? (
            <ul className="space-y-4">
              {bids.map((bid) => (
                <li key={bid.id} className="bg-gray-100 rounded-xl p-8">
                  <div>
                    <span className="font-bold">${bid.amount}</span> by{" "}
                    <span className="font-bold">{bid.user.name}</span>{" "}
                    <span>{formatTimestamp(bid.timestamp)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-8 bg-gray-100 rounded-xl p-12">
              <h2 className="text-2xl font-bold"> No Bids Yet! </h2>
              <form action={createBidAction.bind(null, item.id)}>
                <Button> Place A Bid </Button>
              </form>
            </div>
          )}
        </div>
      </div>
      <h2>
        Current highest bid: {highestBid ? `$${highestBid}` : "No bids yet"}
      </h2>
    </main>
  );
}
