"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Gavel, Trophy, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HowAuctionWork() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center">
          How Our Auction Platform Works
        </h1>

        <section className="border bg-muted/50 my-6 rounded-xl">
          <div className="container py-12 md:py-24">
            <div className="grid gap-8 md:gap-12">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Create an Account</h3>
                  <p className="text-muted-foreground text-sm">
                    Browse through our diverse collection of items. Create an
                    account to participate in auctions and keep track of your
                    bids.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Gavel className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Place Bids</h3>
                  <p className="text-muted-foreground text-sm">
                    Find an item you're interested in and place your bid. Our
                    system will notify you if you're outbid or if you win the
                    auction.{" "}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Win & Collect</h3>
                  <p className="text-muted-foreground text-sm">
                    If you win an auction, you'll be notified immediately.
                    Follow the payment instructions to complete your purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Safety & Security</h2>
            <p className="text-muted-foreground text-sm">
              Our platform uses secure payment processing and verification
              systems to ensure safe transactions for all users.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">
              Staying Until Auction End
            </h2>
            <p className="text-muted-foreground text-sm">
              We recommend staying on the item page until the auction ends to
              ensure you don't miss out on last-minute bidding opportunities.
              The final moments of an auction can be crucial for securing your
              desired item.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Billing Setup</h2>
            <p className="text-muted-foreground text-sm">
              Add your preferred billing method in your dashboard to facilitate
              smooth transactions. For sellers, this ensures quick disbursement
              of funds after successful sales. For buyers, this enables swift
              payment processing upon winning an auction.
            </p>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Post-Auction Process
          </h2>
          <Tabs defaultValue="buyer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="buyer">For Buyers</TabsTrigger>
              <TabsTrigger value="seller">For Sellers</TabsTrigger>
            </TabsList>
            <TabsContent value="buyer" className="space-y-4">
              <Card className="p-8">
                <h3 className="text-2xl font-semibold mb-6">Buyer's Guide</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-medium mb-3">
                      Checkout Process
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                      <li>
                        Upon winning, you'll be redirected to the checkout page
                      </li>
                      <li>Complete payment within 30 minutes</li>
                      <li>
                        Payment includes: sold price, buyer's premium, and
                        shipping fees
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-medium mb-3">
                      Cash on Delivery (COD)
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                      <li>Only buyer's premium required upfront</li>
                      <li>COD is at buyer's own responsibility</li>
                      <li>Full payment to be made upon delivery</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-medium mb-3">Order Tracking</h4>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                      <li>Monitor order status in Dashboard → Orders tab</li>
                      <li>Track payment details and shipping information</li>
                      <li>Receive notifications on order updates</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="seller" className="space-y-4">
              <Card className="p-8">
                <h3 className="text-2xl font-semibold mb-6">Seller's Guide</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-medium mb-3">
                      Post-Sale Process
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                      <li>Receive notification when item is sold</li>
                      <li>Prepare item for shipping</li>
                      <li>Use your preferred courier service</li>
                      <li>
                        Update order status to "SHIPPED" with tracking details
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-medium mb-3">
                      Order Completion
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                      <li>Buyer confirms receipt and satisfaction</li>
                      <li>
                        Order auto-completes after 7 days if no action taken
                      </li>
                      <li>System updates status to "COMPLETED"</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-medium mb-3">
                      Payment Disbursement
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                      <li>Process begins after order completion</li>
                      <li>Funds sent via default billing method</li>
                      <li>3-5 business days processing time</li>
                      <li>Track disbursement status in your dashboard</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <section className="mt-12 text-center">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
            <p className="text-muted-foreground text-lg mb-4">
              Join our Discord community for real-time support and discussions,
              or reach out to us via email.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://discord.gg/ZM4fGYk7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-lg transition-colors"
              >
                Join our Discord
              </a>
              <a
                href="mailto:renownmy@gmail.com"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                Email Support
              </a>
            </div>
          </Card>
        </section>
      </motion.div>
    </div>
  );
}
