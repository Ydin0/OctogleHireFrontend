"use client";

import { useState } from "react";
import Link from "next/link";
import { Headset, LogOut, Mail, Menu, Phone } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import type { CompanyProfileSummary } from "@/lib/api/companies";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { CompanySidebarContent, type CompanySidebarProps } from "./company-sidebar";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function AccountManagerPopover({
  accountManager,
}: {
  accountManager: CompanyProfileSummary["accountManager"];
}) {
  if (!accountManager) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border/70 py-1 pl-1 pr-3 transition-colors hover:bg-accent/50"
        >
          <Headset className="ml-1.5 size-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Support:</span>
          <span className="text-xs font-medium">{accountManager.name}</span>
          <div className="relative">
            <Avatar className="size-5">
              {accountManager.profilePhotoUrl && (
                <AvatarImage
                  src={accountManager.profilePhotoUrl}
                  alt={accountManager.name}
                />
              )}
              <AvatarFallback className="text-[8px]">
                {getInitials(accountManager.name)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-background bg-emerald-500" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <div className="relative shrink-0">
            <Avatar>
              {accountManager.profilePhotoUrl && (
                <AvatarImage
                  src={accountManager.profilePhotoUrl}
                  alt={accountManager.name}
                />
              )}
              <AvatarFallback>
                {getInitials(accountManager.name)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-semibold">{accountManager.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Your Account Manager
            </p>
          </div>
        </div>
        <div className="space-y-1 px-3 py-2">
          <a
            href={`mailto:${accountManager.email}`}
            className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Mail className="size-4" />
            {accountManager.email}
          </a>
          {accountManager.phone && (
            <a
              href={`tel:${accountManager.phone}`}
              className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Phone className="size-4" />
              {accountManager.phone}
            </a>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function UserMenu({ user }: { user: CompanySidebarProps["user"] }) {
  const { signOut } = useClerk();
  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-full transition-opacity hover:opacity-80"
        >
          <Avatar size="sm">
            {user.imageUrl && (
              <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-0">
        <div className="border-b px-4 py-3">
          <p className="truncate text-sm font-medium">
            {user.fullName ?? "User"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>
        <div className="p-1">
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CompanyHeader({ user, companyProfile, roles, activeRole }: CompanySidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
          <Link href="/" className="flex items-center">
            <Logo width={110} height={26} />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <NotificationsDropdown />
          <ThemeToggle />
          <UserMenu user={user} />
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div onClick={() => setOpen(false)}>
              <CompanySidebarContent user={user} companyProfile={companyProfile} roles={roles} activeRole={activeRole} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop header */}
      <header className="sticky top-0 z-20 hidden border-b border-border/70 bg-background/90 backdrop-blur lg:block lg:ml-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div />

          <div className="flex items-center gap-3">
            {companyProfile?.accountManager && (
              <AccountManagerPopover
                accountManager={companyProfile.accountManager}
              />
            )}
            <NotificationsDropdown />
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </div>
      </header>
    </>
  );
}

export { CompanyHeader };
