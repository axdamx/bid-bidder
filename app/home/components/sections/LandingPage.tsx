"use client";

import React, { useEffect } from "react";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import ProcessStepsSection from "@/components/ProcessStepsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

const LandingPage = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e: Event) => {
        e.preventDefault();

        const targetId = (e.currentTarget as HTMLAnchorElement).getAttribute(
          "href"
        );
        if (!targetId) return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <FeaturesSection />
      {/* <EventsHighlightSection /> */}
      <ProcessStepsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;
