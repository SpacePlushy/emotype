'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Message, MessageRole, ChatContextType, MessageStatus } from '@/app/types/chat';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((role: MessageRole, content: string, status?: MessageStatus) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      status: role === 'assistant' ? (status || 'streaming') : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, content: string, status?: MessageStatus) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              content,
              status: status !== undefined ? status : msg.status
            }
          : msg
      )
    );
  }, []);

  const setMessageStatus = useCallback((id: string, status: MessageStatus) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, status } : msg
      )
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value: ChatContextType = {
    messages,
    addMessage,
    updateMessage,
    setMessageStatus,
    clearMessages,
    isLoading,
    setIsLoading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }

  return context;
}
