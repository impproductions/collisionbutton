import { useEffect, useRef } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  time: number;
}

const HISTORY_DURATION = 150; // Keep last 150ms of history

export const useMouseTracking = () => {
  const mouseHistory = useRef<MousePosition[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const entry: MousePosition = { x: e.clientX, y: e.clientY, time: now };

      // Add new entry and filter old ones
      mouseHistory.current = [...mouseHistory.current, entry].filter(
        item => now - item.time < HISTORY_DURATION
      );
    };

    // Start tracking immediately when hook mounts
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getMouseHistory = () => mouseHistory.current;

  return { getMouseHistory };
};