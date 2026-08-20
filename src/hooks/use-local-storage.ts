"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key?.startsWith("instacheck-")) emit();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Persist a value to localStorage while staying hydration-safe via
 * `useSyncExternalStore` (server snapshot = initial value, client snapshot
 * reads storage only after hydration).
 */
export function useLocalStorageState<T>(key: string, initial: T) {
  const getSnapshot = useCallback((): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  }, [key, initial]);

  const getServerSnapshot = useCallback((): T => initial, [initial]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore quota / privacy-mode errors */
      }
      emit();
    },
    [key]
  );

  return [value, setValue] as const;
}
