import { useCallback, useEffect, useRef, useState } from 'react';

const BASE = import.meta.env.BASE_URL || '/';
const TRACK_URL = `${BASE}music/Backgroundmusic.mp3`;

type HolidayMusicHandle = {
  isActive: boolean;
  volume: number;
  setVolume: (value: number) => void;
};

const MIN_VOLUME = 0;
const MAX_VOLUME = 1;
const DEFAULT_VOLUME = 0.22;

export function useHolidayMusic(): HolidayMusicHandle {
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const volumeRef = useRef(DEFAULT_VOLUME);
  const audioReadyRef = useRef(false);

  const cancelFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const ensureAudio = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = volumeRef.current;

      // Listen for successful load
      audio.addEventListener('canplaythrough', () => {
        audioReadyRef.current = true;
      }, { once: true });

      // Listen for load errors (missing file, wrong MIME, etc.)
      audio.addEventListener('error', () => {
        audioReadyRef.current = false;
        // Silently ignore – the file may not exist in production yet
      }, { once: true });

      audio.src = TRACK_URL;
      audioRef.current = audio;
    }

    return audioRef.current;
  }, []);

  const fadeToVolume = useCallback((target: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    cancelFade();

    const step = () => {
      if (!audioRef.current) {
        return;
      }

      const current = audio.volume;
      const diff = target - current;

      if (Math.abs(diff) < 0.01) {
        audio.volume = target;
        cancelFade();
        onDone?.();
        return;
      }

      audio.volume = current + diff * 0.2;
      fadeFrameRef.current = requestAnimationFrame(step);
    };

    fadeFrameRef.current = requestAnimationFrame(step);
  }, [cancelFade]);

  const startPlayback = useCallback(async () => {
    const audio = ensureAudio();
    if (!audio) {
      return;
    }

    // Don't try to play if audio failed to load (file missing, etc.)
    if (audio.error) {
      return;
    }

    if (!audio.paused) {
      setIsActive(true);
      return;
    }

    try {
      audio.volume = 0;
      await audio.play();
      fadeToVolume(volumeRef.current);
      setIsActive(true);
    } catch (err) {
      // Silently ignore autoplay blocks (NotAllowedError) and missing source errors (NotSupportedError)
      const isDOMError = err instanceof DOMException;
      const isExpectedError = isDOMError && (err.name === 'NotAllowedError' || err.name === 'NotSupportedError');
      if (!isExpectedError) {
        console.warn('Background music error:', err);
      }
      setIsActive(false);
    }
  }, [ensureAudio, fadeToVolume]);

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(MAX_VOLUME, Math.max(MIN_VOLUME, value));
    volumeRef.current = clamped;
    setVolumeState(clamped);

    const audio = audioRef.current;
    if (audio && !audio.paused) {
      fadeToVolume(clamped);
    } else if (audio) {
      audio.volume = clamped;
    }
  }, [fadeToVolume]);

  useEffect(() => {
    void startPlayback();
  }, [startPlayback]);

  useEffect(() => {
    const handleUserGesture = () => {
      void startPlayback();
    };

    document.addEventListener('pointerdown', handleUserGesture, { once: false });
    document.addEventListener('keydown', handleUserGesture, { once: false });
    document.addEventListener('visibilitychange', handleUserGesture, { once: false });

    return () => {
      document.removeEventListener('pointerdown', handleUserGesture);
      document.removeEventListener('keydown', handleUserGesture);
      document.removeEventListener('visibilitychange', handleUserGesture);
    };
  }, [startPlayback]);

  useEffect(() => {
    return () => {
      cancelFade();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
    };
  }, [cancelFade]);

  return {
    isActive,
    volume,
    setVolume,
  };
}
