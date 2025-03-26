"use client";

import { Suspense } from "react";
import { LiveAuctions } from "../home/components/sections/LiveAuctions";
import { EndedAuctions } from "../home/components/sections/EndedAuctions";
import HeroSection from "../home/components/sections/HeroSection";
import { useAtom } from "jotai";
import { userAtom } from "../atom/userAtom";
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

export default function AppHome() {
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
        errorMessage =
          error_description ||
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
      if (newUrl.hash && newUrl.hash.includes("error=")) {
        newUrl.hash = "";
      }
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    // Handle success cases
    const auth_success = searchParams.get("auth-success");
    const provider = searchParams.get("provider");

    if (auth_success === "true" && !hasTriggeredSuccess) {
      setShowSuccessDialog(true);
      setHasTriggeredSuccess(true);

      // Clean up success params
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("auth-success");
      newUrl.searchParams.delete("provider");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams, user, hasTriggeredSuccess]);

  // How It Works section data
  const howItWorksSteps = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Create an Account",
      description:
        "Browse through our diverse collection of items. Create an account to participate in auctions and keep track of your bids.",
    },
    {
      icon: <Gavel className="h-8 w-8" />,
      title: "Place Bids",
      description:
        "Find an item you're interested in and place your bid. Our system will notify you if you're outbid or if you win the auction.",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Win & Collect",
      description:
        "If you win an auction, you'll be notified immediately. Follow the payment instructions to complete your purchase.",
    },
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
              <DialogTitle>Welcome!</DialogTitle>
              <DialogDescription>
                You have successfully signed in.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowSuccessDialog(false)}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-12 py-8">
        <HeroSection />

        <Suspense
          fallback={<LoadingSection message="Loading live auctions..." />}
        >
          <LiveAuctions />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 text-center"
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <Suspense
          fallback={<LoadingSection message="Loading ended auctions..." />}
        >
          <EndedAuctions />
        </Suspense>

        <section className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy to participate in auctions. Here's how
              to get started.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
