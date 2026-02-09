'use client';

/**
 * Receptionist Input
 * Text input with voice toggle button for the receptionist widget
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Mic } from 'lucide-react';

interface ReceptionistInputProps {
  onSend: (message: string) => void;
  onVoiceToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export function ReceptionistInput({
  onSend,
  onVoiceToggle,
  disabled,
  className,
}: ReceptionistInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
    }
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className={cn('flex items-end gap-2 p-3 border-t border-border', className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Emma anything..."
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none min-h-[36px] max-h-[96px] py-2"
      />
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-primary"
          onClick={onVoiceToggle}
          disabled={disabled}
          aria-label="Switch to voice mode"
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="h-9 w-9 bg-primary hover:bg-primary/90"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
