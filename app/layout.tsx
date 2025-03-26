// import type { Metadata } from "next";
// import "./globals.css";
// import { Inter as FontSans } from "next/font/google";
// import { cn } from "@/lib/utils";
// import { Providers } from "./Providers";
// import { Analytics } from "@vercel/analytics/react";

// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

// export const metadata: Metadata = {
//   title: "AuctionHub",
//   description: "Auction and Bidding Platform",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         <meta
//           name="google-site-verification"
//           content="rveUeW8a9X2bMP_1qdudSLOfSd7FV1Kt88q8wgCxwc0"
//         />
//       </head>
//       <body
//         className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
//       >
//         <Providers>
//           {children}
//           <Analytics />
//         </Providers>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./Providers";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <head>
        <meta
          name="google-site-verification"
          content="rveUeW8a9X2bMP_1qdudSLOfSd7FV1Kt88q8wgCxwc0"
        />
      </head>
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      >
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
