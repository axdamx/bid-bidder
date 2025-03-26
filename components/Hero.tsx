"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, DollarSign, BarChart4 } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-20 overflow-hidden" id="home">
      <div className="absolute inset-0 bg-hero-pattern opacity-20 z-0"></div>

      <div className="container mx-auto px-4 md:px-6 py-20 relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-sm font-medium">
              Revolutionizing Online Auctions
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Host Your{" "}
            <span className="text-primary relative">Auction Events</span> With
            Confidence & Style
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-auction-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Empower your selling journey with our premium platform designed to
            showcase your items to engaged bidders around the world.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/app" passHref>
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="https://www.youtube.com/@renownmy" target="_blank" rel="noopener noreferrer" passHref>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto max-w-5xl h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl glass-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{
            y: -10,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/20 backdrop-blur-xs"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-display font-bold mb-4">
                Premium Auction Platform
              </h3>
              <p className="text-auction-600 mb-8 max-w-md mx-auto">
                Experience our intuitive interface designed to showcase your
                items and attract serious bidders.
              </p>
              {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm">Explore Features</Button>
              </motion.div> */}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <motion.div
            className="glass-card rounded-lg p-6 text-center transform transition-transform"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{
              y: -5,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-1">
              <AnimatedCounter value={500} label="+" />
            </h3>
            <p className="text-auction-500">Events Hosted Monthly</p>
          </motion.div>

          <motion.div
            className="glass-card rounded-lg p-6 text-center transform transition-transform"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            whileHover={{
              y: -5,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-1">
              <AnimatedCounter value={15} label="M+" />
            </h3>
            <p className="text-auction-500">Revenue Generated</p>
          </motion.div>

          <motion.div
            className="glass-card rounded-lg p-6 text-center transform transition-transform"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            whileHover={{
              y: -5,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <BarChart4 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-1">
              <AnimatedCounter value={98} label="%" />
            </h3>
            <p className="text-auction-500">Seller Satisfaction</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
