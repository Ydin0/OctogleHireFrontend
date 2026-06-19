"use client";

import { createContext, useCallback, useContext, useState } from "react";

import { BriefWizard } from "@/components/marketing/brief-wizard";

interface OpenOptions {
  defaultRole?: string;
  roleChips?: string[];
  defaultTech?: string[];
  sourcePage?: string;
}

const BriefWizardContext = createContext<{ open: (opts?: OpenOptions) => void } | null>(
  null,
);

/**
 * Mounts a single shared BriefWizard modal and exposes `open()` so any CTA
 * across the site (navbar, hire pages, signup) can launch the lead-gen flow.
 */
export function BriefWizardProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOptions>({});

  const openWizard = useCallback((o?: OpenOptions) => {
    setOpts(o ?? {});
    setOpen(true);
  }, []);

  return (
    <BriefWizardContext.Provider value={{ open: openWizard }}>
      {children}
      <BriefWizard
        open={open}
        onClose={() => setOpen(false)}
        defaultRole={opts.defaultRole}
        roleChips={opts.roleChips}
        defaultTech={opts.defaultTech}
        sourcePage={opts.sourcePage}
      />
    </BriefWizardContext.Provider>
  );
}

export function useBriefWizard() {
  return useContext(BriefWizardContext) ?? { open: () => {} };
}
