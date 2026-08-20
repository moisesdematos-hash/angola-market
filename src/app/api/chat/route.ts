import { NextResponse } from 'next/server';
import { SuperChatEngine } from '@/lib/chat/super-chat-engine';

export async function POST(request: Request) {
  try {
    const { message, conversationId } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const aiResponse = await SuperChatEngine.processCommand(message, conversationId || 'conv-default');
    
    return NextResponse.json({ success: true, response: aiResponse });
  } catch (err: any) {
    console.error('Error in Super Chat AI route handler:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
