"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LangToggle } from "./lang-toggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-4">
      <div
        className={cn(
          "mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4 transition-all duration-300 ease-out",
          scrolled
            ? "mt-2 max-w-xl rounded-full border border-border bg-background/80 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "border-b border-border/60 bg-background/70 backdrop-blur-xl"
        )}
      >
        <Logo />
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
