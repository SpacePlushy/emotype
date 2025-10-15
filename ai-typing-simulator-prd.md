# Product Requirements Document (PRD)
## AI Typing Simulator - Proof of Concept

**Version:** 1.0  
**Date:** October 14, 2025  
**Author:** Product Team  
**Status:** Draft

---

## Executive Summary

The AI Typing Simulator is a web-based proof of concept that creates a more human and engaging AI chat experience by visualizing realistic typing behavior in real-time. Instead of showing a generic "typing..." indicator, users will see the AI's response appear character-by-character as it's being generated—complete with natural pauses, speed variations, occasional backspaces, and "thinking" moments. The typing animation happens live as the AI composes its response, creating an authentic feeling of conversation with a real person.

This POC will validate the core concept and user engagement before developing a full macOS native application.

---

## Problem Statement

Current AI chat interfaces either display responses instantly or show a generic "typing..." indicator that provides no insight into the conversation flow. Users are accustomed to messaging apps where they can watch someone typing in real-time, seeing pauses, corrections, and the organic rhythm of human thought. This disconnect reduces the conversational "warmth" of AI interactions.

**Key Issues:**
- AI responses appear instantly or behind a generic loading indicator
- No visual feedback that mimics the live typing experience of human conversation
- Missing the anticipation and natural rhythm of watching someone compose their thoughts
- Lack of personality in how AI "types" its responses in real-time
- No sense of the AI "thinking" or "composing" its message

---

## Goals and Objectives

### Primary Goals
1. **Validate the Concept**: Determine if realistic typing animations improve user engagement and satisfaction
2. **Test Technical Feasibility**: Prove that the typing simulation can work smoothly in a web environment
3. **Gather User Feedback**: Understand which typing behaviors feel most natural and engaging

### Success Metrics
- Users report the experience feels "more human" (qualitative feedback)
- Average session time increases compared to standard AI chat
- Users complete conversations rather than abandoning mid-chat
- Positive sentiment in user testing feedback

---

## Target Audience

### Primary Users (POC Phase)
- Early adopters interested in AI technology
- Users who value conversational UX design
- Potential beta testers aged 25-45
- Tech-savvy individuals comfortable with web applications

### Use Cases
1. Casual conversation with AI
2. Getting help or advice in a more personal way
3. Creative brainstorming sessions
4. Entertainment and novel AI interaction

---

## Features and Requirements

### Core Features (Must Have)

#### 1. Chat Interface
- Clean, modern messaging UI similar to iMessage or WhatsApp
- Message bubbles for user and AI messages
- Text input field with send button
- Scrollable conversation history
- Responsive design (desktop and mobile)

#### 2. AI Integration
- Integration with OpenRouter API (supports multiple AI models)
- Use Claude or other compatible models through OpenRouter
- Stream API responses for real-time typing visualization
- Handle API errors gracefully
- Rate limiting awareness
- API key management (stored in environment variables)

#### 3. Typing Animation System
**The core innovation of the application**

The AI's response will be displayed character-by-character in real-time as it's being generated, creating the authentic experience of watching someone type. The animation will occur live as the streaming API returns content.

**Typing Behaviors:**
- **Live Streaming**: Display characters as they arrive from the API
- **Variable Speed**: 50-150ms per character with natural variation
- **Punctuation Pauses**: 300-800ms pause after periods, commas, exclamation points
- **Thinking Pauses**: Random 500-1500ms pauses mid-sentence (2-3 times per response)
- **Backspace Corrections**: Occasionally delete 2-5 characters and retype (simulating typos)
- **Natural Rhythm**: Vary typing speed based on word complexity
- **Active Typing**: Show cursor or blinking indicator at the current typing position

**Animation Control:**
- Ability to skip animation and show full response instantly
- Smooth, performant rendering even with long responses
- Character-by-character reveal with proper Unicode support
- Real-time processing of streaming API responses

#### 4. Typing Personality Profiles
Pre-configured typing styles users can experience:

