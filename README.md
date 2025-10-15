# AI Typing Simulator

A web-based application that creates realistic typing animations for AI chat responses. Watch AI "type" its responses character-by-character with natural pauses, speed variations, and occasional corrections—just like a real person!

## Features

- **Real-time Streaming**: AI responses stream in real-time from the OpenRouter API
- **Realistic Typing Animation**: Character-by-character display with natural behaviors:
  - Variable typing speed (50-150ms per character)
  - Punctuation pauses (300-800ms)
  - Thinking pauses (500-1500ms)
  - Backspace corrections (simulates typos)
  - Blinking cursor during typing
- **5 Typing Personalities**:
  - Natural Human - Balanced and realistic
  - Fast Typer - Quick responses
  - Thoughtful - Slower, deliberate typing
  - Excited - Fast bursts with energy
  - Casual - Relaxed with more corrections
- **Multiple AI Models**: Support for Claude, GPT-4, and other models via OpenRouter
- **Settings Panel**: Customize personality, model, speed, and toggle animations
- **Clean UI**: Modern, responsive chat interface inspired by iMessage

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Provider**: OpenRouter API
- **State Management**: React Context API
- **Deployment**: Ready for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenRouter API key ([Get one here](https://openrouter.ai))

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Running the Application

#### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
emotype/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # OpenRouter API endpoint
│   ├── components/
│   │   ├── ChatContainer.tsx     # Main chat orchestrator
│   │   ├── InputBar.tsx          # Message input component
│   │   ├── Message.tsx           # Individual message bubble
│   │   ├── MessageList.tsx       # List of messages
│   │   ├── SettingsPanel.tsx     # Settings sidebar
│   │   └── TypingAnimator.tsx    # Core typing animation
│   ├── context/
│   │   ├── ChatContext.tsx       # Chat state management
│   │   └── SettingsContext.tsx   # Settings state management
│   ├── lib/
│   │   ├── openrouter.ts         # OpenRouter client
│   │   └── typingEngine.ts       # Typing animation logic
│   ├── types/
│   │   └── chat.ts               # TypeScript interfaces
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page
├── .env.local                    # Environment variables (create from .env.example)
└── package.json
```

## Usage

1. **Start a Conversation**: Type a message in the input box and press Enter or click Send
2. **Watch the AI Type**: The AI's response will appear character-by-character with realistic typing behavior
3. **Customize the Experience**:
   - Click the settings icon (⚙️) in the top right
   - Choose a different typing personality
   - Select an AI model
   - Adjust typing speed
   - Toggle animations on/off
4. **Clear Conversation**: Use the "Clear Conversation" button in settings

## Configuration

### Typing Personalities

Each personality has unique timing characteristics:

- **Natural Human** (Default): Balanced speed with occasional pauses and corrections
- **Fast Typer**: Quick responses with minimal pauses
- **Thoughtful**: Slower, more deliberate typing
- **Excited**: Fast bursts with lots of energy
- **Casual**: Relaxed pace with more corrections

### AI Models

Supported models through OpenRouter:
- Claude 3.5 Sonnet (Recommended)
- Claude 3 Opus
- GPT-4
- GPT-3.5 Turbo

## How It Works

1. **User Input**: User sends a message through the input bar
2. **API Request**: Message is sent to the Next.js API route (`/api/chat`)
3. **OpenRouter Streaming**: API route streams responses from OpenRouter
4. **Real-time Animation**: `TypingAnimator` component displays characters with realistic timing
5. **Typing Engine**: Calculates delays, pauses, and behaviors based on selected personality
6. **Character Display**: Each character appears with natural variations and cursor blinking

## Development

### Key Components

- **TypingAnimator**: Handles the core animation logic with streaming support
- **TypingEngine**: Calculates typing delays and behaviors for each personality
- **ChatContainer**: Orchestrates API calls and streaming state management
- **ChatContext/SettingsContext**: Global state management using React Context

### Adding a New Personality

Edit `app/lib/typingEngine.ts` and add to the `TYPING_PERSONALITIES` object:

```typescript
newpersonality: {
  id: 'newpersonality',
  name: 'New Personality',
  description: 'Description here',
  baseSpeed: 80,
  punctuationPause: 400,
  thinkingPauseMin: 700,
  thinkingPauseMax: 1200,
  thinkingPauseFrequency: 0.15,
  backspaceFrequency: 0.08,
  backspaceLength: 3,
  correctionPause: 300,
  speedVariation: 30,
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variable:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
4. Deploy!

## Troubleshooting

### "OpenRouter API key is not configured" Error

Make sure you've created `.env.local` and added your API key:
```env
OPENROUTER_API_KEY=your_actual_key_here
```

### Streaming Not Working

Check that:
1. Your OpenRouter API key is valid
2. You have credits in your OpenRouter account
3. The model you selected is available

### Build Errors

Run these commands to fix common issues:
```bash
npm install
npm run build
```

## Contributing

This is a proof of concept project. Feel free to fork and customize for your needs!

## License

MIT License

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenRouter](https://openrouter.ai)
- Inspired by the natural typing patterns of human conversation

---

**Note**: This is a POC (Proof of Concept) project designed to validate the typing animation concept. For production use, consider adding:
- User authentication
- Conversation persistence
- Rate limiting
- Error monitoring
- Analytics
