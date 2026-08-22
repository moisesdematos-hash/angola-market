import { NextResponse } from 'next/server';
import { GroqAIService } from '@/lib/ai/groq-service';

export async function POST(request: Request) {
  try {
    const { brief } = await request.json();
    
    if (!brief) {
      return NextResponse.json({ error: 'Brief is required' }, { status: 400 });
    }

    const aiListing = await GroqAIService.generateSellerListing(brief);
    
    return NextResponse.json({ success: true, ...aiListing });
  } catch (err: any) {
    console.error('Error in AI Seller Copilot route:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