1. **Natural Human** - Balanced speed, occasional pauses and corrections
2. **Fast Typer** - Quick responses, fewer pauses, minimal corrections
3. **Thoughtful** - Slower speed, longer pauses, careful typing
4. **Excited** - Fast bursts, lots of punctuation pauses, energetic feel
5. **Casual** - More corrections, relaxed pace, natural flow

#### 5. Markup System
The AI response will include hidden markup that controls animation:

```
[PAUSE:500]Hey there![PAUSE:300] I was thinking[BACKSPACE:8]wondering about your question[THINK:1000] and here's what I came up with...
```

**Markup Commands:**
- `[PAUSE:ms]` - Pause for specified milliseconds
- `[BACKSPACE:n]` - Delete n characters and prepare to retype
- `[THINK:ms]` - Show thinking indicator for specified milliseconds
- `[SPEED:fast|normal|slow]` - Change typing speed
- `[TYPE:text]` - Specify replacement text after backspace

### Secondary Features (Nice to Have)

#### 6. Settings Panel
- Toggle typing animations on/off
- Select typing personality
- Choose AI model from OpenRouter options:
  - Claude 3.5 Sonnet (recommended)
  - Claude 3 Opus
  - GPT-4
  - GPT-3.5 Turbo
  - Other available models
- Adjust base typing speed slider
- Control pause duration multiplier
- View current API usage (optional)

#### 7. Conversation Management
- Clear conversation button
- Basic conversation history (session-based)
- Copy message text

#### 8. Visual Polish
- Smooth scrolling to new messages
- Fade-in effects for new message bubbles
- Cursor blinking effect during typing
- Sound effects toggle (optional typing sounds)

---

## Technical Requirements

### Frontend Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (recommended) or JavaScript
- **Styling**: Tailwind CSS for styling and animations
- **State Management**: React hooks (useState, useEffect)
- **Deployment**: Vercel (optimized for Next.js)

