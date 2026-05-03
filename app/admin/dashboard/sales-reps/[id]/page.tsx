import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
  CircleDollarSign,
  Clock,
  Globe,
} from "lucide-react";

import { fetchSalesRepApplication } from "@/lib/api/admin-sales-rep";
import {
  type SalesRepApplicationStatus,
  salesRepApplicationStatusBadgeClass,
  salesRepApplicationStatusLabel,
  formatCurrency,
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
import { Button } from "@/components/ui/button";
import { StatusChanger } from "./_components/status-changer";
import { NotesSection } from "./_components/notes-section";
import { LiveToggle } from "./_components/live-toggle";

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

interface SalesRepDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SalesRepDetailPage({
  params,
}: SalesRepDetailPageProps) {
  const { id } = await params;
  const { userId, getToken } = await auth();
  const token = await getToken();

  const result = await fetchSalesRepApplication(token, id);
  if (!result) notFound();

  const { application, notes } = result;

  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/admin/dashboard/sales-reps">
            <ArrowLeft className="size-4" />
            All Sales Reps
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {application.profilePhotoPath && (
              <AvatarImage
                src={application.profilePhotoPath}
                alt={application.fullName ?? ""}
              />
            )}
            <AvatarFallback>{getInitials(application.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">
              {application.fullName ?? "Unknown"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {application.salesRoleTitle ?? "—"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={salesRepApplicationStatusBadgeClass(
                  application.status as SalesRepApplicationStatus
                )}
              >
                {salesRepApplicationStatusLabel[
                  application.status as SalesRepApplicationStatus
                ] ?? application.status}
              </Badge>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {application.id}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-72">
          <StatusChanger
            applicationId={application.id}
            currentStatus={application.status}
            token={token!}
          />
          <LiveToggle
            applicationId={application.id}
            isLive={application.isLive}
            status={application.status}
            token={token!}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* Contact + meta */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact & Compensation</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field icon={<Mail className="size-3.5" />} label="Email">
                {application.email}
              </Field>
              <Field icon={<Phone className="size-3.5" />} label="Phone">
                {application.phone ?? "—"}
              </Field>
              <Field icon={<MapPin className="size-3.5" />} label="Location">
                {[application.locationCity, application.locationState]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </Field>
              <Field icon={<Briefcase className="size-3.5" />} label="Experience">
                {application.yearsOfExperience != null
                  ? `${application.yearsOfExperience} yrs`
                  : "—"}
              </Field>
              <Field
                icon={<CircleDollarSign className="size-3.5" />}
                label="Target OTE / mo"
              >
                {application.salaryAmount && application.salaryCurrency ? (
                  <span className="font-mono">
                    {formatCurrency(
                      application.salaryAmount,
                      application.salaryCurrency
                    )}
                  </span>
                ) : (
                  "—"
                )}
              </Field>
              <Field icon={<Globe className="size-3.5" />} label="English">
                {application.englishProficiency ?? "—"}
              </Field>
              <Field icon={<Clock className="size-3.5" />} label="Availability">
                {application.availability ?? "—"}
              </Field>
              <Field icon={<Calendar className="size-3.5" />} label="Submitted">
                {formatDate(application.submittedAt)}
              </Field>
            </CardContent>
          </Card>

          {/* Bio */}
          {application.bio && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {application.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Sales toolkit */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Sales Tools & Methodology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BadgeRow label="Tools & CRMs" items={application.salesTools} />
              <BadgeRow
                label="Methodologies"
                items={application.salesMethodologies}
              />
              <BadgeRow
                label="Industries Sold Into"
                items={application.industriesSold}
              />
              {application.certifications && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Certifications & Achievements
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {application.certifications}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work experience */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {application.workExperience &&
              application.workExperience.length > 0 ? (
                <ul className="space-y-3">
                  {application.workExperience.map((exp, i) => (
                    <li key={i} className="rounded-lg border p-3">
                      <p className="text-sm font-medium">
                        {exp.title}{" "}
                        <span className="font-normal text-muted-foreground">
                          at {exp.company}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </p>
                      {exp.description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {exp.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No work experience added.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <NotesSection
                applicationId={application.id}
                notes={notes}
                token={token!}
                currentUserId={userId}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Links & uploads */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Links & Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {application.linkedinUrl && (
                <ExternalLinkRow
                  label="LinkedIn"
                  href={application.linkedinUrl}
                />
              )}
              {application.portfolioUrl && (
                <ExternalLinkRow
                  label="Portfolio"
                  href={application.portfolioUrl}
                />
              )}
              {application.resumePath && (
                <ExternalLinkRow
                  label="Resume"
                  href={application.resumePath}
                  icon={<FileText className="size-3.5" />}
                />
              )}
              {!application.linkedinUrl &&
                !application.portfolioUrl &&
                !application.resumePath && (
                  <p className="text-sm text-muted-foreground">
                    No links provided.
                  </p>
                )}
            </CardContent>
          </Card>

          {/* Intro video */}
          {application.introVideoPath && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Intro Video</CardTitle>
              </CardHeader>
              <CardContent>
                <video
                  src={application.introVideoPath}
                  controls
                  className="aspect-video w-full rounded-lg bg-black"
                />
              </CardContent>
            </Card>
          )}

          {/* Engagement preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Field label="Type">
                {application.engagementType?.join(", ") ?? "—"}
              </Field>
              <Field label="Availability">
                {application.availability ?? "—"}
              </Field>
              <Field label="English">
                {application.englishProficiency ?? "—"}
              </Field>
            </CardContent>
          </Card>

          {/* Source */}
          {application.agencyName && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Source</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Sourced via{" "}
                  <Link
                    href={`/admin/dashboard/agencies/${application.agencyId}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {application.agencyName}
                  </Link>
                </p>
                {application.referralCode && (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {application.referralCode}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

function BadgeRow({
  label,
  items,
}: {
  label: string;
  items: string[] | null;
}) {
  if (!items || items.length === 0) {
    return (
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">—</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <Badge key={it} variant="outline" className="text-[10px]">
            {it}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function ExternalLinkRow({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm transition-colors hover:border-border hover:bg-muted/30"
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <ExternalLink className="size-3.5 opacity-50" />
    </a>
  );
}
