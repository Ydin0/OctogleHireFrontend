import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { fetchAgencyCandidates } from "@/lib/api/agencies";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AddDeveloperDialog } from "./_components/add-developer-dialog";

const statusBadge: Record<string, string> = {
  draft: "border-zinc-600/20 bg-zinc-500/10 text-zinc-600",
  hr_communication_round: "border-blue-600/20 bg-blue-500/10 text-blue-600",
  initial_screening: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  technical_round: "border-purple-600/20 bg-purple-500/10 text-purple-600",
  final_round: "border-indigo-600/20 bg-indigo-500/10 text-indigo-600",
  offer_extended: "border-cyan-600/20 bg-cyan-500/10 text-cyan-600",
  approved: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  rejected: "border-red-600/20 bg-red-500/10 text-red-600",
};

interface CandidatesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AgencyCandidatesPage({
  searchParams,
}: CandidatesPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await fetchAgencyCandidates(token, { page, limit: 20 });
  const candidates = result?.candidates ?? [];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Candidates</h1>
          <p className="text-sm text-muted-foreground">
            Developers who applied through your referral link.
          </p>
        </div>
        <AddDeveloperDialog />
      </div>

      {candidates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No candidates yet. Share your referral link to start sourcing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {result?.pagination.total ?? 0} candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {candidates.map((c) => (
                <Link
                  key={c.id}
                  href={`/agencies/dashboard/candidates/${c.id}`}
                  className="flex items-center gap-4 py-3 transition-colors hover:bg-accent/50 -mx-2 px-2 rounded-md"
                >
                  <Avatar size="sm">
                    {c.profilePhotoPath && (
                      <AvatarImage src={c.profilePhotoPath} alt="" />
                    )}
                    <AvatarFallback>
                      {c.fullName
                        ? c.fullName
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {c.fullName ?? "Unknown"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.professionalTitle ?? c.email}
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    {c.primaryStack?.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      statusBadge[c.status] ?? statusBadge.draft
                    }
                  >
                    {c.status.replace(/_/g, " ")}
                  </Badge>
                </Link>
              ))}
            </div>

            {result && result.pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  Page {result.pagination.page} of{" "}
                  {result.pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={`/agencies/dashboard/candidates?page=${page - 1}`}
                      className="text-pulse underline"
                    >
                      Previous
                    </Link>
                  )}
                  {page < result.pagination.totalPages && (
                    <Link
                      href={`/agencies/dashboard/candidates?page=${page + 1}`}
                      className="text-pulse underline"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