### Backend/API
- **AI Provider**: OpenRouter API (https://openrouter.ai)
- **Supported Models**: Claude, GPT-4, and other compatible models
- **API Routes**: Next.js API routes (/api/chat) for secure API key handling
- **Streaming**: Server-Sent Events (SSE) or streaming responses
- **Rate Limiting**: Implement server-side throttling
- **Error Handling**: Graceful degradation if API fails
- **Environment Variables**: Store OpenRouter API key in .env.local

### Browser Support
- Chrome (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest version)

### Performance Requirements
- Typing animation runs at 60fps
- No dropped frames during typing
- Response time: <100ms to start typing after API response
- Support responses up to 2000 characters smoothly

### Security & Privacy
- API keys stored securely (environment variables)
- Next.js API routes prevent exposing keys to client
- No persistent storage of conversations (POC phase)
- HTTPS required in production
- No collection of personal data
- OpenRouter API key never exposed to browser

### Environment Setup

**Required Environment Variables:**
```bash
# .env.local file
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting an OpenRouter API Key:**
1. Visit https://openrouter.ai
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Add credits to your account
6. Copy the key to your .env.local file

**Development Setup:**
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## User Stories

### As a User...

1. **Basic Interaction**
   - I want to type a message and send it to the AI
   - I want to see my message appear in a chat bubble
   - I want to see a typing indicator before the AI responds

2. **Typing Animation**
   - I want to watch the AI "type" its response character by character
   - I want to see natural pauses that make it feel like a real person
   - I want to occasionally see the AI "correct" itself with backspaces

3. **Customization**
   - I want to choose different typing personalities
   - I want to skip the animation if I'm in a hurry
   - I want to adjust the typing speed to my preference

4. **Experience**
   - I want the chat to feel conversational and engaging
   - I want smooth animations without lag
   - I want to easily read previous messages

---

## User Flow

### Primary Flow

1. **Landing Page**
   - User sees clean chat interface
   - Brief explanation: "Chat with AI that types like a human"
   - Input field is ready for first message

2. **First Message**
   - User types message and clicks send or presses Enter
   - Message appears in user bubble on right side
   - Empty AI bubble appears on left side with blinking cursor

3. **AI Response (Real-Time Typing)**
   - Text begins appearing character by character in real-time
   - User watches the AI "type" its response live
   - Natural pauses, speed variations, and occasional backspaces occur
   - Cursor blinks at the current typing position
   - User can watch the typing or skip to full response

4. **Continued Conversation**
   - User can respond immediately or wait for completion
   - Scrolling automatically follows conversation
   - Pattern repeats for each exchange

5. **Settings (Optional Path)**
   - User clicks settings icon
   - Can toggle typing animations on/off
   - Can select different typing personality
   - Can choose AI model (via OpenRouter)
   - Changes apply to next AI response

---

## UI/UX Specifications

### Layout

```
┌─────────────────────────────────────────┐
│  AI Typing Simulator         [⚙️]       │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────┐                  │
│  │ Hi! How are you? │ (AI - Left)      │
│  └──────────────────┘                  │
│                                         │
│                  ┌──────────────────┐  │
│                  │ I'm great thanks!│  │
│                  └──────────────────┘  │
│                  (User - Right)         │
│                                         │
│  ┌──────────────────────────────┐     │
│  │ Let me think about th▊       │     │
│  └──────────────────────────────┘     │
│  (AI typing in real-time with cursor)  │
│                                         │
├─────────────────────────────────────────┤
│  [Type your message here...    ] [Send]│
└─────────────────────────────────────────┘
```

### Color Scheme
- **AI Bubbles**: Light gray (#F0F0F0)
- **User Bubbles**: Blue (#007AFF) with white text
- **Background**: White or light gradient
- **Text**: Dark gray (#333333)
- **Accent**: Blue for interactive elements

### Typography
- **Font**: System font stack (SF Pro, Segoe UI, Roboto)
- **Message Text**: 16px, line-height 1.5
- **Timestamps**: 12px, gray
- **Input**: 16px

### Cursor & Typing Animation
- **Cursor Style**: Blinking vertical bar (|) or block (█)
- **Cursor Color**: Matches text color with 50% opacity
- **Blink Rate**: 530ms on/off cycle (standard text cursor timing)
- **Cursor Behavior**:
  - Appears at end of typing text
  - Blinks while "thinking" or pausing
  - Disappears when message is complete
  - Smooth transitions
- **Text Appearance**: 
  - Characters fade in slightly as they appear (50ms fade)
  - No jarring instant appearance
  - Smooth scroll-to-bottom as text grows

---

## Technical Architecture

### Component Structure

```
app/
├── page.tsx (Home/Chat page)
├── layout.tsx (Root layout)
├── api/
│   └── chat/
│       └── route.ts (OpenRouter API endpoint)
├── components/
│   ├── ChatContainer.tsx
│   ├── MessageList.tsx
│   ├── Message.tsx
│   ├── TypingAnimator.tsx
│   ├── InputBar.tsx
│   └── SettingsPanel.tsx
├── lib/
│   ├── openrouter.ts (API client)
│   └── typingEngine.ts (Animation logic)
└── types/
    └── chat.ts (TypeScript interfaces)
```

### Data Flow

1. User submits message → stored in state
2. Message sent to Next.js API route (/api/chat)
3. API route initiates streaming request to OpenRouter
4. Stream chunks received in real-time from OpenRouter
5. Each chunk sent to client via Server-Sent Events (SSE)
6. TypingAnimator receives chunks and displays with realistic timing
7. Character-by-character rendering with natural pauses and behaviors
8. Complete message stored in conversation history when stream ends

### Typing Animation Algorithm

```javascript
// Pseudocode for streaming animation
async function animateStreamingResponse(stream, personality) {
  let buffer = '';
  let displayedText = '';
  
  for await (const chunk of stream) {
    buffer += chunk;
    
    // Process buffer with typing personality rules
    while (buffer.length > 0) {
      const char = buffer[0];
      
      // Natural typing delay based on personality
      await delay(getTypingDelay(char, personality));
      
      // Check for natural pause points
      if (isPunctuation(char)) {
        await delay(personality.punctuationPause);
      }
      
      // Occasional backspace simulation
      if (shouldSimulateTypo(personality)) {
        await simulateBackspace(displayedText, 3);
        await delay(personality.correctionPause);
      }
      
      // Random thinking pauses
      if (shouldPause(personality)) {
        await delay(personality.thinkingPause);
      }
      
      // Display character
      displayedText += char;
      updateUI(displayedText);
      buffer = buffer.slice(1);
    }
  }
}

function getTypingDelay(char, personality) {
  const baseSpeed = personality.baseSpeed; // 50-150ms
  const variation = Math.random() * 50; // Add randomness
  
  if (char === ' ') return baseSpeed * 0.5; // Spaces are faster
  if (isComplexChar(char)) return baseSpeed * 1.5; // Complex chars slower
  
  return baseSpeed + variation;
}
```

### Streaming Architecture Details

**How Streaming Works:**

1. **Client → Next.js API Route**
   ```typescript
   // Client sends request
   const response = await fetch('/api/chat', {
     method: 'POST',
     body: JSON.stringify({ message: userMessage, model: selectedModel })
   });
   
   const reader = response.body.getReader();
   // Read stream chunks
   ```

2. **API Route → OpenRouter**
   ```typescript
   // app/api/chat/route.ts
   const stream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       model: 'anthropic/claude-3-sonnet',
       messages: [...],
       stream: true
     })
   });
   
   // Forward stream to client
   return new Response(stream.body);
   ```

3. **Client Receives & Animates**
   ```typescript
   // Process each chunk with typing animation
   while (true) {
     const { done, value } = await reader.read();
     if (done) break;
     
     const chunk = decoder.decode(value);
     // Apply typing animation logic
     await animateChunk(chunk, personality);
   }
   ```

**Benefits of This Architecture:**
- Real-time response feels truly live
- No artificial delay before typing starts
- Natural pauses emerge from stream timing
- Can start showing response while AI is still generating
- More authentic "thinking" appearance

---

## Prompt Engineering for AI

Since the typing animation is driven by the client-side animation engine processing the streaming response, the AI doesn't need special markup. However, you can still optionally prompt the AI to generate responses in a way that works well with natural typing animation.

### System Prompt Template (Optional)

```
You are a conversational AI assistant. Your responses will be displayed 
with realistic typing animations as you generate them.

