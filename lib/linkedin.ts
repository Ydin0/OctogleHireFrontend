import { MARKETPLACE_TECH_STACK_OPTIONS } from "@/lib/data/developers";
import type {
  Application,
  WorkExperience,
  Education,
} from "@/lib/schemas/application";

/* ------------------------------------------------------------------ */
/*  Apify response types (actor 2SyF0bVxmgGr8IVCZ)                   */
/* ------------------------------------------------------------------ */

export interface ApifyExperience {
  companyName?: string;
  title?: string;
  jobStartedOn?: string;
  jobEndedOn?: string;
  description?: string;
  location?: string;
  jobStillWorking?: boolean;
}

export interface ApifyEducation {
  title?: string;
  subtitle?: string;
  grade?: string;
  period?: {
    startedOn?: { year?: number };
    endedOn?: { year?: number };
  };
}

export interface ApifySkill {
  title?: string;
}

export interface ApifyProfile {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  headline?: string;
  about?: string;
  addressWithoutCountry?: string;
  addressCountryOnly?: string;
  experiences?: ApifyExperience[];
  educations?: ApifyEducation[];
  skills?: ApifySkill[];
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/*  Client-side fetch (calls Express backend)                         */
/* ------------------------------------------------------------------ */

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function fetchLinkedInProfile(
  linkedinUrl: string,
): Promise<ApifyProfile> {
  const response = await fetch(`${apiBaseUrl}/api/public/linkedin/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ linkedinUrl }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(payload?.message ?? "Failed to fetch LinkedIn profile");
  }

  const data: unknown = await response.json();

  return data as ApifyProfile;
}

/* ------------------------------------------------------------------ */
/*  Mapping: Apify profile → form field values                        */
/* ------------------------------------------------------------------ */

const normalizedTechOptions = MARKETPLACE_TECH_STACK_OPTIONS.map((t) => ({
  original: t,
  lower: t.toLowerCase(),
}));

const matchSkillsToStack = (skills: ApifySkill[]): string[] => {
  const matched: string[] = [];

  for (const skill of skills) {
    const lower = (skill.title ?? "").toLowerCase().trim();
    if (!lower) continue;
    const found =
      normalizedTechOptions.find((t) => t.lower === lower) ??
      normalizedTechOptions.find(
        (t) => lower.includes(t.lower) || t.lower.includes(lower),
      );
    if (found && !matched.includes(found.original)) {
      matched.push(found.original);
    }
    if (matched.length >= 8) break;
  }

  return matched;
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Convert Apify date format "9-2023" → "Sep 2023" */
const formatApifyDate = (raw: string | undefined): string => {
  if (!raw) return "";
  const parts = raw.split("-");
  if (parts.length === 2) {
    const monthIndex = parseInt(parts[0], 10) - 1;
    const year = parts[1];
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${MONTH_NAMES[monthIndex]} ${year}`;
    }
  }
  return raw;
};

const mapExperience = (exp: ApifyExperience[]): WorkExperience[] =>
  exp
    .filter((e) => e.companyName || e.title)
    .map((e) => ({
      company: e.companyName || "",
      title: e.title || "",
      startDate: formatApifyDate(e.jobStartedOn),
      endDate: e.jobStillWorking ? "" : formatApifyDate(e.jobEndedOn),
      description: e.description || "",
      current: e.jobStillWorking ?? (!e.jobEndedOn),
    }));

const mapEducation = (edu: ApifyEducation[]): Education[] =>
  edu
    .filter((e) => e.title || e.subtitle)
    .map((e) => ({
      institution: e.title || "",
      degree: e.subtitle || "",
      grade: e.grade || "",
      startYear: e.period?.startedOn?.year?.toString() ?? "",
      endYear: e.period?.endedOn?.year?.toString() ?? "",
    }));

export type LinkedInFormValues = Partial<Application>;

export function mapProfileToFormValues(
  profile: ApifyProfile,
  linkedinUrl: string,
): LinkedInFormValues {
  const fullName =
    profile.fullName ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  return {
    fullName: fullName || undefined,
    bio: profile.about ? profile.about.slice(0, 500) : undefined,
    professionalTitle: profile.headline || undefined,
    locationCity: profile.addressWithoutCountry || undefined,
    locationState: profile.addressCountryOnly || undefined,
    linkedinUrl,
    workExperience: profile.experiences?.length
      ? mapExperience(profile.experiences)
      : [],
    education: profile.educations?.length
      ? mapEducation(profile.educations)
      : [],
    primaryStack: profile.skills?.length
      ? matchSkillsToStack(profile.skills)
      : undefined,
    secondarySkills: profile.skills?.length
      ? profile.skills
          .map((s) => s.title ?? "")
          .filter(Boolean)
          .join(", ")
      : undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Session storage helpers                                           */
/* ------------------------------------------------------------------ */

const SESSION_KEY = "linkedin_profile_data";

export function cacheLinkedInData(data: LinkedInFormValues) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or unavailable — silently skip
  }
}

export function getCachedLinkedInData(): LinkedInFormValues | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as LinkedInFormValues) : null;
  } catch {
    return null;
  }
}

export function clearCachedLinkedInData() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}
