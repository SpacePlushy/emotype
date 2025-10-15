import { TypingPersonality, TypingPersonalityType } from '@/app/types/chat';

/**
 * Keyboard Proximity Map (QWERTY layout)
 * Maps each key to its adjacent keys for realistic typos
 */
const KEYBOARD_PROXIMITY: Record<string, string[]> = {
  q: ['w', 'a', 's'],
  w: ['q', 'e', 'a', 's', 'd'],
  e: ['w', 'r', 's', 'd', 'f'],
  r: ['e', 't', 'd', 'f', 'g'],
  t: ['r', 'y', 'f', 'g', 'h'],
  y: ['t', 'u', 'g', 'h', 'j'],
  u: ['y', 'i', 'h', 'j', 'k'],
  i: ['u', 'o', 'j', 'k', 'l'],
  o: ['i', 'p', 'k', 'l'],
  p: ['o', 'l'],
  a: ['q', 'w', 's', 'z'],
  s: ['a', 'w', 'e', 'd', 'z', 'x'],
  d: ['s', 'e', 'r', 'f', 'x', 'c'],
  f: ['d', 'r', 't', 'g', 'c', 'v'],
  g: ['f', 't', 'y', 'h', 'v', 'b'],
  h: ['g', 'y', 'u', 'j', 'b', 'n'],
  j: ['h', 'u', 'i', 'k', 'n', 'm'],
  k: ['j', 'i', 'o', 'l', 'm'],
  l: ['k', 'o', 'p'],
  z: ['a', 's', 'x'],
  x: ['z', 's', 'd', 'c'],
  c: ['x', 'd', 'f', 'v'],
  v: ['c', 'f', 'g', 'b'],
  b: ['v', 'g', 'h', 'n'],
  n: ['b', 'h', 'j', 'm'],
  m: ['n', 'j', 'k'],
};

/**
 * Common letter transpositions in English
 */
const COMMON_TRANSPOSITIONS = [
  ['th', 'ht'],
  ['he', 'eh'],
  ['in', 'ni'],
  ['er', 're'],
  ['an', 'na'],
  ['re', 'er'],
  ['on', 'no'],
  ['at', 'ta'],
  ['en', 'ne'],
  ['it', 'ti'],
];

/**
 * Typing Personality Profiles
 * Each profile defines how the AI "types" its responses
 */
export const TYPING_PERSONALITIES: Record<TypingPersonalityType, TypingPersonality> = {
  natural: {
    id: 'natural',
    name: 'Natural Human',
    description: 'Balanced speed with occasional pauses and corrections',
    baseSpeed: 80, // ms per character
    punctuationPause: 400,
    thinkingPauseMin: 700,
    thinkingPauseMax: 1200,
    thinkingPauseFrequency: 0.15, // 15% chance per sentence
    backspaceFrequency: 0.08, // 8% chance
    backspaceLength: 3,
    correctionPause: 300,
    speedVariation: 30,
    typoFrequency: 0.5, // 50% of backspaces will be realistic typos
    typoVisibilityTime: 200
  },

  fast: {
    id: 'fast',
    name: 'Fast Typer',
    description: 'Quick responses with minimal pauses',
    baseSpeed: 50,
    punctuationPause: 200,
    thinkingPauseMin: 400,
    thinkingPauseMax: 800,
    thinkingPauseFrequency: 0.05,
    backspaceFrequency: 0.03,
    backspaceLength: 2,
    correctionPause: 150,
    speedVariation: 20,
    typoFrequency: 0.3, // 30% - faster typers make fewer typos
    typoVisibilityTime: 150
  },

  thoughtful: {
    id: 'thoughtful',
    name: 'Thoughtful',
    description: 'Slower, more deliberate typing with careful pauses',
    baseSpeed: 120,
    punctuationPause: 600,
    thinkingPauseMin: 1000,
    thinkingPauseMax: 1500,
    thinkingPauseFrequency: 0.25,
    backspaceFrequency: 0.05,
    backspaceLength: 4,
    correctionPause: 400,
    speedVariation: 40,
    typoFrequency: 0.2, // 20% - very careful, rarely makes typos
    typoVisibilityTime: 250
  },

  excited: {
    id: 'excited',
    name: 'Excited',
    description: 'Fast bursts with energetic punctuation pauses',
    baseSpeed: 60,
    punctuationPause: 500,
    thinkingPauseMin: 300,
    thinkingPauseMax: 600,
    thinkingPauseFrequency: 0.12,
    backspaceFrequency: 0.10,
    backspaceLength: 3,
    correctionPause: 200,
    speedVariation: 35,
    typoFrequency: 0.7, // 70% - excited = more mistakes!
    typoVisibilityTime: 180
  },

  casual: {
    id: 'casual',
    name: 'Casual',
    description: 'Relaxed pace with more corrections and natural flow',
    baseSpeed: 90,
    punctuationPause: 450,
    thinkingPauseMin: 600,
    thinkingPauseMax: 1000,
    thinkingPauseFrequency: 0.18,
    backspaceFrequency: 0.12,
    backspaceLength: 4,
    correctionPause: 350,
    speedVariation: 40,
    typoFrequency: 0.6, // 60% - casual typing has more mistakes
    typoVisibilityTime: 220
  },
};

