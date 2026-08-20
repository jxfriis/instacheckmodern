"use client";

import { createContext, useContext } from "react";

import type { InstaCheckApi } from "@/hooks/use-insta-check";

export const InstaCheckContext = createContext<InstaCheckApi | null>(null);

export function useInstaCheckContext() {
  const ctx = useContext(InstaCheckContext);
  if (!ctx) {
    throw new Error(
      "useInstaCheckContext must be used within an InstaCheckContext.Provider"
    );
  }
  return ctx;
}