Guidelines for natural-feeling responses:
1. Write naturally and conversationally
2. Use proper punctuation for natural pauses
3. Break complex thoughts into sentences
4. Vary sentence length for natural rhythm
5. Use contractions and casual language when appropriate

The user will see your response appear character by character in real-time,
so write as if you're having a natural conversation.
```

### Alternative: Markup System (Optional Enhancement)

If you want the AI to have more control over typing behavior, you can implement an optional markup system:

```
You can optionally include these commands:
- [PAUSE:500] - Pause typing (use sparingly)
- [THINK] - Show brief thinking moment
- [SLOW] - Slow down typing speed temporarily
- [FAST] - Speed up typing temporarily

Example:
"Hey there! I was wondering about your question[PAUSE:500] and here's 
what I think..."
```

**Note**: For the POC, markup is optional. The animation engine can create 
natural typing behavior automatically based on punctuation, sentence structure, 
and the typing personality selected.

---

## Development Phases

### Phase 1: Core Foundation (Week 1)
- Set up Next.js project with TypeScript and Tailwind CSS
- Create basic chat UI components
- Implement message sending/receiving
- Set up Next.js API route for OpenRouter
- Configure environment variables for API key
- Implement basic streaming from API route
- Basic styling with Tailwind

**Deliverable**: Working Next.js chat interface with streaming AI responses (no animation yet)

### Phase 2: Real-Time Typing Animation (Week 2)
- Build TypingAnimator component with streaming support
- Implement character-by-character display from stream
- Add variable speed timing logic
- Add punctuation pause detection
- Implement cursor blinking at typing position
- Test performance with long streamed messages

**Deliverable**: AI responses stream and display with character-by-character typing

### Phase 3: Advanced Behaviors (Week 3)
- Implement backspace/correction animation during streaming
- Add thinking pauses at natural points
- Add speed variations based on content
- Optional: Implement markup parser for AI-controlled behaviors
- Add "skip animation" button
- Polish streaming performance

**Deliverable**: Full realistic typing simulation with natural behaviors

### Phase 4: Personalities & Polish (Week 4)
- Implement 5 typing personalities
- Add settings panel with model selection
- Optimize animation performance
- Add visual polish and transitions
- Mobile responsive design
- Add loading states and error handling
- Deployment to Vercel

**Deliverable**: Complete POC ready for user testing

---

## Testing Strategy

### Functional Testing
- Message sending and receiving works correctly
- API integration handles errors gracefully
- Typing animation plays smoothly
- All typing personalities work as expected
- Settings changes apply correctly

### Performance Testing
- Animation runs at 60fps
- No memory leaks during long conversations
- Handles responses up to 2000 characters
- Works on mobile devices

### User Testing
- 10-15 test users from target audience
- Provide specific scenarios to test
- Gather qualitative feedback on "humanness"
- A/B test: animated vs. instant responses
- Collect data on typing personality preferences

### Browser Testing
- Test on all supported browsers
- Verify animations work on mobile Safari
- Check responsive design breakpoints

---

## Success Criteria

The POC will be considered successful if:

1. **Technical Viability**: The typing animation system works smoothly without performance issues
2. **User Engagement**: 70%+ of testers prefer the animated version over instant responses
3. **Natural Feel**: 60%+ of testers describe the experience as "more human" or "more engaging"
4. **No Blockers**: No technical issues that would prevent scaling to native app
5. **Positive Feedback**: Average rating of 4/5 or higher from test users

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API rate limits hit | High | Implement server-side throttling, show user-friendly errors |
| Streaming connection drops | High | Implement reconnection logic, graceful error handling |
| Animation feels gimmicky | High | User testing early, make skip option prominent |
| Performance issues on mobile | Medium | Optimize animation, reduce visual effects on mobile |
| API costs too high for POC | Medium | Set daily request limits, monitor usage closely |
| Users find it annoying | High | Make it easy to disable, adjust timing based on feedback |
| Buffering delays in stream | Medium | Implement smart buffering, adjust animation to mask latency |
| OpenRouter API instability | Medium | Add retry logic, fallback error messages |
| Next.js API route overhead | Low | Optimize API route, consider edge functions |

---

## Future Considerations (Post-POC)

### Native macOS App
- Convert to Swift/SwiftUI
- Better performance
- System integration (menu bar, notifications)
- Local storage of conversations

### Enhanced Features
- Voice typing with pauses
- Emotion detection in typing speed
- Multiple AI personality avatars
- Conversation export
- User accounts and history

### Advanced Typing Behaviors
- Context-aware pauses (longer for complex topics)
- Typing speed influenced by message content
- Emotional typing patterns (excited, hesitant, etc.)
- "Reading" delay proportional to user message length

---

## Appendix

### A. Technical References
- OpenRouter API Documentation: https://openrouter.ai/docs
- Next.js Documentation: https://nextjs.org/docs
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Server-Sent Events (SSE): MDN Web Docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript Documentation: https://www.typescriptlang.org/docs

### B. Design Inspiration
- iMessage (iOS)
- WhatsApp Web
- Telegram Web
- Slack messaging interface

### C. Glossary
- **POC**: Proof of Concept
- **Typing Indicator**: Visual element showing someone is typing
- **Message Bubble**: Rounded container for chat messages
- **Markup Commands**: Special text codes that control animation
- **Typing Personality**: Pre-defined set of typing behaviors

---

## Approval and Sign-off

**Product Owner:** _________________ Date: _______

**Engineering Lead:** _________________ Date: _______

**Design Lead:** _________________ Date: _______

---

*Document Version History*
- v1.0 (Oct 14, 2025) - Initial PRD for POC created
