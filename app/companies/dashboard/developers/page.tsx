import { Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BrowseDevelopersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Browse Developers</CardTitle>
        <CardDescription>
          Search and discover vetted developers for your team.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="flex size-14 items-center justify-center rounded-full bg-pulse/10">
          <Users className="size-6 text-pulse" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Coming Soon</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            We&apos;re building the developer marketplace. You&apos;ll be able
            to browse and connect with vetted talent here soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
