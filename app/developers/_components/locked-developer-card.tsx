import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LockedDeveloperCardProps {
  onUnlock: () => void;
}

function LockedDeveloperCard({ onUnlock }: LockedDeveloperCardProps) {
  return (
    <Card className="group relative flex h-full w-full flex-col border-pulse/20 bg-gradient-to-b from-card to-pulse/5 p-5">
      {/* Blurred placeholder content */}
      <div className="flex flex-col items-center select-none">
        {/* Fake avatar */}
        <div className="size-18 rounded-full bg-muted/60 blur-sm" />

        {/* Redacted name */}
        <div className="mt-3 h-5 w-28 rounded-full bg-muted/50 blur-sm" />
        {/* Redacted role */}
        <div className="mt-2 h-3 w-36 rounded-full bg-muted/40 blur-sm" />

        {/* Fake tags */}
        <div className="mt-3 flex gap-1.5">
          <div className="h-5 w-20 rounded-full bg-muted/30 blur-sm" />
          <div className="h-5 w-16 rounded-full bg-muted/30 blur-sm" />
        </div>
      </div>

      {/* Fake meta */}
      <div className="mt-3 flex justify-center">
        <div className="h-3 w-24 rounded-full bg-muted/30 blur-sm" />
      </div>

      {/* Fake bio */}
      <div className="mt-3 space-y-1.5">
        <div className="h-3 w-full rounded-full bg-muted/20 blur-sm" />
        <div className="h-3 w-3/4 rounded-full bg-muted/20 blur-sm" />
      </div>

      {/* Fake skills */}
      <div className="mt-3 flex justify-center gap-1.5">
        <div className="h-6 w-16 rounded-full bg-muted/25 blur-sm" />
        <div className="h-6 w-14 rounded-full bg-muted/25 blur-sm" />
        <div className="h-6 w-12 rounded-full bg-muted/25 blur-sm" />
      </div>

      {/* Centered unlock CTA */}
      <div className="mt-auto flex flex-col items-center gap-3 pt-5">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <Lock className="size-4 text-muted-foreground" />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={onUnlock}
        >
          Unlock Profile
        </Button>
      </div>
    </Card>
  );
}

export { LockedDeveloperCard };
