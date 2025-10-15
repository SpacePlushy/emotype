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
    'anthropic/claude-3.5-sonnet'
  );
  const [animationEnabled, setAnimationEnabledState] = useState(true);
  const [typingSpeedMultiplier, setTypingSpeedMultiplierState] = useState(1.0);
  const [darkMode, setDarkModeState] = useState(false);

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
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
