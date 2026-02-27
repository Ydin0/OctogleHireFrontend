/**
 * AI crawler user-agent patterns and metadata.
 * Used by middleware to detect and log AI bot crawls.
 */
export interface AIBot {
  name: string;
  /** Pattern matched against the User-Agent header */
  pattern: RegExp;
  /** The AI engine this bot belongs to */
  engine: string;
}

export const AI_BOTS: AIBot[] = [
  {
    name: "GPTBot",
    pattern: /GPTBot/i,
    engine: "OpenAI",
  },
  {
    name: "ChatGPT-User",
    pattern: /ChatGPT-User/i,
    engine: "OpenAI",
  },
  {
    name: "OAI-SearchBot",
    pattern: /OAI-SearchBot/i,
    engine: "OpenAI",
  },
  {
    name: "ClaudeBot",
    pattern: /ClaudeBot/i,
    engine: "Anthropic",
  },
  {
    name: "Claude-Web",
    pattern: /Claude-Web/i,
    engine: "Anthropic",
  },
  {
    name: "PerplexityBot",
    pattern: /PerplexityBot/i,
    engine: "Perplexity",
  },
  {
    name: "Google-Extended",
    pattern: /Google-Extended/i,
    engine: "Google AI",
  },
  {
    name: "Googlebot (AI Overview)",
    pattern: /Google-InspectionTool/i,
    engine: "Google AI",
  },
  {
    name: "Amazonbot",
    pattern: /Amazonbot/i,
    engine: "Amazon",
  },
  {
    name: "YouBot",
    pattern: /YouBot/i,
    engine: "You.com",
  },
  {
    name: "PhindBot",
    pattern: /PhindBot/i,
    engine: "Phind",
  },
  {
    name: "Bytespider",
    pattern: /Bytespider/i,
    engine: "ByteDance",
  },
  {
    name: "Cohere-ai",
    pattern: /cohere-ai/i,
    engine: "Cohere",
  },
  {
    name: "Meta-ExternalAgent",
    pattern: /Meta-ExternalAgent/i,
    engine: "Meta AI",
  },
  {
    name: "Applebot-Extended",
    pattern: /Applebot-Extended/i,
    engine: "Apple AI",
  },
];

/**
 * Detect which AI bot (if any) is making the request.
 */
export function detectAIBot(userAgent: string): AIBot | null {
  for (const bot of AI_BOTS) {
    if (bot.pattern.test(userAgent)) {
      return bot;
    }
  }
  return null;
}
