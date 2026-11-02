import { cn } from "@/lib/utils";

const avatarColors = [
  "var(--ig-orange)",
  "var(--ig-pink)",
  "var(--ig-purple)",
  "var(--ig-blue)",
  "var(--wl-fg)",
  "var(--watch-fg)",
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

/** A raised disc with a coloured initial, like the avatars in Friis. */
export function UserAvatar({ u, className }: { u: string; className?: string }) {
  const color = avatarColors[hashString(u) % avatarColors.length];
  return (
    <div
      aria-hidden
      className={cn(
        "raised font-display grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold",
        className
      )}
      style={{ color: `color-mix(in oklch, ${color} 78%, var(--foreground))` }}
    >
      {initials(u)}
    </div>
  );
}
