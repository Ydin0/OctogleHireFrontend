"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Layers,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: Layers },
  { href: "/admin/dashboard/applicants", label: "Applicants", icon: Users },
  { href: "/admin/dashboard/companies", label: "Companies", icon: Building2 },
  { href: "/admin/dashboard/team", label: "Team", icon: Shield },
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
}

function SidebarContent({ user }: AdminSidebarProps) {
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

  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex flex-col gap-1 border-b border-border/70 px-6 py-5 transition-colors hover:bg-accent/50">
        <Logo width={110} height={26} />
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Admin Dashboard
        </p>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
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
      </nav>

      <div className="border-t border-border/70 px-4 py-4">
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

function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border/70 lg:bg-background">
      <SidebarContent user={user} />
    </aside>
  );
}

export { AdminSidebar, SidebarContent };
export type { AdminSidebarProps };
