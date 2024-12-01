import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { handlePaymentCallback } from '@/app/checkout/[itemId]/actions';

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const signature = headersList.get('x-signature');
    const body = await request.text();
    
    await handlePaymentCallback(signature, body);
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
