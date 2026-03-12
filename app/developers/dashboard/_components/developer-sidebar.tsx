"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  FolderKanban,
  Globe2,
  HandCoins,
  Layers,
  LogOut,
  Rocket,
  UserCircle2,
  Video,
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
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsDropdown } from "@/components/notifications-dropdown";

const navItems = [
  { href: "/developers/dashboard", label: "Overview", icon: Layers },
  { href: "/developers/dashboard/application-status", label: "Application Status", icon: FileText },
  { href: "/developers/dashboard/profile", label: "My Profile", icon: UserCircle2 },
  { href: "/developers/dashboard/offers", label: "Offers", icon: HandCoins },
  { href: "/developers/dashboard/opportunities", label: "Opportunities", icon: Rocket },
  { href: "/developers/dashboard/interviews", label: "Interviews", icon: Video },
  { href: "/developers/dashboard/availability", label: "Availability", icon: Calendar },
  { href: "/developers/dashboard/engagements", label: "My Engagements", icon: FolderKanban },
  { href: "/developers/dashboard/earnings", label: "Earnings & Payments", icon: Wallet },
  { href: "/developers/dashboard/resources", label: "Resources", icon: Globe2 },
] as const;

const isItemActive = (pathname: string, href: string) => {
  if (href === "/developers/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

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

interface DeveloperSidebarProps {
  user: {
    fullName: string | null;
    imageUrl: string | null;
  };
}

function DeveloperSidebarContent({ user }: DeveloperSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "D";

  let completeness = 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const profile = useDeveloperProfile();
    completeness = computeProfileCompleteness(profile);
  } catch {
    // Profile context not available
  }

  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex flex-col gap-1 border-b border-border/70 px-6 py-5 transition-colors hover:bg-accent/50">
        <Logo width={110} height={26} />
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Developer Portal
        </p>
      </Link>

      <nav className="flex-1 overflow-y-auto space-y-1 px-3 py-4">
        {navItems.map((item) => {
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
      </nav>

      <div className="border-t border-border/70 px-4 py-4 space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-mono uppercase tracking-[0.08em]">
            <span className="text-muted-foreground">Profile</span>
            <span>{completeness}%</span>
          </div>
          <Progress value={completeness} />
        </div>
        {completeness < 100 ? (
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-pulse/35 bg-pulse/10 font-mono text-[10px] uppercase tracking-[0.08em] text-pulse"
            >
              Incomplete
            </Badge>
            <Link
              href="/developers/dashboard/profile/edit"
              className="text-xs font-medium text-pulse hover:underline"
            >
              Update Profile
            </Link>
          </div>
        ) : (
          <Badge
            variant="outline"
            className="border-emerald-500/35 bg-emerald-500/10 font-mono text-[10px] uppercase tracking-[0.08em] text-emerald-600"
          >
            Complete
          </Badge>
        )}
      </div>

      <div className="border-t border-border/70 px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            {user.imageUrl && (
              <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <p className="min-w-0 flex-1 truncate text-sm font-medium">
            {user.fullName ?? "Developer"}
          </p>
          <div className="flex items-center gap-1">
            <NotificationsDropdown />
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

function DeveloperSidebar({ user }: DeveloperSidebarProps) {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border/70 lg:bg-background">
      <DeveloperSidebarContent user={user} />
    </aside>
  );
}

export { DeveloperSidebar, DeveloperSidebarContent };
export type { DeveloperSidebarProps };
