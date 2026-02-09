'use client';

/**
 * Receptionist Voice Mode (Compact)
 * Simplified voice mode that fits within the chat widget panel
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Mic,
  MicOff,
  PhoneOff,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  REALTIME_CONFIG,
  REALTIME_MODEL,
  TRANSCRIPT_GRACE_TIMEOUT_MS,
  isVoiceSupported,
  VoiceError,
  formatDuration,
  VOICE_ERROR_MESSAGES,
  CONNECTION_TIMEOUT_MS,
  type VoiceSessionState,
  type TranscriptMessage,
} from '@/lib/realtime/config';

interface ReceptionistVoiceProps {
  persona: string;
  onTranscriptUpdate: (messages: TranscriptMessage[]) => void;
  onEnd: () => void;
  className?: string;
}

export function ReceptionistVoice({
  persona,
  onTranscriptUpdate,
  onEnd,
  className,
}: ReceptionistVoiceProps) {
  const [state, setState] = useState<VoiceSessionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  // Buffer refs for transcript ordering
  const awaitingUserTranscriptRef = useRef(false);
  const bufferedAIDeltasRef = useRef<string[]>([]);
  const userTranscriptTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // WebRTC refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Sync transcript updates to parent
  useEffect(() => {
    if (transcript.length > 0) {
      onTranscriptUpdate(transcript);
    }
  }, [transcript, onTranscriptUpdate]);

  // Audio visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const isActive = state === 'listening' || state === 'speaking';

    if (!canvas || !analyser || !isActive) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barCount = 24;

    function draw() {
      if (!ctx || !analyser) return;
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      const barWidth = canvas!.width / barCount;
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i * bufferLength) / barCount);
        const value = dataArray[dataIndex] ?? 0;
        const barHeight = (value / 255) * canvas!.height;
        const gradient = ctx.createLinearGradient(0, canvas!.height - barHeight, 0, canvas!.height);
        gradient.addColorStop(0, '#D32F2F');
        gradient.addColorStop(1, '#B71C1C');
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth + 1, canvas!.height - barHeight, barWidth - 2, barHeight);
      }
    }
    draw();
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [state]);

  const cleanup = useCallback(() => {
    if (connectionTimeoutRef.current) { clearTimeout(connectionTimeoutRef.current); connectionTimeoutRef.current = null; }
    if (userTranscriptTimeoutRef.current) { clearTimeout(userTranscriptTimeoutRef.current); userTranscriptTimeoutRef.current = null; }
    awaitingUserTranscriptRef.current = false;
    bufferedAIDeltasRef.current = [];
    if (durationIntervalRef.current) { clearInterval(durationIntervalRef.current); durationIntervalRef.current = null; }
    if (dataChannelRef.current) { dataChannelRef.current.close(); dataChannelRef.current = null; }
    if (peerConnectionRef.current) { peerConnectionRef.current.close(); peerConnectionRef.current = null; }
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close().catch(console.error); audioContextRef.current = null; }
    analyserRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const appendAIDelta = useCallback((delta: string) => {
    setTranscript(prev => {
      const last = prev[prev.length - 1];
      if (last?.isPartial && last.role === 'assistant') {
        return [...prev.slice(0, -1), { ...last, content: last.content + delta }];
      }
      return [...prev, { id: crypto.randomUUID(), role: 'assistant', content: delta, timestamp: new Date(), isPartial: true }];
    });
  }, []);

  const flushBufferedDeltas = useCallback(() => {
    const deltas = bufferedAIDeltasRef.current;
    if (deltas.length > 0) {
      bufferedAIDeltasRef.current = [];
      appendAIDelta(deltas.join(''));
    }
    awaitingUserTranscriptRef.current = false;
  }, [appendAIDelta]);

  const handleRealtimeEvent = useCallback((event: Record<string, unknown>) => {
    const type = event['type'] as string;
    switch (type) {
      case 'input_audio_buffer.speech_started':
        awaitingUserTranscriptRef.current = true;
        bufferedAIDeltasRef.current = [];
        if (userTranscriptTimeoutRef.current) { clearTimeout(userTranscriptTimeoutRef.current); userTranscriptTimeoutRef.current = null; }
        setState('listening');
        break;
      case 'input_audio_buffer.speech_stopped':
        userTranscriptTimeoutRef.current = setTimeout(flushBufferedDeltas, TRANSCRIPT_GRACE_TIMEOUT_MS);
        setState('processing');
        break;
      case 'conversation.item.input_audio_transcription.completed': {
        const text = event['transcript'] as string;
        if (userTranscriptTimeoutRef.current) { clearTimeout(userTranscriptTimeoutRef.current); userTranscriptTimeoutRef.current = null; }
        if (text) {
          setTranscript(prev => [...prev.filter(m => !m.isPartial || m.role !== 'user'), {
            id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date(),
          }]);
        }
        flushBufferedDeltas();
        break;
      }
      case 'response.audio_transcript.delta': {
        const delta = event['delta'] as string;
        if (awaitingUserTranscriptRef.current) bufferedAIDeltasRef.current.push(delta);
        else appendAIDelta(delta);
        setState('speaking');
        break;
      }
      case 'response.audio_transcript.done':
        setTranscript(prev => prev.map(m => m.isPartial ? { ...m, isPartial: false } : m));
        setState('connected');
        break;
      case 'response.done':
        setState('connected');
        break;
      case 'error':
        console.error('Realtime API error:', event);
        setError('An error occurred during the conversation');
        setState('error');
        break;
    }
  }, [appendAIDelta, flushBufferedDeltas]);

  const connect = useCallback(async () => {
    if (!isVoiceSupported()) { setError(VOICE_ERROR_MESSAGES.NOT_SUPPORTED); return; }

    setState('connecting');
    setError(null);
    setTranscript([]);
    setDuration(0);

    connectionTimeoutRef.current = setTimeout(() => {
      setError(VOICE_ERROR_MESSAGES.CONNECTION_TIMEOUT);
      setState('error');
      cleanup();
    }, CONNECTION_TIMEOUT_MS);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: REALTIME_CONFIG.audio.sampleRate, channelCount: REALTIME_CONFIG.audio.channelCount, echoCancellation: REALTIME_CONFIG.audio.echoCancellation, noiseSuppression: REALTIME_CONFIG.audio.noiseSuppression, autoGainControl: REALTIME_CONFIG.audio.autoGainControl },
      });
      localStreamRef.current = stream;

      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      audioCtx.createMediaStreamSource(stream).connect(analyser);

      const sessionRes = await fetch(`${REALTIME_CONFIG.sessionEndpoint}?persona=${persona}`, { method: 'POST' });
      if (!sessionRes.ok) throw new VoiceError('Failed to create voice session', 'CONNECTION_FAILED');
      const { client_secret } = await sessionRes.json();

      const pc = new RTCPeerConnection({ iceServers: REALTIME_CONFIG.iceServers });
      peerConnectionRef.current = pc;
      stream.getTracks().forEach(t => pc.addTrack(t, stream));
      pc.ontrack = (e) => { const [rs] = e.streams; if (rs) { const a = new Audio(); a.srcObject = rs; a.play().catch(console.error); } };

      const dc = pc.createDataChannel('oai-events');
      dataChannelRef.current = dc;
      dc.onopen = () => {
        if (connectionTimeoutRef.current) { clearTimeout(connectionTimeoutRef.current); connectionTimeoutRef.current = null; }
        setState('connected');
        durationIntervalRef.current = setInterval(() => setDuration(d => d + 1000), 1000);
      };
      dc.onmessage = (e) => handleRealtimeEvent(JSON.parse(e.data));
      dc.onerror = () => { setError('Connection error'); setState('error'); };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const sdpRes = await fetch(`https://api.openai.com/v1/realtime?model=${REALTIME_MODEL}`, {
        method: 'POST', headers: { Authorization: `Bearer ${client_secret.value}`, 'Content-Type': 'application/sdp' }, body: offer.sdp ?? '',
      });
      if (!sdpRes.ok) throw new VoiceError('Failed to establish connection', 'CONNECTION_FAILED');
      await pc.setRemoteDescription({ type: 'answer', sdp: await sdpRes.text() });
    } catch (err) {
      if (connectionTimeoutRef.current) { clearTimeout(connectionTimeoutRef.current); connectionTimeoutRef.current = null; }
      if (err instanceof VoiceError) setError(VOICE_ERROR_MESSAGES[err.code] || err.message);
      else if (err instanceof DOMException && err.name === 'NotAllowedError') setError(VOICE_ERROR_MESSAGES.PERMISSION_DENIED);
      else setError(VOICE_ERROR_MESSAGES.UNKNOWN);
      setState('error');
      cleanup();
    }
  }, [persona, cleanup, handleRealtimeEvent]);

  const toggleMute = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = isMuted; setIsMuted(!isMuted); }
  }, [isMuted]);

  const handleEnd = useCallback(() => {
    cleanup();
    setState('idle');
    onEnd();
  }, [cleanup, onEnd]);

  // Auto-connect on mount
  useEffect(() => { connect(); }, [connect]);

  const isConnected = state === 'connected' || state === 'listening' || state === 'processing' || state === 'speaking';

  return (
    <div className={cn('flex flex-col items-center gap-3 p-4', className)}>
      {state === 'connecting' && (
        <div className="flex flex-col items-center gap-2 py-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">Connecting voice...</p>
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-xs text-muted-foreground">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEnd}>Back to Text</Button>
            <Button size="sm" onClick={connect}>Retry</Button>
          </div>
        </div>
      )}

      {isConnected && (
        <>
          {/* Compact visualizer */}
          <canvas
            ref={canvasRef}
            width={280}
            height={40}
            className="w-full max-w-[280px] h-[40px] rounded-lg bg-muted/30"
          />
          <p className="text-xs text-muted-foreground">
            {state === 'listening' && 'Listening...'}
            {state === 'processing' && 'Thinking...'}
            {state === 'speaking' && 'Emma is speaking...'}
            {state === 'connected' && 'Speak when ready'}
          </p>
          <span className="text-xs text-muted-foreground">{formatDuration(duration)}</span>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-destructive"
              onClick={handleEnd}
            >
              <PhoneOff className="h-4 w-4 mr-1" />
              End
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
