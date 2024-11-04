// // // // // import React, { useState, useEffect, useCallback } from "react";
// // // // // import { Card, CardContent } from "@/components/ui/card";

// // // // // const CountdownTimer = ({ endDate, onExpire = () => {} }) => {
// // // // //   const [timeLeft, setTimeLeft] = useState({
// // // // //     days: 0,
// // // // //     hours: 0,
// // // // //     minutes: 0,
// // // // //     seconds: 0,
// // // // //   });
// // // // //   const [isExpired, setIsExpired] = useState(false);

// // // // //   // Memoize the calculation function to prevent re-creation on every render
// // // // //   const calculateTimeLeft = useCallback(() => {
// // // // //     const now = new Date().getTime();
// // // // //     const targetDate = new Date(endDate).getTime();
// // // // //     const difference = targetDate - now;

// // // // //     if (difference <= 0) {
// // // // //       if (!isExpired) {
// // // // //         // Only call onExpire once
// // // // //         setIsExpired(true);
// // // // //         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
// // // // //         onExpire();
// // // // //       }
// // // // //       return null;
// // // // //     }

// // // // //     return {
// // // // //       days: Math.floor(difference / (1000 * 60 * 60 * 24)),
// // // // //       hours: Math.floor(
// // // // //         (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
// // // // //       ),
// // // // //       minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
// // // // //       seconds: Math.floor((difference % (1000 * 60)) / 1000),
// // // // //     };
// // // // //   }, [endDate, isExpired]);

// // // // //   useEffect(() => {
// // // // //     // Initial calculation
// // // // //     const initialTimeLeft = calculateTimeLeft();
// // // // //     if (initialTimeLeft) {
// // // // //       setTimeLeft(initialTimeLeft);
// // // // //     }

// // // // //     // Set up interval only if not expired
// // // // //     const timer =
// // // // //       !isExpired &&
// // // // //       setInterval(() => {
// // // // //         const newTimeLeft = calculateTimeLeft();
// // // // //         if (newTimeLeft) {
// // // // //           setTimeLeft(newTimeLeft);
// // // // //         } else {
// // // // //           clearInterval(timer);
// // // // //         }
// // // // //       }, 1000);

// // // // //     // Cleanup
// // // // //     return () => {
// // // // //       if (timer) {
// // // // //         clearInterval(timer);
// // // // //       }
// // // // //     };
// // // // //   }, [calculateTimeLeft, isExpired]);

// // // // //   return (
// // // // //     <Card className="w-full bg-white shadow-sm">
// // // // //       <CardContent className="flex justify-between p-1 px-4">
// // // // //         {isExpired ? (
// // // // //           <div className="w-full text-center text-red-500 font-medium">
// // // // //             Auction Ended
// // // // //           </div>
// // // // //         ) : (
// // // // //           <>
// // // // //             <div className="text-center">
// // // // //               <span className="text-2xl font-bold">
// // // // //                 {String(timeLeft.days).padStart(2, "0")}
// // // // //               </span>
// // // // //               <p className="text-sm text-muted-foreground">Days</p>
// // // // //             </div>
// // // // //             <div className="text-center">
// // // // //               <span className="text-2xl font-bold">
// // // // //                 {String(timeLeft.hours).padStart(2, "0")}
// // // // //               </span>
// // // // //               <p className="text-sm text-muted-foreground">Hours</p>
// // // // //             </div>
// // // // //             <div className="text-center">
// // // // //               <span className="text-2xl font-bold">
// // // // //                 {String(timeLeft.minutes).padStart(2, "0")}
// // // // //               </span>
// // // // //               <p className="text-sm text-muted-foreground">Minutes</p>
// // // // //             </div>
// // // // //             <div className="text-center">
// // // // //               <span className="text-2xl font-bold">
// // // // //                 {String(timeLeft.seconds).padStart(2, "0")}
// // // // //               </span>
// // // // //               <p className="text-sm text-muted-foreground">Seconds</p>
// // // // //             </div>
// // // // //           </>
// // // // //         )}
// // // // //       </CardContent>
// // // // //     </Card>
// // // // //   );
// // // // // };

// // // // // export default CountdownTimer;

// // // // "use client";

// // // // import React, { useState, useEffect, useCallback } from "react";
// // // // import { Card, CardContent } from "@/components/ui/card";
// // // // import { Separator } from "@/components/ui/separator";
// // // // import { cn } from "@/lib/utils";

// // // // interface TimeLeft {
// // // //   days: number;
// // // //   hours: number;
// // // //   minutes: number;
// // // //   seconds: number;
// // // // }

