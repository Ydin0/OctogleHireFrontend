"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  className?: string;
}

const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Apply as a Dev", href: "/apply" },
];

const Navbar = ({ className }: NavbarProps) => {
  const { isSignedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className={cn(
        "sticky top-0 z-[120] py-3 transition-all duration-300",
        className,
      )}
    >
      <div className="container mx-auto px-6">
        <div
          className={cn(
            "transition-all duration-300",
            isScrolled
              ? "rounded-full border border-border/70 bg-background/70 px-5 py-2.5 shadow-lg backdrop-blur-md"
              : "py-1",
          )}
        >
          {/* Desktop */}
          <nav className="hidden items-center justify-between lg:flex">
            <div className="flex items-center gap-8">
              <Link href="/">
                <Logo width={130} height={30} />
              </Link>
              <div className="flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {isSignedIn ? (
                <Button asChild size="sm" className="rounded-full">
                  <Link href="/auth/after-sign-in">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="rounded-full">
                    <Link href="/companies/signup">Start Hiring</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile */}
          <div className="flex items-center justify-between lg:hidden">
            <Link href="/">
              <Logo width={130} height={30} />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/">
                        <Logo width={130} height={30} />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col p-4">
                    <div className="flex flex-col">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="border-b border-border py-4 text-sm font-medium last:border-0"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-col gap-3">
                      {isSignedIn ? (
                        <Button asChild>
                          <Link href="/auth/after-sign-in">Dashboard</Link>
                        </Button>
                      ) : (
                        <>
                          <Button asChild variant="outline">
                            <Link href="/login">Sign In</Link>
                          </Button>
                          <Button asChild>
                            <Link href="/companies/signup">Start Hiring</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
