'use client';

import React from 'react';
import { Message as MessageType } from '@/app/types/chat';
import { TypingAnimator } from './TypingAnimator';
import { useSettingsContext } from '@/app/context/SettingsContext';
import { useChatContext } from '@/app/context/ChatContext';

interface MessageProps {
  message: MessageType;
  streamingContent?: string;
  isStreaming?: boolean;
}

export function Message({ message, streamingContent, isStreaming }: MessageProps) {
  const { personality, animationEnabled, typingSpeedMultiplier } =
    useSettingsContext();
  const { setMessageStatus } = useChatContext();

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Determine what content to show and which mode we're in
  let content = message.content;
  let showAnimation = false;

  if (isStreaming && streamingContent !== undefined) {
    // STREAMING MODE: Show raw streaming text character by character
    content = streamingContent;
  } else if (isAssistant && (message.status === 'ready_to_animate' || message.status === 'animating')) {
    // READY TO ANIMATE or ANIMATING: Show typing animation
    showAnimation = true;
    content = message.content;
  } else {
    // COMPLETE or USER MESSAGE: Show full content
    content = message.content;
  }

  const handleAnimationStart = () => {
    // DON'T update status here - avoid re-render during animation
    // Just let it stay as 'ready_to_animate' until complete
  };

  const handleAnimationComplete = () => {
    // Update status to 'complete' when animation finishes
    setMessageStatus(message.id, 'complete');
  };

  // DEBUG: Log what we're passing to TypingAnimator
  if (showAnimation) {
    console.log('[Message] Rendering TypingAnimator with:', {
      messageId: message.id,
      contentLength: content.length,
      first100chars: content.substring(0, 100),
      status: message.status,
    });
  }

  return (
    <div
      className={`flex w-full mb-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-blue-500 dark:bg-blue-600 text-white rounded-tr-sm'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-sm'
        }`}
      >
        <div className="text-base leading-relaxed whitespace-pre-wrap break-words">
          {showAnimation && (
            <TypingAnimator
              key={message.id}
              fullText={content}
              personality={personality}
              speedMultiplier={typingSpeedMultiplier}
              enabled={animationEnabled}
              onAnimationStart={handleAnimationStart}
              onComplete={handleAnimationComplete}
            />
          )}
          {!showAnimation && content}
        </div>
      </div>
    </div>
  );
}
