"use client";

import { createContext, useContext } from "react";
import type { DeveloperProfile } from "@/lib/api/developer";

const DeveloperProfileContext = createContext<DeveloperProfile | null>(null);

export function DeveloperProfileProvider({
  profile,
  children,
}: {
  profile: DeveloperProfile;
  children: React.ReactNode;
}) {
  return (
    <DeveloperProfileContext.Provider value={profile}>
      {children}
    </DeveloperProfileContext.Provider>
  );
}

export function useDeveloperProfile(): DeveloperProfile {
  const ctx = useContext(DeveloperProfileContext);
  if (!ctx) {
    throw new Error(
      "useDeveloperProfile must be used within a DeveloperProfileProvider",
    );
  }
  return ctx;
}
