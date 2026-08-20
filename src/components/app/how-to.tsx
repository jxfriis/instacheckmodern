"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import { GlassCard } from "@/components/ui/section-card";
import { CloudDownloadIcon } from "@/components/ui/cloud-download";
import { useI18n } from "@/providers/i18n-provider";

export function HowTo() {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<number>(-1);
  const downloadIconRef = useRef<AnimatedIconHandle | null>(null);

  const playDownload = () => downloadIconRef.current?.startAnimation();

  const steps = [
    { phase: t.phase1, title: t.tutStep1Title, desc: t.tutStep1Desc },
    { phase: t.phase1, title: t.tutStep2Title, desc: t.tutStep2Desc },
    { phase: t.phase1, title: t.tutStep3Title, desc: t.tutStep3Desc },
    { phase: t.phase2, title: t.tutStep4Title, desc: t.tutStep4Desc },
    { phase: t.phase2, title: t.tutStep5Title, desc: t.tutStep5Desc },
    { phase: t.phase2, title: t.tutStep6Title, desc: t.tutStep6Desc },
    { phase: t.phase3, title: t.tutStep7Title, desc: t.tutStep7Desc },
    { phase: t.phase3, title: t.tutStep8Title, desc: t.tutStep8Desc },
  ];

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pt-10">
      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <h2 className="font-display text-lg font-bold tracking-tight">
              {t.extTitle}
            </h2>
            <p className="text-xs text-muted-foreground">{t.extSub}</p>
          </div>
          <a
            href="/instacheck-v2.zip"
            download
            onMouseEnter={playDownload}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-ig px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
          >
            <CloudDownloadIcon
              ref={downloadIconRef}
              size={16}
              className="[&_svg]:block"
            />
            {t.extBtn}
          </a>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t.extDesc}
        </p>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:border-ring/40 hover:bg-muted/40"
        >
          {t.tutLabel}
          <ChevronDownIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ol className="mt-3 space-y-2">
                {steps.map((step, i) => {
                  const isOpen = open === i;
                  const showPhase =
                    i === 0 || steps[i - 1].phase !== step.phase;
                  return (
                    <li key={i}>
                      {showPhase && (
                        <span className="mb-1.5 mt-2 inline-flex items-center gap-1.5 rounded-full bg-ig-purple/10 px-2.5 py-0.5 text-[11px] font-semibold text-ig-purple">
                          {step.phase}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? -1 : i)}
                        aria-expanded={isOpen}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                          isOpen
                            ? "border-ring/40 bg-muted/40"
                            : "border-border hover:border-ring/30 hover:bg-muted/20"
                        )}
                      >
                        <span
                          className={cn(
                            "tabular grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors",
                            isOpen
                              ? "bg-gradient-ig text-white"
                              : "bg-muted/70 text-muted-foreground"
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium">
                          {step.title}
                        </span>
                        <ChevronDownIcon
                          className={cn(
                            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.22,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="py-2 pl-9 pr-3 text-xs leading-relaxed text-muted-foreground">
                              {step.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </section>
  );
}
