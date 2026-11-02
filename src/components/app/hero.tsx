"use client";

import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/providers/i18n-provider";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-8 pt-10 text-center sm:pt-14">
      <Reveal>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">
          <span className="text-3d">{t.heroTitle1}</span>
          <br />
          <span className="text-3d text-3d-accent">
            <span className="text-gradient">{t.heroTitleGrad}</span>
          </span>
        </h1>
      </Reveal>
      <Reveal delay={50}>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
          {t.heroSub}
        </p>
      </Reveal>
    </section>
  );
}
