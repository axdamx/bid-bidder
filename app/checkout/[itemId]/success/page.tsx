'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function PaymentSuccessPage({
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
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/purchases')}
          >
            View My Purchases
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
