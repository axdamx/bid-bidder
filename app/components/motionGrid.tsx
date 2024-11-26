"use client";
import { motion } from "framer-motion";

export function MotionGrid({
  children,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 10 },
  transition = { duration: 0.5 },
  className,
}: {
  children: React.ReactNode;
  initial?: Record<string, number>;
  animate?: Record<string, number>;
  transition?: Record<string, number>;
  className?: string;
}) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
