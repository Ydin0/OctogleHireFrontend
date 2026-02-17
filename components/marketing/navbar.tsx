"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Book,
  Briefcase,
  Code,
  FileText,
  Globe,
  GraduationCap,
  Menu,
  Rocket,
  Shield,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
}

const menu: MenuItem[] = [
  {
    title: "How It Works",
    url: "#how-it-works",
  },
  {
    title: "For Companies",
    url: "/companies/signup",
    items: [
      {
        title: "Hire Developers",
        description: "Find pre-vetted engineers matched to your needs",
        icon: <Users className="size-5 shrink-0" />,
        url: "/companies/signup",
      },
      {
        title: "Enterprise Solutions",
        description: "Scalable hiring for large teams and organizations",
        icon: <Briefcase className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Compliance & Payments",
        description: "Handle contracts and payments in 150+ countries",
        icon: <Shield className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Success Stories",
        description: "See how companies built world-class teams",
        icon: <Rocket className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "For Developers",
    url: "/developers/join",
    items: [
      {
        title: "Why Join OctogleHire",
        description: "See how our developer network helps you land better roles",
        icon: <Rocket className="size-5 shrink-0" />,
        url: "/developers/join",
      },
      {
        title: "Apply as a Developer",
        description: "Join our network of pre-vetted engineers",
        icon: <FileText className="size-5 shrink-0" />,
        url: "/apply",
      },
      {
        title: "Developer Dashboard",
        description: "Manage your profile, status, and engagements",
        icon: <Briefcase className="size-5 shrink-0" />,
        url: "/developers/dashboard",
      },
      {
        title: "Find Work",
        description: "Browse opportunities from top global companies",
        icon: <Code className="size-5 shrink-0" />,
        url: "/developers",
      },
      {
        title: "Skill Assessment",
        description: "Showcase your abilities with verified assessments",
        icon: <Zap className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Career Resources",
        description: "Guides, tips, and tools to advance your career",
        icon: <GraduationCap className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Developer Community",
        description: "Connect with a global network of engineers",
        icon: <Book className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "Compare",
    url: "#compare",
  },
  {
    title: "Pricing",
    url: "#",
  },
];

const Navbar = ({ className }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
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
              ? "rounded-full border border-border/70 bg-background/70 px-4 py-2 shadow-lg backdrop-blur-md"
              : "py-1",
          )}
        >
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Globe className="size-6" />
              <span className="text-lg font-semibold tracking-tighter">
                OctogleHire
              </span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/companies/signup">Start Hiring</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Globe className="size-6" />
              <span className="text-lg font-semibold tracking-tighter">
                OctogleHire
              </span>
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
                    <Link href="/" className="flex items-center gap-2">
                      <Globe className="size-6" />
                      <span className="text-lg font-semibold tracking-tighter">
                        OctogleHire
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/companies/signup">Start Hiring</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="font-mono uppercase tracking-[0.08em]">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-mono uppercase tracking-[0.08em] transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-mono uppercase tracking-[0.08em] hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-mono uppercase tracking-[0.08em]">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
