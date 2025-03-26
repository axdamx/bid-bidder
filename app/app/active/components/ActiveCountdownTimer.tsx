"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ActiveCountdownTimerProps {
  endDate: string;
  onExpire?: () => void;
  status?: string;
}

export function ActiveCountdownTimer({
  endDate,
  onExpire = () => {},
  status,
}: ActiveCountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        if (!isExpired) {
          setIsExpired(true);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          onExpire();
        }
        return null;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [endDate, isExpired, onExpire]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center space-x-1 text-sm font-medium"
      >
        {status !== "LIVE" ? (
          <span className="text-red-500">Auction Ended</span>
        ) : isExpired ? (
          <span className="text-red-500">Auction Ended</span>
        ) : (
          <>
            <span>{formatNumber(timeLeft.days)}D</span>
            <span>{formatNumber(timeLeft.hours)}H</span>
            <span>{formatNumber(timeLeft.minutes)}M</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
