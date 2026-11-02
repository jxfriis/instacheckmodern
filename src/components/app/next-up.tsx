"use client";

import { useState } from "react";
import { ArrowUpRightIcon, CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { INSTAGRAM_URL } from "@/lib/instacheck/constants";
import { getFilterCounts, getNextUp } from "@/lib/instacheck/selectors";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";
import { UserAvatar } from "./user-avatar";

/** The main job, one account at a time: open it, unfollow it, tick it off, on to the next. */
export function NextUp() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();
  const [opened, setOpened] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const u = getNextUp(state);
  const hasOpened = opened === u;

  if (state.unfollowers.length === 0) return null;

  if (!u) {
    const { done } = getFilterCounts(state);
    if (done === 0) return null;
    return (
      <Reveal kind="pop">
        <Panel className="flex items-center gap-3">
          <span className="accent-fill grid size-10 shrink-0 place-items-center rounded-full text-white">
            <CheckIcon className="size-5" strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{t.allDoneTitle}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.allDoneSub}</p>
          </div>
        </Panel>
      </Reveal>
    );
  }

  return (
    <Panel>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold text-muted-foreground">
          {t.nextTitle}
        </h2>
        {previous && state.checked.has(previous) && (
          <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span className="truncate">
              {t.nextPrevious} @{previous}
            </span>
            <button
              type="button"
              onClick={() => {
                actions.toggleCheck(previous);
                setPrevious(null);
              }}
              className="shrink-0 font-medium text-foreground underline underline-offset-2"
            >
              {t.undo}
            </button>
          </p>
        )}
      </div>

      <Reveal key={u} kind="pop" className="mt-3 flex items-center gap-3">
        <UserAvatar u={u} className="size-11 text-sm" />
        <p className="min-w-0 truncate pb-1 font-display text-lg font-semibold">@{u}</p>
      </Reveal>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`${INSTAGRAM_URL}${u}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(u)}
          className={cn(
            buttonVariants({ variant: hasOpened ? "outline" : "default" }),
            "max-sm:w-full"
          )}
        >
          {t.nextOpen}
          <ArrowUpRightIcon />
        </a>
        <Button
          variant={hasOpened ? "default" : "outline"}
          className="max-sm:w-full"
          onClick={() => {
            actions.toggleCheck(u);
            setPrevious(u);
          }}
        >
          <CheckIcon />
          {t.nextDone}
        </Button>
        <Button
          variant="ghost"
          className="max-sm:flex-1"
          onClick={() => actions.toggleWhitelist(u)}
        >
          {t.nextKeep}
        </Button>
        <Button
          variant="ghost"
          className="max-sm:flex-1"
          onClick={() => actions.toggleSkip(u)}
        >
          {t.nextSkip}
        </Button>
      </div>
    </Panel>
  );
}
