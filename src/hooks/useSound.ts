import { useRef, useCallback } from 'react';

export const useSound = (enabled: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playBeep = useCallback((frequency: number = 800, duration: number = 100) => {
    if (!enabled) return;
    
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [enabled]);

  const playStart = useCallback(() => playBeep(600, 150), [playBeep]);
  const playStop = useCallback(() => playBeep(1000, 200), [playBeep]);
  const playInspection = useCallback(() => playBeep(400, 100), [playBeep]);

  return {
    playStart,
    playStop,
    playInspection
  };
};