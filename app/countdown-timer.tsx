import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

const CountdownTimer = ({ endDate, onExpire = () => {} }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  // Memoize the calculation function to prevent re-creation on every render
  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const targetDate = new Date(endDate).getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (!isExpired) {
        // Only call onExpire once
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
    // Initial calculation
    const initialTimeLeft = calculateTimeLeft();
    if (initialTimeLeft) {
      setTimeLeft(initialTimeLeft);
    }

    // Set up interval only if not expired
    const timer =
      !isExpired &&
      setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        if (newTimeLeft) {
          setTimeLeft(newTimeLeft);
        } else {
          clearInterval(timer);
        }
      }, 1000);

    // Cleanup
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [calculateTimeLeft, isExpired]);

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="flex justify-between p-1 px-4">
        {isExpired ? (
          <div className="w-full text-center text-red-500 font-medium">
            Auction Ended
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="text-2xl font-bold">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <p className="text-sm text-muted-foreground">Days</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <p className="text-sm text-muted-foreground">Hours</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <p className="text-sm text-muted-foreground">Seconds</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
