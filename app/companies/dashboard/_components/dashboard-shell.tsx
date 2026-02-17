"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  FileText,
  Layers,
  Users,
  Wrench,
} from "lucide-react";

import {
  companyProfile,
  getInitials,
  teamMembers,
} from "./dashboard-data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarItems = [
  { href: "/companies/dashboard", label: "Overview", icon: Layers },
  { href: "/companies/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/companies/dashboard/team", label: "Team", icon: Users },
  { href: "/companies/dashboard/resources", label: "Resources", icon: Wrench },
] as const;

const isItemActive = (pathname: string, href: string) => {
  if (href === "/companies/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background font-sans normal-case tracking-normal">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-pulse/15">
              <Building2 className="size-4 text-pulse" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                Company Dashboard
              </p>
              <p className="text-sm font-semibold">{companyProfile.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono uppercase tracking-[0.08em]">
              Company workspace
            </Badge>
            <ThemeToggle />
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="size-4" />
              Alerts
            </Button>
            <Avatar>
              <AvatarImage src={companyProfile.adminAvatar} alt="Company admin" />
              <AvatarFallback>{companyProfile.adminInitials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
                <CardDescription>Company workspace sections.</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1.5">
                  {sidebarItems.map((item) => {
                    const active = isItemActive(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                          active
                            ? "border-pulse/35 bg-pulse/10 text-foreground"
                            : "border-transparent hover:border-pulse/25 hover:bg-pulse/5"
                        }`}
                      >
                        <item.icon className="size-4 text-pulse" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Team at a glance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {teamMembers.slice(0, 4).map((member) => (
                    <Avatar key={member.id} size="sm">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                  ))}
                  <Badge variant="outline" className="font-mono uppercase tracking-[0.08em]">
                    +{Math.max(0, teamMembers.length - 4)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Active developers assigned to your company account.
                </p>
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-6">{children}</section>
        </div>
      </div>
    </div>
  );
};

export { DashboardShell };
