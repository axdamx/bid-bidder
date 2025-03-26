"use client";

import React from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const TestimonialsSection = () => {
  return (
    <section
      className="py-20 bg-auction-50 dark:bg-auction-800/30 relative"
      id="testimonials"
    >
      <div className="absolute inset-0 bg-noise-pattern opacity-10"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-sm font-medium">Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Our Sellers Say
          </h2>
          <p className="text-auction-600">
            Discover how our platform has helped sellers around the world host
            successful auction events and connect with serious buyers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="Since using Renown, we've seen a 40% increase in final sale prices and have expanded our reach to international buyers we never had access to before."
            author="Michael Thompson"
            role="Owner"
            company="Thompson Estate Auctions"
            delay={100}
          />
          <TestimonialCard
            quote="The analytics dashboard gives me insights I never had before. I can now make data-driven decisions about timing, reserves, and marketing for each auction event."
            author="Sarah Johnson"
            role="Director"
            company="Vintage Collectibles"
            delay={200}
          />
          <TestimonialCard
            quote="As a new seller, I was worried about the technical aspects of hosting an online auction. The support team was incredible, guiding me through every step of the process."
            author="David Chen"
            role="Independent Seller"
            company="Art & Antiques"
            delay={300}
          />
        </div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a
            href="#"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors animated-underline"
          >
            <span>View More Success Stories</span>
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
