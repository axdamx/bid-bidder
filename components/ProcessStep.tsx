"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ProcessStepProps {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  icon: Icon,
  step,
  title,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: step * 0.2, duration: 0.5 }}
      className="relative"
    >
      {/* Connecting line - positioned to connect steps properly */}
      {step < 4 && (
        <motion.div
          className="hidden md:block absolute top-12 w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-primary/30 to-primary/0 z-0"
          initial={{ scaleX: 0, opacity: 0.7 }}
          // whileInView={{ scaleX: 1, opacity: 0 }}
          transition={{ delay: step * 0.2 + 0.5, duration: 0.8 }}
          style={{
            transformOrigin: "left",
            right: "-3rem",
            left: "6rem", // Adjusted to align properly with the icon
          }}
        />
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center flex-shrink-0 relative shadow-md"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse-soft"></div>
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-sm font-bold shadow-lg"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{
              delay: step * 0.2 + 0.3,
              type: "spring",
              stiffness: 500,
            }}
          >
            {step}
          </motion.div>
          <motion.div
            initial={{ rotateY: 90 }}
            whileInView={{ rotateY: 0 }}
            transition={{ delay: step * 0.2 + 0.4, duration: 0.5 }}
          >
            <Icon className="h-10 w-10 text-primary drop-shadow-md" />
          </motion.div>
        </motion.div>

        <div className="max-w-md">
          <motion.h3
            className="text-xl font-display font-semibold mb-2 text-primary"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: step * 0.2 + 0.5, duration: 0.3 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-auction-600"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: step * 0.2 + 0.6, duration: 0.3 }}
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessStep;
