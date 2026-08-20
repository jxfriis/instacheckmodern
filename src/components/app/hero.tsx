"use client";

import { motion } from "motion/react";

import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { useI18n } from "@/providers/i18n-provider";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 pb-8 pt-10 text-center sm:pt-14">
      <Spotlight className="opacity-70" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ig-pink opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-gradient-ig" />
            </span>
            Instagram follower checker
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl"
        >
          {t.heroTitle1}
          <br />
          <AnimatedGradientText>{t.heroTitleGrad}</AnimatedGradientText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base"
        >
          {t.heroSub}
        </motion.p>
      </div>
    </section>
  );
}
