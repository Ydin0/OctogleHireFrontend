"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Building2,
  ClipboardList,
  Clock,
  FileText,
  Layers,
  Settings,
  UserSearch,
  UsersRound,
  Video,
} from "lucide-react";

import type { CompanyProfileSummary } from "@/lib/api/companies";
import { Logo } from "@/components/logo";
import { RoleSwitcher } from "@/components/shared/role-switcher";

const navGroups = [
  {
    label: "WORKSPACE",
    items: [
      { href: "/companies/dashboard", label: "Overview", icon: Layers },
    ],
  },
  {
    label: "HIRING",
    items: [
      { href: "/companies/dashboard/requirements", label: "Requirements", icon: ClipboardList },
      { href: "/companies/dashboard/candidates", label: "Candidates", icon: UserSearch },
      { href: "/companies/dashboard/interviews", label: "Interviews", icon: Video },
    ],
  },
  {
    label: "TEAM",
    items: [
      { href: "/companies/dashboard/engagements", label: "Engagements", icon: Briefcase },
      { href: "/companies/dashboard/team", label: "Team", icon: UsersRound },
      { href: "/companies/dashboard/timesheets", label: "Timesheets", icon: Clock },
    ],
  },
  {
    label: "BILLING",
    items: [
      { href: "/companies/dashboard/invoices", label: "Invoices", icon: FileText },
      { href: "/companies/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

const isItemActive = (pathname: string, href: string) => {
  if (href === "/companies/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

interface CompanySidebarProps {
  user: {
    fullName: string | null;
    email: string | null;
    imageUrl: string | null;
  };
  companyProfile: CompanyProfileSummary | null;
  roles?: string[];
  activeRole?: string;
}

function CompanySidebarContent({ companyProfile, roles, activeRole }: CompanySidebarProps) {
  const pathname = usePathname();

  const companyName = companyProfile?.companyName ?? "Company";

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/70">
        <Link href="/" className="flex flex-col gap-1 px-6 py-5 transition-colors hover:bg-accent/50">
          <Logo width={110} height={26} />
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Company Portal
          </p>
        </Link>
        {roles && activeRole && (
          <div className="px-3 pb-3">
            <RoleSwitcher roles={roles} activeRole={activeRole} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-b border-border/70 px-6 py-4">
        {companyProfile?.logoUrl ? (
          <Image
            src={companyProfile.logoUrl}
            alt={companyName}
            width={32}
            height={32}
            unoptimized
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-pulse/15">
            <Building2 className="size-4 text-pulse" />
          </div>
        )}
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{companyName}</p>
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
                    className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
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
    </div>
  );
}

function CompanySidebar({ user, companyProfile }: CompanySidebarProps) {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border/70 lg:bg-background">
      <CompanySidebarContent user={user} companyProfile={companyProfile} />
    </aside>
  );
}

export { CompanySidebar, CompanySidebarContent };
export type { CompanySidebarProps };
