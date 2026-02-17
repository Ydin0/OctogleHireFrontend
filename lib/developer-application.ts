export type ApplicationTimelineState = "completed" | "active" | "upcoming";

export interface ApplicationTimelineItem {
  label: string;
  state: ApplicationTimelineState;
}

export interface DeveloperApplicationStatusResponse {
  applicationId: string;
  status: string;
  approved: boolean;
  submittedAt: string | null;
  lastCompletedStep: number;
  timeline: ApplicationTimelineItem[];
}

export const APPLICATION_PIPELINE_LABELS = [
  "HR Communication Round",
  "AI Technical Examination",
  "Tech Lead Human Interview",
  "Background & Previous Company Checks",
  "Approved",
] as const;

export const buildDefaultTimeline = (): ApplicationTimelineItem[] =>
  APPLICATION_PIPELINE_LABELS.map((label, index) => ({
    label,
    state: index === 0 ? "active" : "upcoming",
  }));

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const fetchDeveloperApplicationStatus = async (
  authToken: string | null
): Promise<DeveloperApplicationStatusResponse | null> => {
  if (!authToken) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/developers/application-status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as DeveloperApplicationStatusResponse;

    if (!payload || typeof payload !== "object") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};
