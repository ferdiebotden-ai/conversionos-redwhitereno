/**
 * Visualization Service
 * AI-powered room transformation using Gemini image generation
 */

import { generateText } from 'ai';
import { google, VISUALIZATION_CONFIG, type GeneratedImage } from './gemini';
import {
  type RoomType,
  type DesignStyle,
  STYLE_DESCRIPTIONS,
  ROOM_CONTEXTS,
  type GeneratedConcept,
} from '@/lib/schemas/visualization';

// Build the visualization prompt for Gemini
export function buildVisualizationPrompt(
  roomType: RoomType,
  style: DesignStyle,
  constraints?: string
): string {
  const styleDesc = STYLE_DESCRIPTIONS[style];
  const roomContext = ROOM_CONTEXTS[roomType];

  let prompt = `Transform this ${roomType.replace('_', ' ')} into a ${style} design style.

Style characteristics: ${styleDesc}

Room focus areas: ${roomContext}

Requirements:
- Maintain the exact same room layout, dimensions, and architecture
- Keep the camera angle and perspective identical to the original
- Preserve windows, doors, and structural elements in their exact positions
- Apply the ${style} aesthetic to fixtures, finishes, colors, and decor
- Ensure realistic lighting that matches the original room's light sources
- Make the transformation believable as a real renovation result
- High quality, photorealistic output suitable for showing to clients`;

  if (constraints) {
    prompt += `

User preferences: ${constraints}`;
  }

  prompt += `

Generate a photorealistic visualization showing how this room would look after a professional ${style} renovation.`;

  return prompt;
}

// Generate a single visualization concept
export async function generateVisualizationConcept(
  imageBase64: string,
  roomType: RoomType,
  style: DesignStyle,
  constraints?: string,
  conceptIndex: number = 0
): Promise<GeneratedImage | null> {
  const prompt = buildVisualizationPrompt(roomType, style, constraints);

  // Add variation instruction for multiple concepts
  const variationPrompt = conceptIndex > 0
    ? `${prompt}\n\nCreate variation ${conceptIndex + 1}: Explore a slightly different interpretation while staying true to the ${style} aesthetic.`
    : prompt;

  try {
    // Use Gemini's multimodal capabilities
    const result = await generateText({
      model: google(VISUALIZATION_CONFIG.model),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: imageBase64,
            },
            {
              type: 'text',
              text: variationPrompt,
            },
          ],
        },
      ],
      // Note: Actual image generation requires the experimental image generation API
      // This is a placeholder for when the SDK fully supports image generation
    });

    // For now, since Vercel AI SDK doesn't directly support image generation output,
    // we'll need to use the Google AI client directly for actual image generation
    // This function signature is ready for when that's available

    // Placeholder: Image generation not yet implemented
    // variationPrompt and result.text are available for future use
    void variationPrompt;
    void result;

    return null;
  } catch {
    // Visualization generation failed - return null to use placeholder
    return null;
  }
}

// Generate multiple visualization concepts
export async function generateVisualizationConcepts(
  imageBase64: string,
  roomType: RoomType,
  style: DesignStyle,
  constraints?: string,
  count: number = VISUALIZATION_CONFIG.outputCount
): Promise<GeneratedImage[]> {
  const concepts: GeneratedImage[] = [];

  // Generate concepts in parallel for speed
  const promises = Array.from({ length: count }, (_, i) =>
    generateVisualizationConcept(imageBase64, roomType, style, constraints, i)
  );

  const results = await Promise.allSettled(promises);

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      concepts.push(result.value);
    }
  }

  return concepts;
}

// Create concept objects with IDs and URLs
export function createConceptObjects(
  imageUrls: string[],
  descriptions?: string[]
): GeneratedConcept[] {
  return imageUrls.map((url, index) => ({
    id: `concept-${index + 1}-${Date.now()}`,
    imageUrl: url,
    description: descriptions?.[index],
    generatedAt: new Date().toISOString(),
  }));
}

// Placeholder image generator (for development/demo)
// Returns placeholder URLs until actual Gemini image generation is available
export function generatePlaceholderConcepts(
  roomType: RoomType,
  style: DesignStyle,
  count: number = 4
): GeneratedConcept[] {
  const placeholders: GeneratedConcept[] = [];

  for (let i = 0; i < count; i++) {
    placeholders.push({
      id: `placeholder-${i + 1}-${Date.now()}`,
      // Use picsum.photos for demo placeholders with room-specific seeds
      imageUrl: `https://picsum.photos/seed/${roomType}-${style}-${i}/1024/768`,
      description: `${style.charAt(0).toUpperCase() + style.slice(1)} ${roomType.replace('_', ' ')} design - Concept ${i + 1}`,
      generatedAt: new Date().toISOString(),
    });
  }

  return placeholders;
}
