"use client";

import React from "react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import {
  Upload,
  Clock,
  Users,
  Shield,
  BarChart,
  DollarSign,
  Calendar,
  Globe,
  Zap,
  MessageSquare,
} from "lucide-react";

const FeaturesSection = () => {
  return (
    <section
      className="py-20 bg-gradient-to-br from-secondary/70 to-background relative"
      id="features"
    >
      <div className="absolute inset-0 bg-noise-pattern opacity-10"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary mb-4 shadow-sm">
            <span className="text-sm font-medium">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Your Premier Auction House Platform
          </h2>
          <p className="text-auction-600">
            We curate and host auction events on behalf of sellers while also
            enabling individual users to buy and sell directly on our
            marketplace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            icon={Upload}
            title="Curated Auction Events"
            description="We handle the entire process of hosting professional auction events on behalf of sellers, from setup to completion."
            delay={100}
          />
          <FeatureCard
            icon={Clock}
            title="Scheduled Events"
            description="Time-limited auction events with flexible scheduling options to maximize bidder participation and engagement."
            delay={200}
          />
          <FeatureCard
            icon={Users}
            title="Dual-Purpose Platform"
            description="Primary focus on curated auction events, with secondary features for individual users to create accounts to buy and sell directly."
            delay={300}
          />
          <FeatureCard
            icon={Shield}
            title="Secure Transactions"
            description="Integrated payment processing with fraud protection and escrow services for all transactions on our platform."
            delay={400}
          />
          <FeatureCard
            icon={BarChart}
            title="Seller Dashboard"
            description="Comprehensive analytics and reporting tools for both event hosts and individual sellers to track performance."
            delay={500}
          />
          <FeatureCard
            icon={DollarSign}
            title="Flexible Fee Structure"
            description="Transparent pricing with different options for curated events versus individual user listings."
            delay={600}
          />
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3 className="text-2xl font-display font-bold mb-6 text-primary">
            Additional Platform Benefits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Calendar className="h-6 w-6" />,
                text: "Time-Limited Events",
              },
              { icon: <Globe className="h-6 w-6" />, text: "Global Reach" },
              { icon: <Zap className="h-6 w-6" />, text: "Real-Time Bidding" },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                text: "Bidder Communication",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center p-4 bg-gradient-to-br from-white to-secondary/30 dark:from-accent/20 dark:to-accent/10 rounded-lg shadow-md border border-primary/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="flex-shrink-0 mr-4 text-primary">
                  {item.icon}
                </div>
                <span className="font-medium text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
