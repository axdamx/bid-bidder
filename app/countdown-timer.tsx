"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  endDate: string | number | Date;
  onExpire?: () => void;
  className?: string;
}

export default function CountdownTimer({
  endDate,
  onExpire = () => {},
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const targetDate = new Date(endDate).getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (!isExpired) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onExpire();
      }
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }, [endDate, isExpired]);

  useEffect(() => {
    const initialTimeLeft = calculateTimeLeft();
    if (initialTimeLeft) {
      setTimeLeft(initialTimeLeft);
    }

    const timer =
      !isExpired &&
      setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        if (newTimeLeft) {
          setTimeLeft(newTimeLeft);
        } else {
          clearInterval(timer as NodeJS.Timeout);
        }
      }, 1000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [calculateTimeLeft, isExpired]);

  if (isExpired) {
    return (
      <div className="text-sm font-medium text-destructive">Auction Ended</div>
    );
  }

  return (
    <div className={cn("grid grid-cols-4 gap-2 text-center", className)}>
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <span className="text-2xl font-bold tabular-nums">
            {value.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground uppercase">{key}</span>
        </div>
      ))}
    </div>
  );
}
