import React from "react";
import { Header } from "../header";
import { Footer } from "../footer";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renown",
  description: "Auction and Bidding Platform",
};
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "min-h-screen text-base md:text-xl font-serif tracking-wide overflow-x-hidden",
        "bg-gradient-to-br from-purple-100 via-slate-200 to-slate-400" // This is the lighter version
        // fontSans.variable
      )}
    >
      <div className="flex flex-col min-h-screen">
        <div className="app-header sticky top-0 z-50 bg-background border-b border-border shadow-sm">
          <Header />
        </div>
        <main className="flex-1 relative w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
            {children}
          </div>
        </main>
        <div className="app-footer">
          <Footer />
        </div>
      </div>
    </div>
  );
}
