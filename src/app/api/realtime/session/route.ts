/**
 * OpenAI Realtime API Session Route
 * Generates ephemeral client tokens for secure browser-based WebRTC connections
 * Supports persona-specific voice prompts for Emma, Marcus, and Mia
 * [DEV-075]
 */

import { NextResponse } from 'next/server';
import { REALTIME_MODEL, TRANSCRIPTION_MODEL, VAD_CONFIG } from '@/lib/realtime/config';
import { buildVoiceSystemPrompt, getPersona, type PersonaKey } from '@/lib/ai/personas';

const OPENAI_API_KEY = process.env['OPENAI_API_KEY'];
const USE_SEMANTIC_VAD = process.env['USE_SEMANTIC_VAD'] !== 'false';

const VALID_PERSONAS: PersonaKey[] = ['receptionist', 'quote-specialist', 'design-consultant'];

export async function POST(request: Request) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Voice service not configured' },
      { status: 503 }
    );
  }

  try {
    // Determine persona from query params (default: quote-specialist for backward compat)
    const url = new URL(request.url);
    const personaParam = url.searchParams.get('persona') as PersonaKey | null;
    const personaKey: PersonaKey = personaParam && VALID_PERSONAS.includes(personaParam)
      ? personaParam
      : 'quote-specialist';

    const persona = getPersona(personaKey);
    const voicePrompt = buildVoiceSystemPrompt(personaKey);

    // Create ephemeral session token via OpenAI Realtime API
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: REALTIME_MODEL,
        voice: persona.voiceId || 'alloy',
        instructions: voicePrompt,
        input_audio_transcription: {
          model: TRANSCRIPTION_MODEL,
        },
        turn_detection: USE_SEMANTIC_VAD
          ? VAD_CONFIG.semantic
          : VAD_CONFIG.serverVad,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI Realtime session error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create voice session' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      client_secret: data.client_secret,
      expires_at: data.expires_at,
    });
  } catch (error) {
    console.error('Error creating realtime session:', error);
    return NextResponse.json(
      { error: 'Failed to initialize voice service' },
      { status: 500 }
    );
  }
}
