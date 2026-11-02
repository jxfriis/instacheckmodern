"use client";

import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { parseList } from "@/lib/instacheck/parse";
import { getRememberedCount } from "@/lib/instacheck/selectors";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";
import { ListTextarea } from "./list-textarea";
import { ImportButton } from "./import-button";

export function InputPanel() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();

  const following = parseList(state.followingText);
  const followers = parseList(state.followersText);
  const ready = following.length > 0 && followers.length > 0;
  const remembered = getRememberedCount(state);

  let hint = "";
  if (!following.length && !followers.length) hint = t.needBoth;
  else if (!following.length) hint = t.needFollowing;
  else if (!followers.length) hint = t.needFollowers;
  else if (following.join() === followers.join()) hint = t.listsIdentical;

  return (
    <section className="mx-auto w-full max-w-3xl px-4">
      <Reveal delay={100}>
        <Panel>
          <div className="grid gap-5 sm:grid-cols-2">
            <ListTextarea
              id="following"
              label={t.lbl1}
              value={state.followingText}
              onChange={actions.setFollowingText}
              placeholder={t.placeholder1}
            />
            <ListTextarea
              id="followers"
              label={t.lbl2}
              value={state.followersText}
              onChange={actions.setFollowersText}
              placeholder={t.placeholder2}
            />
          </div>

          {remembered > 0 && (
            <p className="mt-4 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              {t.remembered.replace("{n}", String(remembered))}
              <button
                type="button"
                onClick={actions.clearAll}
                className="font-medium text-foreground underline underline-offset-2"
              >
                {t.forget}
              </button>
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              size="lg"
              disabled={!ready}
              onClick={actions.run}
              className="sm:flex-1"
            >
              {t.run}
              <ArrowRightIcon />
            </Button>
            <ImportButton />
          </div>

          <p className="mt-3 min-h-4 text-center text-xs text-muted-foreground">
            {hint}
          </p>
        </Panel>
      </Reveal>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {t.noListsYet}{" "}
        <a
          href="#how-to"
          className="inline-block font-medium text-foreground underline underline-offset-2"
        >
          {t.howLink}
        </a>
      </p>
    </section>
  );
}
