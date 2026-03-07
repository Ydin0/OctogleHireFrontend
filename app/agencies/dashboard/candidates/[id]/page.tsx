import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { fetchUnifiedCandidateDetail } from "@/lib/api/agencies";
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
import {
  type ApplicationStatus,
  applicationStatusBadgeClass,
  applicationStatusLabel,
  formatDate,
  PIPELINE_STAGES,
} from "@/app/admin/dashboard/_components/dashboard-data";
import { AgencyStatusChanger } from "./_components/agency-status-changer";

const getInitials = (name: string | null) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// Apify experience shape — flexible to handle various field names
interface LinkedInExperience {
  title?: string;
  company?: string;
  companyName?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  companyLogoUrl?: string;
  logoUrl?: string;
  _companyLogoR2Url?: string;
  location?: string;
}

// Apify education shape
interface LinkedInEducation {
  school?: string;
  schoolName?: string;
  institution?: string;
  degree?: string;
  degreeName?: string;
  field?: string;
  fieldOfStudy?: string;
  years?: string;
  startYear?: string;
  endYear?: string;
  grade?: string;
  logoUrl?: string;
  institutionLogoUrl?: string;
  _institutionLogoR2Url?: string;
}

interface CandidateDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string }>;
}

export default async function AgencyCandidateDetailPage({
  params,
  searchParams,
}: CandidateDetailPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const { id } = await params;
  const { source } = await searchParams;

  const candidate = await fetchUnifiedCandidateDetail(
    token,
    id,
    source === "saved" ? "saved" : undefined
  );

  if (!candidate) {
    notFound();
  }

  const isSaved = candidate.sourceTable === "saved";

  const location =
    candidate.location ||
    [candidate.locationCity, candidate.locationState].filter(Boolean).join(", ") ||
    null;

  const workExperience = (
    isSaved
      ? (candidate.experience ?? [])
      : []
  ) as LinkedInExperience[];

  const education = (
    isSaved
      ? (candidate.education ?? [])
      : []
  ) as LinkedInEducation[];

  const skills = (
    isSaved
      ? (candidate.skills ?? candidate.primaryStack ?? [])
      : (candidate.primaryStack ?? [])
  ) as string[];

  return (
    <>
      <Link
        href="/agencies/dashboard/candidates"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Candidates
      </Link>

      {/* ── Header card ─────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="size-16">
                {(candidate.profilePhotoPath || candidate.profileImageUrl) && (
                  <AvatarImage
                    src={candidate.profilePhotoPath ?? candidate.profileImageUrl ?? ""}
                    alt={candidate.fullName ?? ""}
                  />
                )}
                <AvatarFallback className="text-lg">
                  {getInitials(candidate.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">
                  {candidate.fullName ?? "Unknown"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {candidate.professionalTitle ?? candidate.headline ?? "-"}
                </p>
                {location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {location}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className={applicationStatusBadgeClass(candidate.status as ApplicationStatus)}
                  >
                    {applicationStatusLabel[candidate.status as ApplicationStatus] ?? candidate.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      candidate.source === "extension"
                        ? "bg-teal-500/10 text-teal-600 border-teal-600/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-600/20"
                    }
                  >
                    {candidate.source === "extension" ? "Extension" : "Referral"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <AgencyStatusChanger
                candidateId={candidate.id}
                currentStatus={candidate.status}
                sourceTable={candidate.sourceTable}
                token={token!}
              />
              {candidate.linkedinUrl && (
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Two-column detail grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column — 2/3 width */}
        <div className="space-y-6 xl:col-span-2">
          {/* Contact + Skills row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidate.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="size-4 text-muted-foreground" />
                    <span>{candidate.email}</span>
                  </div>
                )}
                {!candidate.email && isSaved && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="size-4" />
                    <span>Not available (LinkedIn prospect)</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span>{location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isSaved ? "Skills" : "Tech Stack"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((tech) => (
                      <Badge key={typeof tech === "string" ? tech : JSON.stringify(tech)} variant="outline">
                        {typeof tech === "string" ? tech : (tech as Record<string, unknown>).name as string ?? "Unknown"}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Professional Summary / About */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isSaved ? "About" : "Professional Summary"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(candidate.about || candidate.professionalTitle) && (
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {candidate.about ?? candidate.professionalTitle ?? "-"}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Experience
                  </p>
                  <p className="font-mono text-sm font-medium">
                    {candidate.yearsOfExperience != null
                      ? `${candidate.yearsOfExperience} years`
                      : "-"}
                  </p>
                </div>
                {!isSaved && (
                  <>
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
                  </>
                )}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isSaved ? "Saved" : "Submitted"}
                  </p>
                  <p className="text-sm font-medium">
                    {candidate.submittedAt
                      ? formatDate(candidate.submittedAt)
                      : candidate.createdAt
                        ? formatDate(candidate.createdAt)
                        : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workExperience.map((exp, i) => {
                  const company = exp.company ?? exp.companyName ?? null;
                  const logo = exp._companyLogoR2Url ?? exp.companyLogoUrl ?? exp.logoUrl ?? null;
                  const duration = exp.duration ?? (
                    exp.startDate
                      ? `${exp.startDate} – ${exp.current ? "Present" : exp.endDate ?? "Present"}`
                      : null
                  );

                  return (
                    <div
                      key={i}
                      className="rounded-lg border border-border/70 p-4"
                    >
                      <div className="flex items-start gap-3">
                        {logo ? (
                          <img
                            src={logo}
                            alt=""
                            className="mt-0.5 size-8 rounded object-contain"
                          />
                        ) : (
                          <Briefcase className="mt-0.5 size-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-semibold">
                            {exp.title ?? "Untitled Role"}
                          </p>
                          {company && (
                            <p className="text-sm text-muted-foreground">
                              {company}
                            </p>
                          )}
                          {duration && (
                            <p className="text-xs text-muted-foreground">
                              {duration}
                            </p>
                          )}
                          {exp.location && (
                            <p className="text-xs text-muted-foreground">
                              {exp.location}
                            </p>
                          )}
                          {exp.description && (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu, i) => {
                  const school = edu.school ?? edu.schoolName ?? edu.institution ?? null;
                  const degree = edu.degree ?? edu.degreeName ?? null;
                  const field = edu.field ?? edu.fieldOfStudy ?? null;
                  const logo = edu._institutionLogoR2Url ?? edu.institutionLogoUrl ?? edu.logoUrl ?? null;
                  const years = edu.years ?? (
                    edu.startYear || edu.endYear
                      ? `${edu.startYear ?? ""}${edu.startYear && edu.endYear ? " – " : ""}${edu.endYear ?? ""}`
                      : null
                  );

                  return (
                    <div key={i} className="flex items-start gap-3">
                      {logo ? (
                        <img
                          src={logo}
                          alt=""
                          className="mt-0.5 size-8 rounded object-contain"
                        />
                      ) : (
                        <GraduationCap className="mt-0.5 size-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-semibold">
                          {school ?? "Unknown School"}
                        </p>
                        {(degree || field) && (
                          <p className="text-sm text-muted-foreground">
                            {[degree, field].filter(Boolean).join(" - ")}
                          </p>
                        )}
                        {edu.grade && (
                          <p className="text-xs text-muted-foreground">
                            Grade: {edu.grade}
                          </p>
                        )}
                        {years && (
                          <p className="text-xs text-muted-foreground">
                            {years}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column — 1/3 width */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isSaved ? "Candidate Pipeline" : "Application Timeline"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isSaved ? "Saved" : "Submitted"}
                  </p>
                  <p className="font-medium">
                    {candidate.submittedAt
                      ? formatDate(candidate.submittedAt)
                      : candidate.createdAt
                        ? formatDate(candidate.createdAt)
                        : "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Pipeline Progress
                </p>
                {(() => {
                  const stages: ApplicationStatus[] = isSaved
                    ? ["prospected", "contacted", "interviewing"]
                    : PIPELINE_STAGES;

                  const currentStageIndex = stages.indexOf(
                    candidate.status as ApplicationStatus
                  );

                  return stages.map((stage, i) => {
                    let state: "completed" | "active" | "upcoming" = "upcoming";
                    if (candidate.status === "rejected") {
                      state = i <= currentStageIndex ? "completed" : "upcoming";
                    } else if (currentStageIndex >= 0) {
                      if (i < currentStageIndex) state = "completed";
                      if (i === currentStageIndex) state = "active";
                    }

                    return (
                      <div
                        key={stage}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className={`size-2 rounded-full ${
                            state === "completed"
                              ? "bg-emerald-500"
                              : state === "active"
                                ? "bg-pulse"
                                : "bg-zinc-300 dark:bg-zinc-600"
                          }`}
                        />
                        <span
                          className={
                            state === "active"
                              ? "font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {applicationStatusLabel[stage]}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>

          {candidate.linkedinUrl && (
            <Card>
              <CardContent className="py-4">
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pulse underline"
                >
                  LinkedIn Profile
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
