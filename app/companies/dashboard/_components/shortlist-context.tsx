"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { addToShortlist, removeFromShortlist } from "@/lib/api/companies";

interface ShortlistContextValue {
  ids: Set<string>;
  count: number;
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({
  initialIds,
  children,
}: {
  initialIds: string[];
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();
  const [ids, setIds] = useState<Set<string>>(() => new Set(initialIds));

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = new Set(prev);
        const willRemove = next.has(id);
        if (willRemove) next.delete(id);
        else next.add(id);
        // Fire-and-forget persistence; UI is optimistic.
        void (async () => {
          const token = await getToken();
          if (willRemove) await removeFromShortlist(token, id);
          else await addToShortlist(token, id);
        })();
        return next;
      });
    },
    [getToken],
  );

  const value: ShortlistContextValue = {
    ids,
    count: ids.size,
    isSaved: (id: string) => ids.has(id),
    toggle,
  };

  return (
    <ShortlistContext.Provider value={value}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist(): ShortlistContextValue {
  const ctx = useContext(ShortlistContext);
  if (!ctx) {
    // Safe fallback so components used outside the provider don't crash.
    return {
      ids: new Set(),
      count: 0,
      isSaved: () => false,
      toggle: () => {},
    };
  }
  return ctx;
}
