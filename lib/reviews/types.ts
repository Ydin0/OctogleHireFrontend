export type ReviewTag =
  | "communication"
  | "technical_skill"
  | "reliability"
  | "problem_solving"
  | "collaboration"
  | "delivery_speed";

export const reviewTagLabels: Record<ReviewTag, string> = {
  communication: "Communication",
  technical_skill: "Technical Skill",
  reliability: "Reliability",
  problem_solving: "Problem Solving",
  collaboration: "Collaboration",
  delivery_speed: "Delivery Speed",
};

export interface DeveloperReview {
  id: string;
  developerId: string;
  engagementId?: string;
  companyId?: string;
  companyName?: string;
  companyLogoUrl?: string | null;
  rating: number;
  tags: ReviewTag[];
  text: string;
  createdAt: string;
}
