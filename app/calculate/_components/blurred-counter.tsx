"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Sparkles, TrendingUp, Zap } from "lucide-react";

interface BlurredCounterProps {
  value: number;
  currency: string;
  revealed: boolean;
  variant?: "floating" | "inline";
  step?: number;
  totalSteps?: number;
}

/**
 * Mask the value as XXXX with the same number of digits as the actual figure.
 * Keeps suspense — they can see the number is growing without seeing the value.
 */
function maskValue(value: number, currency: string): string {
  const rounded = Math.round(value);
  if (rounded === 0) return `${currency}---`;
  // Format with commas, then replace digits with X
  const withCommas = rounded.toLocaleString();
  const masked = withCommas.replace(/\d/g, "X");
  return `${currency}${masked}`;
}

/**
 * Animated savings counter. Shows masked XXXX format until revealed.
 */
export function BlurredCounter({
  value,
  currency,
  revealed,
  variant = "floating",
  step,
  totalSteps,
}: BlurredCounterProps) {
  const [display, setDisplay] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const animRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startVal = startValueRef.current;
    const endVal = value;
    const duration = 1400;
    const startTime = performance.now();

    if (endVal !== startVal) {
      setPulseKey((k) => k + 1);
    }

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

  const realValue = `${currency}${Math.round(display).toLocaleString()}`;
  const maskedValue = maskValue(display, currency);
  const displayValue = revealed ? realValue : maskedValue;

  // Inline variant — used in reveal screen
  if (variant === "inline") {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-pulse">
          <TrendingUp className="size-3" />
          Estimated annual savings
        </p>
        <div className="relative">
          <p
            className={`font-mono text-5xl font-bold tracking-tight transition-all duration-700 sm:text-7xl ${
              revealed ? "text-pulse" : "text-foreground/90"
            }`}
          >
            {displayValue}
          </p>
          {revealed && (
            <div className="pointer-events-none absolute inset-0 -z-10 animate-pulse rounded-lg bg-pulse/20 blur-3xl" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">per year</p>
      </div>
    );
  }

  // Floating variant — sticky bottom bar (mobile + desktop)
  const stepProgress = step && totalSteps ? (step / totalSteps) * 100 : 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="relative border-t border-border/60 bg-background/95 backdrop-blur-md shadow-[0_-8px_32px_rgba(0,0,0,0.15)]">
        {/* Top progress line */}
        {step && totalSteps && (
          <div className="absolute inset-x-0 top-0 h-0.5 bg-foreground/5">
            <div
              className="h-full bg-pulse transition-all duration-500 ease-out"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        )}

        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          {/* Left: label + value */}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:text-[10px]">
              <TrendingUp className="size-2.5 text-pulse sm:size-3" />
              Your potential annual savings
            </p>
            <div className="relative mt-1 inline-flex items-baseline gap-2">
              <p
                key={pulseKey}
                className={`font-mono text-2xl font-bold tracking-tight tabular-nums transition-colors duration-700 sm:text-4xl ${
                  revealed
                    ? "text-pulse animate-in zoom-in-50"
                    : "text-foreground/90"
                }`}
              >
                {displayValue}
              </p>
              <span className="text-[10px] text-muted-foreground sm:text-xs">
                /year
              </span>
              {value > 0 && !revealed && (
                <span
                  key={`bump-${pulseKey}`}
                  className="absolute -right-2 -top-2 flex size-5 animate-in fade-in zoom-in items-center justify-center rounded-full bg-pulse/20 text-pulse sm:-right-4 sm:size-6"
                >
                  <Zap className="size-3 sm:size-3.5" fill="currentColor" />
                </span>
              )}
            </div>
            {revealed && (
              <div className="absolute inset-0 -z-10 animate-pulse bg-pulse/5 blur-2xl" />
            )}
          </div>

          {/* Right: status badge */}
          <div className="shrink-0">
            {revealed ? (
              <div className="flex items-center gap-1.5 rounded-full bg-pulse/15 px-3 py-1.5 text-[10px] font-semibold text-pulse sm:px-4 sm:py-2 sm:text-xs">
                <Sparkles className="size-3 sm:size-3.5" />
                Unlocked
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/50 px-3 py-1.5 text-[10px] font-semibold text-muted-foreground sm:px-4 sm:py-2 sm:text-xs">
                <Lock className="size-3" />
                <span className="hidden sm:inline">Locked — finish to reveal</span>
                <span className="sm:hidden">Locked</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
