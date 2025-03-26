"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ProcessStep from './ProcessStep';
import { Briefcase, PenTool, Calendar, Zap } from 'lucide-react';

const ProcessStepsSection = () => {
  return (
    <section className="py-20 relative bg-gradient-to-b from-secondary/50 to-background" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6">
        <div className="absolute inset-0 bg-noise-pattern opacity-5"></div>
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary mb-4 shadow-sm">
            <span className="text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How Our Auction House Works
          </h2>
          <p className="text-auction-600">
            We help sellers host professional auction events while also enabling individual users to buy and sell on our platform. Here's how it works:
          </p>
        </motion.div>
        
        <div className="space-y-12 max-w-4xl mx-auto">
          <ProcessStep 
            icon={Briefcase}
            step={1}
            title="Contact Our Auction House"
            description="Reach out to our team to discuss your auction needs. We'll handle the curation and hosting of your event professionally."
          />
          <ProcessStep 
            icon={PenTool}
            step={2}
            title="Item Submission & Curation"
            description="We'll work with you to select, photograph, and describe your items to maximize their appeal to potential bidders."
          />
          <ProcessStep 
            icon={Calendar}
            step={3}
            title="Event Scheduling & Promotion"
            description="We'll schedule your auction event and promote it to our global network of qualified bidders to ensure maximum participation."
          />
          <ProcessStep 
            icon={Zap}
            step={4}
            title="Auction Execution & Settlement"
            description="We manage the entire auction process from start to finish, including bidder verification, payment processing, and final settlement."
          />
        </div>
        
        <motion.div 
          className="mt-12 bg-gradient-to-br from-secondary to-secondary/80 dark:from-accent dark:to-accent/50 p-6 rounded-lg max-w-4xl mx-auto shadow-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="text-xl font-display font-bold mb-4 text-center text-primary dark:text-primary">
            Individual User Accounts
          </h3>
          <p className="text-auction-600 text-center mb-6">
            In addition to our primary auction house services, users can also create personal accounts to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/90 dark:bg-accent/30 p-4 rounded-lg shadow-sm border border-primary/10">
              <h4 className="font-medium mb-2 text-primary">Sell Items Directly</h4>
              <p className="text-sm text-foreground/80">Create listings, set prices, and sell items directly to other users on our marketplace.</p>
            </div>
            <div className="bg-white/90 dark:bg-accent/30 p-4 rounded-lg shadow-sm border border-primary/10">
              <h4 className="font-medium mb-2 text-primary">Participate in Auctions</h4>
              <p className="text-sm text-foreground/80">Browse and bid on items in both curated auction events and individual seller listings.</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg max-w-2xl mx-auto shadow-sm">
            <p className="text-lg text-foreground italic">
              "Working with this auction house was a game-changer for my business. They handled everything from photography to payment processing, allowing me to focus on sourcing quality items while they managed the entire auction process."
            </p>
            <p className="text-sm text-primary/80 mt-4 font-medium">— Alex Johnson, Vintage Collectibles</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessStepsSection;