// // // // interface CountdownTimerProps {
// // // //   endDate: string | number | Date;
// // // //   onExpire?: () => void;
// // // //   className?: string;
// // // // }

// // // // const CountdownTimer: React.FC<CountdownTimerProps> = ({
// // // //   endDate,
// // // //   onExpire = () => {},
// // // //   className,
// // // // }) => {
// // // //   const [timeLeft, setTimeLeft] = useState<TimeLeft>({
// // // //     days: 0,
// // // //     hours: 0,
// // // //     minutes: 0,
// // // //     seconds: 0,
// // // //   });
// // // //   const [isExpired, setIsExpired] = useState(false);

// // // //   const calculateTimeLeft = useCallback(() => {
// // // //     const now = new Date().getTime();
// // // //     const targetDate = new Date(endDate).getTime();
// // // //     const difference = targetDate - now;

// // // //     if (difference <= 0) {
// // // //       if (!isExpired) {
// // // //         setIsExpired(true);
// // // //         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
// // // //         onExpire();
// // // //       }
// // // //       return null;
// // // //     }

// // // //     return {
// // // //       days: Math.floor(difference / (1000 * 60 * 60 * 24)),
// // // //       hours: Math.floor(
// // // //         (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
// // // //       ),
// // // //       minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
// // // //       seconds: Math.floor((difference % (1000 * 60)) / 1000),
// // // //     };
// // // //   }, [endDate, isExpired]);

// // // //   useEffect(() => {
// // // //     const initialTimeLeft = calculateTimeLeft();
// // // //     if (initialTimeLeft) {
// // // //       setTimeLeft(initialTimeLeft);
// // // //     }

// // // //     const timer =
// // // //       !isExpired &&
// // // //       setInterval(() => {
// // // //         const newTimeLeft = calculateTimeLeft();
// // // //         if (newTimeLeft) {
// // // //           setTimeLeft(newTimeLeft);
// // // //         } else {
// // // //           clearInterval(timer);
// // // //         }
// // // //       }, 1000);

// // // //     return () => {
// // // //       if (timer) {
// // // //         clearInterval(timer);
// // // //       }
// // // //     };
// // // //   }, [calculateTimeLeft, isExpired]);

// // // //   const TimeUnit: React.FC<{ value: number; label: string }> = ({
// // // //     value,
// // // //     label,
// // // //   }) => (
// // // //     <div className="flex flex-col items-center">
// // // //       <span className="text-2xl font-bold tabular-nums">
// // // //         {String(value).padStart(2, "0")}
// // // //       </span>
// // // //       <span className="text-xs text-muted-foreground">{label}</span>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <Card className={cn("bg-background", className)}>
// // // //       <CardContent className="p-4">
// // // //         {isExpired ? (
// // // //           <div className="text-center text-destructive font-medium">
// // // //             Auction Ended
// // // //           </div>
// // // //         ) : (
// // // //           <div className="flex justify-between items-center">
// // // //             <TimeUnit value={timeLeft.days} label="Days" />
// // // //             <Separator orientation="vertical" className="h-8" />
// // // //             <TimeUnit value={timeLeft.hours} label="Hours" />
// // // //             <Separator orientation="vertical" className="h-8" />
// // // //             <TimeUnit value={timeLeft.minutes} label="Minutes" />
// // // //             <Separator orientation="vertical" className="h-8" />
// // // //             <TimeUnit value={timeLeft.seconds} label="Seconds" />
// // // //           </div>
// // // //         )}
// // // //       </CardContent>
// // // //     </Card>
// // // //   );
// // // // };

// // // // export default CountdownTimer;

// // // "use client";

// // // import React, { useState, useEffect, useCallback } from "react";
// // // import { cn } from "@/lib/utils";

// // // interface TimeLeft {
// // //   days: number;
// // //   hours: number;
// // //   minutes: number;
// // //   seconds: number;
// // // }

// // // interface CountdownTimerProps {
// // //   endDate: string | number | Date;
// // //   onExpire?: () => void;
// // //   className?: string;
// // // }

// // // const CountdownTimer: React.FC<CountdownTimerProps> = ({
// // //   endDate,
// // //   onExpire = () => {},
// // //   className,
// // // }) => {
// // //   const [timeLeft, setTimeLeft] = useState<TimeLeft>({
// // //     days: 0,
// // //     hours: 0,
// // //     minutes: 0,
// // //     seconds: 0,
// // //   });
// // //   const [isExpired, setIsExpired] = useState(false);

// // //   const calculateTimeLeft = useCallback(() => {
// // //     const now = new Date().getTime();
// // //     const targetDate = new Date(endDate).getTime();
// // //     const difference = targetDate - now;

