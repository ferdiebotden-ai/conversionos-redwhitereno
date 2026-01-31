---
name: ai-native-development
description: "Patterns for building AI-native applications with Vercel AI SDK, OpenAI, Anthropic, and Google. Covers streaming, structured outputs, tool calling, and validation."
---

# AI-Native Application Development

Comprehensive guide for building production AI-powered applications using the Vercel AI SDK v5/v6, with patterns for multiple providers (OpenAI, Anthropic, Google).

## When to Use This Skill

- Building chat interfaces with streaming responses
- Implementing structured data extraction from AI
- Creating tool-calling agents
- Integrating vision/multimodal capabilities
- Validating AI outputs with Zod schemas
- Building human-in-the-loop AI workflows

## Do NOT Use This Skill

- For static websites without AI features
- For simple API integrations without LLM components
- When using raw fetch calls to AI providers (use the SDK instead)

---

## Core Setup

### Installation

```bash
# Core AI SDK
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google

# For validation
npm install zod
```

### Provider Configuration

```typescript
// lib/ai/providers.ts
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

// Model shortcuts
export const gpt4o = openai('gpt-4o');
export const claude = anthropic('claude-sonnet-4-20250514');
export const gemini = google('gemini-2.0-flash');
```

---

## Pattern 1: Streaming Text (Chat)

Use `streamText` for real-time chat interfaces.

### API Route (App Router)

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@/lib/ai/providers';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages,
    maxTokens: 1000,
  });

  return result.toDataStreamResponse();
}
```

### Client Component

```typescript
'use client';
import { useChat } from '@ai-sdk/react';

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id} className={m.role === 'user' ? 'user' : 'assistant'}>
          {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}
```

---

## Pattern 2: Structured Outputs

Use `generateObject` or `streamObject` for type-safe AI responses.

### Define Schema First

```typescript
// types/schemas.ts
import { z } from 'zod';

export const LeadExtractionSchema = z.object({
  projectType: z.enum(['kitchen', 'bathroom', 'basement', 'other']),
  estimatedBudget: z.object({
    low: z.number(),
    high: z.number(),
  }),
  timeline: z.enum(['asap', '1-3 months', '3-6 months', 'flexible']),
  requirements: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export type LeadExtraction = z.infer<typeof LeadExtractionSchema>;
```

### Generate Structured Data

```typescript
// app/api/extract/route.ts
import { generateObject } from 'ai';
import { openai } from '@/lib/ai/providers';
import { LeadExtractionSchema } from '@/types/schemas';

export async function POST(req: Request) {
  const { conversation } = await req.json();

  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: LeadExtractionSchema,
    prompt: `Extract structured data from this conversation:\n\n${conversation}`,
  });

  // object is fully typed as LeadExtraction
  return Response.json(object);
}
```

### Stream Structured Data

```typescript
import { streamObject } from 'ai';

const { partialObjectStream } = streamObject({
  model: openai('gpt-4o'),
  schema: LeadExtractionSchema,
  prompt: 'Extract lead data...',
});

for await (const partial of partialObjectStream) {
  // partial is typed, updates as fields complete
  console.log(partial.projectType); // may be undefined initially
}
```

---

## Pattern 3: Tool Calling

Enable AI to invoke functions with validated parameters.

### Define Tools

```typescript
// lib/ai/tools.ts
import { tool } from 'ai';
import { z } from 'zod';

export const calculateEstimate = tool({
  description: 'Calculate a renovation cost estimate',
  parameters: z.object({
    projectType: z.enum(['kitchen', 'bathroom', 'basement']),
    squareFeet: z.number().positive(),
    finishLevel: z.enum(['economy', 'standard', 'premium']),
  }),
  execute: async ({ projectType, squareFeet, finishLevel }) => {
    // Your pricing logic here
    const rates = {
      kitchen: { economy: 150, standard: 225, premium: 350 },
      bathroom: { economy: 200, standard: 300, premium: 450 },
      basement: { economy: 40, standard: 60, premium: 85 },
    };
    const rate = rates[projectType][finishLevel];
    return {
      estimate: squareFeet * rate,
      breakdown: { sqft: squareFeet, rate, total: squareFeet * rate },
    };
  },
});

