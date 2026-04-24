"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { SlideShell } from "../_components/slide-shell";

const PROFILES = [
  { image: "/featured-developers/01.png", name: "Priya Sharma", role: "Senior Full-Stack", rate: "$65/hr" },
  { image: "/featured-developers/02.png", name: "Arjun Kumar", role: "Backend Engineer", rate: "$60/hr" },
  { image: "/featured-developers/03.png", name: "Ananya Reddy", role: "Frontend Engineer", rate: "$50/hr" },
  { image: "/featured-developers/04.png", name: "Rohan Mehta", role: "Platform Engineer", rate: "$70/hr" },
  { image: "/featured-developers/05.png", name: "Vikram Iyer", role: "AI / ML Engineer", rate: "$75/hr" },
  { image: "/featured-developers/06.png", name: "Aryan Gupta", role: "DevOps Engineer", rate: "$68/hr" },
  { image: "/featured-developers/07.png", name: "Karthik Nair", role: "Full-Stack", rate: "$58/hr" },
  { image: "/featured-developers/08.png", name: "Ayesha Khan", role: "Senior Backend", rate: "$72/hr" },
  { image: "/featured-developers/09.png", name: "Rahul Joshi", role: "Mobile Engineer", rate: "$55/hr" },
  { image: "/featured-developers/10.png", name: "Meera Pillai", role: "Backend Engineer", rate: "$48/hr" },
  { image: "/featured-developers/11.png", name: "Siddharth Rao", role: "Frontend Engineer", rate: "$45/hr" },
  { image: "/featured-developers/12.png", name: "Divya Menon", role: "Data Engineer", rate: "$62/hr" },
];

const STATS = [
  { value: "1,000+", label: "Active engineers" },
  { value: "30+", label: "Countries" },
  { value: "40+", label: "Tech stacks" },
  { value: "1 in 25", label: "Acceptance rate" },
];

export const NetworkSlide = () => {
  return (
    <SlideShell eyebrow="The Network">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:items-center">
        {/* Left: headline + stats */}
        <div className="space-y-10">
          <div className="space-y-5">
            <h2 className="text-4xl font-medium tracking-tight leading-[1.05] md:text-5xl xl:text-6xl">
              <span className="font-mono text-pulse">1,000+</span> engineers,
              pre-vetted and ready to ship.
            </h2>
            <p className="text-base text-muted-foreground md:text-lg leading-relaxed max-w-xl">
              Drawn from 25,000+ applications across six continents. Every one
              passed the Gauntlet — more on that next.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-border bg-card p-5 space-y-1"
              >
                <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums md:text-3xl">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: photo grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {PROFILES.map((p, i) => (
            <motion.div
              key={p.image}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1 + i * 0.04,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width: 1024px) 15vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <div className="absolute inset-x-2 bottom-2 space-y-0.5">
                <p className="text-xs font-semibold text-white leading-tight truncate">
                  {p.name}
                </p>
                <p className="font-mono text-[9px] text-white/70 truncate">
                  {p.rate}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
};