// // //     if (difference <= 0) {
// // //       if (!isExpired) {
// // //         setIsExpired(true);
// // //         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
// // //         onExpire();
// // //       }
// // //       return null;
// // //     }

// // //     return {
// // //       days: Math.floor(difference / (1000 * 60 * 60 * 24)),
// // //       hours: Math.floor(
// // //         (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
// // //       ),
// // //       minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
// // //       seconds: Math.floor((difference % (1000 * 60)) / 1000),
// // //     };
// // //   }, [endDate, isExpired]);

// // //   useEffect(() => {
// // //     const initialTimeLeft = calculateTimeLeft();
// // //     if (initialTimeLeft) {
// // //       setTimeLeft(initialTimeLeft);
// // //     }

// // //     const timer =
// // //       !isExpired &&
// // //       setInterval(() => {
// // //         const newTimeLeft = calculateTimeLeft();
// // //         if (newTimeLeft) {
// // //           setTimeLeft(newTimeLeft);
// // //         } else {
// // //           clearInterval(timer);
// // //         }
// // //       }, 1000);

// // //     return () => {
// // //       if (timer) {
// // //         clearInterval(timer);
// // //       }
// // //     };
// // //   }, [calculateTimeLeft, isExpired]);

// // //   const TimeUnit: React.FC<{ value: number; label: string }> = ({
// // //     value,
// // //     label,
// // //   }) => (
// // //     <div className="flex flex-col items-center">
// // //       <span className="text-3xl font-semibold tabular-nums tracking-tight">
// // //         {String(value).padStart(2, "0")}
// // //       </span>
// // //       <span className="text-sm text-muted-foreground mt-1">{label}</span>
// // //     </div>
// // //   );

// // //   if (isExpired) {
// // //     return (
// // //       <div className="text-center text-destructive font-medium">
// // //         Auction Ended
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className={cn("flex items-end gap-6 justify-center", className)}>
// // //       <TimeUnit value={timeLeft.days} label="Days" />
// // //       <TimeUnit value={timeLeft.hours} label="Hours" />
// // //       <TimeUnit value={timeLeft.minutes} label="Minutes" />
// // //       <TimeUnit value={timeLeft.seconds} label="Seconds" />
// // //     </div>
// // //   );
// // // };

// // // export default CountdownTimer;

// // "use client";

// // import React, { useState, useEffect, useCallback } from "react";
// // import { cn } from "@/lib/utils";

// // interface TimeLeft {
// //   days: number;
// //   hours: number;
// //   minutes: number;
// //   seconds: number;
// // }

// // interface CountdownTimerProps {
// //   endDate: string | number | Date;
// //   onExpire?: () => void;
// //   className?: string;
// // }

// // const CountdownTimer: React.FC<CountdownTimerProps> = ({
// //   endDate,
// //   onExpire = () => {},
// //   className,
// // }) => {
// //   const [timeLeft, setTimeLeft] = useState<TimeLeft>({
// //     days: 0,
// //     hours: 0,
// //     minutes: 0,
// //     seconds: 0,
// //   });
// //   const [isExpired, setIsExpired] = useState(false);

// //   const calculateTimeLeft = useCallback(() => {
// //     const now = new Date().getTime();
// //     const targetDate = new Date(endDate).getTime();
// //     const difference = targetDate - now;

// //     if (difference <= 0) {
// //       if (!isExpired) {
// //         setIsExpired(true);
// //         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
// //         onExpire();
// //       }
// //       return null;
// //     }

// //     return {
// //       days: Math.floor(difference / (1000 * 60 * 60 * 24)),
// //       hours: Math.floor(
// //         (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
// //       ),
// //       minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
// //       seconds: Math.floor((difference % (1000 * 60)) / 1000),
// //     };
// //   }, [endDate, isExpired]);

// //   useEffect(() => {
// //     const initialTimeLeft = calculateTimeLeft();
// //     if (initialTimeLeft) {
// //       setTimeLeft(initialTimeLeft);
// //     }

// //     const timer =
// //       !isExpired &&
// //       setInterval(() => {
// //         const newTimeLeft = calculateTimeLeft();
// //         if (newTimeLeft) {
// //           setTimeLeft(newTimeLeft);
// //         } else {
// //           clearInterval(timer);
// //         }
// //       }, 1000);

// //     return () => {
// //       if (timer) {
// //         clearInterval(timer);
// //       }
// //     };
// //   }, [calculateTimeLeft, isExpired]);

// //   const TimeUnit: React.FC<{ value: number; label: string }> = ({
// //     value,
// //     label,
// //   }) => (
// //     <div className="flex flex-col items-center">
// //       <span className="text-lg font-semibold tabular-nums tracking-tight">
// //         {String(value).padStart(2, "0")}
// //       </span>
// //       <span className="text-xs text-muted-foreground">{label}</span>
// //     </div>
// //   );

