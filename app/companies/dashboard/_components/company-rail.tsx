"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bookmark,
  ClipboardList,
  FileSignature,
  Moon,
  Receipt,
  Settings,
  Sparkles,
  Sun,
  Target,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useShortlist } from "./shortlist-context";

const BASE = "/companies/dashboard";

interface RailItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badgeKey?: "saved" | "candidates" | "agreements" | "requirements";
  exact?: boolean;
}

const PRIMARY: RailItem[] = [
  { href: BASE, label: "Discover", icon: Sparkles, exact: true },
  { href: `${BASE}/requirements`, label: "Roles", icon: Target, badgeKey: "requirements" },
  { href: `${BASE}/saved`, label: "Saved", icon: Bookmark, badgeKey: "saved" },
  { href: `${BASE}/engagements`, label: "Hires", icon: Users },
  { href: `${BASE}/invoices`, label: "Billing", icon: Receipt },
];

const SECONDARY: RailItem[] = [
  { href: `${BASE}/candidates`, label: "Cands", icon: ClipboardList, badgeKey: "candidates" },
  // Interviews ("Calls"), Calendar ("Cal") and Timesheets ("Time") are hidden
  // until those surfaces are ready for companies.
  { href: `${BASE}/team`, label: "Team", icon: Users },
  { href: `${BASE}/agreements`, label: "Docs", icon: FileSignature, badgeKey: "agreements" },
  { href: `${BASE}/settings`, label: "Setup", icon: Settings },
];

function isActive(pathname: string, item: RailItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function RailButton({
  item,
  active,
  badge,
}: {
  item: RailItem;
  active: boolean;
  badge: number;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={item.label}
      className={cn(
        "relative flex w-[60px] flex-col items-center gap-1 rounded-2xl py-2 transition-colors",
        active
          ? "bg-pulse/14 text-pulse"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      <Icon className="size-[19px]" />
      <span className="font-mono text-[8.5px] uppercase tracking-wider">
        {item.label}
      </span>
      {badge > 0 && (
        <span className="absolute right-2.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-pulse px-1 font-mono text-[9px] font-medium text-pulse-foreground">
          {badge}
        </span>
      )}
    </Link>
  );
}

interface CompanyRailProps {
  counts: {
    requirements: number;
    candidates: number;
    agreements: number;
  };
  companyInitials: string;
  marketplaceEnabled: boolean;
}

// Items hidden when a company's marketplace view is disabled.
const MARKETPLACE_HREFS = new Set([BASE, `${BASE}/saved`]);

export function CompanyRail({
  counts,
  companyInitials,
  marketplaceEnabled,
}: CompanyRailProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { count: savedCount } = useShortlist();

  const primary = marketplaceEnabled
    ? PRIMARY
    : PRIMARY.filter((item) => !MARKETPLACE_HREFS.has(item.href));

  const badgeFor = (item: RailItem) => {
    switch (item.badgeKey) {
      case "saved":
        return savedCount;
      case "candidates":
        return counts.candidates;
      case "agreements":
        return counts.agreements;
      case "requirements":
        return counts.requirements;
      default:
        return 0;
    }
  };

  return (
    <div className="flex h-full w-[78px] shrink-0 flex-col items-center gap-1.5 border-r border-border bg-card/55 py-3.5">
      <Link href={BASE} className="mb-3 inline-flex">
        {/* Light-mode icon on light theme, dark-mode icon on dark theme. */}
        <Image
          src="/Octogle%20Icon%20Light.svg"
          alt="OctogleHire"
          width={30}
          height={30}
          unoptimized
          className="size-[30px] object-contain dark:hidden"
        />
        <Image
          src="/Octogle%20Icon.svg"
          alt="OctogleHire"
          width={30}
          height={30}
          unoptimized
          className="hidden size-[30px] object-contain dark:block"
        />
      </Link>

      <div className="flex w-full flex-1 flex-col items-center gap-1 overflow-y-auto">
        {primary.map((item) => (
          <RailButton
            key={item.href}
            item={item}
            active={isActive(pathname, item)}
            badge={badgeFor(item)}
          />
        ))}
        <div className="my-1 h-px w-8 bg-border" />
        {SECONDARY.map((item) => (
          <RailButton
            key={item.href}
            item={item}
            active={isActive(pathname, item)}
            badge={badgeFor(item)}
          />
        ))}
      </div>

      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        title="Toggle theme"
        className="mb-2.5 inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground"
      >
        <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </button>
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-pulse/60 to-muted text-xs font-semibold text-foreground">
        {companyInitials}
      </span>
    </div>
  );
}
