'use client';

/**
 * Receptionist Chat
 * Unified voice + text chat container
 * Voice transcript appears inline with text messages
 */

import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from '@/components/chat/message-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { ReceptionistInput } from './receptionist-input';
import { ReceptionistCTAButtons, stripCTAs } from './receptionist-cta-buttons';
import { VoiceIndicator } from '@/components/voice/voice-indicator';
import { VoiceTranscriptMessage } from '@/components/voice/voice-transcript-message';
import { useVoice } from '@/components/voice/voice-provider';
import { RECEPTIONIST_PERSONA } from '@/lib/ai/personas/receptionist';
import type { VoiceTranscriptEntry } from '@/lib/voice/config';
import { Loader2 } from 'lucide-react';

function getMessageContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map(part => part.text)
    .join('');
}

// Merged message type for rendering both text and voice messages
interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source: 'text' | 'voice';
}

interface ReceptionistChatProps {
  startInVoiceMode?: boolean;
}

export function ReceptionistChat({ startInVoiceMode }: ReceptionistChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [voiceMessages, setVoiceMessages] = useState<VoiceTranscriptEntry[]>([]);
  const hasAutoStartedRef = useRef(false);

  const { status, startVoice, isApiConfigured } = useVoice();

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/ai/receptionist' }),
    []
  );

  const initialMessages = useMemo<UIMessage[]>(() => [{
    id: 'emma-greeting',
    role: 'assistant' as const,
    parts: [{ type: 'text' as const, text: RECEPTIONIST_PERSONA.greeting }],
  }], []);

  const { messages, sendMessage, status: chatStatus } = useChat({
    transport,
    messages: initialMessages,
  });

  const isLoading = chatStatus === 'streaming' || chatStatus === 'submitted';

  // Auto-start voice if startInVoiceMode prop
  useEffect(() => {
    if (startInVoiceMode && !hasAutoStartedRef.current && isApiConfigured !== null) {
      hasAutoStartedRef.current = true;
      if (isApiConfigured) {
        startVoice('receptionist');
      }
    }
  }, [startInVoiceMode, isApiConfigured, startVoice]);

  // Collect voice transcript entries
  const handleVoiceMessage = useCallback((entry: VoiceTranscriptEntry) => {
    setVoiceMessages(prev => [...prev, entry]);
  }, []);

  // Note: We re-register voice message callback via a ref pattern in VoiceProvider
  // For simplicity, voice messages come through the transcript in the provider

  const { transcript: voiceTranscript } = useVoice();

  // Merge text messages and voice transcript for display
  const displayMessages = useMemo<DisplayMessage[]>(() => {
    const textMsgs: DisplayMessage[] = messages.map((message) => ({
      id: message.id,
      role: message.role as 'user' | 'assistant',
      content: getMessageContent(message),
      source: 'text' as const,
    }));

    const voiceMsgs: DisplayMessage[] = voiceTranscript.map((entry) => ({
      id: entry.id,
      role: entry.role,
      content: entry.content,
      source: 'voice' as const,
    }));

    // Voice messages appear after text messages
    return [...textMsgs, ...voiceMsgs];
  }, [messages, voiceTranscript]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [displayMessages, isLoading]);

  const handleSend = useCallback(
    async (message: string) => {
      await sendMessage({ text: message });
    },
    [sendMessage]
  );

  const isVoiceActive = status === 'connected' || status === 'connecting';

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 min-h-0">
        <div className="space-y-1 py-2">
          {displayMessages.map((message) => {
            if (message.source === 'voice') {
              return (
                <VoiceTranscriptMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  agentName={message.role === 'assistant' ? 'Emma' : undefined}
                />
              );
            }

            const cleanContent = message.role === 'assistant' ? stripCTAs(message.content) : message.content;
            return (
              <div key={message.id}>
                <MessageBubble
                  role={message.role}
                  content={cleanContent}
                  agentName={message.role === 'assistant' ? 'Emma' : undefined}
                />
                {message.role === 'assistant' && (
                  <div className="px-4 pl-14">
                    <ReceptionistCTAButtons text={message.content} />
                  </div>
                )}
              </div>
            );
          })}
          {isLoading && (
            <div className="px-4">
              <TypingIndicator />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Voice Indicator — shown inline when voice is active */}
      {isVoiceActive && (
        <VoiceIndicator persona="receptionist" />
      )}

      {/* Connecting indicator */}
      {status === 'connecting' && (
        <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground border-t border-border">
          <Loader2 className="h-3 w-3 animate-spin" />
          Connecting voice...
        </div>
      )}

      {/* Input — always visible */}
      <ReceptionistInput
        onSend={handleSend}
        disabled={isLoading}
        persona="receptionist"
      />
    </div>
  );
}
