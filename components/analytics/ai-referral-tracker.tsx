"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Known AI referral sources — domains that indicate traffic
 * came from an AI engine citing or linking to our content.
 */
const AI_REFERRAL_SOURCES: Record<string, string> = {
  "chat.openai.com": "chatgpt",
  "chatgpt.com": "chatgpt",
  "perplexity.ai": "perplexity",
  "gemini.google.com": "google_gemini",
  "bard.google.com": "google_gemini",
  "claude.ai": "claude",
  "copilot.microsoft.com": "microsoft_copilot",
  "bing.com/chat": "microsoft_copilot",
  "you.com": "you_ai",
  "phind.com": "phind",
  "poe.com": "poe",
  "kagi.com": "kagi",
};

function getAIReferralSource(): string | null {
  if (typeof window === "undefined") return null;

  const referrer = document.referrer;
  if (!referrer) return null;

  try {
    const url = new URL(referrer);
    const hostname = url.hostname.replace(/^www\./, "");

    // Check exact hostname match
    if (AI_REFERRAL_SOURCES[hostname]) {
      return AI_REFERRAL_SOURCES[hostname];
    }

    // Check partial hostname match (e.g. subdomain.perplexity.ai)
    for (const [domain, source] of Object.entries(AI_REFERRAL_SOURCES)) {
      if (hostname.endsWith(domain)) {
        return source;
      }
    }

    // Check for AI-related UTM parameters
    const utmSource = url.searchParams.get("utm_source")?.toLowerCase();
    const utmMedium = url.searchParams.get("utm_medium")?.toLowerCase();
    if (utmMedium === "ai" || utmMedium === "ai_referral") {
      return utmSource || "ai_unknown";
    }
  } catch {
    // Invalid referrer URL
  }

  return null;
}

/**
 * Fires a custom GA4 event when the page was referred by an AI engine.
 * Also stores the AI source in sessionStorage so subsequent page views
 * within the same session are attributed correctly.
 */
export function AIReferralTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const aiSource =
      getAIReferralSource() || sessionStorage.getItem("ai_referral_source");

    if (!aiSource) return;

    // Persist for the session so all page views are attributed
    sessionStorage.setItem("ai_referral_source", aiSource);

    // Fire GA4 custom event
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "ai_referral", {
        ai_source: aiSource,
        page_path: pathname,
        referrer: document.referrer,
      });

      // Also set a user property for audience segmentation
      window.gtag("set", "user_properties", {
        ai_referred: "true",
        ai_source: aiSource,
      });
    }
  }, [pathname]);

  return null;
}
