"use client";

import { Eye, XIcon } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import { INSTAGRAM_URL } from "@/lib/instacheck/constants";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";
import { Button } from "@/components/ui/button";

export function WatchPanel() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();

  if (state.watched.size === 0) return null;

  return (
    <Panel>
      <div className="flex items-center gap-2">
        <Eye className="size-4 text-watch-fg" />
        <h2 className="text-sm font-semibold">{t.watchPanelTitle}</h2>
        <span className="tabular text-xs font-semibold text-watch-fg">
          {state.watched.size}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{t.watchPanelSub}</p>

      <ul className="mt-3 divide-y divide-border">
        {Array.from(state.watched.entries()).map(([u, entry]) => (
          <li
            key={u}
            className="flex items-center justify-between gap-2 py-1.5 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-2">
              <a
                href={`${INSTAGRAM_URL}${u}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.open}: @${u}`}
                className="truncate text-sm font-medium text-watch-fg hover:underline"
              >
                @{u}
              </a>
              <span className="tabular shrink-0 text-xs text-muted-foreground">
                {entry.date}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => actions.toggleWatch(u, entry.date)}
              aria-label={t.watchUnwatch}
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
