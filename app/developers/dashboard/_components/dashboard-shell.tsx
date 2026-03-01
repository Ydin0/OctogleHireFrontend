"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderKanban,
  Globe2,
  HandCoins,
  Layers,
  LogOut,
  Rocket,
  ShieldCheck,
  UserCircle2,
  Wallet,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import { useDeveloperProfile } from "./developer-profile-context";
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
import { Logo } from "@/components/logo";
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
    href: "/developers/dashboard/offers",
    label: "Offers",
    icon: HandCoins,
  },
  {
    href: "/developers/dashboard/opportunities",
    label: "Opportunities",
    icon: Rocket,
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const COMPLETENESS_FIELDS: Array<(p: { fullName: string | null; professionalTitle: string | null; bio: string | null; aboutLong: string | null; primaryStack: string[] | null; linkedinUrl: string | null; githubUrl: string | null; portfolioUrl: string | null; profilePhotoUrl: string | null; availability: string | null; workExperience: unknown; education: unknown; engagementType: string[] | null }) => boolean> = [
  (p) => !!p.fullName,
  (p) => !!p.professionalTitle,
  (p) => !!(p.aboutLong || p.bio),
  (p) => (p.primaryStack?.length ?? 0) > 0,
  (p) => !!p.linkedinUrl,
  (p) => !!p.githubUrl,
  (p) => !!p.portfolioUrl,
  (p) => !!p.profilePhotoUrl,
  (p) => !!p.availability,
  (p) => Array.isArray(p.workExperience) && p.workExperience.length > 0,
  (p) => !!p.education,
  (p) => (p.engagementType?.length ?? 0) > 0,
];

function computeProfileCompleteness(profile: Parameters<(typeof COMPLETENESS_FIELDS)[0]>[0]) {
  const filled = COMPLETENESS_FIELDS.filter((check) => check(profile)).length;
  return Math.round((filled / COMPLETENESS_FIELDS.length) * 100);
}

const DashboardShell = ({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { signOut } = useClerk();

  let displayName = "Developer";
  let avatarUrl: string | null = null;
  let initials = "D";
  let publicProfileHref = "/developers";
  let completeness = 0;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const profile = useDeveloperProfile();
    displayName = profile.fullName ?? "Developer";
    avatarUrl = profile.profilePhotoUrl;
    initials = profile.fullName ? getInitials(profile.fullName) : "D";
    publicProfileHref = profile.slug
      ? `/developers/${profile.slug}`
      : "/developers";
    completeness = computeProfileCompleteness(profile);
  } catch {
    // Profile context not available — use defaults
  }

  return (
    <div className="min-h-screen bg-background font-sans normal-case tracking-normal">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center text-foreground transition-colors hover:text-foreground/80">
              <Logo width={110} height={26} />
            </Link>
            <span className="text-border">|</span>
            <Avatar className="size-10 border border-pulse/30">
              <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                Developer Dashboard
              </p>
              <p className="text-sm font-semibold">{displayName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            <Button asChild size="sm" variant="outline" className="gap-2">
              <Link href={publicProfileHref}>
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
                    <span>{completeness}%</span>
                  </div>
                  <Progress value={completeness} />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs font-mono uppercase tracking-[0.08em]">
                    <span className="text-muted-foreground">Client readiness</span>
                    <span>{completeness}%</span>
                  </div>
                  <Progress value={completeness} className="bg-muted" />
                </div>
                {completeness < 100 && (
                  <Badge
                    variant="outline"
                    className="border-pulse/35 bg-pulse/10 font-mono uppercase tracking-[0.08em] text-pulse"
                  >
                    Profile incomplete
                  </Badge>
                )}
                {completeness === 100 && (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/35 bg-emerald-500/10 font-mono uppercase tracking-[0.08em] text-emerald-600"
                  >
                    Profile complete
                  </Badge>
                )}
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
