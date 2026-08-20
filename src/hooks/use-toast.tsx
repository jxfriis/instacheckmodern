"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

interface ToastItem {
  id: number;
  msg: string;
  sub?: string;
}

interface ToastContextValue {
  toast: (msg: string, sub?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback(
    (msg: string, sub?: string, duration = 2200) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev.slice(-2), { id, msg, sub }]);
      window.setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        duration
      );
    },
    []
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={cn(
                "glass-strong max-w-sm rounded-xl px-4 py-3 text-center shadow-lg"
              )}
            >
              <p className="text-sm font-medium text-foreground">{t.msg}</p>
              {t.sub && (
                <p className="mt-0.5 text-xs text-muted-foreground">{t.sub}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
