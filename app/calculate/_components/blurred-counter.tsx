"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Sparkles, TrendingUp } from "lucide-react";

interface BlurredCounterProps {
  value: number;
  currency: string;
  revealed: boolean;
  variant?: "floating" | "inline";
}

/**
 * Animated savings counter that's blurred until `revealed=true`.
 * Used as a sticky panel during the calculator flow.
 */
export function BlurredCounter({
  value,
  currency,
  revealed,
  variant = "floating",
}: BlurredCounterProps) {
  const [display, setDisplay] = useState(0);
  const animRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startVal = startValueRef.current;
    const endVal = value;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * eased;
      setDisplay(current);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        startValueRef.current = endVal;
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [value]);

  const formatted = `${currency}${Math.round(display).toLocaleString()}`;

  if (variant === "inline") {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          <TrendingUp className="size-3 text-emerald-500" />
          Estimated annual savings
        </p>
        <div className="relative">
          <p
            className={`font-mono text-5xl font-bold tracking-tight transition-all duration-1000 sm:text-6xl ${
              revealed
                ? "text-emerald-500"
                : "text-foreground/90 [filter:blur(10px)]"
            }`}
          >
            {formatted}
          </p>
          {revealed && (
            <div className="pointer-events-none absolute inset-0 animate-pulse rounded-lg bg-emerald-500/10 blur-2xl" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">per year</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: sticky top-right */}
      <div className="pointer-events-none fixed right-6 top-24 z-40 hidden lg:block">
        <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-2xl backdrop-blur-sm">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            <TrendingUp className="size-3 text-emerald-500" />
            Estimated savings
          </p>
          <div className="relative mb-2">
            <p
              className={`font-mono text-3xl font-bold tracking-tight transition-all duration-700 ${
                revealed
                  ? "text-emerald-500"
                  : "text-foreground/90 [filter:blur(8px)]"
              }`}
            >
              {formatted}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground">per year</p>
          {!revealed && (
            <div className="mt-3 flex items-center gap-1.5 border-t border-border/60 pt-2.5 text-[10px] text-muted-foreground">
              <Lock className="size-3" />
              Reveal at the end
            </div>
          )}
          {revealed && (
            <div className="mt-3 flex items-center gap-1.5 border-t border-border/60 pt-2.5 text-[10px] font-semibold text-emerald-500">
              <Sparkles className="size-3" />
              Unlocked
            </div>
          )}
        </div>
      </div>

      {/* Mobile: sticky bottom */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <TrendingUp className="size-2.5 text-emerald-500" />
                Annual savings
              </p>
              <p
                className={`font-mono text-xl font-bold tracking-tight transition-all duration-700 ${
                  revealed
                    ? "text-emerald-500"
                    : "text-foreground/90 [filter:blur(7px)]"
                }`}
              >
                {formatted}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-[10px] text-muted-foreground">
              {revealed ? (
                <>
                  <Sparkles className="size-3 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="size-2.5" />
                  <span>Locked</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
