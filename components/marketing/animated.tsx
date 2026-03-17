"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  type Variant,
} from "motion/react";

/* ─── Fade-up on scroll ───────────────────────────────────────────────────── */

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Distance in px the element travels upward */
  distance?: number;
  /** Once = true (default) means it only animates in once */
  once?: boolean;
}

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 24,
  once = true,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Staggered children ──────────────────────────────────────────────────── */

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

/* ─── Individual stagger item ─────────────────────────────────────────────── */

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Scale-in on scroll ──────────────────────────────────────────────────── */

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function ScaleIn({
  children,
  className,
  delay = 0,
  once = true,
}: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={
        inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
      }
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Counter animation ───────────────────────────────────────────────────── */

interface CountUpProps {
  value: string;
  className?: string;
}

export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {value}
    </motion.span>
  );
}

/* ─── Slide-in from side ──────────────────────────────────────────────────── */

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  from?: "left" | "right";
  delay?: number;
  once?: boolean;
}

export function SlideIn({
  children,
  className,
  from = "left",
  delay = 0,
  once = true,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });
  const x = from === "left" ? -40 : 40;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Progress bar that fills on scroll ───────────────────────────────────── */

interface FillBarProps {
  className?: string;
  /** 0–100 */
  percent: number;
  delay?: number;
  color?: string;
}

export function FillBar({
  className,
  percent,
  delay = 0,
  color = "bg-pulse",
}: FillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className={`h-1.5 w-full overflow-hidden rounded-full bg-muted ${className ?? ""}`}>
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={inView ? { width: `${percent}%` } : { width: 0 }}
        transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}