// //   if (isExpired) {
// //     return (
// //       <div className="text-sm text-destructive font-medium">Auction Ended</div>
// //     );
// //   }

// //   return (
// //     <div className={cn("flex items-end gap-2 justify-center", className)}>
// //       <TimeUnit value={timeLeft.days} label="D" />
// //       <TimeUnit value={timeLeft.hours} label="H" />
// //       <TimeUnit value={timeLeft.minutes} label="M" />
// //       <TimeUnit value={timeLeft.seconds} label="S" />
// //     </div>
// //   );
// // };

// // export default CountdownTimer;

// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { cn } from "@/lib/utils";

// interface TimeLeft {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// interface CountdownTimerProps {
//   endDate: string | number | Date;
//   onExpire?: () => void;
//   className?: string;
// }

// const CountdownTimer: React.FC<CountdownTimerProps> = ({
//   endDate,
//   onExpire = () => {},
//   className,
// }) => {
//   const [timeLeft, setTimeLeft] = useState<TimeLeft>({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });
//   const [isExpired, setIsExpired] = useState(false);

//   const calculateTimeLeft = useCallback(() => {
//     const now = new Date().getTime();
//     const targetDate = new Date(endDate).getTime();
//     const difference = targetDate - now;

//     if (difference <= 0) {
//       if (!isExpired) {
//         setIsExpired(true);
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//         onExpire();
//       }
//       return null;
//     }

//     return {
//       days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//       hours: Math.floor(
//         (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       ),
//       minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
//       seconds: Math.floor((difference % (1000 * 60)) / 1000),
//     };
//   }, [endDate, isExpired]);

//   useEffect(() => {
//     const initialTimeLeft = calculateTimeLeft();
//     if (initialTimeLeft) {
//       setTimeLeft(initialTimeLeft);
//     }

//     const timer =
//       !isExpired &&
//       setInterval(() => {
//         const newTimeLeft = calculateTimeLeft();
//         if (newTimeLeft) {
//           setTimeLeft(newTimeLeft);
//         } else {
//           clearInterval(timer);
//         }
//       }, 1000);

//     return () => {
//       if (timer) {
//         clearInterval(timer);
//       }
//     };
//   }, [calculateTimeLeft, isExpired]);

//   const TimeUnit: React.FC<{ value: number; label: string }> = ({
//     value,
//     label,
//   }) => (
//     <div className="flex items-center">
//       <div className="bg-secondary text-secondary-foreground rounded-md px-2 py-1">
//         <span className="text-lg font-semibold tabular-nums tracking-tight">
//           {String(value).padStart(2, "0")}
//         </span>
//       </div>
//       <span className="text-xs text-muted-foreground ml-1">{label}</span>
//     </div>
//   );

//   if (isExpired) {
//     return (
//       <div className="text-sm text-destructive font-medium">Auction Ended</div>
//     );
//   }

//   return (
//     <div className={cn("flex items-center gap-2 justify-end", className)}>
//       <TimeUnit value={timeLeft.days} label="d" />
//       <TimeUnit value={timeLeft.hours} label="h" />
//       <TimeUnit value={timeLeft.minutes} label="m" />
//       <TimeUnit value={timeLeft.seconds} label="s" />
//     </div>
//   );
// };

// export default CountdownTimer;

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

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  onExpire = () => {},
  className,
}) => {
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
          clearInterval(timer);
        }
      }, 1000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [calculateTimeLeft, isExpired]);

  const TimeDigit: React.FC<{ digit: string }> = ({ digit }) => (
    <div className="bg-white rounded-md w-5 h-8 flex items-center justify-center shadow-sm">
      <span className="text-lg tabular-nums">{digit}</span>
    </div>
  );

  const TimeUnit: React.FC<{ value: number; label: string }> = ({
    value,
    label,
  }) => (
    <div className="flex flex-col items-center">
      <div className="flex gap-px">
        <TimeDigit digit={String(value).padStart(2, "0")[0]} />
        <TimeDigit digit={String(value).padStart(2, "0")[1]} />
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );

  if (isExpired) {
    return (
      <div className="text-sm text-destructive font-medium">Auction Ended</div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 justify-end", className)}>
      <TimeUnit value={timeLeft.days} label="DD" />
      <TimeUnit value={timeLeft.hours} label="HH" />
      <TimeUnit value={timeLeft.minutes} label="MM" />
      <TimeUnit value={timeLeft.seconds} label="SS" />
    </div>
  );
};

export default CountdownTimer;
