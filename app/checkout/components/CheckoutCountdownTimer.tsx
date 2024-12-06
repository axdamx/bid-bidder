"use client";

import { useEffect, useRef, useState } from "react";
import { updateOrderStatusToCancelled } from "../[itemId]/actions";

interface CountdownTimerProps {
  createdAt: string;
  orderId: number;
  userId: string;
  onTimerExpired?: () => void;
}

export default function CountdownTimer({
  createdAt,
  orderId,
  userId,
  onTimerExpired,
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const calculateTime = () => {
      const created = new Date(createdAt);
      const deadline = new Date(created.getTime() + 60 * 60 * 1000); // 1 hour after creation
      // const deadline = new Date(created.getTime() + 2 * 60 * 1000); // 2 minutes after creation
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Time expired");
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        // Call the server action to update order status
        updateOrderStatusToCancelled(orderId, userId).catch((error) =>
          console.error("Failed to update order status:", error)
        );
        // Notify parent component that timer has expired
        onTimerExpired?.();
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}m ${seconds}s`);
    };

    calculateTime(); // Initial calculation
    timerRef.current = setInterval(calculateTime, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [createdAt, orderId, userId]);

  if (!timeRemaining) return null;

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-muted-foreground">
        Time remaining to complete order:
      </p>
      <p className="text-lg font-bold text-primary">{timeRemaining}</p>
    </div>
  );
}