/**
 * Typing Engine
 * Handles the logic for realistic typing animations
 */
export class TypingEngine {
  private personality: TypingPersonality;
  private speedMultiplier: number;

  constructor(
    personalityType: TypingPersonalityType = 'natural',
    speedMultiplier: number = 1.0
  ) {
    this.personality = TYPING_PERSONALITIES[personalityType];
    this.speedMultiplier = Math.max(0.1, Math.min(3.0, speedMultiplier));
  }

  /**
   * Calculate delay for typing a character
   */
  getCharacterDelay(char: string): number {
    let delay = this.personality.baseSpeed;

    // Spaces are typed faster
    if (char === ' ') {
      delay *= 0.5;
    }

    // Add random variation
    const variation =
      Math.random() * this.personality.speedVariation -
      this.personality.speedVariation / 2;
    delay += variation;

    // Apply speed multiplier (divide so higher multiplier = faster)
    delay /= this.speedMultiplier;

    return Math.max(10, delay); // Minimum 10ms
  }

  /**
   * Get pause duration after punctuation
   */
  getPunctuationPause(char: string): number {
    const punctuation = ['.', '!', '?', ',', ';', ':'];

    if (punctuation.includes(char)) {
      // Longer pause for sentence-ending punctuation
      const multiplier = ['.', '!', '?'].includes(char) ? 1.5 : 1.0;
      return (this.personality.punctuationPause * multiplier) / this.speedMultiplier;
    }

    return 0;
  }

  /**
   * Determine if a thinking pause should occur
   */
  shouldAddThinkingPause(): boolean {
    return Math.random() < this.personality.thinkingPauseFrequency;
  }

  /**
   * Get thinking pause duration
   */
  getThinkingPause(): number {
    const min = this.personality.thinkingPauseMin;
    const max = this.personality.thinkingPauseMax;
    const duration = min + Math.random() * (max - min);
    return duration / this.speedMultiplier;
  }

  /**
   * Determine if a backspace/correction should occur
   */
  shouldAddBackspace(position: number, totalLength: number): boolean {
    // Don't add backspaces at the very start or end
    if (position < 5 || position > totalLength - 10) {
      return false;
    }

    return Math.random() < this.personality.backspaceFrequency;
  }

  /**
   * Get number of characters to backspace
   */
  getBackspaceLength(): number {
    return Math.floor(
      2 + Math.random() * (this.personality.backspaceLength - 2)
    );
  }

  /**
   * Get pause after correction
   */
  getCorrectionPause(): number {
    return this.personality.correctionPause / this.speedMultiplier;
  }

  /**
   * Check if character is a word boundary
   */
  isWordBoundary(char: string): boolean {
    return char === ' ' || char === '\n';
  }

  /**
   * Check if position is at end of sentence
   */
  isEndOfSentence(text: string, position: number): boolean {
    if (position >= text.length) return false;

    const char = text[position];
    const sentenceEnders = ['.', '!', '?'];

    return sentenceEnders.includes(char);
  }

  /**
   * Get current personality
   */
  getPersonality(): TypingPersonality {
    return this.personality;
  }

  /**
   * Update personality
   */
  setPersonality(personalityType: TypingPersonalityType): void {
    this.personality = TYPING_PERSONALITIES[personalityType];
  }

