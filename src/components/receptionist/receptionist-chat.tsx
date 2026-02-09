'use client';

/**
 * Receptionist Chat
 * Chat container using Vercel AI SDK useChat, with CTA button support
 */

import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from '@/components/chat/message-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { ReceptionistInput } from './receptionist-input';
import { ReceptionistVoice } from './receptionist-voice';
import { ReceptionistCTAButtons, stripCTAs } from './receptionist-cta-buttons';
import { RECEPTIONIST_PERSONA } from '@/lib/ai/personas/receptionist';
import type { TranscriptMessage } from '@/lib/realtime/config';

function getMessageContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map(part => part.text)
    .join('');
}

export function ReceptionistChat() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/ai/receptionist' }),
    []
  );

  const initialMessages = useMemo<UIMessage[]>(() => [{
    id: 'emma-greeting',
    role: 'assistant' as const,
    parts: [{ type: 'text' as const, text: RECEPTIONIST_PERSONA.greeting }],
  }], []);

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: initialMessages,
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (message: string) => {
      await sendMessage({ text: message });
    },
    [sendMessage]
  );

  const handleVoiceTranscriptUpdate = useCallback((_messages: TranscriptMessage[]) => {
    // Voice transcript updates displayed in the voice mode component
  }, []);

  const handleVoiceEnd = useCallback(() => {
    setIsVoiceMode(false);
  }, []);

  if (isVoiceMode) {
    return (
      <div className="flex flex-col h-full">
        <ReceptionistVoice
          persona="receptionist"
          onTranscriptUpdate={handleVoiceTranscriptUpdate}
          onEnd={handleVoiceEnd}
          className="flex-1"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 min-h-0">
        <div className="space-y-1 py-2">
          {messages.map((message) => {
            const content = getMessageContent(message);
            const cleanContent = message.role === 'assistant' ? stripCTAs(content) : content;
            return (
              <div key={message.id}>
                <MessageBubble
                  role={message.role as 'user' | 'assistant'}
                  content={cleanContent}
                  agentName={message.role === 'assistant' ? 'Emma' : undefined}
                />
                {message.role === 'assistant' && (
                  <div className="px-4 pl-14">
                    <ReceptionistCTAButtons text={content} />
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

      {/* Input */}
      <ReceptionistInput
        onSend={handleSend}
        onVoiceToggle={() => setIsVoiceMode(true)}
        disabled={isLoading}
      />
    </div>
  );
}
