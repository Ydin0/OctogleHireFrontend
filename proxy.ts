import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { detectAIBot } from "@/lib/ai-bots";

const isProtectedRoute = createRouteMatcher([
  "/developers/dashboard(.*)",
  "/companies/dashboard(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // ── Clerk auth ──
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── AI bot crawl detection ──
  const userAgent = req.headers.get("user-agent") || "";
  const bot = detectAIBot(userAgent);

  if (bot) {
    // Fire-and-forget: log the crawl event to our API route.
    const crawlEvent = {
      timestamp: new Date().toISOString(),
      bot: bot.name,
      engine: bot.engine,
      path: req.nextUrl.pathname,
      userAgent,
      ip:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown",
      statusCode: 200,
    };

    const logUrl = new URL("/api/bot-crawls", req.url);

    const logPromise = fetch(logUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-crawl-secret":
          process.env.BOT_CRAWL_SECRET || "octoglehire-bot-monitor",
      },
      body: JSON.stringify(crawlEvent),
    }).catch(() => {
      // Silently fail — monitoring should never break the site
    });

    // Use waitUntil if available (Vercel Edge Runtime) to avoid blocking
    // @ts-expect-error — waitUntil available at runtime on Vercel
    if (typeof globalThis.waitUntil === "function") {
      // @ts-expect-error
      globalThis.waitUntil(logPromise);
    }

    // Add response headers for debugging
    const response = NextResponse.next();
    response.headers.set("x-ai-bot", bot.name);
    response.headers.set("x-ai-engine", bot.engine);
    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
