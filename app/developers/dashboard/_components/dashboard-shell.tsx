"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderKanban,
  Globe2,
  Layers,
  Rocket,
  ShieldCheck,
  UserCircle2,
  Wallet,
} from "lucide-react";

import {
  currentDeveloper,
  getInitials,
  profileCompleteness,
  readinessScore,
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
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarItems = [
  { href: "/developers/dashboard", label: "Overview", icon: Layers },
  {
    href: "/developers/dashboard/application-status",
    label: "Application Status",
    icon: FileText,
  },
  {
    href: "/developers/dashboard/profile",
    label: "My Profile",
    icon: UserCircle2,
  },
  {
    href: "/developers/dashboard/engagements",
    label: "My Engagements",
    icon: FolderKanban,
  },
  {
    href: "/developers/dashboard/earnings",
    label: "Earnings & Payments",
    icon: Wallet,
  },
  {
    href: "/developers/dashboard/resources",
    label: "Resources",
    icon: Globe2,
  },
] as const;

const isItemActive = (pathname: string, href: string) => {
  if (href === "/developers/dashboard") {
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
            <Avatar className="size-10 border border-pulse/30">
              <AvatarImage src={currentDeveloper.avatar} alt={currentDeveloper.name} />
              <AvatarFallback>{getInitials(currentDeveloper.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                Developer Dashboard
              </p>
              <p className="text-sm font-semibold">{currentDeveloper.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" variant="outline" className="gap-2">
              <Link href={`/developers/${currentDeveloper.id}`}>
                <ShieldCheck className="size-4" />
                Public Profile
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90">
              <Link href="/developers/dashboard/profile/edit">
                <Rocket className="size-4" />
                Update Profile
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
                <CardDescription>Developer workspace sections.</CardDescription>
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
                <CardTitle className="text-base">Profile Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs font-mono uppercase tracking-[0.08em]">
                    <span className="text-muted-foreground">Profile completeness</span>
                    <span>{profileCompleteness}%</span>
                  </div>
                  <Progress value={profileCompleteness} />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs font-mono uppercase tracking-[0.08em]">
                    <span className="text-muted-foreground">Client readiness</span>
                    <span>{readinessScore}%</span>
                  </div>
                  <Progress value={readinessScore} className="bg-muted" />
                </div>
                <Badge
                  variant="outline"
                  className="border-pulse/35 bg-pulse/10 font-mono uppercase tracking-[0.08em] text-pulse"
                >
                  Profile under review
                </Badge>
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
