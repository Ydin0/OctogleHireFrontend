import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { BackgroundBeams } from "@/components/ui/background-beams";

interface HowItWorksProps {
  className?: string;
}

const HowItWorks = ({ className }: HowItWorksProps) => {
  return (
    <section
      id="how-it-works"
      className={cn(
        "relative h-full w-full overflow-hidden py-32",
        className,
      )}
    >
      <div className="relative z-20 container mx-auto flex h-full flex-col items-center justify-center gap-10 px-6">
        <p className="text-sm font-mono uppercase tracking-[0.08em] text-muted-foreground">
          How It Works
        </p>
        <h2 className="text-center text-4xl font-semibold tracking-tight lg:text-5xl">
          Just 3 Steps <span className="text-pulse">to Hire</span>
        </h2>
        <p className="max-w-3xl text-center text-muted-foreground">
          Tell us what you need, review pre-vetted candidates, and onboard your
          new engineer — all in days, not months.
        </p>
        <div className="relative grid grid-cols-1 md:grid-cols-3">
          <div className="relative space-y-5 border border-border p-10">
            <h3 className="text-xl font-semibold tracking-tighter">
              Tell Us What You Need
            </h3>
            <p className="text-muted-foreground">
              Share your requirements and tech stack. Our AI-powered matching
              engine finds the best candidates for your team in under 48 hours.
            </p>
            <div className="absolute right-1/2 -bottom-5 z-10 flex size-10 translate-x-1/2 rotate-90 items-center justify-center gap-2 rounded-full border-2 border-pulse bg-background md:top-1/2 md:-right-5 md:translate-x-0 md:-translate-y-1/2 md:rotate-0">
              <ArrowRight className="size-6 text-pulse" />
            </div>
          </div>
          <div className="relative space-y-5 border border-border p-10">
            <h3 className="text-xl font-semibold tracking-tighter">
              Review Vetted Candidates
            </h3>
            <p className="text-muted-foreground">
              Browse pre-screened profiles with verified skills, work history,
              and performance ratings from previous engagements.
            </p>
            <div className="absolute right-1/2 -bottom-5 z-10 flex size-10 translate-x-1/2 rotate-90 items-center justify-center gap-2 rounded-full border-2 border-pulse bg-background md:top-1/2 md:-right-5 md:translate-x-0 md:-translate-y-1/2 md:rotate-0">
              <ArrowRight className="size-6 text-pulse" />
            </div>
          </div>
          <div className="space-y-5 border border-border p-10">
            <h3 className="text-xl font-semibold tracking-tighter">
              Onboard in Days
            </h3>
            <p className="text-muted-foreground">
              We handle compliance, contracts, and payments across 150+
              countries. Your new hire is productive from day one with dedicated
              support.
            </p>
          </div>
          <div className="pointer-events-none absolute left-0 z-[5] h-full w-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 z-[5] h-full w-10 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
      <BackgroundBeams />
    </section>
  );
};

export { HowItWorks };
