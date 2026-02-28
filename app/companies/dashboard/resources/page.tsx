import { Wrench } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ResourcesPage = () => {
  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            Capacity and upcoming resource events across the offshore team.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Wrench className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">No active engagements yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Resource utilization and capacity tracking will appear here once developers are assigned to your company.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default ResourcesPage;
