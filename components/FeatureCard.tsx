"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0
}) => {
  return (
    <motion.div 
      className="glass-card rounded-xl p-6 shadow-md overflow-hidden relative transition-all duration-200 cursor-default"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: delay * 0.001, duration: 0.5 }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="bg-gradient-to-br from-primary/10 to-transparent w-24 h-24 rounded-full absolute -top-8 -right-8 opacity-50"></div>
      
      <div className="relative z-10">
        <motion.div 
          className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: delay * 0.001 + 0.2, duration: 0.3 }}
        >
          <Icon className="h-6 w-6 text-primary" />
        </motion.div>
        
        <motion.h3 
          className="text-xl font-display font-semibold mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay * 0.001 + 0.3, duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-auction-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay * 0.001 + 0.4, duration: 0.3 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
