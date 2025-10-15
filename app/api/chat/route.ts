import { NextRequest, NextResponse } from 'next/server';
import { createOpenRouterClient, OpenRouterClient } from '@/app/lib/openrouter';
import { ChatAPIRequest, Message } from '@/app/types/chat';

export const runtime = 'edge'; // Use edge runtime for better streaming performance

/**
 * POST /api/chat
 * Handle chat requests with streaming responses
 */
export async function POST(req: NextRequest) {
  try {
    const body: ChatAPIRequest = await req.json();
    const { message, model, conversationHistory } = body;

    if (!message || !model) {
      return NextResponse.json(
        { success: false, error: 'Message and model are required' },
        { status: 400 }
      );
    }

    // Create OpenRouter client
    const client = createOpenRouterClient();

    // Build messages array from conversation history
    const messages = [
      {
        role: 'system' as const,
        content: `You are a conversational AI assistant. Your responses will be displayed with realistic typing animations as you generate them.

Guidelines for natural-feeling responses:
1. Write naturally and conversationally
2. Use proper punctuation for natural pauses
3. Break complex thoughts into sentences
4. Vary sentence length for natural rhythm
5. Use contractions and casual language when appropriate

The user will see your response appear character by character in real-time, so write as if you're having a natural conversation.`,
      },
      // Include conversation history
      ...conversationHistory.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      })),
      // Add the new user message
      {
        role: 'user' as const,
        content: message,
      },
    ];

    // Create streaming request
    const stream = await client.createChatCompletionStream({
      model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Process the OpenRouter stream directly - don't use TransformStream
    // Create a new ReadableStream that parses SSE and outputs plain text
    const encoder = new TextEncoder();
    const processedStream = new ReadableStream({
      async start(controller) {
        try {
          // Parse the entire SSE stream
          for await (const parsedChunk of OpenRouterClient.parseSSEStream(stream)) {
            const content = OpenRouterClient.getContentFromChunk(parsedChunk);

            if (content) {
              // Send content as plain text chunks
              controller.enqueue(encoder.encode(content));
            }

            // Check if stream is finished
            if (OpenRouterClient.isStreamFinished(parsedChunk)) {
              break;
            }
          }

          controller.close();
        } catch (error) {
          console.error('Error processing stream:', error);
          controller.error(error);
        }
      },
    });

    // Return the streaming response
    return new NextResponse(processedStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'AI Typing Simulator API is running',
  });
}
