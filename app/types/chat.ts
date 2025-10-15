// Message types
export type MessageRole = 'user' | 'assistant';

export type MessageStatus = 'streaming' | 'ready_to_animate' | 'animating' | 'complete';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status?: MessageStatus; // Only for assistant messages
}

// Typing Personality types
export type TypingPersonalityType =
  | 'natural'
  | 'fast'
  | 'thoughtful'
  | 'excited'
  | 'casual';

export interface TypingPersonality {
  id: TypingPersonalityType;
  name: string;
  description: string;
  baseSpeed: number; // milliseconds per character (50-150ms)
  punctuationPause: number; // pause after punctuation (300-800ms)
  thinkingPauseMin: number; // min thinking pause (500ms)
  thinkingPauseMax: number; // max thinking pause (1500ms)
  thinkingPauseFrequency: number; // probability (0-1)
  backspaceFrequency: number; // probability of typo correction (0-1)
  backspaceLength: number; // characters to backspace (2-5)
  correctionPause: number; // pause after correction (200-500ms)
  speedVariation: number; // random variation in typing speed (0-50ms)
  typoFrequency: number; // probability of making a typo when backspacing (0-1)
  typoVisibilityTime: number; // how long typo shows before correction (100-300ms)
}

// AI Model types
export type AIModel =
  | 'anthropic/claude-3.5-sonnet'
  | 'anthropic/claude-3-opus'
  | 'openai/gpt-4'
  | 'openai/gpt-3.5-turbo';

export interface ModelOption {
  id: AIModel;
  name: string;
  description: string;
}

// Typing Animation types
export interface TypingState {
  isTyping: boolean;
  displayedText: string;
  fullText: string;
  cursorPosition: number;
}

// Markup command types (optional enhancement)
export type MarkupCommand =
  | { type: 'PAUSE'; duration: number }
  | { type: 'BACKSPACE'; count: number }
  | { type: 'THINK'; duration: number }
  | { type: 'SPEED'; speed: 'fast' | 'normal' | 'slow' }
  | { type: 'TYPE'; text: string };

// Chat Context types
export interface ChatContextType {
  messages: Message[];
  addMessage: (role: MessageRole, content: string, status?: MessageStatus) => string;
  updateMessage: (id: string, content: string, status?: MessageStatus) => void;
  setMessageStatus: (id: string, status: MessageStatus) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Settings Context types
export interface SettingsContextType {
  personality: TypingPersonalityType;
  setPersonality: (personality: TypingPersonalityType) => void;
  model: AIModel;
  setModel: (model: AIModel) => void;
  animationEnabled: boolean;
  setAnimationEnabled: (enabled: boolean) => void;
  typingSpeedMultiplier: number;
  setTypingSpeedMultiplier: (multiplier: number) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
}

// OpenRouter API types
export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  stream: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface OpenRouterStreamChunk {
  id: string;
  choices: Array<{
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason?: string | null;
  }>;
}

// API Response types
export interface ChatAPIRequest {
  message: string;
  model: AIModel;
  conversationHistory: Message[];
}

export interface ChatAPIResponse {
  success: boolean;
  error?: string;
}
