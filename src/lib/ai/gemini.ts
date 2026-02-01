/**
 * Google AI Provider Configuration
 * Gemini provider setup using Vercel AI SDK for image generation
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Create Google AI provider instance
// API key is read from GOOGLE_GENERATIVE_AI_API_KEY env variable automatically
export const google = createGoogleGenerativeAI({});

// Image generation model (Gemini 3 Pro Image / Nano Banana Pro)
// Note: As of the AI SDK, image generation uses the experimental API
export const imageModel = 'gemini-2.0-flash-exp';

// Configuration for visualization generation
export const VISUALIZATION_CONFIG = {
  // Model to use for image generation
  model: imageModel,
  // How much to preserve the original room structure (0.0-1.0)
  // Higher = more faithful to original layout
  structureReferenceStrength: 0.85,
  // How strongly to apply the style (0.0-1.0)
  // Moderate to avoid overwhelming the original image
  styleStrength: 0.4,
  // Number of variations to generate
  outputCount: 4,
  // Output resolution
  resolution: '1024x1024' as const,
  // Maximum generation time (ms)
  timeout: 90000,
} as const;

// Type for image generation result
export interface GeneratedImage {
  base64: string;
  mimeType: string;
}
