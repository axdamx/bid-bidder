"use client";

import React from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  imageUrl?: string;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  company,
  imageUrl,
  delay = 0,
}) => {
  return (
    <motion.div
      className="glass-card rounded-xl p-6 shadow-sm relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: delay * 0.001, duration: 0.5 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="bg-gradient-to-br from-primary/5 to-transparent w-16 h-16 rounded-full absolute -top-8 -left-8 opacity-30"></div>
      
      <Quote className="h-8 w-8 text-primary/20 mb-4" />
      
      <p className="text-auction-600 mb-6 relative z-10">
        "{quote}"
      </p>
      
      <div className="flex items-center">
        {imageUrl ? (
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <Image 
              src={imageUrl} 
              alt={author} 
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <span className="text-primary font-medium text-lg">
              {author.charAt(0)}
            </span>
          </div>
        )}
        
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-auction-500">{role}, {company}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
