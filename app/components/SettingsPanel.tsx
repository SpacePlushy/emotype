'use client';

import React from 'react';
import { useSettingsContext } from '@/app/context/SettingsContext';
import { useChatContext } from '@/app/context/ChatContext';
import { getAvailablePersonalities } from '@/app/lib/typingEngine';
import { AIModel, ModelOption } from '@/app/types/chat';

const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Recommended - Fast and intelligent',
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Most capable Claude model',
  },
  {
    id: 'openai/gpt-4',
    name: 'GPT-4',
    description: 'OpenAI\'s most capable model',
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective',
  },
];

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
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
  } = useSettingsContext();

  const { clearMessages } = useChatContext();

  const personalities = getAvailablePersonalities();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Appearance
            </h3>
            <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <span className="text-gray-800 dark:text-gray-100">Dark mode</span>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-5 h-5"
              />
            </label>
          </div>

          {/* AI Model Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              AI Model
            </h3>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map((modelOption) => (
                <label
                  key={modelOption.id}
                  className="flex items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="model"
                    value={modelOption.id}
                    checked={model === modelOption.id}
                    onChange={() => setModel(modelOption.id as AIModel)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {modelOption.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {modelOption.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Typing Personality */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Typing Personality
            </h3>
            <div className="space-y-2">
              {personalities.map((p) => (
                <label
                  key={p.id}
                  className="flex items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="personality"
                    value={p.id}
                    checked={personality === p.id}
                    onChange={() => setPersonality(p.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-gray-100">{p.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {p.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Animation Toggle */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Animation
            </h3>
            <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <span className="text-gray-800 dark:text-gray-100">Enable typing animation</span>
              <input
                type="checkbox"
                checked={animationEnabled}
                onChange={(e) => setAnimationEnabled(e.target.checked)}
                className="w-5 h-5"
              />
            </label>
          </div>

          {/* Speed Multiplier */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Typing Speed
            </h3>
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Slower</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {typingSpeedMultiplier.toFixed(1)}x
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Faster</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={typingSpeedMultiplier}
                onChange={(e) =>
                  setTypingSpeedMultiplier(parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Clear Conversation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Conversation
            </h3>
            <button
              onClick={() => {
                if (
                  confirm('Are you sure you want to clear all messages?')
                ) {
                  clearMessages();
                  onClose();
                }
              }}
              className="w-full px-4 py-3 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              Clear Conversation
            </button>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              About This App
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              AI Typing Simulator creates realistic typing animations for AI
              responses. Configure your preferences above to customize the
              experience.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
