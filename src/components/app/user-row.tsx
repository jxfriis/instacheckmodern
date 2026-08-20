"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Folder, FolderPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import { getUserFolder } from "@/lib/instacheck/selectors";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";
import { Button } from "@/components/ui/button";
import { FavouriteIcon } from "@/components/ui/favourite";
import { Cancel01Icon } from "@/components/ui/cancel-01";
import { EyeIcon } from "@/components/ui/eye";
import { EyeOffIcon } from "@/components/ui/eye-off";
import { Copy01Icon } from "@/components/ui/copy-01";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const avatarGradients = [
  "linear-gradient(135deg,#f58529,#dd2a7b)",
  "linear-gradient(135deg,#dd2a7b,#8134af)",
  "linear-gradient(135deg,#518cd4,#8134af)",
  "linear-gradient(135deg,#f58529,#e5484d)",
  "linear-gradient(135deg,#8b5cf6,#dd2a7b)",
  "linear-gradient(135deg,#10b981,#518cd4)",
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(u: string) {
  const cleaned = u.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase();
  return cleaned || "??";
}

function avatarStyle(u: string, checked: boolean, wl: boolean, skip: boolean, watch: boolean, folder: string | null) {
  if (skip) return { background: "linear-gradient(135deg, rgba(255,80,80,0.75), rgba(255,140,140,0.55))" };
  if (watch) return { background: "linear-gradient(135deg, rgba(81,140,212,0.75), rgba(129,52,175,0.65))" };
  if (wl) return { background: "linear-gradient(135deg, rgba(245,133,41,0.8), rgba(221,42,123,0.65))" };
  if (folder) return { background: "linear-gradient(135deg, rgba(129,52,175,0.7), rgba(221,42,123,0.55))" };
  void checked;
  return { background: avatarGradients[hashString(u) % avatarGradients.length] };
}

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

  const wlRef = useRef<AnimatedIconHandle | null>(null);
  const skipRef = useRef<AnimatedIconHandle | null>(null);
  const watchRef = useRef<AnimatedIconHandle | null>(null);
  const copyRef = useRef<AnimatedIconHandle | null>(null);

  const playWl = () => wlRef.current?.startAnimation();
  const playSkip = () => skipRef.current?.startAnimation();
  const playWatch = () => watchRef.current?.startAnimation();
  const playCopy = () => copyRef.current?.startAnimation();

  return (
    <div
      className={cn(
        "group flex items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 transition-colors hover:border-border hover:bg-muted/30",
        skip && "opacity-70"
      )}
    >
      <div
        className="grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white"
        style={avatarStyle(u, checked, wl, skip, watch, folder)}
        aria-hidden
      >
        {initials(u)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate font-mono text-sm",
              skip && "text-muted-foreground line-through",
              watch && "text-watch-fg"
            )}
          >
            @{u}
          </span>
          {folder && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ig-purple/10 px-1.5 py-0.5 text-[10px] font-medium text-ig-purple">
              <Folder className="size-2.5" />
              {folder}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconAction
          label={wl ? t.wlRemove : t.wlAdd}
          active={wl}
          onClick={() => {
            actions.toggleWhitelist(u);
            playWl();
          }}
          onMouseEnter={playWl}
          className={wl ? "text-wl-fg" : ""}
        >
          <FavouriteIcon
            ref={wlRef}
            size={16}
            className={cn("[&_svg]:block", wl && "[&_path]:fill-current")}
          />
        </IconAction>

        <IconAction
          label={skip ? t.skipRemove : t.skipAdd}
          active={skip}
          onClick={() => {
            actions.toggleSkip(u);
            playSkip();
          }}
          onMouseEnter={playSkip}
          className={skip ? "text-skip-fg" : ""}
        >
          <Cancel01Icon
            ref={skipRef}
            size={16}
            className="[&_svg]:block"
          />
        </IconAction>

        <IconAction
          label={watch ? t.watchRemove : t.watchAdd}
          active={watch}
          onClick={() => {
            actions.toggleWatch(u, new Date().toISOString().slice(0, 10));
            playWatch();
          }}
          onMouseEnter={playWatch}
          className={watch ? "text-watch-fg" : ""}
        >
          {watch ? (
            <EyeOffIcon
              ref={watchRef}
              size={16}
              className="[&_svg]:block"
            />
          ) : (
            <EyeIcon
              ref={watchRef}
              size={16}
              className="[&_svg]:block"
            />
          )}
        </IconAction>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  folder && "bg-muted/60 text-ig-purple"
                )}
                aria-label={t.folderQuick}
              >
                <FolderPlus className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            {state.folders.size > 0 && (
              <>
                <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                  {t.filterByFolder}
                </div>
                <DropdownMenuItem
                  onClick={() => actions.setActiveFolder(null)}
                >
                  <span className="grid w-4 place-items-center">
                    {!state.activeFolder && (
                      <Check className="size-3.5" strokeWidth={3} />
                    )}
                  </span>
                  {t.filterAll}
                </DropdownMenuItem>
                {Array.from(state.folders.keys()).map((name) => {
                  const active = state.activeFolder === name;
                  return (
                    <DropdownMenuItem
                      key={`filter-${name}`}
                      onClick={() => actions.setActiveFolder(active ? null : name)}
                    >
                      <span className="grid w-4 place-items-center">
                        {active && (
                          <Check className="size-3.5" strokeWidth={3} />
                        )}
                      </span>
                      <Folder className="size-3.5 text-muted-foreground" />
                      {name}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
              </>
            )}

            <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
              {t.foldersLabel}
            </div>
            {state.lastUsedFolder && (
              <DropdownMenuItem
                onClick={() => actions.addToFolder(u, state.lastUsedFolder!)}
              >
                {t.folderQuick} {state.lastUsedFolder}
              </DropdownMenuItem>
            )}
            {Array.from(state.folders.keys()).map((name) => (
              <DropdownMenuItem
                key={`add-${name}`}
                onClick={() => actions.addToFolder(u, name)}
              >
                <Folder className="size-3.5 text-muted-foreground" />
                {name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onRequestNewFolder(u)}>
              <FolderPlus className="size-3.5 text-muted-foreground" />
              {t.folderNew}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <IconAction
          label={t.copy}
          onClick={() => {
            actions.copyUsername(u);
            playCopy();
          }}
          onMouseEnter={playCopy}
        >
          <Copy01Icon
            ref={copyRef}
            size={16}
            className="[&_svg]:block"
          />
        </IconAction>

        <a
          href={`https://instagram.com/${u}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.open}
          className="inline-flex size-7 items-center justify-center rounded-md text-ig-pink transition-colors hover:bg-ig-pink/10 hover:text-ig-pink"
        >
          <ExternalLinkIcon size={16} className="[&_svg]:block" />
        </a>
      </div>

      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={checkDisabled}
        onClick={() => actions.toggleCheck(u)}
        className={cn(
          "relative grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors",
          checked ? "border-transparent" : "border-border hover:border-ring/60",
          checkDisabled && "cursor-not-allowed opacity-40"
        )}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute inset-0 grid place-items-center rounded-full bg-gradient-ig text-white"
            >
              <Check className="size-3.5" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

function IconAction({
  label,
  active,
  onClick,
  onMouseEnter,
  children,
  className,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              active && "bg-muted/60",
              className
            )}
          >
            {children}
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
