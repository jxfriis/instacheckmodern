import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 outline-none",
        className
      )}
      aria-label="InstaCheck"
    >
      <span className="grid size-8 place-items-center rounded-xl bg-gradient-ig text-white shadow-sm transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
        <CheckIcon className="size-4.5" strokeWidth={3} />
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
        Insta<span className="text-gradient">Check</span>
      </span>
    </Link>
  );
}
