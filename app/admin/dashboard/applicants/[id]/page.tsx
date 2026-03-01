import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  HandCoins,
  Clock,
  CircleDollarSign,
} from "lucide-react";

import { fetchApplication } from "@/lib/api/admin";
import type { ApplicationOffer } from "@/lib/api/admin";
import {
  type ApplicationStatus,
  applicationStatusBadgeClass,
  applicationStatusLabel,
  formatCurrency,
  PIPELINE_STAGES,
} from "../../_components/dashboard-data";
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
import { StatusChanger } from "./_components/status-changer";
import { ActivateButton } from "./_components/activate-button";
import { NotesSection } from "./_components/notes-section";
import { FeaturedToggle } from "./_components/featured-toggle";
import { MarketplaceProfileEditor } from "./_components/marketplace-profile-editor";
import { EditProfileDialog } from "./_components/edit-profile-dialog";

const getInitials = (name: string | null) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const offerStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  },
  accepted: {
    label: "Accepted",
    className: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  },
  declined: {
    label: "Declined",
    className: "border-red-600/20 bg-red-500/10 text-red-600",
  },
};

function OfferCard({ offer }: { offer: ApplicationOffer }) {
  const statusCfg = offerStatusConfig[offer.status] ?? offerStatusConfig.pending;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <HandCoins className="size-4" />
          Extended Offer
        </CardTitle>
        <Badge variant="outline" className={statusCfg!.className}>
          {statusCfg!.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Hourly Rate
            </p>
            <p className="font-mono text-lg font-semibold">
              {formatCurrency(offer.hourlyRateCents / 100, offer.currency)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Monthly Rate
            </p>
            <p className="font-mono text-lg font-semibold">
              {formatCurrency(offer.monthlyRateCents / 100, offer.currency)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Engagement
            </p>
            <p className="text-sm font-medium capitalize">
              {offer.engagementType}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Start Date
            </p>
            <p className="text-sm font-medium">{formatDate(offer.startDate)}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CircleDollarSign className="size-3" />
            {offer.currency}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            Offered {formatDate(offer.createdAt)}
          </span>
          {offer.respondedAt && (
            <span>Responded {formatDate(offer.respondedAt)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ApplicantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicantDetailPage({
  params,
}: ApplicantDetailPageProps) {
  const { getToken, userId } = await auth();
  const token = await getToken();
  const { id } = await params;

  const result = await fetchApplication(token, id);

  if (!result) {
    notFound();
  }

  const { application: applicant, notes } = result;
  const currentStageIndex = PIPELINE_STAGES.indexOf(
    applicant.status as ApplicationStatus
  );

  const location = [applicant.locationCity, applicant.locationState]
    .filter(Boolean)
    .join(", ");

  const workExperience = (applicant.workExperience ?? []) as {
    company: string;
    title: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
    companyLogoUrl?: string;
  }[];

  const education = (applicant.education ?? []) as {
    institution: string;
    degree: string;
    grade?: string;
    startYear?: string;
    endYear?: string;
    institutionLogoUrl?: string;
  }[];

  return (
    <>
      <Link
        href="/admin/dashboard/applicants"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Applicants
      </Link>

      {/* ── Header card ─────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="size-16">
                {applicant.profilePhotoPath && (
                  <AvatarImage
                    src={applicant.profilePhotoPath}
                    alt={applicant.fullName ?? ""}
                  />
                )}
                <AvatarFallback className="text-lg">
                  {getInitials(applicant.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">
                  {applicant.fullName ?? "Unknown"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {applicant.professionalTitle ?? "-"}
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
                    className={applicationStatusBadgeClass(
                      applicant.status as ApplicationStatus
                    )}
                  >
                    {applicationStatusLabel[
                      applicant.status as ApplicationStatus
                    ] ?? applicant.status}
                  </Badge>
                  {applicant.isLive && (
                    <Badge
                      variant="outline"
                      className="border-emerald-600/20 bg-emerald-500/10 text-emerald-600"
                    >
                      Live
                    </Badge>
                  )}
                  <FeaturedToggle
                    applicationId={applicant.id}
                    isLive={applicant.isLive}
                    initialFeatured={applicant.isFeatured}
                    token={token!}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <StatusChanger
                applicationId={applicant.id}
                currentStatus={applicant.status}
                token={token!}
              />
              <ActivateButton
                applicationId={applicant.id}
                currentStatus={applicant.status}
                clerkUserId={applicant.clerkUserId}
                token={token!}
              />
              <EditProfileDialog
                applicationId={applicant.id}
                token={token!}
                initialData={{
                  email: applicant.email,
                  fullName: applicant.fullName,
                  phone: applicant.phone,
                  locationCity: applicant.locationCity,
                  locationState: applicant.locationState,
                  professionalTitle: applicant.professionalTitle,
                  yearsOfExperience: applicant.yearsOfExperience,
                  bio: applicant.bio,
                  linkedinUrl: applicant.linkedinUrl,
                  githubUrl: applicant.githubUrl,
                  portfolioUrl: applicant.portfolioUrl,
                  availability: applicant.availability,
                  englishProficiency: applicant.englishProficiency,
                  certifications: applicant.certifications,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Offer card (if one exists) ────────────────────────────────── */}
      {applicant.offer && <OfferCard offer={applicant.offer} />}

      {/* ── Two-column detail grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column — 2/3 width */}
        <div className="space-y-6 xl:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{applicant.email}</span>
                </div>
                {applicant.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="size-4 text-muted-foreground" />
                    <span>{applicant.phone}</span>
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
                <CardTitle className="text-base">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicant.primaryStack && applicant.primaryStack.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      Primary
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {applicant.primaryStack.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {applicant.secondarySkills && (
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      Secondary
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.secondarySkills}
                    </p>
                  </div>
                )}
                {applicant.certifications && (
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      Certifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.certifications}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Professional Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {applicant.bio && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {applicant.bio}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Experience
                  </p>
                  <p className="font-mono text-sm font-medium">
                    {applicant.yearsOfExperience != null
                      ? `${applicant.yearsOfExperience} years`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Availability
                  </p>
                  <p className="text-sm font-medium">
                    {applicant.availability ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    English
                  </p>
                  <p className="text-sm font-medium">
                    {applicant.englishProficiency ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Engagement
                  </p>
                  <p className="text-sm font-medium">
                    {applicant.engagementType?.join(", ") ?? "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {workExperience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workExperience.map((exp, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border/70 p-4"
                  >
                    <div className="flex items-start gap-3">
                      {exp.companyLogoUrl ? (
                        <img
                          src={exp.companyLogoUrl}
                          alt=""
                          className="mt-0.5 size-8 rounded object-contain"
                        />
                      ) : (
                        <Briefcase className="mt-0.5 size-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-semibold">{exp.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.company}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exp.startDate} – {exp.current ? "Present" : exp.endDate ?? "Present"}
                        </p>
                        {exp.description && (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {edu.institutionLogoUrl ? (
                      <img
                        src={edu.institutionLogoUrl}
                        alt=""
                        className="mt-0.5 size-8 rounded object-contain"
                      />
                    ) : (
                      <GraduationCap className="mt-0.5 size-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        {edu.institution}
                      </p>
                      {edu.degree && (
                        <p className="text-sm text-muted-foreground">
                          {edu.degree}
                        </p>
                      )}
                      {edu.grade && (
                        <p className="text-xs text-muted-foreground">
                          Grade: {edu.grade}
                        </p>
                      )}
                      {(edu.startYear || edu.endYear) && (
                        <p className="text-xs text-muted-foreground">
                          {edu.startYear}{edu.startYear && edu.endYear ? " – " : ""}{edu.endYear}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column — 1/3 width */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Application Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Submitted
                  </p>
                  <p className="font-medium">
                    {formatDate(applicant.submittedAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Pipeline Progress
                </p>
                {PIPELINE_STAGES.map((stage, i) => {
                  let state: "completed" | "active" | "upcoming" = "upcoming";
                  if (applicant.status === "rejected") {
                    state =
                      i <= currentStageIndex ? "completed" : "upcoming";
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
                })}
              </div>

              {applicant.resumePath && (
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Resume
                    </p>
                    <a
                      href={applicant.resumePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pulse underline"
                    >
                      {applicant.resumeOriginalName ??
                        applicant.resumePath.split("/").pop()}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {applicant.linkedinUrl && (
            <Card>
              <CardContent className="py-4">
                <a
                  href={applicant.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pulse underline"
                >
                  LinkedIn Profile
                </a>
              </CardContent>
            </Card>
          )}

          {applicant.githubUrl && (
            <Card>
              <CardContent className="py-4">
                <a
                  href={applicant.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pulse underline"
                >
                  GitHub Profile
                </a>
              </CardContent>
            </Card>
          )}

          {applicant.portfolioUrl && (
            <Card>
              <CardContent className="py-4">
                <a
                  href={applicant.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pulse underline"
                >
                  Portfolio
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Full-width sections ─────────────────────────────────────── */}
      {(applicant.status === "approved" || applicant.isLive) && (
        <MarketplaceProfileEditor
          applicationId={applicant.id}
          token={token!}
          initialData={{
            hourlyRateCents: applicant.hourlyRateCents ?? null,
            monthlyRateCents: applicant.monthlyRateCents ?? null,
            marketplaceRating: applicant.marketplaceRating ?? null,
            marketplaceProjects: applicant.marketplaceProjects ?? null,
            marketplaceAchievements: applicant.marketplaceAchievements ?? null,
            marketplaceAwards: applicant.marketplaceAwards ?? null,
            aboutLong: applicant.aboutLong ?? null,
          }}
        />
      )}

      <NotesSection
        applicationId={applicant.id}
        currentStatus={applicant.status}
        notes={notes}
        token={token!}
        currentUserId={userId ?? undefined}
      />
    </>
  );
}
