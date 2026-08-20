"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useInstaCheck } from "@/hooks/use-insta-check";
import { useI18n } from "@/providers/i18n-provider";
import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import { InstaCheckContext } from "./context";
import { Header } from "@/components/layout/header";
import { SpotlightShader } from "@/components/ui/spotlight-shader";
import { RefreshIcon } from "@/components/ui/refresh";
import { Hero } from "./hero";
import { InputPanel } from "./input-panel";
import { Thinking } from "./thinking";
import { Results } from "./results";
import { HowTo } from "./how-to";
import { Footer } from "./footer";

export function InstaCheck() {
  const api = useInstaCheck();
  const { state, actions } = api;
  const { t } = useI18n();
  const newSearchIconRef = useRef<AnimatedIconHandle | null>(null);

  const playNewSearch = () => newSearchIconRef.current?.startAnimation();

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasData =
        state.followingText.trim() ||
        state.followersText.trim() ||
        state.hasRun;
      if (hasData) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [state.followingText, state.followersText, state.hasRun]);

  return (
    <InstaCheckContext.Provider value={api}>
      <SpotlightShader />
      <Header />
      <main className="flex-1 pb-8">
        <Hero />

        <AnimatePresence mode="wait" initial={false}>
          {state.hasRun ? (
            <motion.section
              key="thought"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-2xl space-y-3 px-4"
            >
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    actions.rescan();
                    playNewSearch();
                  }}
                  onMouseEnter={playNewSearch}
                  className="group relative rounded-2xl border border-border bg-muted/30 px-7 py-3 text-base font-semibold text-foreground transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      padding: "2px",
                      background:
                        "linear-gradient(135deg, rgba(245,133,41,0.75), rgba(221,42,123,0.75), rgba(129,52,175,0.75))",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                  <span className="relative flex items-center gap-2">
                    <RefreshIcon
                      ref={newSearchIconRef}
                      size={20}
                      className="[&_svg]:block"
                    />
                    {t.newSearchQuestion}
                  </span>
                </button>
              </div>
              <Thinking />
            </motion.section>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <InputPanel />
            </motion.div>
          )}
        </AnimatePresence>

        <Results />
        <HowTo />
      </main>
      <Footer />
    </InstaCheckContext.Provider>
  );
}
