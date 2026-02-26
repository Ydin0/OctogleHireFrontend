"use client";

import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

import { Tabs, TabsContent } from "@/components/ui/tabs";

interface VettingProcessProps {
  className?: string;
}

const STEPS = [
  { value: "screening", label: "Screening" },
  { value: "assessment", label: "Assessment" },
  { value: "interview", label: "Interview" },
  { value: "background", label: "Background" },
  { value: "approved", label: "Approved" },
];

const VettingProcess = ({ className }: VettingProcessProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % STEPS.length);
    setAnimKey((k) => k + 1);
  }, []);

  const jumpTo = useCallback((index: number) => {
    setActiveIndex(index);
    setAnimKey((k) => k + 1);
  }, []);

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight lg:text-5xl">
            Only the <span className="text-pulse">Top 3%</span> Make the Cut
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every developer goes through our rigorous 5-stage vetting process.
            No shortcuts — just verified, exceptional talent you can trust.
          </p>
        </div>
        <Tabs
          value={STEPS[activeIndex].value}
          onValueChange={(v) => {
            const idx = STEPS.findIndex((s) => s.value === v);
            if (idx !== -1) jumpTo(idx);
          }}
          className="rounded-4xl border border-border p-4 lg:p-8"
        >
          {/* Progress bar */}
          <div className="mb-8 flex gap-2">
            {STEPS.map((step, i) => {
              const isCompleted = i < activeIndex;
              const isActive = i === activeIndex;

              return (
                <button
                  key={step.value}
                  onClick={() => jumpTo(i)}
                  className="flex flex-1 cursor-pointer flex-col gap-2"
                >
                  <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                    {isCompleted && (
                      <div className="h-full w-full rounded-full bg-pulse" />
                    )}
                    {isActive && (
                      <div
                        key={animKey}
                        className="h-full rounded-full bg-pulse animate-progress-fill"
                        onAnimationEnd={advance}
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden text-xs font-mono uppercase tracking-[0.08em] sm:block",
                      isActive
                        ? "text-foreground"
                        : isCompleted
                          ? "text-pulse"
                          : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:gap-20">
            <div>
              <TabsContent
                value="screening"
                className="flex animate-in flex-col gap-6 duration-300 fade-in"
              >
                <span className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  Step 1 — Screening
                </span>
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-medium">
                    Apply. Verify. Shortlist.
                  </h2>
                  <p className="text-muted-foreground">
                    Every developer submits a detailed application with work
                    history, tech stack, and portfolio. Our team manually reviews
                    each profile to verify experience and credentials before
                    anyone moves forward.
                  </p>
                </div>
              </TabsContent>
              <TabsContent
                value="assessment"
                className="flex animate-in flex-col gap-6 duration-300 fade-in"
              >
                <span className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  Step 2 — Assessment
                </span>
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-medium">
                    Challenge. Evaluate. Prove.
                  </h2>
                  <p className="text-muted-foreground">
                    Shortlisted candidates complete a rigorous, stack-specific
                    coding assessment designed by senior engineers. We evaluate
                    problem-solving ability, code quality, and architectural
                    thinking across real-world scenarios.
                  </p>
                </div>
              </TabsContent>
              <TabsContent
                value="interview"
                className="flex animate-in flex-col gap-6 duration-300 fade-in"
              >
                <span className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  Step 3 — Interview
                </span>
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-medium">
                    Meet. Discuss. Validate.
                  </h2>
                  <p className="text-muted-foreground">
                    Candidates join a live technical interview with our
                    engineering panel. We assess system design ability,
                    communication skills, and cultural alignment to ensure they
                    can thrive in any team environment.
                  </p>
                </div>
              </TabsContent>
              <TabsContent
                value="background"
                className="flex animate-in flex-col gap-6 duration-300 fade-in"
              >
                <span className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  Step 4 — Background Check
                </span>
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-medium">
                    Verify. Reference. Confirm.
                  </h2>
                  <p className="text-muted-foreground">
                    We verify employment history, contact professional
                    references, and confirm identity. Only candidates with a
                    proven track record of consistent delivery make it through
                    this stage.
                  </p>
                </div>
              </TabsContent>
              <TabsContent
                value="approved"
                className="flex animate-in flex-col gap-6 duration-300 fade-in"
              >
                <span className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  Step 5 — Approved & Matched
                </span>
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-medium">
                    Match. Onboard. Deliver.
                  </h2>
                  <p className="text-muted-foreground">
                    Approved developers join our vetted talent network and are
                    matched with companies based on skill fit, timezone, and
                    availability. Ongoing performance tracking ensures sustained
                    quality.
                  </p>
                </div>
              </TabsContent>
            </div>
            <div>
              <TabsContent
                value="screening"
                className="animate-in duration-300 fade-in"
              >
                <div className="relative">
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-hCb3lIB8L8E-unsplash.jpg"
                    alt="Application screening process"
                    className="h-[440px] w-full rounded-3xl object-cover lg:h-[540px]"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 flex flex-col justify-center gap-8 p-6 text-white">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">
                        10,000+
                      </p>
                      <p className="font-medium">
                        applications reviewed monthly
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">
                        Top 3%
                      </p>
                      <p className="font-medium">acceptance rate</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="assessment"
                className="animate-in duration-300 fade-in"
              >
                <div className="relative">
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg"
                    alt="Technical assessment"
                    className="h-[440px] w-full rounded-3xl object-cover lg:h-[540px]"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 flex flex-col justify-center gap-8 p-6 text-white">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">5 hrs</p>
                      <p className="font-medium">
                        average assessment completion
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">20+</p>
                      <p className="font-medium">
                        stack-specific challenge tracks
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="interview"
                className="animate-in duration-300 fade-in"
              >
                <div className="relative">
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-AkftcHujUmk-unsplash.jpg"
                    alt="Live technical interview"
                    className="h-[440px] w-full rounded-3xl object-cover lg:h-[540px]"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 flex flex-col justify-center gap-8 p-6 text-white">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">2</p>
                      <p className="font-medium">rounds of live evaluation</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">90min</p>
                      <p className="font-medium">system design deep-dive</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="background"
                className="animate-in duration-300 fade-in"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=100"
                    alt="Reference and background verification"
                    className="h-[440px] w-full rounded-3xl object-cover lg:h-[540px]"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 flex flex-col justify-center gap-8 p-6 text-white">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">100%</p>
                      <p className="font-medium">references verified</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">3+</p>
                      <p className="font-medium">
                        professional references contacted
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="approved"
                className="animate-in duration-300 fade-in"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=100"
                    alt="Approved and matched with companies"
                    className="h-[440px] w-full rounded-3xl object-cover lg:h-[540px]"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 flex flex-col justify-center gap-8 p-6 text-white">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">48hrs</p>
                      <p className="font-medium">
                        average time to first match
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-4xl font-medium lg:text-5xl">150+</p>
                      <p className="font-medium">countries in our network</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { VettingProcess };
