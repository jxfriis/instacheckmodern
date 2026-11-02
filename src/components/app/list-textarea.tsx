"use client";

import { useCallback, useRef, useState } from "react";
import { UploadIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Motion } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { usePopOnChange } from "@/components/ui/reveal";
import { useToast } from "@/hooks/use-toast";
import { inspectList, listFromFile } from "@/lib/instacheck/parse";
import { useI18n } from "@/providers/i18n-provider";

export function ListTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const { t } = useI18n();
  const { toast } = useToast();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const { users, ignored, duplicates } = inspectList(value);
  const count = users.length;
  const countRef = usePopOnChange<HTMLSpanElement>(count);

  const notes = [
    ignored > 0 && t.ignoredLines.replace("{n}", String(ignored)),
    duplicates > 0 && t.dupesRemoved.replace("{n}", String(duplicates)),
  ].filter(Boolean);

  const handleFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return;
      const reject = () => {
        if (rootRef.current) Motion.shake(rootRef.current);
        toast(t.fileEmpty, t.fileEmptySub, 4000);
      };
      try {
        const list = listFromFile(await file.text());
        if (inspectList(list).users.length === 0) reject();
        else onChange(list);
      } catch {
        reject();
      }
    },
    [onChange, t, toast]
  );

  return (
    <div
      ref={rootRef}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        void handleFile(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "flex min-w-0 flex-col gap-2 rounded-xl",
        dragOver && "ring-2 ring-ring ring-offset-4 ring-offset-card"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        <span
          ref={countRef}
          className="raised tabular font-display inline-grid h-6 min-w-8 place-items-center rounded-lg px-2 text-xs font-bold"
        >
          {count.toLocaleString()}
        </span>
      </div>

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        className="sunken h-36 w-full resize-none px-3 py-2.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
      />

      <p className="min-h-4 text-xs text-muted-foreground">{notes.join(" · ")}</p>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <UploadIcon />
          {t.uploadFile}
        </Button>
        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange("")}>
            <XIcon />
            {t.clear}
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,.json,.html,text/plain,application/json,text/html"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
