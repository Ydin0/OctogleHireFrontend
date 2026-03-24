"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Layers,
  Link2,
  LogOut,
  Send,
  Settings,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { RoleSwitcher } from "@/components/shared/role-switcher";

const navGroups = [
  {
    label: "WORKSPACE",
    items: [
      { href: "/agencies/dashboard", label: "Overview", icon: Layers },
    ],
  },
  {
    label: "CANDIDATES",
    items: [
      { href: "/agencies/dashboard/candidates", label: "Candidates", icon: Users },
      { href: "/agencies/dashboard/referral-link", label: "Referral Link", icon: Link2 },
    ],
  },
  {
    label: "MARKETPLACE",
    items: [
      { href: "/agencies/dashboard/requirements", label: "Requirements", icon: Store },
      { href: "/agencies/dashboard/pitches", label: "My Pitches", icon: Send },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { href: "/agencies/dashboard/commissions", label: "Commissions", icon: Wallet },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { href: "/agencies/dashboard/team", label: "Team", icon: Briefcase },
      { href: "/agencies/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

const isItemActive = (pathname: string, href: string) => {
  if (href === "/agencies/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

interface AgencySidebarProps {
  user: {
    fullName: string | null;
    email: string | null;
    imageUrl: string | null;
  };
  agencyName: string;
  roles?: string[];
  activeRole?: string;
}

function AgencySidebarContent({ user, agencyName, roles, activeRole }: AgencySidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AG";

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/70">
        <Link href="/" className="flex flex-col gap-1 px-6 py-5 transition-colors hover:bg-accent/50">
          <Logo width={110} height={26} />
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Agency Portal
          </p>
        </Link>
        {roles && activeRole && (
          <div className="px-3 pb-3">
            <RoleSwitcher roles={roles} activeRole={activeRole} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-b border-border/70 px-6 py-4">
        <div className="flex size-8 items-center justify-center rounded-full bg-pulse/15">
          <Briefcase className="size-4 text-pulse" />
        </div>
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{agencyName}</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navGroups.map((group, gi) => (
          <div key={group.label}>
            <p className={`px-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground ${gi === 0 ? "mt-2" : "mt-6"}`}>
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isItemActive(pathname, item.href);
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
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/70 px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            {user.imageUrl && (
              <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user.fullName ?? "Agent"}
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

function AgencySidebar(props: AgencySidebarProps) {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border/70 lg:bg-background">
      <AgencySidebarContent {...props} />
    </aside>
  );
}

export { AgencySidebar, AgencySidebarContent };
export type { AgencySidebarProps };
