"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { CompanySidebarContent, type CompanySidebarProps } from "./company-sidebar";

function CompanyHeader({ user, companyProfile }: CompanySidebarProps) {
  const [open, setOpen] = useState(false);

  return (
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

      <NotificationsDropdown />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div onClick={() => setOpen(false)}>
            <CompanySidebarContent user={user} companyProfile={companyProfile} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export { CompanyHeader };
