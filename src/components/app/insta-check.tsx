"use client";

import { cn } from "@/lib/utils";
import { useInstaCheck } from "@/hooks/use-insta-check";
import { InstaCheckContext } from "./context";
import { Header } from "@/components/layout/header";
import { Hero } from "./hero";
import { InputPanel } from "./input-panel";
import { StickyCounter } from "./sticky-counter";
import { Results } from "./results";
import { HowTo } from "./how-to";
import { Footer } from "./footer";

export function InstaCheck() {
  const api = useInstaCheck();
  const { state } = api;

  return (
    <InstaCheckContext.Provider value={api}>
      <Header />
      <main className={cn("flex-1 pb-8", !state.hydrated && "invisible")}>
        {state.hasRun ? (
          <Results />
        ) : (
          <>
            <Hero />
            <InputPanel />
            <HowTo />
          </>
        )}
      </main>
      <StickyCounter />
      <Footer />
    </InstaCheckContext.Provider>
  );
}
