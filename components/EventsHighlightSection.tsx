"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const EventsHighlightSection = () => {
  // Mock event data for display purposes
  const featuredEvents = [
    {
      id: 'event-1',
      name: 'Spring Collection Auction',
      description: 'Exclusive spring collection featuring rare collectibles and vintage items from top sellers.',
      startDate: '2025-04-01',
      endDate: '2025-04-15',
      imageUrl: '/placeholder-event-1.jpg'
    },
    {
      id: 'event-2',
      name: 'Tech Gadgets Showcase',
      description: 'The latest tech gadgets and electronics from premium brands at competitive auction prices.',
      startDate: '2025-04-10',
      endDate: '2025-04-20',
      imageUrl: '/placeholder-event-2.jpg'
    }
  ];

  return (
    <section className="py-20 relative" id="events">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-sm font-medium">Time-Limited Events</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Showcase Multiple Items in Special Events
          </h2>
          <p className="text-auction-600">
            Create time-limited auction events to showcase multiple items to your audience. Perfect for seasonal collections, themed auctions, or special promotions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {featuredEvents.map((event, index) => (
            <motion.div 
              key={event.id}
              className="glass-card rounded-xl overflow-hidden shadow-lg border border-auction-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="relative h-48 w-full bg-auction-100">
                {/* Placeholder for event image */}
                <div className="absolute inset-0 flex items-center justify-center bg-auction-200">
                  <Calendar className="h-12 w-12 text-auction-400" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{event.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-auction-500 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {event.startDate} - {event.endDate}
                  </span>
                </div>
                <p className="text-auction-600 mb-6">{event.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-1 bg-auction-100 text-auction-600 rounded-full text-xs">Multiple Items</span>
                  <span className="px-2 py-1 bg-auction-100 text-auction-600 rounded-full text-xs">Time-Limited</span>
                  <span className="px-2 py-1 bg-auction-100 text-auction-600 rounded-full text-xs">Special Event</span>
                </div>
                <Link href={`/events/${event.id}`} passHref>
                  <Button variant="outline" className="w-full group">
                    View Event
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="bg-auction-50 dark:bg-auction-800/20 rounded-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Create Your Own Event</h3>
              <p className="text-auction-600 mb-6">
                Hosting a special auction event is easy. Set your event dates, add your items, customize your event page, and start promoting to your audience.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary text-sm font-medium">1</span>
                  </div>
                  <span className="text-auction-600">Set event name, description, and dates</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary text-sm font-medium">2</span>
                  </div>
                  <span className="text-auction-600">Add multiple items to your event</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary text-sm font-medium">3</span>
                  </div>
                  <span className="text-auction-600">Upload an event banner image</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary text-sm font-medium">4</span>
                  </div>
                  <span className="text-auction-600">Publish and promote your event</span>
                </li>
              </ul>
              <Link href="/events/create" passHref>
                <Button className="group">
                  Create an Event
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-radial from-primary/20 to-transparent rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              ></motion.div>
              <div className="relative bg-background rounded-lg p-6 shadow-md border border-auction-200">
                <div className="mb-4 pb-4 border-b border-auction-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-6 w-32 bg-auction-200 rounded"></div>
                    <div className="h-6 w-24 bg-auction-200 rounded"></div>
                  </div>
                  <div className="h-4 w-full bg-auction-200 rounded mt-2"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-auction-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-auction-200 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-auction-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-auction-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-auction-200 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-auction-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-auction-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-auction-200 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-auction-200 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-auction-200 flex justify-between">
                  <div className="h-8 w-24 bg-auction-200 rounded"></div>
                  <div className="h-8 w-24 bg-primary/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsHighlightSection;
