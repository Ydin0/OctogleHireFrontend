"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Briefcase,
  Building2,
  ClipboardCheck,
  Clock,
  GitPullRequestArrow,
  Handshake,
  Layers,
  LineChart,
  LogOut,
  Receipt,
  Send,
  Shield,
  Store,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAdminCurrency } from "./admin-currency-context";

const navGroups = [
  {
    label: "WORKSPACE",
    superAdminOnly: false,
    items: [
      { href: "/admin/dashboard", label: "Overview", icon: Layers },
    ],
  },
  {
    label: "PIPELINE",
    superAdminOnly: false,
    items: [
      { href: "/admin/dashboard/applicants", label: "Applicants", icon: Users },
      { href: "/admin/dashboard/companies", label: "Companies", icon: Building2 },
      { href: "/admin/dashboard/requirements", label: "Requirements", icon: Store, badgeKey: "requirements" as const },
      { href: "/admin/dashboard/interviews", label: "Interviews", icon: Video },
      { href: "/admin/dashboard/approvals", label: "Approvals", icon: ClipboardCheck, badgeKey: "approvals" as const },
    ],
  },
  {
    label: "PARTNERS",
    superAdminOnly: true,
    items: [
      { href: "/admin/dashboard/agencies", label: "Agencies", icon: Briefcase },
      { href: "/admin/dashboard/agencies/pitches", label: "Agency Pitches", icon: Send },
    ],
  },
  {
    label: "OPERATIONS",
    superAdminOnly: false,
    items: [
      { href: "/admin/dashboard/engagements", label: "Engagements", icon: Handshake },
      { href: "/admin/dashboard/time-entries", label: "Timesheets", icon: Clock },
      { href: "/admin/dashboard/change-requests", label: "Requests", icon: GitPullRequestArrow },
      { href: "/admin/dashboard/invoices", label: "Invoices", icon: Receipt },
      { href: "/admin/dashboard/payouts", label: "Payouts", icon: Wallet },
    ],
  },
  {
    label: "FINANCE",
    superAdminOnly: true,
    items: [
      { href: "/admin/dashboard/finances", label: "Finances", icon: LineChart },
    ],
  },
  {
    label: "SETTINGS",
    superAdminOnly: true,
    items: [
      { href: "/admin/dashboard/team", label: "Team", icon: Shield },
      { href: "/admin/dashboard/aeo", label: "AEO Monitoring", icon: Bot },
    ],
  },
] as const;

const isItemActive = (pathname: string, href: string) => {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

interface AdminSidebarProps {
  user: {
    fullName: string | null;
    email: string | null;
    imageUrl: string | null;
  };
  isSuperAdmin: boolean;
  openRequirementCount: number;
  pendingApprovalCount: number;
}

const currencies = ["USD", "GBP", "AED"] as const;

function CurrencyToggle() {
  const { displayCurrency, setDisplayCurrency } = useAdminCurrency();

  return (
    <div className="flex items-center gap-1">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mr-auto">
        Display
      </p>
      {currencies.map((c) => (
        <button
          key={c}
          onClick={() => setDisplayCurrency(c)}
          className={`rounded-md px-2 py-1 text-[10px] font-mono transition-colors ${
            displayCurrency === c
              ? "bg-pulse/10 text-pulse"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function SidebarContent({ user, isSuperAdmin, openRequirementCount, pendingApprovalCount }: AdminSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  const visibleGroups = navGroups.filter(
    (group) => !group.superAdminOnly || isSuperAdmin,
  );

  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex flex-col gap-1 border-b border-border/70 px-6 py-5 transition-colors hover:bg-accent/50">
        <Logo width={110} height={26} />
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Admin Dashboard
        </p>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {visibleGroups.map((group, gi) => (
          <div key={group.label}>
            <p className={`px-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground ${gi === 0 ? "mt-2" : "mt-6"}`}>
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isItemActive(pathname, item.href);
                const badgeCount =
                  "badgeKey" in item && item.badgeKey === "requirements"
                    ? openRequirementCount
                    : "badgeKey" in item && item.badgeKey === "approvals"
                      ? pendingApprovalCount
                      : 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors ${
                      active
                        ? "border-pulse/35 bg-pulse/10 font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:border-pulse/25 hover:bg-pulse/5 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="size-4 text-pulse" />
                    {item.label}
                    {badgeCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 min-w-5 justify-center px-1.5 text-[10px] font-mono"
                      >
                        {badgeCount}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/70 px-4 py-4 space-y-3">
        <CurrencyToggle />
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            {user.imageUrl && (
              <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user.fullName ?? "Admin"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="size-4" />
              <span className="sr-only">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSidebar({ user, isSuperAdmin, openRequirementCount, pendingApprovalCount }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border/70 lg:bg-background">
      <SidebarContent user={user} isSuperAdmin={isSuperAdmin} openRequirementCount={openRequirementCount} pendingApprovalCount={pendingApprovalCount} />
    </aside>
  );
}

export { AdminSidebar, SidebarContent };
export type { AdminSidebarProps };
