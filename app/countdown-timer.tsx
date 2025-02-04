"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  isOver?: boolean;
}

const AnimatedNumber = ({ value }: { value: number }) => (
  <AnimatePresence mode="popLayout">
    <motion.div
      key={value}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {value.toString().padStart(2, "0")}
    </motion.div>
  </AnimatePresence>
);

export default function CountdownTimer({
  endDate,
  onExpire = () => {},
  className,
  isOver = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (isOver) {
      if (!isExpired) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onExpire();
      }
      return null;
    }

    const now = new Date().getTime();
    // Convert the date string to include the local timezone offset
    const localDate =
      typeof endDate === "string"
        ? endDate.replace(" ", "T") + "+08:00"
        : endDate;
    const targetDate = new Date(localDate).getTime();
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
  }, [endDate, isExpired, isOver]);

  useEffect(() => {
    // If auction is over, immediately expire the timer
    if (isOver) {
      setIsExpired(true);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      onExpire();
      return;
    }

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
  }, [calculateTimeLeft, isExpired, isOver]);

  const timeLeftEntries = useMemo(() => Object.entries(timeLeft), [timeLeft]);

  if (isExpired || isOver) {
    return (
      <div className="text-sm font-medium text-destructive text-center">
        Auction Ended
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-4 gap-2 text-center", className)}>
      {timeLeftEntries.map(([key, value]) => (
        <div key={key} className="flex flex-col items-center">
          <div className="text-2xl font-bold tabular-nums h-10 w-full relative overflow-hidden">
            <AnimatedNumber value={value} />
          </div>
          <span className="text-xs text-muted-foreground uppercase mt-1">
            {key}
          </span>
        </div>
      ))}
    </div>
  );
}
