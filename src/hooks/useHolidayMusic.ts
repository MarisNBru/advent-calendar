import { useCallback, useEffect, useRef, useState } from 'react';

interface MelodyNote {
  freq: number;
  duration: number;
  gap?: number;
}

const MELODY: MelodyNote[] = [
  { freq: 659.25, duration: 0.35 },
  { freq: 659.25, duration: 0.35 },
  { freq: 659.25, duration: 0.55, gap: 0.1 },
  { freq: 659.25, duration: 0.35 },
  { freq: 659.25, duration: 0.35 },
  { freq: 659.25, duration: 0.55, gap: 0.12 },
  { freq: 659.25, duration: 0.35 },
  { freq: 783.99, duration: 0.35 },
  { freq: 523.25, duration: 0.35 },
  { freq: 587.33, duration: 0.4 },
  { freq: 659.25, duration: 0.9, gap: 0.15 },
  { freq: 698.46, duration: 0.35 },
  { freq: 698.46, duration: 0.35 },
  { freq: 698.46, duration: 0.4 },
  { freq: 698.46, duration: 0.35 },
  { freq: 659.25, duration: 0.35 },
  { freq: 659.25, duration: 0.35 },
  { freq: 659.25, duration: 0.2 },
  { freq: 659.25, duration: 0.35 },
  { freq: 587.33, duration: 0.35 },
  { freq: 587.33, duration: 0.35 },
  { freq: 659.25, duration: 0.35 },
  { freq: 587.33, duration: 0.35 },
  { freq: 783.99, duration: 0.9, gap: 0.2 }
];

const LOOP_DURATION = MELODY.reduce((total, note) => total + note.duration + (note.gap ?? 0.08), 0);

type HolidayMusicHandle = {
  isPlaying: boolean;
  togglePlayback: () => void;
  stopPlayback: () => void;
  volume: number;
  setVolume: (value: number) => void;
};

export function useHolidayMusic(): HolidayMusicHandle {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, updateVolume] = useState(0.35);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const loopTimeoutRef = useRef<number | null>(null);
  const volumeRef = useRef(0.35);

  const clearLoop = useCallback(() => {
    if (loopTimeoutRef.current !== null) {
      window.clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
  }, []);

  const ensureContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }

    if (!audioCtxRef.current) {
      const ctx = new AudioContextCtor();
      const master = ctx.createGain();
      master.gain.value = volumeRef.current;
      master.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }

    return audioCtxRef.current;
  }, []);

  const scheduleLoop = useCallback(() => {
    const ctx = ensureContext();
    const master = masterGainRef.current;

    if (!ctx || !master) {
      return;
    }

    let nextStart = ctx.currentTime + 0.1;

    MELODY.forEach((note) => {
      const fundamental = ctx.createOscillator();
      fundamental.type = 'triangle';
      fundamental.frequency.setValueAtTime(note.freq, nextStart);

      const shimmer = ctx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(note.freq * 2, nextStart);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, nextStart);
      env.gain.linearRampToValueAtTime(0.9, nextStart + 0.04);
      env.gain.exponentialRampToValueAtTime(0.0001, nextStart + note.duration + 0.35);

      fundamental.connect(env);
      shimmer.connect(env);
      env.connect(master);

      const stopTime = nextStart + note.duration + 0.4;
      fundamental.start(nextStart);
      shimmer.start(nextStart);
      fundamental.stop(stopTime);
      shimmer.stop(stopTime);

      nextStart += note.duration + (note.gap ?? 0.08);
    });

    loopTimeoutRef.current = window.setTimeout(scheduleLoop, LOOP_DURATION * 1000);
  }, [ensureContext]);

  const startPlayback = useCallback(async () => {
    if (loopTimeoutRef.current !== null) {
      return;
    }

    const ctx = ensureContext();
    const master = masterGainRef.current;

    if (!ctx || !master) {
      return;
    }

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(volumeRef.current, ctx.currentTime, 0.1);

    scheduleLoop();
    setIsPlaying(true);
  }, [ensureContext, scheduleLoop]);

  const stopPlayback = useCallback(() => {
    clearLoop();
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;

    if (ctx && master) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(0.0001, now, 0.08);
    }

    setIsPlaying(false);
  }, [clearLoop]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      void startPlayback();
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  const setVolume = useCallback((value: number) => {
    const nextValue = Math.min(1, Math.max(0, value));
    volumeRef.current = nextValue;
    updateVolume(nextValue);

    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(nextValue, ctx.currentTime, 0.1);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearLoop();
      if (audioCtxRef.current) {
        void audioCtxRef.current.close().catch(() => undefined);
      }
    };
  }, [clearLoop]);

  return {
    isPlaying,
    togglePlayback,
    stopPlayback,
    volume,
    setVolume,
  };
}
