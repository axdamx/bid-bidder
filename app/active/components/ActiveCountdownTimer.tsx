"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface ActiveCountdownTimerProps {
  endDate: string;
  onExpire?: () => void;
}

export function ActiveCountdownTimer({
  endDate,
  onExpire = () => {},
}: ActiveCountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference =
        new Date(endDate + "Z").getTime() - new Date().getTime();

      if (difference <= 0) {
        if (!isExpired) {
          setIsExpired(true);
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          onExpire();
        }
        return null;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
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
        {isExpired ? (
          <span className="text-red-500">Auction Ended</span>
        ) : (
          <>
            <span>{formatNumber(timeLeft.hours)}H</span>
            <span>{formatNumber(timeLeft.minutes)}M</span>
            <span>{formatNumber(timeLeft.seconds)}S</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
