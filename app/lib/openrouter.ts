import { OpenRouterRequest, OpenRouterStreamChunk, AIModel } from '@/app/types/chat';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export class OpenRouterClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key is not configured');
    }
    this.apiKey = apiKey;
  }

  /**
   * Create a streaming chat completion request to OpenRouter
   */
  async createChatCompletionStream(
    request: OpenRouterRequest
  ): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'AI Typing Simulator',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(
        `OpenRouter API error: ${response.status} - ${error.error?.message || error.error || 'Unknown error'}`
      );
    }

    if (!response.body) {
      throw new Error('No response body from OpenRouter API');
    }

    return response.body;
  }

  /**
   * Parse Server-Sent Events stream from OpenRouter
   */
  static async* parseSSEStream(
    stream: ReadableStream<Uint8Array>
  ): AsyncGenerator<OpenRouterStreamChunk, void, unknown> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (!trimmedLine || trimmedLine === 'data: [DONE]') {
            continue;
          }

          if (trimmedLine.startsWith('data: ')) {
            try {
              const jsonData = trimmedLine.slice(6); // Remove 'data: ' prefix
              const chunk: OpenRouterStreamChunk = JSON.parse(jsonData);
              yield chunk;
            } catch (e) {
              console.error('Error parsing SSE chunk:', e);
              // Continue processing other chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Extract text content from stream chunks
   */
  static getContentFromChunk(chunk: OpenRouterStreamChunk): string | null {
    return chunk.choices[0]?.delta?.content || null;
  }

  /**
   * Check if the stream has finished
   */
  static isStreamFinished(chunk: OpenRouterStreamChunk): boolean {
    return chunk.choices[0]?.finish_reason !== null;
  }
}

/**
 * Get the full model identifier for OpenRouter
 */
export function getModelIdentifier(model: AIModel): string {
  // Models are already in the correct format (e.g., 'anthropic/claude-3.5-sonnet')
  return model;
}

/**
 * Create a new OpenRouter client instance
 * Note: This should only be called server-side
 */
export function createOpenRouterClient(): OpenRouterClient {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

  return new OpenRouterClient(apiKey);
}
