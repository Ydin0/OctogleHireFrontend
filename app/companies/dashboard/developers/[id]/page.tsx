import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Clock,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Languages,
  Linkedin,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";

import {
  fetchCompanyDeveloperProfile,
  type CompanyDeveloperProfile,
} from "@/lib/api/companies";
import { TECH_ICONS } from "@/lib/tech-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  const developer = await fetchCompanyDeveloperProfile(token, id);

  if (!developer) return notFound();

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/companies/dashboard/requirements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to requirements
      </Link>

      {/* Hero section */}
      <HeroSection developer={developer} />

      {/* Key details grid */}
      <KeyDetailsGrid developer={developer} />

      {/* About */}
      {developer.about && (
        <Card>
          <CardHeader>
            <CardTitle>About {developer.name.split(" ")[0]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-w-3xl leading-relaxed text-muted-foreground">
              {developer.about}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      <SkillsSection developer={developer} />

      {/* Work History */}
      {developer.workHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Work History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-sm font-semibold">
                      {item.role}{" "}
                      <span className="font-normal text-muted-foreground">
                        at {item.company}
                      </span>
                    </h3>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.duration}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
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
                    <Separator className="mt-4" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education & Awards */}
      {(developer.education.length > 0 || developer.awards.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Education & Awards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {developer.education.map((edu, i) => (
                <div key={i} className="flex gap-3 rounded-lg border border-border/70 p-4">
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
              {developer.awards.map((award, i) => (
                <div key={i} className="flex gap-3 rounded-lg border border-border/70 p-4">
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
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      {developer.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {developer.certifications && (
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {developer.certifications}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function HeroSection({ developer }: { developer: CompanyDeveloperProfile }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <Avatar className="size-24 border-4 border-border shadow-lg">
              <AvatarImage src={developer.avatar} alt={developer.name} className="object-cover" />
              <AvatarFallback className="text-2xl font-semibold">
                {getInitials(developer.name)}
              </AvatarFallback>
            </Avatar>
            {developer.isOnline && (
              <span className="absolute bottom-1 right-1 size-4 rounded-full border-[3px] border-background bg-emerald-500" />
            )}
          </div>

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <h1 className="text-2xl font-semibold">{developer.name}</h1>
              <p className="text-sm text-muted-foreground">{developer.role}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground sm:justify-start">
              {developer.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {developer.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {developer.yearsOfExperience} years exp.
              </span>
              {developer.projects > 0 && (
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3.5" />
                  {developer.projects} projects
                </span>
              )}
              {developer.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {developer.rating.toFixed(1)}
                </span>
              )}
            </div>

            {/* Rates */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge variant="secondary" className="font-mono text-xs">
                ${developer.hourlyRate}/hr
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                ${developer.monthlyRate.toLocaleString()}/mo
              </Badge>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {developer.linkedinUrl && (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <a href={developer.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="size-3.5" />
                    LinkedIn
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              )}
              {developer.githubUrl && (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <a href={developer.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="size-3.5" />
                    GitHub
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              )}
              {developer.portfolioUrl && (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <a href={developer.portfolioUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="size-3.5" />
                    Portfolio
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KeyDetailsGrid({ developer }: { developer: CompanyDeveloperProfile }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            English
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <Languages className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">
              {developer.englishProficiency
                ? ENGLISH_LABELS[developer.englishProficiency] ?? developer.englishProficiency
                : "Not specified"}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Availability
          </p>
          <p className="mt-1 text-sm font-medium capitalize">
            {developer.availability?.replace(/_/g, " ") ?? "Not specified"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Engagement
          </p>
          <p className="mt-1 text-sm font-medium capitalize">
            {developer.engagementType.length > 0
              ? developer.engagementType.join(", ")
              : "Not specified"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Experience
          </p>
          <p className="mt-1 text-sm font-medium">
            {developer.yearsOfExperience} years
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SkillsSection({ developer }: { developer: CompanyDeveloperProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tech Stack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <>
            <Separator />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Secondary Skills
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {developer.secondarySkills}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
