'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  TypingPersonalityType,
  AIModel,
  SettingsContextType,
} from '@/app/types/chat';

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [personality, setPersonalityState] =
    useState<TypingPersonalityType>('natural');
  const [model, setModelState] = useState<AIModel>(
    'anthropic/claude-haiku-4.5'
  );
  const [animationEnabled, setAnimationEnabledState] = useState(true);
  const [typingSpeedMultiplier, setTypingSpeedMultiplierState] = useState(1.0);
  const [darkMode, setDarkModeState] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      setDarkModeState(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setDarkModeState(false);
      document.documentElement.classList.remove('dark');
    } else {
      // No saved preference, use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkModeState(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const setPersonality = useCallback((newPersonality: TypingPersonalityType) => {
    setPersonalityState(newPersonality);
  }, []);

  const setModel = useCallback((newModel: AIModel) => {
    setModelState(newModel);
  }, []);

  const setAnimationEnabled = useCallback((enabled: boolean) => {
    setAnimationEnabledState(enabled);
  }, []);

  const setTypingSpeedMultiplier = useCallback((multiplier: number) => {
    setTypingSpeedMultiplierState(Math.max(0.1, Math.min(3.0, multiplier)));
  }, []);

  const setDarkMode = useCallback((enabled: boolean) => {
    setDarkModeState(enabled);

    // Update DOM immediately
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  // Apply dark mode class whenever it changes
  useEffect(() => {
    if (!mounted) return;

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  const value: SettingsContextType = {
    personality,
    setPersonality,
    model,
    setModel,
    animationEnabled,
    setAnimationEnabled,
    typingSpeedMultiplier,
    setTypingSpeedMultiplier,
    darkMode,
    setDarkMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error(
      'useSettingsContext must be used within a SettingsProvider'
    );
  }

  return context;
}
