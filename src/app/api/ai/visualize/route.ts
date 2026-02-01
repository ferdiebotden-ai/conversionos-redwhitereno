/**
 * AI Visualization API Route
 * Generates AI design visualizations using Gemini
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/db/server';
import {
  visualizationRequestSchema,
  type VisualizationResponse,
  type VisualizationError,
  type GeneratedConcept,
} from '@/lib/schemas/visualization';
import { generatePlaceholderConcepts } from '@/lib/ai/visualization';
import { VISUALIZATION_CONFIG } from '@/lib/ai/gemini';

// Maximum execution time for Vercel
export const maxDuration = 90;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse request body
    const body = await request.json();

    // Validate request
    const parseResult = visualizationRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const error: VisualizationError = {
        error: 'Invalid request',
        code: 'INVALID_IMAGE',
        details: parseResult.error.issues[0]?.message,
      };
      return NextResponse.json(error, { status: 400 });
    }

    const { image, roomType, style, constraints, count } = parseResult.data;

    // Initialize Supabase service client
    const supabase = createServiceClient();

    // Upload original image to Supabase Storage
    const originalImageUrl = await uploadOriginalImage(supabase, image);
    if (!originalImageUrl) {
      const error: VisualizationError = {
        error: 'Failed to store original image',
        code: 'STORAGE_ERROR',
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Generate visualization concepts
    // For now, using placeholder concepts until Gemini image generation is fully integrated
    // TODO: Replace with actual Gemini image generation when available
    let concepts: GeneratedConcept[];

    if (process.env['GOOGLE_GENERATIVE_AI_API_KEY']) {
      // When API key is available, try real generation
      // For now, using placeholders as Vercel AI SDK image generation is in preview
      concepts = await generateConceptsWithGemini(
        image,
        roomType,
        style,
        constraints,
        count
      );
    } else {
      // Use placeholder images for development/demo
      concepts = generatePlaceholderConcepts(roomType, style, count);
    }

    // Upload generated concepts to Supabase Storage (for real generated images)
    // For placeholders, we use external URLs directly

    const generationTimeMs = Date.now() - startTime;

    // Generate share token
    const shareToken = generateShareToken();

    // Save visualization to database
    const { data: visualization, error: dbError } = await supabase
      .from('visualizations')
      .insert({
        original_photo_url: originalImageUrl,
        room_type: roomType,
        style: style,
        constraints: constraints || null,
        generated_concepts: concepts,
        generation_time_ms: generationTimeMs,
        share_token: shareToken,
        source: 'visualizer',
        device_type: getDeviceType(request),
        user_agent: request.headers.get('user-agent') || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      const error: VisualizationError = {
        error: 'Failed to save visualization',
        code: 'STORAGE_ERROR',
        details: dbError.message,
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Build response
    const response: VisualizationResponse = {
      id: visualization.id,
      originalImageUrl,
      roomType,
      style,
      constraints: constraints || undefined,
      concepts,
      generationTimeMs,
      createdAt: visualization.created_at,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Visualization error:', error);

    // Check for timeout
    const elapsed = Date.now() - startTime;
    if (elapsed >= VISUALIZATION_CONFIG.timeout) {
      const errorResponse: VisualizationError = {
        error: 'Generation timed out',
        code: 'TIMEOUT',
        details: 'The AI took too long to generate visualizations. Please try again.',
      };
      return NextResponse.json(errorResponse, { status: 504 });
    }

    const errorResponse: VisualizationError = {
      error: 'Failed to generate visualization',
      code: 'UNKNOWN',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Upload original image to Supabase Storage
async function uploadOriginalImage(
  supabase: ReturnType<typeof createServiceClient>,
  imageBase64: string
): Promise<string | null> {
  try {
    // Extract base64 data and mime type
    const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      console.error('Invalid base64 image format');
      return null;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType?.split('/')[1] || 'jpg';

    // Decode base64 to buffer
    const buffer = Buffer.from(base64Data ?? '', 'base64');

    // Generate unique filename
    const filename = `original/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('visualizations')
      .upload(filename, buffer, {
        contentType: mimeType || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      // If bucket doesn't exist, return a placeholder URL for development
      if (error.message.includes('Bucket not found')) {
        console.warn('Visualizations bucket not found, using data URL');
        return imageBase64; // Return original base64 as fallback
      }
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('visualizations')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    return null;
  }
}

// Generate concepts using Gemini (placeholder implementation)
async function generateConceptsWithGemini(
  imageBase64: string,
  roomType: string,
  style: string,
  constraints: string | undefined,
  count: number
): Promise<GeneratedConcept[]> {
  // TODO: Implement actual Gemini image generation
  // The Vercel AI SDK's image generation support is in preview
  // For now, return placeholder concepts

  // Simulate generation time (2-5 seconds per concept)
  const delay = Math.random() * 3000 + 2000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Return placeholder concepts
  return generatePlaceholderConcepts(
    roomType as Parameters<typeof generatePlaceholderConcepts>[0],
    style as Parameters<typeof generatePlaceholderConcepts>[1],
    count
  );
}

// Generate a unique share token
function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Detect device type from user agent
function getDeviceType(request: NextRequest): string {
  const ua = request.headers.get('user-agent') || '';
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet/i.test(ua)) return 'tablet';
  return 'desktop';
}
