"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

type Tab = "steps" | "reasoning" | "search" | "coding";

function fill(template: string, n: number) {
  return template.replace("{n}", String(n));
}

export function Thinking() {
  const { t } = useI18n();
  const { state } = useInstaCheckContext();
  const [tab, setTab] = useState<Tab>("steps");
  const [open, setOpen] = useState(true);

  const following = state.following.length;
  const followers = state.followers.length;
  const unfollowers = state.unfollowers.length;
  const total = following + followers;

  const tabs: { id: Tab; label: string }[] = [
    { id: "steps", label: t.thinkSteps },
    { id: "reasoning", label: t.thinkReasoning },
    { id: "search", label: t.thinkSearch },
    { id: "coding", label: t.thinkCoding },
  ];

  const traces: Record<Tab, string[]> = {
    steps: [
      fill(t.thinkStep1, following),
      fill(t.thinkStep2, followers),
      t.thinkStep3,
      fill(t.thinkStep4, unfollowers),
    ],
    reasoning: [
      fill(t.thinkReason1, unfollowers),
      t.thinkReason2,
      t.thinkReason3,
    ],
    search: [fill(t.thinkSearch1, total), t.thinkSearch2, t.thinkSearch3],
    coding: [t.thinkCode1, t.thinkCode2, t.thinkCode3],
  };

  return (
    <div className="rounded-xl border border-border bg-muted/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 px-3 py-2.5"
      >
        <CheckIcon
          className="size-4 shrink-0 text-muted-foreground"
          strokeWidth={2.5}
        />
        <span className="flex-1 text-left text-sm font-semibold">
          {t.thinkTitle}
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">
              <div className="flex gap-1">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      tab === item.id
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div
                key={tab}
                className="mt-2 space-y-1 rounded-lg bg-background/50 px-3 py-2.5"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {traces[tab].map((line, i) => (
                    <motion.p
                      key={line}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                      className="font-mono text-xs leading-relaxed text-muted-foreground"
                    >
                      <span className="mr-2 text-ig-pink/70">▸</span>
                      {line}
                    </motion.p>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
