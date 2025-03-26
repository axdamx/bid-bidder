"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="contact">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 opacity-70 z-0"></div>

      <motion.div
        className="container mx-auto px-4 md:px-6 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-5xl mx-auto glass-card rounded-2xl p-8 md:p-12 shadow-lg"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h2
                className="text-3xl md:text-4xl font-display font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Ready to Host Your Next Successful Auction?
              </motion.h2>
              <motion.p
                className="text-auction-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Join thousands of sellers who have transformed their auction
                experience with our platform. Get started today and see the
                difference.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/app" passHref>
                    <Button size="lg" className="group">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="mailto:renownmy@gmail.com">
                    <Button size="lg" variant="outline">
                      Schedule Demo
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-radial from-primary/20 to-transparent rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              ></motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-radial from-primary/20 to-transparent rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
              ></motion.div>

              <motion.div
                className="relative glass-card rounded-lg p-6 shadow-md"
                whileHover={{
                  y: -1,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="space-y-4">
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <motion.div
                      className="h-2 bg-gray-600 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7, duration: 1 }}
                    ></motion.div>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <motion.div
                      className="h-2 bg-gray-400 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9, duration: 1 }}
                    ></motion.div>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <motion.div
                      className="h-2 bg-gray-200 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "50%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.1, duration: 1 }}
                    ></motion.div>
                  </motion.div>
                  <motion.div
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <p className="text-sm text-auction-500">
                      Average Auction Growth
                    </p>
                    <motion.p
                      className="text-2xl font-bold text-primary"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 1.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      +127%
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-sm text-auction-500">
            Trusted by leading auction houses and independent sellers worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 mt-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div
                key={item}
                className="h-8 bg-gray-400/20 rounded w-24"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + item * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              ></motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
