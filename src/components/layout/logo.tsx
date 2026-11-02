import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label="InstaCheck"
    >
      <span className="accent-fill grid size-8 place-items-center rounded-[10px] text-white">
        <CheckIcon className="size-4.5" strokeWidth={3} />
      </span>
      <span className="hidden font-display text-lg font-extrabold tracking-tight text-foreground min-[420px]:inline">
        Insta<span className="text-gradient">Check</span>
      </span>
    </Link>
  );
}
