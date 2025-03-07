"use client";

import { Suspense } from "react";
import { LiveAuctions } from "./home/components/sections/LiveAuctions";
import { EndedAuctions } from "./home/components/sections/EndedAuctions";
import HeroSection from "./home/components/sections/HeroSection";
import { useAtom } from "jotai";
import { userAtom } from "./atom/userAtom";
import { Gavel, Trophy, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MotionGrid } from "./components/motionGrid";

function LoadingSection({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center min-h-[200px] w-full">
      <div className="bg-background border border-border rounded-lg shadow-sm p-4 min-w-[200px] text-center">
        <div
          className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [user] = useAtom(userAtom);
  const searchParams = useSearchParams();
  const hasSeenOnboarding = user?.hasSeenOnboarding;
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Handle error cases
    const error = searchParams.get("error");
    const error_code = searchParams.get("error_code");
    const auth_error = searchParams.get("auth-error");
    const error_description = searchParams.get("error_description");
    
    // Check for errors either with auth-error param or direct error params
    const hasError = auth_error === "true" || (error && error_code);
    
    if (hasError) {
      let errorMessage = "An error occurred during login. Please try again.";

      // Handle specific error cases
      if (error === "access_denied" && error_code === "otp_expired") {
        errorMessage = error_description || 
          "Email link is invalid or has expired. Please try logging in again.";
      } else if (error === "database_error") {
        errorMessage =
          "There was an error accessing your account. Please try again.";
      } else if (error === "no_session") {
        errorMessage =
          "Unable to establish a session. Please try logging in again.";
      }

      setShowErrorDialog(true);
      setErrorMessage(errorMessage);

      // Clean up error params
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("auth-error");
      newUrl.searchParams.delete("error");
      newUrl.searchParams.delete("error_code");
      newUrl.searchParams.delete("error_description");
      // Also clean up hash fragment if it contains error params
      if (newUrl.hash && newUrl.hash.includes('error=')) {
        newUrl.hash = '';
      }
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    // Handle success cases
    const auth_success = searchParams.get("auth-success");
    const provider = searchParams.get("provider");
    const account_exists = searchParams.get("account-exists");
    const user_id = searchParams.get("user_id");

    if (auth_success === "true" && user && !hasTriggeredSuccess) {
      setShowSuccessDialog(true);
      setHasTriggeredSuccess(true);

      // Clean up success params after a delay
      const timer = setTimeout(() => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("auth-success");
        newUrl.searchParams.delete("provider");
        newUrl.searchParams.delete("account-exists");
        newUrl.searchParams.delete("user_id");
        window.history.replaceState({}, "", newUrl.toString());
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchParams, user, hasTriggeredSuccess]);

  // How It Works section data
  const howItWorksSteps = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Create an Account",
      description: "Browse through our diverse collection of items. Create an account to participate in auctions and keep track of your bids."
    },
    {
      icon: <Gavel className="h-8 w-8" />,
      title: "Place Bids",
      description: "Find an item you're interested in and place your bid. Our system will notify you if you're outbid or if you win the auction."
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Win & Collect",
      description: "If you win an auction, you'll be notified immediately. Follow the payment instructions to complete your purchase."
    }
  ];

  return (
    <>
      {showErrorDialog && (
        <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <DialogContent
            aria-describedby="success-message"
            aria-labelledby="success-title"
            className="[&>button]:hidden"
          >
            <DialogHeader>
              <DialogTitle>Error</DialogTitle>
              <DialogDescription>{errorMessage}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowErrorDialog(false)}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {showSuccessDialog && (
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent
            aria-describedby="success-message"
            aria-labelledby="success-title"
            className="[&>button]:hidden"
          >
            <DialogHeader>
              <DialogTitle>Successfully Logged In</DialogTitle>
              <DialogDescription>
                Welcome back! You have successfully logged into your account.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button
                variant="default"
                onClick={() => setShowSuccessDialog(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <main className="flex flex-col">
        {/* Hero Section */}
        <HeroSection />
        {/* Top Bids Section */}
        {/* <Suspense fallback={<LoadingSection message="Loading top bids..." />}>
          <TopBids />
        </Suspense> */}

        {/* <CategoryCarousell /> */}

        {/* Live Auctions - Featured Section */}
        <section className="w-full px-0 my-12">
          <div className="w-full">
            <Suspense
              fallback={<LoadingSection message="Loading live auctions..." />}
            >
              <LiveAuctions />
            </Suspense>
          </div>
        </section>

        <section className="border bg-muted/50 my-6 rounded-xl">
          <div className="container py-12 md:py-24">
            <div className="grid gap-8 md:gap-12">
              <div className="grid gap-8 md:grid-cols-3">
                {howItWorksSteps.map((step, index) => (
                  <MotionGrid 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="flex flex-col items-center space-y-4 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </MotionGrid>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Auctions - Notable Drops */}
        {/* <section className="container px-4 md:px-6">
          <Suspense
            fallback={<LoadingSection message="Loading upcoming auctions..." />}
          >
            <UpcomingAuctions />
          </Suspense>
        </section> */}

        {/* Ended Auctions - Trending */}
        <section className="w-full px-0 mb-6">
          {/* <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Past Auctions</h2>
            <p className="text-muted-foreground mt-1">Recently sold items</p>
          </div>
          <a href="/ended" className="text-primary hover:text-primary/80">
            View all →
          </a>
        </div> */}
          <Suspense
            fallback={<LoadingSection message="Loading ended auctions..." />}
          >
            <EndedAuctions limit={3} />
          </Suspense>
        </section>

        {/* Discord Community Section */}
        <section className="container py-12 md:py-24">
          <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Join our Community.
            </h2>
            <p className="text-muted-foreground text-md">
              Meet the Renown Community, where we share news for platform
              updates, announcements, and more...
            </p>
            <a
              href="https://discord.gg/ZM4fGYk7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-lg transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
              </svg>
              Discord
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
