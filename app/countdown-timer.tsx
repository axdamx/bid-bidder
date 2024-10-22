import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetDate = new Date(endDate).getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      return true;
    };

    // Calculate immediately
    const isValid = calculateTimeLeft();

    // Only set interval if not expired
    let timer;
    if (isValid) {
      timer = setInterval(calculateTimeLeft, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [endDate]);

  return (
    <Card className="w-full max-w-lg bg-white shadow-sm space-y-2">
      <CardContent className="flex justify-between p-6">
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
