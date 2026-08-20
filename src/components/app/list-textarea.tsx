"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { UploadIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { parseList } from "@/lib/instacheck/parse";
import { useI18n } from "@/providers/i18n-provider";

export type ListAccent = "following" | "followers";

const accentRing: Record<ListAccent, string> = {
  following: "ring-ig-orange/60",
  followers: "ring-ig-blue/70",
};

const accentText: Record<ListAccent, string> = {
  following: "text-ig-orange",
  followers: "text-ig-blue",
};

export function ListTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  uploadLabel,
  accent,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  uploadLabel: string;
  accent: ListAccent;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [flash, setFlash] = useState(false);

  const count = parseList(value).length;

  const handleFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return;
      try {
        const text = await file.text();
        onChange(text);
        setFlash(true);
        window.setTimeout(() => setFlash(false), 700);
      } catch {
        /* ignore unreadable file */
      }
    },
    [onChange]
  );

  useEffect(() => {
    const onFocus = () => setUploading(false);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-xl border bg-muted/20 p-3 transition-all duration-200",
        dragOver ? "border-ig-pink/60 bg-ig-pink/5" : "border-border",
        uploading && `ring-2 ring-offset-0 ${accentRing[accent]}`,
        flash && "ring-2 ring-ig-pink/40"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-wide text-muted-foreground"
        >
          {label}
        </label>
        <motion.span
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={cn(
            "tabular rounded-full px-2 py-0.5 text-xs font-semibold",
            count > 0
              ? `${accentText[accent]} bg-muted/60`
              : "text-muted-foreground/60"
          )}
        >
          {count}
        </motion.span>
      </div>

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        className="h-32 w-full resize-none rounded-lg bg-background/50 px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setUploading(true);
            inputRef.current?.click();
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
        >
          <UploadIcon className="size-3.5" />
          {uploadLabel}
        </button>
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <XIcon className="size-3.5" />
              {t.clear}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={(e) => {
          setUploading(false);
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
