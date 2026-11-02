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

import { Curves } from "@/lib/motion";
import { Button } from "@/components/ui/button";

interface ToastItem {
  id: number;
  msg: string;
  sub?: string;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastContextValue {
  toast: (
    msg: string,
    sub?: string,
    duration?: number,
    action?: ToastAction
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback(
    (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    []
  );

  const toast = useCallback(
    (msg: string, sub?: string, duration = 2200, action?: ToastAction) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev.slice(-2), { id, msg, sub, action }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.16 } }}
              transition={{
                opacity: { duration: 0.22, ease: "linear" },
                y: { duration: 0.65, ease: Curves.bouncy },
                layout: { duration: 0.36, ease: Curves.softSettle },
              }}
              className="panel pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{t.msg}</p>
                {t.sub && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.sub}</p>
                )}
              </div>
              {t.action && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    t.action?.onClick();
                    dismiss(t.id);
                  }}
                >
                  {t.action.label}
                </Button>
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
