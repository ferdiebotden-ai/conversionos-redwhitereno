/**
 * Prompt Assembler
 * Builds layered system prompts for each AI agent persona
 */

import type { PersonaKey } from './types';
import { RECEPTIONIST_PERSONA, RECEPTIONIST_PROMPT_RULES } from './receptionist';
import { QUOTE_SPECIALIST_PERSONA, QUOTE_SPECIALIST_PROMPT_RULES } from './quote-specialist';
import { DESIGN_CONSULTANT_PERSONA, DESIGN_CONSULTANT_PROMPT_RULES } from './design-consultant';
import {
  COMPANY_PROFILE,
  COMPANY_SUMMARY,
  SERVICES_KNOWLEDGE,
  SERVICES_SUMMARY,
  PRICING_FULL,
  PRICING_SUMMARY,
  ONTARIO_GENERAL_KNOWLEDGE,
  ONTARIO_BUDGET_KNOWLEDGE,
  ONTARIO_DESIGN_KNOWLEDGE,
  SALES_TRAINING,
} from '../knowledge';

const PERSONAS = {
  receptionist: RECEPTIONIST_PERSONA,
  'quote-specialist': QUOTE_SPECIALIST_PERSONA,
  'design-consultant': DESIGN_CONSULTANT_PERSONA,
} as const;

/**
 * Build the full system prompt for a text-based AI agent
 *
 * Layering:
 * 1. Company + Services (shared)
 * 2. Role-specific knowledge
 * 3. Sales training (shared)
 * 4. Persona identity + boundaries + rules
 */
export function buildAgentSystemPrompt(personaKey: PersonaKey): string {
  const persona = PERSONAS[personaKey];

  // Layer 1: Shared company knowledge (scope varies by agent)
  let layer1 = '';
  switch (personaKey) {
    case 'receptionist':
      layer1 = `${COMPANY_PROFILE}\n\n${SERVICES_SUMMARY}\n\n${ONTARIO_GENERAL_KNOWLEDGE}`;
      break;
    case 'quote-specialist':
      layer1 = `${COMPANY_SUMMARY}\n\n${SERVICES_KNOWLEDGE}`;
      break;
    case 'design-consultant':
      layer1 = `${COMPANY_SUMMARY}\n\n${SERVICES_SUMMARY}`;
      break;
  }

  // Layer 2: Role-specific knowledge
  let layer2 = '';
  switch (personaKey) {
    case 'receptionist':
      layer2 = PRICING_SUMMARY;
      break;
    case 'quote-specialist':
      layer2 = `${PRICING_FULL}\n\n${ONTARIO_BUDGET_KNOWLEDGE}`;
      break;
    case 'design-consultant':
      layer2 = ONTARIO_DESIGN_KNOWLEDGE;
      break;
  }

  // Layer 3: Sales training (shared)
  const layer3 = SALES_TRAINING;

  // Layer 4: Persona identity + rules
  let personaRules = '';
  switch (personaKey) {
    case 'receptionist':
      personaRules = RECEPTIONIST_PROMPT_RULES;
      break;
    case 'quote-specialist':
      personaRules = QUOTE_SPECIALIST_PROMPT_RULES;
      break;
    case 'design-consultant':
      personaRules = DESIGN_CONSULTANT_PROMPT_RULES;
      break;
  }

  const layer4 = `## Your Identity
You are **${persona.name}**, the ${persona.role} at Red White Reno.

### Personality
${persona.personalityTraits.map(t => `- ${t}`).join('\n')}

### What You Can Do
${persona.capabilities.map(c => `- ${c}`).join('\n')}

### Boundaries
${persona.boundaries.map(b => `- ${b}`).join('\n')}

### Routing to Other Agents
${Object.values(persona.routingSuggestions).map(s => `- ${s}`).join('\n')}

${personaRules}`;

  return `${layer4}\n\n---\n\n${layer1}\n\n---\n\n${layer2}\n\n---\n\n${layer3}`;
}

/**
 * Build a voice-optimized system prompt for an AI agent
 * Voice prompts are more concise with voice-specific rules
 */
export function buildVoiceSystemPrompt(personaKey: PersonaKey): string {
  const persona = PERSONAS[personaKey];

  // Use the same knowledge layers but in a more compressed form
  let knowledgeContext = '';
  switch (personaKey) {
    case 'receptionist':
      knowledgeContext = `${COMPANY_SUMMARY}\n\n${SERVICES_SUMMARY}\n\n${PRICING_SUMMARY}`;
      break;
    case 'quote-specialist':
      knowledgeContext = `${COMPANY_SUMMARY}\n\n${SERVICES_SUMMARY}\n\n${PRICING_FULL}\n\n${ONTARIO_BUDGET_KNOWLEDGE}`;
      break;
    case 'design-consultant':
      knowledgeContext = `${COMPANY_SUMMARY}\n\n${SERVICES_SUMMARY}\n\n${ONTARIO_DESIGN_KNOWLEDGE}`;
      break;
  }

  return `You are ${persona.name}, the ${persona.role} at Red White Reno in Stratford, Ontario.

## Voice Conversation Rules
- Keep every response to 1–2 sentences maximum — this is a voice conversation
- ONE topic at a time — never stack multiple questions
- Use verbal acknowledgments: "Got it", "Makes sense", "Love that"
- Speak naturally with contractions: "I'd", "we'll", "that's"
- No lists, no markdown, no formatting — just natural speech
- Pause between topics to let the homeowner respond
- Be warm, friendly, and conversational — like talking to a knowledgeable friend
- If they seem unsure, offer 2–3 concrete options to choose from

## Your Personality
${persona.personalityTraits.slice(0, 3).map(t => `- ${t}`).join('\n')}

## What You Can Help With
${persona.capabilities.slice(0, 4).map(c => `- ${c}`).join('\n')}

## Boundaries
${persona.boundaries.slice(0, 3).map(b => `- ${b}`).join('\n')}

---

${knowledgeContext}`;
}

/**
 * Get a persona by key
 */
export function getPersona(personaKey: PersonaKey) {
  return PERSONAS[personaKey];
}
