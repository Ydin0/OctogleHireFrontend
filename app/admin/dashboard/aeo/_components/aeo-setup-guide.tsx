import {
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const SETUP_STEPS = [
  {
    title: "GA4 AI Referral Tracking",
    status: "active" as const,
    description:
      'Custom events fire automatically when visitors arrive from ChatGPT, Perplexity, Claude, Gemini, or Copilot. View in GA4 under Events > "ai_referral".',
    actions: [
      'In GA4, go to Admin > Custom Definitions > Create custom dimension',
      'Name: "AI Source", Scope: Event, Event parameter: "ai_source"',
      'Create an audience: Event = ai_referral (for retargeting)',
      'Set up an Exploration report filtered by ai_referral events',
    ],
  },
  {
    title: "AI Bot Crawl Monitoring",
    status: "active" as const,
    description:
      "Next.js middleware detects 15 AI crawler bots and logs every crawl event. View stats on the dashboard above.",
    actions: [
      "Monitor crawl frequency to detect indexing changes",
      "Watch for new bots appearing in logs",
      "Compare crawl patterns to content publication schedule",
      "Set up alerts if crawl frequency drops significantly",
    ],
  },
  {
    title: "Otterly.AI — Citation Tracking",
    status: "setup" as const,
    description:
      "Otterly.AI monitors whether your content appears in AI-generated answers across ChatGPT, Perplexity, Google AI Overviews, and more.",
    actions: [
      "Sign up at otterly.ai — they offer a free tier for up to 25 tracked queries",
      "Add your domain: octoglehire.com",
      "Configure tracked queries (suggested below)",
      "Set up weekly email reports for citation changes",
    ],
    trackedQueries: [
      "hire remote developers",
      "best platform to hire developers",
      "OctogleHire vs Toptal",
      "how to vet remote developers",
      "remote developer salary 2026",
      "hire developers from India",
      "pre-vetted developers platform",
      "employer of record for developers",
      "staff augmentation vs full-time hiring",
      "remote hiring platform comparison",
    ],
  },
  {
    title: "Profound — AI Visibility Analytics",
    status: "setup" as const,
    description:
      "Profound tracks your brand visibility across AI engines and provides competitive benchmarking.",
    actions: [
      "Sign up at getprofound.ai",
      "Add competitor domains: toptal.com, turing.com, andela.com",
      "Track brand mentions across AI-generated responses",
      "Monitor share-of-voice in key hiring categories",
      "Set up alerts for competitive citation changes",
    ],
  },
  {
    title: "Google Search Console — AI Overview Tracking",
    status: "setup" as const,
    description:
      "GSC now shows when your pages appear in AI Overviews. Monitor this alongside traditional search performance.",
    actions: [
      'In GSC, go to Performance > Search results > Filter by "Search appearance"',
      'Look for "AI Overview" appearances',
      "Track click-through rates from AI Overview placements",
      "Compare AI Overview traffic to standard organic traffic",
    ],
  },
];

export function AEOSetupGuide() {
  return (
    <div className="space-y-4">
      {SETUP_STEPS.map((step) => (
        <div
          key={step.title}
          className="rounded-2xl border border-border bg-card"
        >
          <div className="flex items-start gap-4 border-b border-border px-5 py-4">
            <div
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${
                step.status === "active"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-amber-500/10 text-amber-500"
              }`}
            >
              <CheckCircle2 className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                    step.status === "active"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {step.status === "active" ? "Active" : "Setup Required"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
          <div className="px-5 py-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {step.status === "active" ? "Configuration" : "Setup Steps"}
            </p>
            <ol className="space-y-2">
              {step.actions.map((action, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 font-mono text-[10px] text-muted-foreground/60">
                    {i + 1}.
                  </span>
                  {action}
                </li>
              ))}
            </ol>
            {step.trackedQueries && (
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Suggested Tracked Queries
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.trackedQueries.map((query) => (
                    <span
                      key={query}
                      className="rounded-full border border-border px-3 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {query}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* External links */}
      <div className="flex flex-wrap gap-3 pt-2">
        {[
          { label: "Otterly.AI", href: "https://otterly.ai" },
          { label: "Profound", href: "https://getprofound.ai" },
          {
            label: "Google Search Console",
            href: "https://search.google.com/search-console",
          },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {link.label}
            <ExternalLink className="size-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
