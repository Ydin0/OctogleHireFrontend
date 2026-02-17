import { Calendar, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Developer } from "@/lib/data/developers";

interface ProfileCtaProps {
  developer: Developer;
}

const ProfileCta = ({ developer }: ProfileCtaProps) => {
  const firstName = developer.name.split(" ")[0];

  return (
    <section>
      <Separator className="mb-8" />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
          Ready to work with {firstName}?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Start building your project with a pre-vetted, world-class engineer.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button className="bg-pulse text-pulse-foreground hover:bg-pulse/90">
            Hire {firstName}
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="size-4" />
            Schedule a Call
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="size-4" />
          <span>7-day risk-free trial</span>
        </div>
      </div>
    </section>
  );
};

export { ProfileCta };
