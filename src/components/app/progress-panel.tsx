"use client";

import { useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Motion } from "@/lib/motion";
import { Panel } from "@/components/ui/panel";
import { NumberTicker } from "@/components/ui/number-ticker";
import { inspectList, unique } from "@/lib/instacheck/parse";
import { getDoneCount, getRemainingCount } from "@/lib/instacheck/selectors";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

export function ProgressPanel() {
  const { t } = useI18n();
  const { state, progress, actions } = useInstaCheckContext();
  const fill = useRef<HTMLDivElement>(null);
  const placed = useRef(false);

  const done = getDoneCount(state);
  const total = done + getRemainingCount(state);

  // An imported save file has no source lists to describe.
  const hasLists = state.following.length > 0;
  const lineNotes = [state.followingText, state.followersText].map(inspectList);
  const ignored = lineNotes[0].ignored + lineNotes[1].ignored;
  const duplicates = lineNotes[0].duplicates + lineNotes[1].duplicates;
  const notes = [
    ignored > 0 && t.ignoredLines.replace("{n}", String(ignored)),
    duplicates > 0 && t.dupesRemoved.replace("{n}", String(duplicates)),
  ].filter(Boolean);

  useLayoutEffect(() => {
    if (!fill.current) return;
    if (placed.current) Motion.size(fill.current, "width", `${progress}%`, true);
    else fill.current.style.width = `${progress}%`;
    placed.current = true;
  }, [progress]);

  return (
    <Panel>
      <p className="pb-1 font-display text-6xl font-black leading-none">
        <NumberTicker value={state.unfollowers.length} className="tabular" />
      </p>
      <p className="mt-1.5 font-display text-base font-semibold">{t.resultTitle}</p>
      {hasLists && (
        <p className="mt-1 text-xs text-muted-foreground">
          {t.youFollow.replace(
            "{n}",
            unique(state.following).length.toLocaleString()
          )}
          {" · "}
          {t.followYou.replace(
            "{n}",
            unique(state.followers).length.toLocaleString()
          )}
        </p>
      )}
      {hasLists && notes.length > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">{notes.join(" · ")}</p>
      )}

      <div className="mt-4 flex items-baseline justify-between gap-2 text-xs">
        <span className="tabular font-medium">
          {t.progressOf
            .replace("{done}", done.toLocaleString())
            .replace("{total}", total.toLocaleString())}
        </span>
        <span className="tabular font-display font-semibold">{progress}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="sunken relative mt-1.5 h-3.5 overflow-hidden rounded-full"
      >
        <div
          ref={fill}
          className={cn(
            "accent-fill absolute inset-y-0 left-0 rounded-full",
            progress === 0 && "opacity-0"
          )}
        />
      </div>

      <label htmlFor="goal-input" className="mt-4 block text-xs font-medium">
        {t.followLbl}
      </label>
      <input
        id="goal-input"
        type="text"
        inputMode="numeric"
        value={state.followCount}
        onChange={(e) =>
          actions.setFollowCount(e.target.value.replace(/[^0-9]/g, ""))
        }
        placeholder={t.goalPlaceholder}
        className="sunken tabular mt-1.5 h-10 w-full px-3 text-sm outline-none placeholder:text-muted-foreground"
      />
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {t.followHint}
      </p>
    </Panel>
  );
}
