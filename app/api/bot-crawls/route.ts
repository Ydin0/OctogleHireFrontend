import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export interface BotCrawlEvent {
  timestamp: string;
  bot: string;
  engine: string;
  path: string;
  userAgent: string;
  ip: string;
  statusCode: number;
}

const LOG_DIR = path.join(process.cwd(), ".bot-crawls");
const LOG_FILE = path.join(LOG_DIR, "crawls.jsonl");

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * POST /api/bot-crawls — Log a bot crawl event (called from middleware).
 */
export async function POST(req: NextRequest) {
  // Only allow internal calls (middleware sets a secret header)
  const secret = req.headers.get("x-bot-crawl-secret");
  if (secret !== (process.env.BOT_CRAWL_SECRET || "octoglehire-bot-monitor")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event: BotCrawlEvent = await req.json();
    try {
      ensureLogDir();
      fs.appendFileSync(LOG_FILE, JSON.stringify(event) + "\n");
    } catch {
      // Vercel has a read-only filesystem — silently skip file write
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

/**
 * GET /api/bot-crawls — Retrieve crawl stats.
 * Query params:
 *   ?days=7    — how many days to look back (default 7)
 *   ?bot=GPTBot — filter by bot name
 */
export async function GET(req: NextRequest) {
  // Basic auth check — only allow with admin secret
  const secret = req.headers.get("x-bot-crawl-secret");
  if (secret !== (process.env.BOT_CRAWL_SECRET || "octoglehire-bot-monitor")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "7", 10);
  const botFilter = searchParams.get("bot");

  try {
    ensureLogDir();
  } catch {
    // Vercel has a read-only filesystem — return empty data gracefully
    return NextResponse.json({
      period: `${days} days`,
      totalEvents: 0,
      summary: {},
      recentEvents: [],
    });
  }

  if (!fs.existsSync(LOG_FILE)) {
    return NextResponse.json({
      period: `${days} days`,
      totalEvents: 0,
      summary: {},
      recentEvents: [],
    });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const lines = fs
    .readFileSync(LOG_FILE, "utf-8")
    .split("\n")
    .filter(Boolean);

  let events: BotCrawlEvent[] = lines
    .map((line) => {
      try {
        return JSON.parse(line) as BotCrawlEvent;
      } catch {
        return null;
      }
    })
    .filter((e): e is BotCrawlEvent => e !== null)
    .filter((e) => new Date(e.timestamp) >= cutoff);

  if (botFilter) {
    events = events.filter(
      (e) => e.bot.toLowerCase() === botFilter.toLowerCase(),
    );
  }

  // Build summary
  const summary: Record<
    string,
    { totalCrawls: number; uniquePaths: number; lastSeen: string }
  > = {};

  for (const event of events) {
    const key = `${event.engine} (${event.bot})`;
    if (!summary[key]) {
      summary[key] = { totalCrawls: 0, uniquePaths: 0, lastSeen: "" };
    }
    summary[key].totalCrawls++;
    if (event.timestamp > summary[key].lastSeen) {
      summary[key].lastSeen = event.timestamp;
    }
  }

  // Count unique paths per bot
  for (const key of Object.keys(summary)) {
    const botName = key.match(/\((.+)\)/)?.[1] || "";
    const paths = new Set(
      events.filter((e) => e.bot === botName).map((e) => e.path),
    );
    summary[key].uniquePaths = paths.size;
  }

  return NextResponse.json({
    period: `${days} days`,
    totalEvents: events.length,
    summary,
    recentEvents: events.slice(-50).reverse(),
  });
}
