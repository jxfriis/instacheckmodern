"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";

import { SpotlightCard } from "@/components/ui/spotlight-card";
import { PixelLoader } from "@/components/ui/pixel-loader";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";
import { ListTextarea } from "./list-textarea";
import { ImportButton } from "./import-button";

export function InputPanel() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();
  const reducedMotion = useReducedMotion();
  const [analyzing, setAnalyzing] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const handleRun = () => {
    if (analyzing) return;
    if (reducedMotion) {
      actions.run();
      return;
    }
    setAnalyzing(true);
    setElapsed(0);
    const start = performance.now();
    const tick = window.setInterval(
      () => setElapsed((performance.now() - start) / 1000),
      100
    );
    window.setTimeout(() => {
      window.clearInterval(tick);
      actions.run();
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <section className="mx-auto w-full max-w-2xl px-4">
      <SpotlightCard>
        <AnimatePresence mode="wait" initial={false}>
          {analyzing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex min-h-[20rem] flex-col items-center justify-center gap-4 py-10 text-center"
            >
              <p className="text-sm font-semibold">{t.analyzing}</p>
              <PixelLoader elapsed={elapsed} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <ListTextarea
                  id="following"
                  label={t.lbl1}
                  value={state.followingText}
                  onChange={actions.setFollowingText}
                  placeholder={t.placeholder1}
                  uploadLabel={t.followingUploadLbl}
                  accent="following"
                />
                <ListTextarea
                  id="followers"
                  label={t.lbl2}
                  value={state.followersText}
                  onChange={actions.setFollowersText}
                  placeholder={t.placeholder2}
                  uploadLabel={t.followersUploadLbl}
                  accent="followers"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleRun}
                  className="group relative flex h-12 flex-1 items-center justify-center overflow-hidden rounded-xl bg-gradient-ig text-sm font-semibold text-white shadow-lg shadow-ig-pink/20 transition-shadow hover:shadow-ig-pink/35"
                >
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.28),transparent)] bg-[length:200%_100%] bg-left transition-[background-position] duration-500 group-hover:bg-right" />
                  <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 transition-opacity group-hover:ring-white/40" />
                  <span className="relative flex items-center gap-2">
                    {t.run}
                    <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </motion.button>

                <ImportButton className="h-12" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SpotlightCard>
    </section>
  );
}
