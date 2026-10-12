import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/** Return false to let the next (older) handler try. */
type BackHandler = () => boolean | void;

const handlers: BackHandler[] = [];

/** Runs the newest registered back handler (an open dialog before its screen). */
export function dispatchBack(): boolean {
  for (let i = handlers.length - 1; i >= 0; i--) {
    if (handlers[i]() !== false) return true;
  }
  return false;
}

/**
 * Handles the Android back button (and Escape) while the component is mounted and `enabled`.
 * Dialogs pass `enabled = isOpen` so they register after, and win over, the screen behind them.
 */
export function useBackHandler(handler: BackHandler, enabled = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!enabled) return;
    const entry: BackHandler = () => ref.current();
    handlers.push(entry);
    return () => {
      const i = handlers.lastIndexOf(entry);
      if (i >= 0) handlers.splice(i, 1);
    };
  }, [enabled]);
}

let initialized = false;

/** `onUnhandled` runs when no screen or dialog consumed the back press. */
export function initBackNavigation(onUnhandled: () => void) {
  if (initialized) return;
  initialized = true;
  if (Capacitor.isNativePlatform()) {
    void App.addListener('backButton', () => {
      if (!dispatchBack()) onUnhandled();
    });
  }
  // Escape does the same in a desktop browser, which makes the back flow testable there.
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.repeat) return;
    e.preventDefault();
    if (!dispatchBack()) onUnhandled();
  });
}

/** Sends the app to the background (Android); the usual back action on the root screen. */
export function minimizeApp() {
  if (Capacitor.isNativePlatform()) void App.minimizeApp();
}
