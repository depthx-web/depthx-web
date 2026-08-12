"use client";

import { createContext, useContext } from "react";
import {
  defaultSectionVisibility,
  type SectionKey,
} from "@/lib/section-visibility";

const SectionVisibilityContext = createContext<Record<string, boolean>>(
  defaultSectionVisibility,
);

/**
 * Client-side counterpart to isSectionVisible() (lib/section-visibility.ts).
 * Wrap a subtree with a resolved settings object fetched server-side, then
 * any client component beneath it can call useSectionVisible(key) directly —
 * this is the useSectionVisible('home.trustBar') hook named in spec §5.
 */
export function SectionVisibilityProvider({
  visibility,
  children,
}: {
  visibility: Record<string, boolean>;
  children: React.ReactNode;
}) {
  return (
    <SectionVisibilityContext.Provider value={visibility}>
      {children}
    </SectionVisibilityContext.Provider>
  );
}

export function useSectionVisible(key: SectionKey): boolean {
  const visibility = useContext(SectionVisibilityContext);
  return visibility[key] ?? defaultSectionVisibility[key];
}
