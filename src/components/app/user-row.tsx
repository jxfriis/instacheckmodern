"use client";

import { useRef } from "react";
import {
  BanIcon,
  Check,
  CopyIcon,
  EllipsisIcon,
  EyeIcon,
  Folder,
  FolderMinus,
  FolderPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import { INSTAGRAM_URL } from "@/lib/instacheck/constants";
import { getUserFolder } from "@/lib/instacheck/selectors";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";
import { UserAvatar } from "./user-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePopOnChange } from "@/components/ui/reveal";
import { FavouriteIcon } from "@/components/ui/favourite";
import { ExternalLinkIcon } from "@/components/ui/external-link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserRow({
  u,
  onRequestNewFolder,
}: {
  u: string;
  onRequestNewFolder: (u: string) => void;
}) {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();

  const checked = state.checked.has(u);
  const wl = state.whitelisted.has(u);
  const skip = state.skipped.has(u);
  const watch = state.watched.has(u);
  const folder = getUserFolder(state, u);

  const checkDisabled = wl || skip;
  const checkRef = usePopOnChange<HTMLButtonElement>(checked, 0.6);
  const starRef = usePopOnChange<HTMLSpanElement>(wl, 0.6);
  const watchRef = usePopOnChange<HTMLSpanElement>(watch, 0.6);

  const wlRef = useRef<AnimatedIconHandle | null>(null);
  const linkRef = useRef<AnimatedIconHandle | null>(null);

  const folderNames = Array.from(state.folders.keys()).sort((a, b) =>
    a === state.lastUsedFolder ? -1 : b === state.lastUsedFolder ? 1 : 0
  );

  return (
    <div className="pb-1">
      <div className="flex items-center gap-1.5 rounded-xl border max-sm:px-1 sm:gap-2.5 border-b-[3px] border-transparent px-2 py-1 hover:bg-[var(--hover)]">
        <button
          ref={checkRef}
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label={`${t.markDone}: @${u}`}
          disabled={checkDisabled}
          onClick={() => actions.toggleCheck(u)}
          className={cn(
            "no-press grid size-7 shrink-0 place-items-center rounded-full text-white outline-none focus-visible:ring-2 focus-visible:ring-ring",
            checked ? "accent-fill" : "sunken rounded-full",
            checkDisabled && "cursor-not-allowed opacity-40"
          )}
        >
          {checked && <Check className="size-3.5" strokeWidth={3} />}
        </button>

        <UserAvatar u={u} className={cn("max-sm:hidden", checked && "opacity-50")} />

        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span
            className={cn(
              "truncate text-sm font-medium",
              (skip || checked) && "text-muted-foreground line-through"
            )}
          >
            @{u}
          </span>
          {folder && (
            <span className="hidden shrink-0 items-center gap-1 rounded-full bg-ig-purple/15 px-1.5 py-0.5 text-[10px] font-medium text-foreground sm:inline-flex">
              <Folder className="size-2.5" />
              {folder}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center sm:gap-0.5 max-sm:[&_[data-slot=button]]:size-7 max-sm:[&>a]:size-7">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={wl ? t.wlRemove : t.wlAdd}
                  aria-pressed={wl}
                  onClick={() => {
                    actions.toggleWhitelist(u);
                    wlRef.current?.startAnimation();
                  }}
                  onMouseEnter={() => wlRef.current?.startAnimation()}
                  className={cn(wl && "text-wl hover:text-wl")}
                >
                  <span ref={starRef} className="inline-grid">
                    <FavouriteIcon
                      ref={wlRef}
                      size={16}
                      className={cn("[&_svg]:block", wl && "[&_path]:fill-current")}
                    />
                  </span>
                </Button>
              }
            />
            <TooltipContent>{wl ? t.wlRemove : t.wlAdd}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={watch ? t.watchRemove : t.watchAdd}
                  aria-pressed={watch}
                  onClick={() =>
                    actions.toggleWatch(u, new Date().toISOString().slice(0, 10))
                  }
                  className={cn(watch && "text-watch-fg hover:text-watch-fg")}
                >
                  <span ref={watchRef} className="inline-grid">
                    <EyeIcon className={cn(watch && "fill-current/25")} />
                  </span>
                </Button>
              }
            />
            <TooltipContent>{watch ? t.watchRemove : t.watchAdd}</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger
                render={
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={folder ? `${t.foldersLabel}: ${folder}` : t.folderAdd}
                        className={cn(folder && "text-ig-pink hover:text-ig-pink")}
                      >
                        {folder ? <Folder className="fill-current" /> : <FolderPlus />}
                      </Button>
                    }
                  />
                }
              />
              <TooltipContent>{folder ?? t.folderAdd}</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-auto min-w-48">
              {folderNames.map((name) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => actions.addToFolder(u, name)}
                >
                  <Folder className="text-muted-foreground" />
                  {name}
                  {name === folder && <Check className="ml-auto" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => onRequestNewFolder(u)}>
                <FolderPlus className="text-muted-foreground" />
                {t.folderNew}
              </DropdownMenuItem>
              {folder && (
                <DropdownMenuItem onClick={() => actions.removeFromFolder(u)}>
                  <FolderMinus className="text-muted-foreground" />
                  {t.folderRemove}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href={`${INSTAGRAM_URL}${u}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.open}
                  onMouseEnter={() => linkRef.current?.startAnimation()}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" }),
                    "text-ig-pink hover:text-ig-pink"
                  )}
                >
                  <ExternalLinkIcon ref={linkRef} size={16} className="[&_svg]:block" />
                </a>
              }
            />
            <TooltipContent>{t.open}</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label={t.moreActions}>
                  <EllipsisIcon />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-auto min-w-56">
              <DropdownMenuItem onClick={() => actions.toggleSkip(u)}>
                <BanIcon className="text-muted-foreground" />
                {skip ? t.skipRemove : t.skipAdd}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.copyUsername(u)}>
                <CopyIcon className="text-muted-foreground" />
                {t.copy}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
