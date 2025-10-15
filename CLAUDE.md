# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Emotype** is an AI chat application that simulates realistic human typing behavior in real-time. Instead of instantly displaying AI responses, the app streams responses character-by-character with natural pauses, speed variations, typos, and corrections—creating the experience of watching a real person type.

## Key Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npx playwright test                    # Run all Playwright tests
npx playwright test --ui               # Run tests in UI mode
npx playwright test animation-debug    # Run specific test file
npx playwright show-report             # View test report
```

## Environment Setup

Required environment variables in `.env.local`:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get an OpenRouter API key at https://openrouter.ai

## Architecture

### Core Animation System

The typing animation is the heart of this application. Understanding how it works:

1. **Streaming Pipeline**: User message → Next.js API route → OpenRouter API → Streaming response back to client
2. **Animation Engine** ([typingEngine.ts](app/lib/typingEngine.ts)): Calculates character delays, pauses, and typing behaviors based on personality profiles
3. **TypingAnimator Component** ([TypingAnimator.tsx](app/components/TypingAnimator.tsx)): Consumes streaming API responses and displays them character-by-character with realistic timing
4. **Typo System**: Generates realistic typos using keyboard proximity maps, then backspaces and corrects them

### State Management Flow

Two React Context providers manage global state:

- **ChatContext** ([ChatContext.tsx](app/context/ChatContext.tsx)): Manages messages, conversation state, and loading states
  - Messages have statuses: `streaming` → `ready_to_animate` → `animating` → `complete`
  - Each message has a unique ID for updates during streaming

- **SettingsContext** ([SettingsContext.tsx](app/context/SettingsContext.tsx)): Controls typing personality, AI model selection, animation settings, and speed multiplier

Components use these contexts via custom hooks: `useChatContext()` and `useSettingsContext()`

### Message Status Lifecycle

Understanding message states is critical for working with the animation system:

1. **User sends message** → Immediately shown as complete
2. **API response starts** → Message created with `streaming` status
3. **Stream chunks arrive** → Content accumulated in message
4. **Stream ends** → Status changes to `ready_to_animate`
5. **TypingAnimator starts** → Status changes to `animating`
6. **Animation completes** → Status changes to `complete`

### Typing Personality System

Five pre-configured personalities in [typingEngine.ts](app/lib/typingEngine.ts):
- **Natural**: Balanced, 80ms base speed, 8% backspace frequency, 70% typo rate
- **Fast**: Quick, 50ms base speed, 3% backspace frequency, 50% typo rate
- **Thoughtful**: Deliberate, 120ms base speed, 5% backspace frequency, 40% typo rate
- **Excited**: Energetic, 60ms base speed, 10% backspace frequency, 80% typo rate
- **Casual**: Relaxed, 90ms base speed, 12% backspace frequency, 75% typo rate

Each personality controls:
- `baseSpeed`: Milliseconds per character
- `punctuationPause`: Delay after punctuation marks
- `thinkingPauseMin/Max/Frequency`: Random pauses mid-response
- `backspaceFrequency`: How often corrections occur
- `typoFrequency`: Probability of actual typo vs simple retype
- `typoVisibilityTime`: How long typos display before correction

### Typo Generation System

The typo system creates realistic mistakes:

1. **Keyboard Proximity Map**: QWERTY layout mapping for adjacent key typos (e.g., 'r' instead of 't')
2. **Typo Types**:
   - Adjacent key mistakes (using proximity map)
   - Double letters ("hellow" instead of "hello")
   - Common transpositions ("teh" instead of "the")
3. **Typo Flow**: Type wrong characters → Pause briefly → Backspace → Type correct text

See `generateTypo()` and `generateTypoSequence()` methods in [typingEngine.ts:300-391](app/lib/typingEngine.ts#L300-L391)

## API Integration

### OpenRouter Streaming

The [/api/chat/route.ts](app/api/chat/route.ts) endpoint:
- Receives user message and model selection
- Makes streaming request to OpenRouter API
- Forwards stream chunks to client in real-time
- Handles errors and API key validation

**Important**: API key is never exposed to client—all OpenRouter calls go through Next.js API routes.

### Supported Models

Via OpenRouter:
- `anthropic/claude-3.5-sonnet` (recommended)
- `anthropic/claude-3-opus`
- `openai/gpt-4`
- `openai/gpt-3.5-turbo`

## Component Architecture

### Main Components

- **ChatContainer** ([ChatContainer.tsx](app/components/ChatContainer.tsx)): Orchestrates API calls, manages streaming state, coordinates message status updates
- **TypingAnimator** ([TypingAnimator.tsx](app/components/TypingAnimator.tsx)): Core animation logic—takes `fullText` and renders it character-by-character based on personality
- **Message** ([Message.tsx](app/components/Message.tsx)): Individual message bubble, integrates TypingAnimator for assistant messages
- **MessageList** ([MessageList.tsx](app/components/MessageList.tsx)): Scrollable container with auto-scroll to bottom
- **InputBar** ([InputBar.tsx](app/components/InputBar.tsx)): Text input with send button
- **SettingsPanel** ([SettingsPanel.tsx](app/components/SettingsPanel.tsx)): Sidebar for personality, model, and animation settings

### Key Props Flow

```
ChatContainer (manages API & state)
  ↓
