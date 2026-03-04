"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Briefcase,
  Layers,
  Link2,
  LogOut,
  Send,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";

import { fetchAgencyProfile, type Agency } from "@/lib/api/agencies";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarItems = [
  { href: "/agencies/dashboard", label: "Overview", icon: Layers },
  { href: "/agencies/dashboard/candidates", label: "Candidates", icon: Users },
  { href: "/agencies/dashboard/requirements", label: "Marketplace", icon: Store },
  { href: "/agencies/dashboard/pitches", label: "My Pitches", icon: Send },
  { href: "/agencies/dashboard/commissions", label: "Commissions", icon: Wallet },
  { href: "/agencies/dashboard/referral-link", label: "Referral Link", icon: Link2 },
  { href: "/agencies/dashboard/team", label: "Team", icon: Briefcase },
] as const;

const isItemActive = (pathname: string, href: string) => {
  if (href === "/agencies/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AgencyDashboardShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<Agency | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getToken();
      const data = await fetchAgencyProfile(token);
      if (!cancelled) setProfile(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const agencyName = profile?.name ?? "Agency Dashboard";
  const initials = profile ? getInitials(profile.name) : "AG";

  return (
    <div className="min-h-screen bg-background font-sans normal-case tracking-normal">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center text-foreground transition-colors hover:text-foreground/80"
            >
              <Logo width={110} height={26} />
            </Link>
            <span className="text-border">|</span>
            <div className="flex size-9 items-center justify-center rounded-full bg-pulse/15">
              <Briefcase className="size-4 text-pulse" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                Agency Dashboard
              </p>
              <p className="text-sm font-semibold">{agencyName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="font-mono uppercase tracking-[0.08em]"
            >
              Agency workspace
            </Badge>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <LogOut className="size-4" />
              <span className="sr-only">Sign out</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="size-4" />
              Alerts
            </Button>
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
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
                <CardDescription>Agency workspace sections.</CardDescription>
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
          </aside>

          <section className="space-y-6">{children}</section>
        </div>
      </div>
    </div>
  );
};

export { AgencyDashboardShell };
