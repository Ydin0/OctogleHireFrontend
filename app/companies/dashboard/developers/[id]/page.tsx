import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { formatDate } from "@/app/admin/dashboard/_components/dashboard-data";
import { formatRate } from "@/lib/utils/format-rate";
import { RequestInterviewButton } from "./_components/request-interview-button";
import { DeveloperReviewSection } from "./_components/developer-review-section";
import { TECH_ICONS } from "@/lib/tech-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

const MonoLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
    {children}
  </div>
);

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
  const activeMatch =
    developer.matches.find((m) => m.status === "active" || m.status === "accepted") ??
    developer.matches[0];
  const refId = `#${developer.id.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-background">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="relative border-b border-border bg-gradient-to-b from-pulse/[0.06] to-transparent">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-5 px-8 py-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/companies/dashboard/candidates"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-pulse/45 hover:text-pulse"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-[28px] font-semibold leading-tight tracking-tight">
                {developer.name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
                <span>{developer.role}</span>
                <span className="size-1 rounded-full bg-muted-foreground/60" />
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-pulse">
                  Candidate · {refId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <RequestInterviewButton developerId={developer.id} name={developer.name} />
          </div>
        </div>
      </div>

      {/* ── Body grid ────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-8 px-8 pb-16 pt-8 lg:grid-cols-[360px_1fr]">
        {/* LEFT: sticky profile card */}
        <ProfileCard developer={developer} activeMatch={activeMatch} />

        {/* RIGHT: tabbed content */}
        <div className="min-w-0">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              {timeEntries.length > 0 && (
                <TabsTrigger value="timesheets">
                  Timesheets ({timeEntries.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <ProfileTab developer={developer} companyProfile={companyProfile} />
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <DocumentsTab />
            </TabsContent>

            {timeEntries.length > 0 && (
              <TabsContent value="timesheets" className="mt-6">
                <TimesheetsTab entries={timeEntries} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/* ─── Left profile card ─────────────────────────────────────────── */

function ProfileCard({
  developer,
  activeMatch,
}: {
  developer: CompanyDeveloperProfile;
  activeMatch?: CompanyDeveloperMatch;
}) {
  const rating = Math.round(developer.rating);
  return (
    <div className="sticky top-6 flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
      {/* header */}
      <div className="flex flex-col items-center bg-gradient-to-b from-pulse/[0.07] to-card px-7 pb-6 pt-8 text-center">
        <div className="relative flex size-[120px] items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-pulse/45 shadow-[0_0_0_5px_color-mix(in_oklab,var(--pulse)_9%,transparent)]" />
          <div className="size-[98px] overflow-hidden rounded-full border-2 border-pulse/55">
            <Avatar className="size-full rounded-none">
              <AvatarImage src={developer.avatar} alt={developer.name} className="object-cover" />
              <AvatarFallback className="rounded-none text-xl font-semibold">
                {getInitials(developer.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          {developer.isOnline && (
            <span className="absolute bottom-2 right-2.5 inline-flex">
              <span className="relative inline-flex">
                <span className="size-4 rounded-full border-[3px] border-card bg-emerald-400" />
                <span className="absolute inset-0 size-4 animate-ping rounded-full bg-emerald-400/70" />
              </span>
            </span>
          )}
        </div>
        <div className="mt-4 text-[21px] font-semibold tracking-tight">{developer.name}</div>
        <div className="mt-0.5 text-[13px] text-pulse">{developer.role}</div>
        {activeMatch && (
          <div className="mt-3.5">
            <Badge
              variant="outline"
              className="gap-1.5 border-pulse/32 bg-pulse/12 text-pulse"
            >
              {activeMatch.status === "accepted" || activeMatch.status === "active"
                ? "✓ Applicant Accepted"
                : activeMatch.status.replace(/_/g, " ")}
            </Badge>
          </div>
        )}
      </div>

      {/* applied role */}
      {activeMatch && (
        <>
          <div className="h-px bg-border" />
          <div className="px-6 py-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-semibold">{activeMatch.requirementTitle}</span>
              <span className="inline-flex items-center rounded-full border border-pulse/32 bg-pulse/12 px-2.5 py-0.5 text-[11px] font-medium text-pulse">
                {activeMatch.status === "accepted" || activeMatch.status === "active"
                  ? "Accepted"
                  : activeMatch.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.05em]">
              <span className="font-medium text-foreground">
                {formatRate(activeMatch.proposedHourlyRate, activeMatch.currency)}/hr
              </span>
              <span className="size-1 rounded-full bg-muted-foreground/60" />
              <span className="text-muted-foreground">
                {activeMatch.engagementType?.replace(/-/g, " ") || "—"}
              </span>
            </div>
            {activeMatch.proposedMonthlyRate > 0 && (
              <div className="mt-2.5 rounded-xl border border-pulse/25 bg-pulse/[0.06] px-3 py-2.5">
                <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                  Estimated monthly
                </div>
                <div className="mt-0.5 font-mono text-[17px] font-bold">
                  {formatRate(activeMatch.proposedMonthlyRate, activeMatch.currency)}
                  <span className="text-[11px] font-normal text-muted-foreground">/mo</span>
                </div>
                {activeMatch.hoursPerDay && activeMatch.workingDaysPerMonth && (
                  <div className="mt-1 text-[11.5px] text-muted-foreground">
                    {formatRate(activeMatch.proposedHourlyRate, activeMatch.currency)}/hr ·{" "}
                    {activeMatch.hoursPerDay}h/day · {activeMatch.workingDaysPerMonth} days/mo
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* meta list */}
      <div className="h-px bg-border" />
      <div className="flex flex-col gap-[18px] px-6 py-5">
        {developer.location && (
          <MetaRow icon={<MapPin className="size-[17px]" />} label="Working from" value={developer.location} />
        )}
        <MetaRow
          icon={<Clock className="size-[17px]" />}
          label="Experience"
          value={`${developer.yearsOfExperience} ${developer.yearsOfExperience === 1 ? "year" : "years"}`}
        />
        {developer.englishProficiency && (
          <MetaRow
            icon={<Languages className="size-[17px]" />}
            label="English"
            value={ENGLISH_LABELS[developer.englishProficiency] ?? developer.englishProficiency}
          />
        )}
        {developer.availability && (
          <MetaRow
            icon={<Briefcase className="size-[17px]" />}
            label="Availability"
            value={
              <span className="inline-flex items-center gap-2 capitalize">
                <span className="size-[7px] rounded-full bg-emerald-400" />
                {developer.availability.replace(/_/g, " ")}
              </span>
            }
          />
        )}
        {developer.engagementType.length > 0 && (
          <div className="flex items-start gap-[13px]">
            <span className="mt-0.5 shrink-0 text-muted-foreground"><Briefcase className="size-[17px]" /></span>
            <div className="min-w-0">
              <MonoLabel>Engagement</MonoLabel>
              <div className="flex flex-wrap gap-1.5">
                {developer.engagementType.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-muted px-2.5 py-[3px] text-[11px] capitalize text-muted-foreground"
                  >
                    {t.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {developer.rating > 0 && (
          <div className="flex items-start gap-[13px]">
            <span className="mt-0.5 shrink-0 text-muted-foreground"><Star className="size-[17px]" /></span>
            <div>
              <MonoLabel>Rating</MonoLabel>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold">{developer.rating.toFixed(1)}</span>
                <span className="inline-flex gap-px text-pulse">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={i < rating ? "size-3 fill-pulse text-pulse" : "size-3 text-pulse/30"}
                    />
                  ))}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-[13px]">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <MonoLabel>{label}</MonoLabel>
        <div className="text-[14px] font-medium">{value}</div>
      </div>
    </div>
  );
}

/* ─── Profile tab ───────────────────────────────────────────────── */

function SectionEyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-pulse">
      {n} · {label}
    </div>
  );
}

function ProfileTab({
  developer,
  companyProfile,
}: {
  developer: CompanyDeveloperProfile;
  companyProfile: CompanyProfileSummary | null;
}) {
  let n = 0;
  const next = () => String(++n).padStart(2, "0");
  return (
    <div className="flex flex-col gap-10">
      {(developer.about || developer.bio) && (
        <section>
          <SectionEyebrow n={next()} label="Intro" />
          <h2 className="mb-3.5 text-xl font-semibold tracking-tight">About</h2>
          <p className="max-w-[62ch] text-[16px] leading-relaxed text-muted-foreground">
            {developer.about || developer.bio}
          </p>
        </section>
      )}

      {developer.skills.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <section>
            <SectionEyebrow n={next()} label="Tech Stack" />
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Core tools</h2>
            <div className="flex flex-wrap gap-2.5">
              {developer.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-pulse/30 bg-pulse/[0.09] px-4 text-[14px] font-medium"
                >
                  {TECH_ICONS[skill] && (
                    <Image src={TECH_ICONS[skill]} alt="" width={16} height={16} unoptimized />
                  )}
                  {skill}
                </span>
              ))}
            </div>
            {developer.secondarySkills && (
              <>
                <div className="my-3 mt-6 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                  Secondary skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {developer.secondarySkills
                    .split(/[,\n]/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border px-3 py-[5px] text-[13px] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                </div>
              </>
            )}
          </section>
        </>
      )}

      {developer.workHistory.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <section>
            <SectionEyebrow n={next()} label="Work Experience" />
            <h2 className="mb-5 text-xl font-semibold tracking-tight">
              {developer.workHistory.length}{" "}
              {developer.workHistory.length === 1 ? "role" : "roles"}
            </h2>
            <div className="relative">
              <div className="absolute bottom-[22px] left-[21px] top-[22px] w-px bg-border" />
              {developer.workHistory.map((item, i) => {
                const last = i === developer.workHistory.length - 1;
                return (
                  <div key={i} className="relative z-[1] flex gap-[18px] pb-6">
                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[13px] border border-border bg-card font-mono text-[13px] text-pulse">
                      {item.companyLogoUrl || item.companyDomain ? (
                        <Image
                          src={
                            item.companyLogoUrl ||
                            `https://www.google.com/s2/favicons?domain=${item.companyDomain}&sz=128`
                          }
                          alt={item.company}
                          width={44}
                          height={44}
                          unoptimized
                          className="size-11 object-contain p-1.5"
                        />
                      ) : (
                        getInitials(item.company)
                      )}
                    </div>
                    <div
                      className={`flex flex-1 flex-col gap-2 ${last ? "" : "border-b border-border pb-6"}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[15px] font-semibold">{item.role}</div>
                          <div className="mt-0.5 text-[14px] text-muted-foreground">{item.company}</div>
                        </div>
                        <div className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.05em] text-muted-foreground">
                          {item.duration}
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-[14px] leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {item.techUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.techUsed.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {developer.education.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <section>
            <SectionEyebrow n={next()} label="Education" />
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Education</h2>
            <div className="flex flex-col gap-4">
              {developer.education.map((edu, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-muted">
                    {edu.institutionLogoUrl ? (
                      <Image src={edu.institutionLogoUrl} alt={edu.institution} width={40} height={40} unoptimized className="size-10 object-contain p-1.5" />
                    ) : (
                      <GraduationCap className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </p>
                    <p className="text-[13px] text-muted-foreground">{edu.institution}</p>
                    <p className="text-[12px] text-muted-foreground">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {developer.awards.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <section>
            <SectionEyebrow n={next()} label="Awards" />
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Awards</h2>
            <div className="flex flex-col gap-4">
              {developer.awards.map((award, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-pulse/12">
                    <Award className="size-5 text-pulse" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold">{award.title}</p>
                    <p className="text-[12px] text-muted-foreground">{award.issuer}</p>
                    <p className="text-[12px] text-muted-foreground">{award.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {developer.achievements.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <section>
            <SectionEyebrow n={next()} label="Achievements" />
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Achievements</h2>
            <ul className="flex flex-col gap-3">
              {developer.achievements.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-pulse/12">
                    <Trophy className="size-3.5 text-pulse" />
                  </span>
                  <span className="text-[14px] text-muted-foreground">{a}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {developer.certifications && (
        <>
          <div className="h-px bg-border" />
          <section>
            <SectionEyebrow n={next()} label="Certifications" />
            <h2 className="mb-3.5 text-xl font-semibold tracking-tight">Certifications</h2>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              {developer.certifications}
            </p>
          </section>
        </>
      )}

      <div className="h-px bg-border" />
      <section>
        <DeveloperReviewSection
          developerId={developer.id}
          developerName={developer.name}
          companyId={companyProfile?.id}
          companyName={companyProfile?.companyName}
          companyLogoUrl={companyProfile?.logoUrl}
        />
      </section>
    </div>
  );
}

/* ─── Documents tab ─────────────────────────────────────────────── */

function DocumentsTab() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FileText className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">No documents available</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Documents for this candidate aren&apos;t available to view here.
      </p>
    </div>
  );
}

/* ─── Timesheets tab ────────────────────────────────────────────── */

const statusBadgeVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
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
    (acc[entry.period] ??= []).push(entry);
    return acc;
  }, {});
  const sortedPeriods = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const totalHours = entries.reduce((s, e) => s + e.hours, 0);
  const approvedHours = entries
    .filter((e) => e.status === "approved")
    .reduce((s, e) => s + e.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-6">
        {[
          ["Total hours", `${totalHours}h`],
          ["Approved", `${approvedHours}h`],
          ["Periods", String(sortedPeriods.length)],
        ].map(([k, v]) => (
          <div key={k}>
            <MonoLabel>{k}</MonoLabel>
            <p className="font-mono text-sm font-semibold">{v}</p>
          </div>
        ))}
      </div>
      {sortedPeriods.map((period) => {
        const periodEntries = grouped[period];
        const periodTotal = periodEntries.reduce((s, e) => s + e.hours, 0);
        return (
          <Card key={period}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{formatPeriod(period)}</p>
                  <p className="text-xs text-muted-foreground">
                    {periodEntries.length}{" "}
                    {periodEntries.length === 1 ? "entry" : "entries"}
                  </p>
                </div>
                <span className="font-mono text-sm text-muted-foreground">{periodTotal}h total</span>
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
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {entry.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{entry.hours}h</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[entry.status] ?? "outline"}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(entry.createdAt)}
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
