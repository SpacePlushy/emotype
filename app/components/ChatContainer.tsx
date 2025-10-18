'use client';

import React, { useState, useCallback, useRef } from 'react';
import { MessageList } from './MessageList';
import { InputBar } from './InputBar';
import { useChatContext } from '@/app/context/ChatContext';
import { useSettingsContext } from '@/app/context/SettingsContext';

export function ChatContainer() {
  const { messages, addMessage, updateMessage, isLoading, setIsLoading } =
    useChatContext();
  const { model } = useSettingsContext();

  const [streamingContent, setStreamingContent] = useState('');
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      if (isLoading) return;

      try {
        // Add user message (no status for user messages)
        addMessage('user', userMessage);

        // Add empty assistant message with 'streaming' status
        const assistantMessageId = addMessage('assistant', '', 'streaming');
        setStreamingMessageId(assistantMessageId);
        setStreamingContent('');
        setIsLoading(true);

        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        // Make API request
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            model,
            conversationHistory: messages,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            error: 'Unknown error',
          }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        if (!response.body) {
          throw new Error('No response body');
        }

        // Process streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          // DON'T update streaming content - just collect silently
          // This prevents the rapid text display before animation
          // setStreamingContent(fullContent);
        }

        // Streaming complete - FIRST clear streaming state, THEN update message status
        // This prevents the flash of full text before animation starts
        setStreamingContent('');
        setStreamingMessageId(null);

        // Now update message with final content and set to 'ready_to_animate'
        updateMessage(assistantMessageId, fullContent, 'ready_to_animate');
      } catch (error) {
        console.error('Error sending message:', error);

        if (error instanceof Error && error.name !== 'AbortError') {
          // Show error message to user with 'complete' status (no animation for errors)
          addMessage(
            'assistant',
            `Sorry, I encountered an error: ${error.message}. Please check your API key configuration and try again.`,
            'complete'
          );
          setStreamingMessageId(null);
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, model, isLoading, addMessage, updateMessage, setIsLoading]
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <MessageList
        messages={messages}
        streamingContent={streamingContent}
        streamingMessageId={streamingMessageId || undefined}
      />
      <InputBar
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={
          isLoading ? 'AI is typing...' : 'Type your message here...'
        }
      />
    </div>
  );
}
