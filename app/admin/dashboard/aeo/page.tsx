import { BotCrawlDashboard } from "./_components/bot-crawl-dashboard";
import { AEOSetupGuide } from "./_components/aeo-setup-guide";

export default function AEOMonitoringPage() {
  return (
    <>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          AEO Monitoring
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          AI Engine Optimization
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Monitor how AI engines crawl and cite your content. Track referral
          traffic from ChatGPT, Perplexity, Google AI Overviews, and more.
        </p>
      </div>

      {/* Bot crawl stats */}
      <div>
        <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          AI Bot Crawl Activity
        </h2>
        <BotCrawlDashboard />
      </div>

      {/* Setup guide */}
      <div>
        <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Monitoring Setup
        </h2>
        <AEOSetupGuide />
      </div>
    </>
  );
}
