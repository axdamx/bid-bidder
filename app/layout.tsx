import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Footer } from "./footer";
import { SupabaseProvider } from "./context/SupabaseContext";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Renown",
  description: "Generated by create next app",
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
          "min-h-screen text-large md:text-xl font-serif tracking-wide overflow-x-hidden",
          fontSans.variable
        )}
      >
        <SupabaseProvider>
          <Header />
          <main className="mx-auto max-w-full">
            <div className="px-4 sm:px-6 w-full max-w-full">
              {children}
              <Footer />
            </div>
          </main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
