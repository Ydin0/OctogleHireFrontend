"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  Code2,
  FileText,
  Gauge,
  Sparkles,
} from "lucide-react";

import { SlideShell } from "../_components/slide-shell";

const MODULES = [
  {
    icon: Code2,
    name: "Cursor & Claude Code",
    body: "Every engineer works fluently in agent-first IDEs — planning, implementing, and reviewing entire features with AI co-pilots.",
  },
  {
    icon: Brain,
    name: "RAG + Context Engineering",
    body: "Retrieval-augmented workflows, context windows, embedding strategies — they know how to feed models the right information.",
  },
  {
    icon: Bot,
    name: "Agentic Development",
    body: "Multi-step autonomous agents, tool use, MCP servers. They build systems that plan, call, and reflect — not just chat wrappers.",
  },
  {
    icon: FileText,
    name: "Prompt-Driven Testing",
    body: "AI-generated unit + integration + e2e tests. They use models to expand coverage, not to replace judgement.",
  },
  {
    icon: Gauge,
    name: "Model Selection + Cost",
    body: "When to reach for Haiku vs Sonnet vs Opus. When to cache. How to keep token bills proportional to value shipped.",
  },
  {
    icon: Sparkles,
    name: "Spec-First Collaboration",
    body: "Write specs the AI can execute against. Review diffs, not prompts. Humans decide the what; AI accelerates the how.",
  },
];

export const AiNativeSlide = () => {
  return (
    <SlideShell eyebrow="AI Native">
      <div className="space-y-12">
        <div className="max-w-4xl space-y-5">
          <h2 className="text-4xl font-medium tracking-tight leading-[1.05] md:text-5xl lg:text-6xl">
            The{" "}
            <span className="text-pulse">Octogle AI Playbook</span>.
            <br />
            <span className="text-muted-foreground">40+ hours. 6 modules.</span>
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed">
            Every engineer completes this before their first match. They
            arrive already fluent in the tools that define modern software —
            not just aware of them.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.08, duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-pulse/30 bg-pulse/[0.08]">
                    <Icon className="size-4 text-pulse" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-[10px] font-semibold tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold leading-tight">
                    {m.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {m.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
};
