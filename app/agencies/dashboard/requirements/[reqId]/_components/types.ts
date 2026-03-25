import type { PricingType } from "@/lib/api/agencies";

export interface PoolCandidate {
  id: string;
  fullName: string | null;
  email: string;
  professionalTitle: string | null;
  locationCity: string | null;
  locationState: string | null;
  yearsOfExperience: number | null;
  primaryStack: string[] | null;
  status: string;
  availability: string | null;
  engagementType: string[] | null;
  hourlyRate: number | null;
  monthlyRate: number | null;
  hourlyRateCents: number | null;
  monthlyRateCents: number | null;
  salaryCurrency: string | null;
  profilePhotoPath: string | null;
  bio: string | null;
  location: string;
  pricingType?: PricingType | null;
  pricingAmount?: number | null;
  pricingCurrency?: string | null;
}

export interface PitchPayload {
  developerId: string;
  hourlyRate: number;
  monthlyRate: number;
  currency: string;
  commissionRate: number;
  workingDaysPerMonth: number;
  hoursPerDay: number;
  coverNote?: string;
}