export const searchProducts = tool({
  description: 'Search for products in catalog',
  parameters: z.object({
    query: z.string(),
    category: z.string().optional(),
    maxResults: z.number().default(5),
  }),
  execute: async ({ query, category, maxResults }) => {
    // Database or API call here
    return { results: [] };
  },
});
```

### Use Tools in Streaming

```typescript
import { streamText } from 'ai';
import { calculateEstimate, searchProducts } from '@/lib/ai/tools';

const result = streamText({
  model: openai('gpt-4o'),
  messages,
  tools: {
    calculateEstimate,
    searchProducts,
  },
  maxSteps: 5, // Allow up to 5 tool calls
});
```

---

## Pattern 4: Vision / Multimodal

Process images alongside text.

### Send Images in Messages

```typescript
// Client-side: prepare image message
const imageMessage = {
  role: 'user',
  content: [
    { type: 'text', text: 'What room is this and what condition is it in?' },
    { type: 'image', image: base64ImageData }, // or URL
  ],
};

// API route
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'), // Vision-capable model
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Image Compression (Client)

```typescript
// utils/image.ts
export async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
```

---

## Pattern 5: AI Output Validation

ALWAYS validate AI outputs before using them.

### Safe Parsing Pattern

```typescript
import { z } from 'zod';

const RoomAnalysisSchema = z.object({
  roomType: z.enum(['kitchen', 'bathroom', 'bedroom', 'other']),
  confidence: z.number().min(0).max(1),
  features: z.array(z.string()),
});

async function analyzeRoom(imageBase64: string) {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: RoomAnalysisSchema,
    prompt: 'Analyze this room image',
  });

  // Additional validation for business logic
  if (object.confidence < 0.6) {
    return {
      ...object,
      needsHumanReview: true,
      warning: 'Low confidence analysis - please verify',
    };
  }

  return object;
}
```

### Fallback Pattern

```typescript
async function safeAICall<T>(
  aiFunction: () => Promise<T>,
  fallback: T,
  maxRetries = 2
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await aiFunction();
    } catch (error) {
      console.error(`AI call failed (attempt ${attempt + 1}):`, error);
      if (attempt === maxRetries) {
        console.error('All retries failed, using fallback');
        return fallback;
      }
      // Exponential backoff
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  return fallback;
}
```

---

## Pattern 6: Prompt Engineering

### System Prompt Structure

```typescript
const systemPrompt = `You are [ROLE] that helps users with [TASK].

## Your Capabilities
- [Capability 1]
- [Capability 2]

## Guidelines
- [Guideline 1]
- [Guideline 2]

## Response Format
[Describe expected output format]

## Constraints
- NEVER [constraint]
- ALWAYS [requirement]`;
```

### Dynamic Prompt Building

```typescript
function buildPrompt(context: {
  projectType: string;
  userGoals: string;
  constraints?: string[];
}): string {
  const constraintsBlock = context.constraints?.length
    ? `\n\nConstraints:\n${context.constraints.map((c) => `- ${c}`).join('\n')}`
    : '';

  return `Project Type: ${context.projectType}
User Goals: ${context.userGoals}${constraintsBlock}`;
}
```

---

## Best Practices

✅ **DO:**
- Always use Zod schemas for AI outputs
- Implement retry logic with exponential backoff
- Compress images before sending to vision models
- Use streaming for chat interfaces (better UX)
- Log AI interactions for debugging
- Set appropriate `maxTokens` limits
- Use `maxSteps` to cap tool calling loops

❌ **DON'T:**
- Concatenate user input directly into prompts (injection risk)
- Trust AI output without validation
- Use `dangerouslySetInnerHTML` with AI content
- Hardcode API keys in source code
- Ignore rate limits and costs
- Send uncompressed images (slow, expensive)

---

## Error Handling

```typescript
import { APICallError, InvalidResponseDataError } from 'ai';

try {
  const result = await generateText({ ... });
} catch (error) {
  if (error instanceof APICallError) {
    // Rate limit, auth error, etc.
    console.error('API Error:', error.message, error.statusCode);
  } else if (error instanceof InvalidResponseDataError) {
    // Response didn't match schema
    console.error('Invalid response:', error.message);
  } else {
    throw error;
  }
}
```

---

## Related Skills

- `nextjs-patterns` - Server/Client component patterns
- `supabase-patterns` - Database integration
- `typescript-strict` - Type safety patterns
- `security-compliance` - Security best practices

---

## References

- [Vercel AI SDK Documentation](https://ai-sdk.dev/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Anthropic API Reference](https://docs.anthropic.com/en/api)
- [Google AI for Developers](https://ai.google.dev/)
