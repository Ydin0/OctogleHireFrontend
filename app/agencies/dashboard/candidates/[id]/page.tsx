import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

import { fetchAgencyCandidate } from "@/lib/api/agencies";
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

interface CandidateDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AgencyCandidateDetailPage({
  params,
}: CandidateDetailPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const { id } = await params;

  const candidate = await fetchAgencyCandidate(token, id);

  if (!candidate) {
    notFound();
  }

  const location = [candidate.locationCity, candidate.locationState]
    .filter(Boolean)
    .join(", ");

  const initials = candidate.fullName
    ? candidate.fullName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <>
      <Link
        href="/agencies/dashboard/candidates"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Candidates
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="size-16">
              {candidate.profilePhotoPath && (
                <AvatarImage src={candidate.profilePhotoPath} alt="" />
              )}
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">
                {candidate.fullName ?? "Unknown"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {candidate.professionalTitle ?? "-"}
              </p>
              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {location}
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline">
                  {candidate.status.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline" className="border-blue-600/20 bg-blue-500/10 text-blue-600">
                  {candidate.source}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{candidate.email}</p>
            {location && <p>{location}</p>}
          </CardContent>
        </Card>

        {candidate.primaryStack && candidate.primaryStack.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {candidate.primaryStack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Experience
                </p>
                <p className="text-sm font-medium">
                  {candidate.yearsOfExperience != null
                    ? `${candidate.yearsOfExperience} years`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Availability
                </p>
                <p className="text-sm font-medium">
                  {candidate.availability ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Engagement
                </p>
                <p className="text-sm font-medium">
                  {candidate.engagementType?.join(", ") ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Submitted
                </p>
                <p className="text-sm font-medium">
                  {candidate.submittedAt
                    ? new Date(candidate.submittedAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
