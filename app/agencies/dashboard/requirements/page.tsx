import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { fetchAgencyRequirements } from "@/lib/api/agencies";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const priorityBadge: Record<string, string> = {
  low: "border-zinc-600/20 bg-zinc-500/10 text-zinc-600",
  medium: "border-blue-600/20 bg-blue-500/10 text-blue-600",
  high: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  urgent: "border-red-600/20 bg-red-500/10 text-red-600",
};

const formatBudget = (cents: number | null) => {
  if (cents == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

export default async function AgencyRequirementsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const requirements = await fetchAgencyRequirements(token);

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Open Requirements</h1>
        <p className="text-sm text-muted-foreground">
          Browse open positions and source candidates for them.
        </p>
      </div>

      {!requirements || requirements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No open requirements at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {requirements.map((req) => (
            <Link
              key={req.id}
              href={`/agencies/dashboard/requirements/${req.id}`}
              className="group"
            >
            <Card className="transition-colors group-hover:border-pulse/40">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{req.title}</CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      priorityBadge[req.priority] ?? priorityBadge.medium
                    }
                  >
                    {req.priority}
                  </Badge>
                </div>
                {req.companyName && (
                  <p className="text-xs text-muted-foreground">
                    {req.companyName}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {req.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-[10px]">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Experience
                    </p>
                    <p className="font-medium capitalize">
                      {req.experienceLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Type
                    </p>
                    <p className="font-medium capitalize">
                      {req.engagementType}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Developers Needed
                    </p>
                    <p className="font-mono font-medium">
                      {req.developersNeeded}
                    </p>
                  </div>
                  {(req.budgetMinCents || req.budgetMaxCents) && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Budget Range
                      </p>
                      <p className="font-mono font-medium">
                        {formatBudget(req.budgetMinCents)} –{" "}
                        {formatBudget(req.budgetMaxCents)}
                      </p>
                    </div>
                  )}
                </div>

                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {req.description}
                </p>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
