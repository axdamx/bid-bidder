import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Footer } from "./footer";
import { Providers } from "./Providers";
import { AnimatedBackground } from "./AnimatedBackground";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Renown",
  description: "Auction and Bidding Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen text-base md:text-xl font-serif tracking-wide overflow-x-hidden",
          "bg-gradient-to-br from-purple-100 via-slate-200 to-slate-400", // This is the lighter version
          fontSans.variable
        )}
      >
        {/* <AnimatedBackground /> */}
        <Providers>
          <div className="flex flex-col min-h-screen w-full">
            <Header />
            <main className="flex-1 relative w-full">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
