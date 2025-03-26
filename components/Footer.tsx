"use client";

import React from "react";
import AnimatedLogo from "./AnimatedLogo";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-auction-50 dark:bg-auction-800/50 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-4">
              <AnimatedLogo />
              <span className="ml-2 text-xl font-display font-medium">
                Renown
              </span>
            </div>
            <p className="text-auction-600 mb-6">
              The premium platform for hosting successful online auctions.
              Connecting sellers with serious bidders worldwide.
            </p>
            <div className="flex space-x-4">
              {/* <a
                href="#"
                className="w-8 h-8 rounded-full bg-auction-200 flex items-center justify-center text-auction-600 hover:bg-primary hover:text-white transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a> */}
              {/* <a
                href="#"
                className="w-8 h-8 rounded-full bg-auction-200 flex items-center justify-center text-auction-600 hover:bg-primary hover:text-white transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a> */}
              <Link
                href="https://www.youtube.com/@renown.my"
                className="w-8 h-8 rounded-full bg-auction-200 flex items-center justify-center text-auction-600 hover:bg-primary hover:text-white transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.instagram.com/renown.my"
                className="w-8 h-8 rounded-full bg-auction-200 flex items-center justify-center text-auction-600 hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>

              {/* <a
                href="#"
                className="w-8 h-8 rounded-full bg-auction-200 flex items-center justify-center text-auction-600 hover:bg-primary hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a> */}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                "Home",
                "Features",
                "How It Works",
                "Testimonials",
                // "Pricing",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-auction-600 hover:text-primary transition-colors animated-underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {[
                "Online Auctions",
                "Live Streaming",
                "Secure Payments",
                "Bidder Verification",
                "Seller Dashboard",
                "Analytics",
              ].map((item) => (
                <li key={item}>
                  <span className="text-auction-600 hover:text-primary transition-colors animated-underline">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {/* <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <span className="text-auction-600">
                  123 Auction Street, Suite 101
                  <br />
                  San Francisco, CA 94103
                </span>
              </li> */}
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3" />
                <a
                  href="tel:+11234567890"
                  className="text-auction-600 hover:text-primary transition-colors"
                >
                  +60162363943
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3" />
                <a
                  href="mailto:renownmy@gmail.com"
                  className="text-auction-600 hover:text-primary transition-colors animated-underline"
                >
                  renownmy@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-auction-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-auction-500 text-sm">
            © {new Date().getFullYear()} Renown. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/app/privacy-policy"
              className="text-auction-500 text-sm hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/app/terms-of-service"
              className="text-auction-500 text-sm hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
