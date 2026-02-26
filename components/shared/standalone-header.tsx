"use client";

import Link from "next/link";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

interface StandaloneHeaderProps {
  action?: { label: string; href: string };
}

function StandaloneHeader({ action }: StandaloneHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <Logo width={110} height={26} />
        </Link>

        <div className="flex items-center gap-2">
          {action && (
            <Link
              href={action.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {action.label}
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export { StandaloneHeader };
