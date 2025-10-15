'use client';

import React, { useEffect, useRef } from 'react';
import { Message as MessageComponent } from './Message';
import { Message as MessageType } from '@/app/types/chat';

interface MessageListProps {
  messages: MessageType[];
  streamingContent?: string;
  streamingMessageId?: string;
}

export function MessageList({
  messages,
  streamingContent,
  streamingMessageId,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or content updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium mb-2">
            Chat with AI that types like a human
          </p>
          <p className="text-sm">
            Send a message to start the conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-2"
    >
      {messages.map((message) => (
        <MessageComponent
          key={message.id}
          message={message}
          streamingContent={
            streamingMessageId === message.id ? streamingContent : undefined
          }
          isStreaming={streamingMessageId === message.id}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
