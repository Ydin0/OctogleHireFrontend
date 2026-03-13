import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Clock,
  FileText,
  GraduationCap,
  Languages,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";

import {
  fetchCompanyDeveloperProfile,
  fetchCompanyTimeEntries,
  fetchCompanyProfile,
  type CompanyDeveloperProfile,
  type CompanyDeveloperMatch,
  type CompanyTimeEntryFull,
  type CompanyProfileSummary,
} from "@/lib/api/companies";
import {
  matchStatusBadgeClass,
  matchStatusLabel,
  formatDate,
} from "@/app/admin/dashboard/_components/dashboard-data";
import { DownloadCVButton } from "./_components/download-cv-button";
import { DeveloperReviewSection } from "./_components/developer-review-section";
import { TECH_ICONS } from "@/lib/tech-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ENGLISH_LABELS: Record<string, string> = {
  native: "Native / Bilingual",
  fluent: "Fluent",
  advanced: "Advanced",
  intermediate: "Intermediate",
  basic: "Basic",
};

export default async function CompanyDeveloperProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken();
  const [developer, allTimeEntries, companyProfile] = await Promise.all([
    fetchCompanyDeveloperProfile(token, id),
    fetchCompanyTimeEntries(token),
    fetchCompanyProfile(token),
  ]);

  if (!developer) return notFound();

  const timeEntries = allTimeEntries.filter((e) => e.developerId === id);

  const activeMatch = developer.matches.find(
    (m) => m.status === "active" || m.status === "accepted",
  );

  return (
    <div className="space-y-6">
      {/* Back link + page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/companies/dashboard/candidates"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{developer.name}</h1>
            <p className="text-sm text-muted-foreground">{developer.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {developer.hasResume && (
            <DownloadCVButton developerId={developer.id} />
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left sidebar */}
        <div className="space-y-4">
          <ProfileSidebar developer={developer} activeMatch={activeMatch} />
        </div>

        {/* Right content */}
        <div>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              {timeEntries.length > 0 && (
                <TabsTrigger value="timesheets">
                  Timesheets ({timeEntries.length})
                </TabsTrigger>
              )}
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6 space-y-8">
              <ProfileTab developer={developer} companyProfile={companyProfile} />
            </TabsContent>

            {timeEntries.length > 0 && (
              <TabsContent value="timesheets" className="mt-6">
                <TimesheetsTab entries={timeEntries} />
              </TabsContent>
            )}

            <TabsContent value="documents" className="mt-6">
              <DocumentsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/* ─── Left Sidebar ──────────────────────────────────────────────── */

function ProfileSidebar({
  developer,
  activeMatch,
}: {
  developer: CompanyDeveloperProfile;
  activeMatch?: CompanyDeveloperMatch;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="size-20 border-2 border-border">
              <AvatarImage src={developer.avatar} alt={developer.name} className="object-cover" />
              <AvatarFallback className="text-xl font-semibold">
                {getInitials(developer.name)}
              </AvatarFallback>
            </Avatar>
            {developer.isOnline && (
              <span className="absolute bottom-0.5 right-0.5 size-4 rounded-full border-[3px] border-background bg-emerald-500" />
            )}
          </div>
          <h2 className="mt-3 text-base font-semibold">{developer.name}</h2>
          <p className="text-sm text-muted-foreground">{developer.role}</p>

          {/* Status badge */}
          {activeMatch && (
            <Badge
              variant="outline"
              className={`mt-2 ${matchStatusBadgeClass(activeMatch.status as "active" | "accepted" | "proposed")}`}
            >
              {matchStatusLabel[activeMatch.status as keyof typeof matchStatusLabel] ?? activeMatch.status}
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        {/* Match details */}
        {developer.matches.length > 0 && (
          <>
            <div className="space-y-3">
              {developer.matches.map((match) => (
                <div key={match.id} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{match.requirementTitle}</p>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] ${matchStatusBadgeClass(match.status as "proposed" | "accepted" | "rejected" | "active" | "ended")}`}
                    >
                      {matchStatusLabel[match.status as keyof typeof matchStatusLabel] ?? match.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">${match.proposedHourlyRate}/hr</span>
                    <span className="text-border">|</span>
                    <span className="capitalize">{match.engagementType?.replace("-", " ")}</span>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
          </>
        )}

        {/* Key info */}
        <div className="space-y-3">
          {developer.location && (
            <InfoRow icon={MapPin} label="Working from" value={developer.location} />
          )}
          <InfoRow
            icon={Clock}
            label="Experience"
            value={`${developer.yearsOfExperience} years`}
          />
          {developer.englishProficiency && (
            <InfoRow
              icon={Languages}
              label="English"
              value={ENGLISH_LABELS[developer.englishProficiency] ?? developer.englishProficiency}
            />
          )}
          {developer.availability && (
            <InfoRow
              icon={Briefcase}
              label="Availability"
              value={developer.availability.replace(/_/g, " ")}
            />
          )}
          {developer.engagementType.length > 0 && (
            <InfoRow
              icon={Briefcase}
              label="Engagement"
              value={developer.engagementType.join(", ")}
            />
          )}
          {developer.rating > 0 && (
            <InfoRow
              icon={Star}
              label="Rating"
              value={developer.rating.toFixed(1)}
            />
          )}
          {developer.projects > 0 && (
            <InfoRow
              icon={Briefcase}
              label="Projects"
              value={String(developer.projects)}
            />
          )}
        </div>

        {/* Rates */}
        {(developer.hourlyRate > 0 || developer.monthlyRate > 0) && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Rates
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  ${developer.hourlyRate || developer.matches[0]?.proposedHourlyRate || 0}/hr
                </Badge>
                <Badge variant="secondary" className="font-mono text-xs">
                  ${(developer.monthlyRate || developer.matches[0]?.proposedMonthlyRate || 0).toLocaleString()}/mo
                </Badge>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm capitalize">{value}</p>
      </div>
    </div>
  );
}

/* ─── Profile Tab ───────────────────────────────────────────────── */

function ProfileTab({ developer, companyProfile }: { developer: CompanyDeveloperProfile; companyProfile: CompanyProfileSummary | null }) {
  return (
    <>
      {/* Intro / About */}
      {(developer.about || developer.bio) && (
        <section>
          <h2 className="text-base font-semibold">Intro</h2>
          <Separator className="my-3" />
          <p className="max-w-3xl leading-relaxed text-muted-foreground">
            {developer.about || developer.bio}
          </p>
        </section>
      )}

      {/* Tech Stack */}
      {developer.skills.length > 0 && (
        <section>
          <h2 className="text-base font-semibold">Tech Stack</h2>
          <Separator className="my-3" />
          <div className="flex flex-wrap gap-2">
            {developer.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1.5 text-sm"
              >
                {TECH_ICONS[skill] && (
                  <img src={TECH_ICONS[skill]} alt="" className="size-4" />
                )}
                {skill}
              </Badge>
            ))}
          </div>
          {developer.secondarySkills && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Secondary Skills
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {developer.secondarySkills}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Work Experience */}
      {developer.workHistory.length > 0 && (
        <section>
          <h2 className="text-base font-semibold">Work Experience</h2>
          <Separator className="my-3" />
          <div className="space-y-6">
            {developer.workHistory.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="hidden shrink-0 sm:block">
                  {item.companyLogoUrl ? (
                    <img
                      src={item.companyLogoUrl}
                      alt={item.company}
                      className="size-10 rounded-lg border border-border object-contain p-1"
                    />
                  ) : item.companyDomain ? (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${item.companyDomain}&sz=128`}
                      alt={item.company}
                      className="size-10 rounded-lg border border-border object-contain p-1"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted">
                      <Briefcase className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{item.role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.company}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.duration}</p>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {item.techUsed.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.techUsed.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {i < developer.workHistory.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {developer.education.length > 0 && (
        <section>
          <h2 className="text-base font-semibold">Education</h2>
          <Separator className="my-3" />
          <div className="space-y-4">
            {developer.education.map((edu, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {edu.institutionLogoUrl ? (
                    <img
                      src={edu.institutionLogoUrl}
                      alt={edu.institution}
                      className="size-10 rounded-lg object-contain p-1"
                    />
                  ) : (
                    <GraduationCap className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-muted-foreground">{edu.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {developer.awards.length > 0 && (
        <section>
          <h2 className="text-base font-semibold">Awards</h2>
          <Separator className="my-3" />
          <div className="space-y-4">
            {developer.awards.map((award, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-pulse/10">
                  <Award className="size-5 text-pulse" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{award.title}</p>
                  <p className="text-xs text-muted-foreground">{award.issuer}</p>
                  <p className="text-xs text-muted-foreground">{award.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {developer.achievements.length > 0 && (
        <section>
          <h2 className="text-base font-semibold">Achievements</h2>
          <Separator className="my-3" />
          <ul className="space-y-3">
            {developer.achievements.map((achievement) => (
              <li key={achievement} className="flex items-start gap-3">
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-pulse/10">
                  <Trophy className="size-3.5 text-pulse" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {achievement}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Certifications */}
      {developer.certifications && (
        <section>
          <h2 className="text-base font-semibold">Certifications</h2>
          <Separator className="my-3" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {developer.certifications}
          </p>
        </section>
      )}

      {/* Reviews */}
      <section>
        <DeveloperReviewSection
          developerId={developer.id}
          developerName={developer.name}
          companyId={companyProfile?.id}
          companyName={companyProfile?.companyName}
          companyLogoUrl={companyProfile?.logoUrl}
        />
      </section>
    </>
  );
}

/* ─── Timesheets Tab ────────────────────────────────────────────── */

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  submitted: "outline",
  approved: "default",
  rejected: "destructive",
};

function formatPeriod(period: string): string {
  const [year, month] = period.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function TimesheetsTab({ entries }: { entries: CompanyTimeEntryFull[] }) {
  const grouped = entries.reduce<Record<string, CompanyTimeEntryFull[]>>((acc, entry) => {
    const key = entry.period;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const sortedPeriods = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const approvedHours = entries.filter((e) => e.status === "approved").reduce((sum, e) => sum + e.hours, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-pulse/10">
            <Clock className="size-4 text-pulse" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Hours</p>
            <p className="font-mono text-sm font-semibold">{totalHours}h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Approved</p>
            <p className="font-mono text-sm font-semibold">{approvedHours}h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Periods</p>
            <p className="text-sm font-semibold">{sortedPeriods.length}</p>
          </div>
        </div>
      </div>

      {/* Grouped by period */}
      {sortedPeriods.map((period) => {
        const periodEntries = grouped[period];
        const periodTotal = periodEntries.reduce((sum, e) => sum + e.hours, 0);

        return (
          <Card key={period}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div>
                  <p className="text-sm font-semibold">{formatPeriod(period)}</p>
                  <p className="text-xs text-muted-foreground">
                    {periodEntries.length} {periodEntries.length === 1 ? "entry" : "entries"}
                  </p>
                </div>
                <span className="font-mono text-sm text-muted-foreground">
                  {periodTotal}h total
                </span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <p className="text-sm">{entry.requirementTitle}</p>
                        {entry.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {entry.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {entry.hours}h
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[entry.status] ?? "outline"}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* ─── Documents Tab (placeholder) ───────────────────────────────── */

function DocumentsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FileText className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">No documents yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Documents for this team member will appear here once available.
      </p>
    </div>
  );
}
