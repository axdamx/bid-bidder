"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import AnimatedLogo from "./AnimatedLogo";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Handle active section based on scroll position
      const sections = [
        "home",
        "features",
        "how-it-works",
        "testimonials",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavLinkClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);

    // Smooth scroll to section with animation
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/90 backdrop-blur-sm shadow-sm dark:bg-auction-800/90"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <AnimatedLogo />
            <span className="ml-2 text-xl font-display font-medium">
              Renown
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-8 mr-6">
              {[
                { name: "Home", id: "home" },
                { name: "Features", id: "features" },
                { name: "How It Works", id: "how-it-works" },
                { name: "Testimonials", id: "testimonials" },
                { name: "Contact", id: "contact" },
              ].map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-auction-600 hover:text-primary relative py-2 ${
                    activeSection === item.id ? "text-primary" : ""
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavLinkClick(item.id);
                  }}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="underline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.a>
              ))}
            </nav>

            {/* GO TO APP button */}
            <Link href="/app" passHref>
              <Button variant="default" className="font-medium">
                Go to App
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden pt-4 pb-3 bg-white dark:bg-accent/10 rounded-b-lg shadow-md mt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-3">
              {[
                { name: "Home", id: "home" },
                { name: "Features", id: "features" },
                { name: "How It Works", id: "how-it-works" },
                { name: "Testimonials", id: "testimonials" },
                { name: "Contact", id: "contact" },
              ].map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-auction-600 hover:text-primary py-2 relative ${
                    activeSection === item.id ? "text-primary" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavLinkClick(item.id);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="underline-mobile"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.a>
              ))}

              {/* Mobile GO TO APP button */}
              <div className="mt-4">
                <Link href="/app" passHref>
                  <Button variant="default" className="w-full font-medium">
                    Go to App
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