  /**
   * Update speed multiplier
   */
  setSpeedMultiplier(multiplier: number): void {
    this.speedMultiplier = Math.max(0.1, Math.min(3.0, multiplier));
  }

  /**
   * Determine if a typo should be generated when backspacing
   */
  shouldMakeTypo(): boolean {
    return Math.random() < this.personality.typoFrequency;
  }

  /**
   * Get typo visibility duration
   */
  getTypoVisibilityTime(): number {
    return this.personality.typoVisibilityTime / this.speedMultiplier;
  }

  /**
   * Generate a realistic typo for a given character
   * Returns a string of 1-3 characters that represents a typo
   */
  generateTypo(correctChar: string): string {
    const lowerChar = correctChar.toLowerCase();
    const typoTypes = ['adjacent', 'double', 'transpose'];
    const typoType = typoTypes[Math.floor(Math.random() * typoTypes.length)];

    switch (typoType) {
      case 'adjacent': {
        // Type an adjacent key
        const adjacentKeys = KEYBOARD_PROXIMITY[lowerChar];
        if (adjacentKeys && adjacentKeys.length > 0) {
          const wrongChar = adjacentKeys[Math.floor(Math.random() * adjacentKeys.length)];
          // Preserve case
          return correctChar === correctChar.toUpperCase() && correctChar !== correctChar.toLowerCase()
            ? wrongChar.toUpperCase()
            : wrongChar;
        }
        // Fallback to a random letter if no adjacency map
        const randomLetters = 'abcdefghijklmnopqrstuvwxyz';
        return randomLetters[Math.floor(Math.random() * randomLetters.length)];
      }

      case 'double': {
        // Double the character
        return correctChar + correctChar;
      }

      case 'transpose': {
        // This will be handled differently - return empty for now
        // Transposition needs the next character too
        return '';
      }

      default:
        return correctChar;
    }
  }

  /**
   * Generate a typo sequence that will be typed and then corrected
   * Returns an object with the typo text and how much to backspace
   */
  generateTypoSequence(
    correctText: string,
    position: number
  ): { typoText: string; backspaceCount: number } | null {
    // Don't generate typos at the very start or end
    if (position < 3 || position >= correctText.length - 3) {
      return null;
    }

    const typoLength = Math.min(
      this.getBackspaceLength(),
      correctText.length - position
    );

    // Try transposition first (most realistic)
    if (typoLength >= 2 && Math.random() < 0.3) {
      const nextTwoChars = correctText.substring(position, position + 2).toLowerCase();
      for (const [correct, wrong] of COMMON_TRANSPOSITIONS) {
        if (nextTwoChars === correct) {
          // Found a common transposition - use it
          const typoText = this.preserveCase(wrong, correctText.substring(position, position + 2));
          return {
            typoText,
            backspaceCount: typoText.length,
          };
        }
      }
    }

    // Generate typo by replacing some characters
    let typoText = '';
    for (let i = 0; i < typoLength; i++) {
      const correctChar = correctText[position + i];
      if (i === 0 || Math.random() < 0.5) {
        // Make a typo on this character
        const typoChar = this.generateTypo(correctChar);
        if (typoChar) {
          typoText += typoChar;
        } else {
          typoText += correctChar;
        }
      } else {
        typoText += correctChar;
      }
    }

    return {
      typoText,
      backspaceCount: typoText.length,
    };
  }

  /**
   * Preserve the case pattern from original to typo
   */
  private preserveCase(typoText: string, originalText: string): string {
    let result = '';
    for (let i = 0; i < typoText.length && i < originalText.length; i++) {
      const originalChar = originalText[i];
      const typoChar = typoText[i];
      if (originalChar === originalChar.toUpperCase() && originalChar !== originalChar.toLowerCase()) {
        result += typoChar.toUpperCase();
      } else {
        result += typoChar.toLowerCase();
      }
    }
    return result;
  }
}

/**
 * Utility function to create delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get all available personality types
 */
export function getAvailablePersonalities(): TypingPersonality[] {
  return Object.values(TYPING_PERSONALITIES);
}

/**
 * Get personality by ID
 */
export function getPersonalityById(
  id: TypingPersonalityType
): TypingPersonality {
  return TYPING_PERSONALITIES[id];
}
