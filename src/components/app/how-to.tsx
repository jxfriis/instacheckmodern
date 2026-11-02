"use client";

import { useRef } from "react";

import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import { buttonVariants } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { CloudDownloadIcon } from "@/components/ui/cloud-download";
import { useI18n } from "@/providers/i18n-provider";

export function HowTo() {
  const { t } = useI18n();
  const downloadIconRef = useRef<AnimatedIconHandle | null>(null);

  const phases = [
    {
      title: t.phase1,
      steps: [
        { title: t.tutStep1Title, desc: t.tutStep1Desc },
        { title: t.tutStep2Title, desc: t.tutStep2Desc },
        { title: t.tutStep3Title, desc: t.tutStep3Desc },
      ],
    },
    {
      title: t.phase2,
      steps: [
        { title: t.tutStep4Title, desc: t.tutStep4Desc },
        { title: t.tutStep5Title, desc: t.tutStep5Desc },
        { title: t.tutStep6Title, desc: t.tutStep6Desc },
      ],
    },
    {
      title: t.phase3,
      steps: [
        { title: t.tutStep7Title, desc: t.tutStep7Desc },
        { title: t.tutStep8Title, desc: t.tutStep8Desc },
      ],
    },
  ];

  let number = 0;

  return (
    <section id="how-to" className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 pt-10">
      <Panel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold tracking-tight">
              {t.extTitle}
            </h2>
            <p className="text-xs text-muted-foreground">{t.extSub}</p>
          </div>
          <a
            href="/instacheck-v2.zip"
            download
            onMouseEnter={() => downloadIconRef.current?.startAnimation()}
            className={buttonVariants()}
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
          {t.extDesc} {t.extAlt}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {phases.map((phase) => (
            <div key={phase.title}>
              <h3 className="text-sm font-semibold">{phase.title}</h3>
              <ol className="mt-3 space-y-4">
                {phase.steps.map((step) => {
                  number += 1;
                  return (
                    <li key={step.title} className="flex gap-3">
                      <span className="raised tabular font-display grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold">
                        {number}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug">
                          {step.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
