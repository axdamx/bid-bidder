"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-12">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-center">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Your payment was cancelled. No charges have been made.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push(`/app/checkout/${itemId}`)}
          >
            Return to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
