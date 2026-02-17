import {
  ArrowRight,
  Clock,
  Globe,
  HeadphonesIcon,
  Scale,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const list = [
  {
    icon: Sparkles,
    text: "AI-powered candidate matching",
  },
  {
    icon: Shield,
    text: "Pre-vetted top 3% engineers",
  },
  {
    icon: Globe,
    text: "Talent from 150+ countries",
  },
  {
    icon: Scale,
    text: "Compliance & payroll handled",
  },
  {
    icon: Users,
    text: "Dedicated account management",
  },
  {
    icon: Zap,
    text: "48-hour candidate delivery",
  },
  {
    icon: Clock,
    text: "Flexible engagement models",
  },
  {
    icon: HeadphonesIcon,
    text: "Priority support & onboarding",
  },
];

const List = () => {
  return (
    <ul
      className={cn(
        "grid max-w-[36.25rem] grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2",
      )}
    >
      {list.map((item, i) => (
        <li key={`cta-item-${i}`} className="flex items-center gap-3">
          <item.icon className="size-5 stroke-white" />
          <div className="text-xs font-mono tracking-[0.06em] text-white">
            {item.text}
          </div>
        </li>
      ))}
    </ul>
  );
};

interface CtaProps {
  className?: string;
}

const Cta = ({ className }: CtaProps) => {
  return (
    <section
      className={cn("dark bg-background py-16 text-foreground", className)}
    >
      <div className="container mx-auto px-6">
        <div className="relative grid grid-cols-1 overflow-hidden rounded-[0.75rem] px-8 pt-10 pb-12 xl:grid-cols-2 xl:px-15.5 xl:pb-12">
          <div className="flex flex-col gap-5 md:gap-7">
            <h2 className="text-4xl tracking-tight md:text-5xl lg:text-6xl">
              <span className="block text-pulse font-semibold">Enterprise:</span>
              <span className="font-normal">Scale your team globally</span>
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl">
              Everything you need to build and manage a world-class engineering
              team.
            </p>
            <List />
            <div>
              <Button
                size="lg"
                className="w-full md:w-fit hover:bg-pulse hover:text-pulse-foreground"
                asChild
              >
                <a href="/companies/signup">
                  Start Hiring Today
                  <ArrowRight />
                </a>
              </Button>
            </div>
          </div>
          <div className="hidden xl:block">
            <div className="absolute top-0 right-0 h-[28rem] w-[36.875rem]">
              <div className="absolute top-0 right-0 aspect-[1.15] w-[12rem] opacity-60">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/fabian-centeno-njeVb6E3XB8-unsplash.jpg"
                  alt=""
                  className="size-full object-cover object-center"
                />
              </div>
              <div className="absolute top-36 right-0 z-10 aspect-[0.709248555] w-[14rem] overflow-hidden rounded-tl-md">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/jason-goodman-ZJlfUi5rTDU-unsplash.jpg"
                  alt=""
                  className="size-full object-cover object-center"
                />
              </div>
              <div className="absolute top-44 right-0 aspect-[1.353211009] w-[36.875rem] overflow-hidden rounded-tl-2xl opacity-25">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/redd-f-5U_28ojjgms-unsplash.jpg"
                  alt=""
                  className="size-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta };
