import { useEffect, useRef } from 'react';

// The race loop emits one event per rendered frame; HUD widgets update from it instead of
// running their own requestAnimationFrame loops, so they stop with the game when it pauses.
type FrameListener = () => void;

const listeners = new Set<FrameListener>();

export function emitGameFrame() {
  listeners.forEach(listener => listener());
}

export function useGameFrame(listener: FrameListener) {
  const ref = useRef(listener);
  ref.current = listener;
  useEffect(() => {
    const entry = () => ref.current();
    listeners.add(entry);
    return () => {
      listeners.delete(entry);
    };
  }, []);
}
