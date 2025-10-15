'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TypingEngine, delay } from '@/app/lib/typingEngine';
import { TypingPersonalityType } from '@/app/types/chat';

interface TypingAnimatorProps {
  fullText: string;
  personality: TypingPersonalityType;
  speedMultiplier: number;
  enabled: boolean;
  onAnimationStart?: () => void;
  onComplete?: () => void;
  onUpdate?: (displayedText: string) => void;
}

export function TypingAnimator({
  fullText,
  personality,
  speedMultiplier,
  enabled,
  onAnimationStart,
  onComplete,
  onUpdate,
}: TypingAnimatorProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(true); // Start as true to show cursor immediately
  const animationRef = useRef<boolean>(false);
  const cursorIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    // Prevent multiple animations of the same content
    if (hasStartedRef.current) {
      return;
    }

    // If animation is disabled, show full text immediately
    if (!enabled) {
      setDisplayedText(fullText);
      setShowCursor(false);
      onUpdate?.(fullText);
      onComplete?.();
      hasStartedRef.current = true;
      return;
    }

    // Reset state when fullText is empty
    if (fullText === '') {
      setDisplayedText('');
      setIsTyping(false);
      setShowCursor(false);
      return;
    }

    // Start typing animation ONCE
    hasStartedRef.current = true;
    animationRef.current = true;
    setIsTyping(true);
    setDisplayedText('');

    // Notify parent that animation is starting
    onAnimationStart?.();

    // Start the animation
    animateTyping();

    return () => {
      // DON'T set animationRef.current = false here - let animation complete
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    if (isTyping) {
      cursorIntervalRef.current = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530); // Standard cursor blink rate

      return () => {
        if (cursorIntervalRef.current) {
          clearInterval(cursorIntervalRef.current);
        }
      };
    } else {
      setShowCursor(false);
    }
  }, [isTyping]);

  const animateTyping = async () => {
    const engine = new TypingEngine(personality, speedMultiplier);
    let currentText = '';
    let position = 0;
    const textLength = fullText.length;

    try {
      while (position < textLength && animationRef.current) {
        const char = fullText[position];

        // Check for backspace/typo simulation
        if (
          engine.shouldAddBackspace(position, textLength) &&
          currentText.length > 0
        ) {
          // Decide if we should make an actual typo or just retype
          if (engine.shouldMakeTypo()) {
            // Generate a realistic typo sequence
            const typoSequence = engine.generateTypoSequence(fullText, position);

            if (typoSequence) {
              // Type the typo
              for (let i = 0; i < typoSequence.typoText.length; i++) {
                if (!animationRef.current) break;
                currentText += typoSequence.typoText[i];
                setDisplayedText(currentText);
                onUpdate?.(currentText);
                await delay(engine.getCharacterDelay(typoSequence.typoText[i]));
              }

              // Show the typo briefly
              await delay(engine.getTypoVisibilityTime());

              // Backspace the typo
              for (let i = 0; i < typoSequence.backspaceCount; i++) {
                if (!animationRef.current) break;
                currentText = currentText.slice(0, -1);
                setDisplayedText(currentText);
                onUpdate?.(currentText);
                await delay(50); // Backspace speed
              }

              // Pause after correction
              await delay(engine.getCorrectionPause());

              // Continue typing the correct text from current position
              continue;
            }
          }

          // Fallback: traditional backspace (retype same text)
          const backspaceLength = Math.min(
            engine.getBackspaceLength(),
            currentText.length
          );

          // Perform backspace animation
          for (let i = 0; i < backspaceLength; i++) {
            if (!animationRef.current) break;
            currentText = currentText.slice(0, -1);
            setDisplayedText(currentText);
            onUpdate?.(currentText);
            await delay(50); // Backspace speed
          }

          // Pause after correction
          await delay(engine.getCorrectionPause());

          // Move position back so we retype the deleted characters
          position = Math.max(0, position - backspaceLength);

          // Skip adding the character this iteration - we'll retype from the new position
          continue;
        }

        // Add the character
        currentText += char;
        setDisplayedText(currentText);
        onUpdate?.(currentText);
        position++;

        // Calculate delay for this character
        const charDelay = engine.getCharacterDelay(char);
        await delay(charDelay);

        // Add punctuation pause
        const punctuationPause = engine.getPunctuationPause(char);
        if (punctuationPause > 0) {
          await delay(punctuationPause);
        }

        // Add thinking pause at word boundaries
        if (
          engine.isWordBoundary(char) &&
          engine.shouldAddThinkingPause()
        ) {
          await delay(engine.getThinkingPause());
        }
      }

      // Animation complete
      if (animationRef.current) {
        setDisplayedText(fullText);
        onUpdate?.(fullText);
        setIsTyping(false);
        onComplete?.();
      }
    } catch (error) {
      console.error('Typing animation error:', error);
      setDisplayedText(fullText);
      onUpdate?.(fullText);
      setIsTyping(false);
      onComplete?.();
    }
  };

  return (
    <span className="inline-block">
      {displayedText}
      {isTyping && showCursor && (
        <span className="inline-block w-[2px] h-5 bg-gray-700 dark:bg-gray-300 ml-[1px] align-middle animate-pulse">
          {' '}
        </span>
      )}
    </span>
  );
}
