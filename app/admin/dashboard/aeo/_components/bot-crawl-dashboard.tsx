"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  RefreshCw,
  Globe,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface CrawlSummary {
  totalCrawls: number;
  uniquePaths: number;
  lastSeen: string;
}

interface CrawlEvent {
  timestamp: string;
  bot: string;
  engine: string;
  path: string;
  userAgent: string;
  ip: string;
  statusCode: number;
}

interface CrawlData {
  period: string;
  totalEvents: number;
  summary: Record<string, CrawlSummary>;
  recentEvents: CrawlEvent[];
}

export function BotCrawlDashboard() {
  const [data, setData] = useState<CrawlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bot-crawls?days=${days}`, {
        headers: {
          "x-bot-crawl-secret":
            process.env.NEXT_PUBLIC_BOT_CRAWL_SECRET ||
            "octoglehire-bot-monitor",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
    } catch {
      setError("Could not load crawl data. Monitoring is active — data will appear once bots start crawling.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [days]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[1, 7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                days === d
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {d === 1 ? "24h" : `${d}d`}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-2"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
          <AlertCircle className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Summary cards */}
      {data && (
        <>
          {/* Overview stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bot className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Total Crawls
                </span>
              </div>
              <p className="mt-2 font-mono text-3xl font-semibold">
                {data.totalEvents.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last {data.period}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  AI Engines
                </span>
              </div>
              <p className="mt-2 font-mono text-3xl font-semibold">
                {Object.keys(data.summary).length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Distinct bots detected
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Pages Crawled
                </span>
              </div>
              <p className="mt-2 font-mono text-3xl font-semibold">
                {Object.values(data.summary).reduce(
                  (sum, s) => sum + s.uniquePaths,
                  0,
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Unique paths
              </p>
            </div>
          </div>

          {/* Bot breakdown table */}
          {Object.keys(data.summary).length > 0 && (
            <div className="rounded-2xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-sm font-semibold">Bot Breakdown</h3>
              </div>
              <div className="divide-y divide-border">
                {Object.entries(data.summary)
                  .sort((a, b) => b[1].totalCrawls - a[1].totalCrawls)
                  .map(([key, stats]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between px-5 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{key}</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.uniquePaths} unique pages
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-medium">
                          {stats.totalCrawls.toLocaleString()}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {new Date(stats.lastSeen).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent events */}
          {data.recentEvents.length > 0 && (
            <div className="rounded-2xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-sm font-semibold">Recent Crawl Events</h3>
              </div>
              <div className="max-h-96 divide-y divide-border overflow-y-auto">
                {data.recentEvents.map((event, i) => (
                  <div
                    key={`${event.timestamp}-${i}`}
                    className="flex items-center justify-between gap-4 px-5 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{event.path}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.bot} ({event.engine})
                      </p>
                    </div>
                    <time className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </time>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {data && data.totalEvents === 0 && (
        <div className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
          <Bot className="mx-auto size-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No crawl data yet</h3>
          <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
            The middleware is active and monitoring for AI bot crawls. Data will
            appear here once bots like GPTBot, ClaudeBot, or PerplexityBot
            start crawling your site.
          </p>
        </div>
      )}
    </div>
  );
}
