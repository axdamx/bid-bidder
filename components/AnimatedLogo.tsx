"use client";

import React from 'react';

const AnimatedLogo = () => {
  return (
    <div className="relative h-8 w-8 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
        >
          <circle 
            cx="20" 
            cy="20" 
            r="18" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="animate-pulse-soft text-primary"
          />
          <path 
            d="M14 26V14L26 14L26 26H14Z" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="origin-center animate-[spin_10s_linear_infinite] text-primary"
          />
          <path 
            d="M20 12V28" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            className="animate-pulse-soft text-primary"
          />
          <path 
            d="M12 20H28" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-pulse-soft text-primary"
          />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedLogo;
