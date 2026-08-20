"use client";

import { ExternalLink, Eye, XIcon } from "lucide-react";

import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";
import { Button } from "@/components/ui/button";

export function WatchPanel() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();

  if (state.watched.size === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <Eye className="size-4 text-watch-fg" />
        <h2 className="text-sm font-semibold">{t.watchPanelTitle}</h2>
        <span className="tabular rounded-full bg-watch/10 px-2 py-0.5 text-xs font-medium text-watch-fg">
          {state.watched.size}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{t.watchPanelSub}</p>

      <ul className="mt-3 divide-y divide-border/60">
        {Array.from(state.watched.entries()).map(([u, entry]) => (
          <li
            key={u}
            className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-2">
              <a
                href={`https://instagram.com/${u}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-mono text-sm text-watch-fg hover:underline"
              >
                @{u}
              </a>
              <span className="tabular shrink-0 text-xs text-muted-foreground">
                {entry.date}
              </span>
              <a
                href={`https://instagram.com/${u}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.open}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => actions.toggleWatch(u, entry.date)}
              aria-label={t.watchUnwatch}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
