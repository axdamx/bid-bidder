import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Mail, Phone } from "lucide-react";

export default function HelpDetails() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 min-h-[calc(100vh-4rem)] overflow-y-auto">
      <Card>
        <CardHeader>
          {/* <CardTitle>Help Center</CardTitle> */}
          {/* <CardDescription>
            Find answers to common questions and get support
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          {/* <div className="mb-6">
            <Label htmlFor="search" className="sr-only">
              Search for help
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search for help..."
                className="pl-8"
              />
            </div>
          </div> */}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="track-order">
              <AccordionTrigger>How do I track my order?</AccordionTrigger>
              <AccordionContent>
                <p>To track your order:</p>
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>Log in to your account</li>
                  <li>
                    Go to the "Dashboard", and choose the "Orders" section
                  </li>
                  <li>Find your order and click on "View Details"</li>
                  <li>
                    You'll see the current status and tracking information if
                    available
                  </li>
                </ol>
                {/* <p className="mt-2">
                  Once your order is shipped, you'll receive an email with a
                  tracking number and link.
                </p> */}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="order-statuses">
              <AccordionTrigger>
                What do the different order statuses mean?
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li>
                    <strong>Pending:</strong> Your order has been placed but not
                    yet processed.
                  </li>
                  <li>
                    <strong>Processing:</strong> We're preparing your items for
                    shipment.
                  </li>
                  <li>
                    <strong>Shipped:</strong> Your order is on its way to you.
                  </li>
                  <li>
                    <strong>Delivered:</strong> Your order has been delivered to
                    the address provided.
                  </li>
                  <li>
                    <strong>Cancelled:</strong> The order has been cancelled.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cancellation-returns">
              <AccordionTrigger>
                What is the cancellation and return policy?
              </AccordionTrigger>
              <AccordionContent>
                <p>Our cancellation and return policy:</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>
                    You can cancel an order within 24 hours of placing it, as
                    long as it hasn't been shipped.
                  </li>
                  <li>
                    Returns are accepted within 30 days of delivery for most
                    items.
                  </li>
                  <li>Items must be unused and in their original packaging.</li>
                  <li>
                    Some products (e.g., personalized items) may not be eligible
                    for return.
                  </li>
                </ul>
                <p className="mt-2">
                  To initiate a return, please contact our customer support
                  team.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment-methods">
              <AccordionTrigger>
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent>
                <p>We accept the following payment methods:</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Credit Cards (Visa, MasterCard, American Express)</li>
                  <li>Debit Cards</li>
                  <li>PayPal</li>
                  <li>Apple Pay</li>
                  <li>Google Pay</li>
                </ul>
                <p className="mt-2">
                  If you're having issues with payment, please ensure your
                  billing information is correct and try again. If problems
                  persist, contact our support team.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping-info">
              <AccordionTrigger>How long does shipping take?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Shipping times vary depending on your location and chosen
                  shipping method:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>
                    <strong>Standard Shipping:</strong> 3-5 business days
                  </li>
                  <li>
                    <strong>Express Shipping:</strong> 1-2 business days
                  </li>
                  <li>
                    <strong>International Shipping:</strong> 7-14 business days
                  </li>
                </ul>
                <p className="mt-2">
                  Please note that these are estimated times and may vary due to
                  unforeseen circumstances. You can always check the status of
                  your order in your account.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Still need help?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Support
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Call Us
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
