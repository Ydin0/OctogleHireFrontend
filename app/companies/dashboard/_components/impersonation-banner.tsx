"use client";

import { useClerk } from "@clerk/nextjs";
import { Eye, LogOut } from "lucide-react";

export function ImpersonationBanner({ companyName }: { companyName: string }) {
  const { signOut } = useClerk();

  return (
    <div className="flex shrink-0 items-center justify-center gap-3 bg-amber-500/15 px-4 py-1.5 text-amber-700 dark:text-amber-300">
      <Eye className="size-3.5" />
      <span className="text-[13px]">
        Viewing as <strong>{companyName}</strong> — impersonated session
      </span>
      <button
        onClick={() => signOut({ redirectUrl: "/admin/dashboard" })}
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider transition-colors hover:bg-amber-500/20"
      >
        <LogOut className="size-3" /> Exit
      </button>
    </div>
  );
}
