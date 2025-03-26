import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  label?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  label = "", 
  duration = 2000 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Store the ref value at the time the effect runs
    const currentRef = counterRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const step = Math.ceil(value / (duration / 50)); // Update every 50ms
    
    const timer = setInterval(() => {
      start += step;
      if (start > value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [isVisible, value, duration]);

  return (
    <div ref={counterRef} className="inline-flex items-center">
      <span className="tabular-nums">{count}</span>
      <span>{label}</span>
    </div>
  );
};

export default AnimatedCounter;