MessageList (displays messages)
  ↓
Message (individual bubble)
  ↓
TypingAnimator (if assistant message)
  - fullText: Complete message content
  - personality: Current typing personality
  - speedMultiplier: Speed adjustment (0.1-3.0)
  - enabled: Whether animation is enabled
  - onComplete: Callback when animation finishes
```

## TypeScript Types

All types defined in [chat.ts](app/types/chat.ts):

- `Message`: Core message structure with role, content, timestamp, status
- `TypingPersonality`: Complete typing behavior configuration
- `TypingPersonalityType`: Union type of personality IDs
- `MessageStatus`: State machine for message lifecycle
- `AIModel`: Supported AI model identifiers

## Working with the Typing System

### Adding a New Typing Personality

1. Add type to `TypingPersonalityType` in [chat.ts](app/types/chat.ts#L15-L20)
2. Add personality config to `TYPING_PERSONALITIES` in [typingEngine.ts](app/lib/typingEngine.ts#L56-L141)
3. Include all required parameters: baseSpeed, pauses, frequencies, typo settings

### Modifying Typing Behavior

The animation algorithm is in [TypingAnimator.tsx:105-168](app/components/TypingAnimator.tsx#L105-L168):
- Handles both typo injection and traditional backspace/retype
- Uses `engine.shouldMakeTypo()` to decide between typo modes
- Typo mode: Generates wrong text → Shows briefly → Backspaces → Continues correct
- Traditional mode: Backspaces existing text → Retypes same text correctly

### Debugging Animation Issues

- Check `animationRef.current` to see if animation was cancelled
- Verify `hasStartedRef.current` prevents duplicate animations
- Look at message status transitions in ChatContext
- Use browser DevTools to monitor state updates
- Check Playwright tests in [tests/](tests/) for expected behavior

## Build System

- **Framework**: Next.js 15.5.5 with App Router
- **Bundler**: Turbopack (enabled via `--turbopack` flag)
- **Styling**: Tailwind CSS v4 with PostCSS
- **Type Checking**: TypeScript 5+ with strict mode
- **Testing**: Playwright for E2E tests

### Build Notes

- All builds use Turbopack for faster compilation
- API routes use Edge runtime (see warning in build output)
- Static pages are pre-rendered during build
- First Load JS is ~120kB (acceptable for this app size)

## Development Patterns

### When Adding Features

1. **Update types first** in [chat.ts](app/types/chat.ts) if adding new configuration
2. **Modify TypingEngine** for animation logic changes
3. **Update TypingAnimator** for display/rendering changes
4. **Add to Context** if it needs global state
5. **Test with different personalities** to ensure consistent behavior

### Testing Strategy

- E2E tests use Playwright (see [playwright.config.ts](playwright.config.ts))
- Tests run against `http://localhost:3002`
- Dev server auto-starts for tests via `webServer` config
- Visual regression possible with screenshot/video capture enabled

### Performance Considerations

- Animation runs at 60fps—avoid blocking the main thread
- Use `requestAnimationFrame` for smooth updates (already handled in delay utility)
- Large responses (>2000 chars) should still animate smoothly
- Cancel animations on unmount via `animationRef.current = false`

## Common Gotchas

1. **Double Animation**: If a message animates twice, check `hasStartedRef.current` logic
2. **Stream Not Showing**: Verify API key is set and OpenRouter account has credits
3. **Typos Not Appearing**: Check `typoFrequency` and ensure `shouldMakeTypo()` returns true
4. **Performance Issues**: Reduce speed multiplier or disable animations for testing
5. **Port Conflicts**: Dev server tries 3000, falls back to 3001, 3002, etc.

## Project Context

This is a **Proof of Concept** validating the typing animation concept before building a native macOS app. The PRD is in [ai-typing-simulator-prd.md](ai-typing-simulator-prd.md) for complete product context.

Focus areas:
- Natural, human-like typing feel
- Smooth streaming integration
- Customizable personalities
- Clean, simple UX
