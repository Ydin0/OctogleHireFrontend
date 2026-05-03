"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

import { toast } from "sonner";
import { trackMetaEvent } from "@/lib/analytics/meta-events";
import { fetchWithRetry } from "@/lib/api/fetch-with-retry";
import {
  salesRepApplicationSchema,
  type SalesRepApplication,
} from "@/lib/schemas/sales-rep-application";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/marketing/navbar";
import { ApplySalesHero } from "./apply-sales-hero";
import { StepPersonal } from "@/app/apply/_components/step-personal";
import { StepWorkExperience } from "@/app/apply/_components/step-work-experience";
import { StepLinks } from "@/app/apply/_components/step-links";
import { StepPreferences } from "@/app/apply/_components/step-preferences";
import { StepVideoIntro } from "@/app/apply/_components/step-video-intro";
import { StepSalesProfessional } from "./step-sales-professional";
import { StepSalesTools } from "./step-sales-tools";
import { StepSalesReview } from "./step-sales-review";

const STEPS = [
  { label: "About" },
  { label: "Experience" },
  { label: "Tools" },
  { label: "Links" },
  { label: "Preferences" },
  { label: "Video" },
  { label: "Review" },
];

const stepFields: Record<number, (keyof SalesRepApplication)[]> = {
  0: [
    "fullName",
    "email",
    "phone",
    "locationCity",
    "locationState",
    "salesRoleTitle",
    "yearsOfExperience",
    "bio",
    "salaryCurrency",
    "salaryAmount",
    "profilePhoto",
  ],
  1: ["workExperience"],
  2: ["salesTools", "salesMethodologies", "industriesSold", "certifications"],
  3: ["linkedinUrl", "githubUrl", "portfolioUrl", "resumeFile"],
  4: ["engagementType", "availability", "englishProficiency"],
  5: ["introVideo"],
};

const stepMeta = [
  {
    title: "About You",
    description: "Tell us about yourself and your sales background.",
  },
  {
    title: "Work Experience",
    description: "Add your relevant sales roles.",
  },
  {
    title: "Sales Tools & Methodology",
    description:
      "Pick the CRMs, prospecting tools, and methodologies you've used.",
  },
  {
    title: "Links & Uploads",
    description: "Share your LinkedIn and upload your resume.",
  },
  {
    title: "Preferences",
    description: "Let us know how and when you'd like to work.",
  },
  {
    title: "Video Introduction",
    description:
      "Record a short pitch — your name, your strongest segment, and a deal you're proud of.",
  },
  {
    title: "Review & Submit",
    description: "Double-check everything before submitting.",
  },
];

const LAST_STEP = STEPS.length - 1;

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const APPLICATION_DRAFT_STORAGE_KEY = "sales_rep_application_draft_id";
const REFERRAL_CODE_STORAGE_KEY = "agency_referral_code";

const buildApplicationFormData = (
  values: SalesRepApplication,
  params: {
    applicationId: string | null;
    step?: number;
    includeFiles: boolean;
    includeVideo?: boolean;
  }
) => {
  const formData = new FormData();

  if (params.applicationId) {
    formData.append("applicationId", params.applicationId);
  }
  if (typeof params.step === "number") {
    formData.append("step", String(params.step));
  }

  formData.append("fullName", values.fullName);
  formData.append("email", values.email);
  formData.append("phone", values.phone);
  formData.append("locationCity", values.locationCity);
  formData.append("locationState", values.locationState);
  formData.append("salesRoleTitle", values.salesRoleTitle);

  if (typeof values.yearsOfExperience === "number") {
    formData.append("yearsOfExperience", String(values.yearsOfExperience));
  }

  formData.append("bio", values.bio);
  formData.append("salaryCurrency", values.salaryCurrency);

  if (typeof values.salaryAmount === "number") {
    formData.append("salaryAmount", String(values.salaryAmount));
  }

  formData.append(
    "workExperience",
    JSON.stringify(values.workExperience ?? [])
  );
  formData.append("salesTools", JSON.stringify(values.salesTools ?? []));
  formData.append(
    "salesMethodologies",
    JSON.stringify(values.salesMethodologies ?? [])
  );
  formData.append(
    "industriesSold",
    JSON.stringify(values.industriesSold ?? [])
  );
  formData.append("certifications", values.certifications ?? "");
  formData.append("linkedinUrl", values.linkedinUrl ?? "");
  formData.append("githubUrl", values.githubUrl ?? "");
  formData.append("portfolioUrl", values.portfolioUrl ?? "");
  formData.append("engagementType", JSON.stringify(values.engagementType));

  if (values.availability) {
    formData.append("availability", values.availability);
  }
  if (values.englishProficiency) {
    formData.append("englishProficiency", values.englishProficiency);
  }

  if (values.profilePhoto) {
    formData.append("profilePhoto", values.profilePhoto);
  }
  if (params.includeFiles && values.resumeFile) {
    formData.append("resumeFile", values.resumeFile);
  }
  if ((params.includeVideo ?? params.includeFiles) && values.introVideo) {
    formData.append("introVideo", values.introVideo);
  }

  const storedReferralCode =
    typeof window !== "undefined"
      ? window.localStorage.getItem(REFERRAL_CODE_STORAGE_KEY)
      : null;
  if (storedReferralCode) {
    formData.append("referralCode", storedReferralCode);
  }

  return formData;
};

const humanizeNetworkError = (error: unknown): string => {
  if (!(error instanceof Error)) return String(error);
  const msg = error.message;
  if (
    msg === "Failed to fetch" ||
    msg === "NetworkError when attempting to fetch resource." ||
    msg === "Load failed"
  ) {
    return "Network error — please check your internet connection and try again.";
  }
  if (msg === "Request failed after retries") {
    return "Our servers are temporarily unavailable. Please wait a moment and try again.";
  }
  return msg;
};

const readErrorMessage = async (response: Response): Promise<string> => {
  const payload = (await response.json().catch(() => null)) as
    | { message?: string; issues?: unknown[] }
    | null;

  if (!payload) {
    return "Unable to process your application right now. Please try again.";
  }

  if (
    payload.issues &&
    Array.isArray(payload.issues) &&
    payload.issues.length > 0
  ) {
    const fieldNames = payload.issues
      .map((issue) => {
        if (typeof issue === "string") return issue;
        if (typeof issue === "object" && issue !== null && "path" in issue) {
          const p = (issue as { path?: unknown[] }).path;
          return Array.isArray(p) ? p.join(".") : String(p);
        }
        return null;
      })
      .filter(Boolean);

    if (fieldNames.length > 0) {
      return `${payload.message ?? "Validation failed"} Missing or invalid: ${fieldNames.join(", ")}`;
    }
  }

  return (
    payload.message ??
    "Unable to process your application right now. Please try again."
  );
};

interface ApplySalesFormProps {
  referralCode?: string;
}

const ApplySalesForm = ({ referralCode }: ApplySalesFormProps = {}) => {
  const router = useRouter();
  const skipToForm =
    typeof window !== "undefined" && window.location.hash === "#apply-form";
  const [heroPhase, setHeroPhase] = useState(!skipToForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const draftId = window.localStorage.getItem(APPLICATION_DRAFT_STORAGE_KEY);
    if (draftId) {
      setApplicationId(draftId);
    }
    if (referralCode) {
      window.localStorage.setItem(REFERRAL_CODE_STORAGE_KEY, referralCode);
    }
  }, [referralCode]);

  const methods = useForm<SalesRepApplication>({
    resolver: standardSchemaResolver(salesRepApplicationSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      locationCity: "",
      locationState: "",
      salesRoleTitle: "",
      yearsOfExperience: undefined as unknown as number,
      bio: "",
      salaryCurrency: "",
      salaryAmount: undefined as unknown as number,
      workExperience: [],
      salesTools: [],
      salesMethodologies: [],
      industriesSold: [],
      certifications: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      resumeFile: undefined as unknown as File,
      profilePhoto: undefined as unknown as File,
      introVideo: undefined as unknown as File,
      engagementType: [],
      availability: undefined as unknown as SalesRepApplication["availability"],
      englishProficiency:
        undefined as unknown as SalesRepApplication["englishProficiency"],
    },
  });

  const applicationIdRef = { current: applicationId };
  applicationIdRef.current = applicationId;

  const persistDraft = async (step: number): Promise<string | null> => {
    const values = methods.getValues();
    const includeFiles = step >= 3; // links onwards
    const includeVideo = step === 5 || step === LAST_STEP;
    const formData = buildApplicationFormData(values, {
      applicationId: applicationIdRef.current,
      step,
      includeFiles,
      includeVideo,
    });

    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/public/sales-rep-applications/draft`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const payload = (await response.json()) as { applicationId?: string };
    if (
      payload.applicationId &&
      payload.applicationId !== applicationIdRef.current
    ) {
      applicationIdRef.current = payload.applicationId;
      setApplicationId(payload.applicationId);
      window.localStorage.setItem(
        APPLICATION_DRAFT_STORAGE_KEY,
        payload.applicationId
      );
    }

    return applicationIdRef.current;
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleNext = async () => {
    if (currentStep >= LAST_STEP) return;

    const fields = stepFields[currentStep];
    const valid = fields ? await methods.trigger(fields) : true;

    if (!valid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await persistDraft(currentStep);
      toast.success("Progress saved");
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      const message = humanizeNetworkError(error);
      toast.error(message);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = methods.handleSubmit(async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!values.profilePhoto) {
        throw new Error("Please upload your profile photo.");
      }
      const hasLinkedIn =
        values.linkedinUrl && values.linkedinUrl.includes("linkedin.com");
      if (!values.resumeFile && !hasLinkedIn) {
        throw new Error("Please upload your CV or provide your LinkedIn URL.");
      }
      if (!values.introVideo) {
        throw new Error("Please record your video introduction.");
      }

      const resolvedId = await persistDraft(currentStep);

      const formData = buildApplicationFormData(values, {
        applicationId: resolvedId,
        step: LAST_STEP,
        includeFiles: true,
        includeVideo: true,
      });

      const response = await fetchWithRetry(
        `${apiBaseUrl}/api/public/sales-rep-applications`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      trackMetaEvent("CompleteRegistration", {
        content_name: "Sales Rep Application",
        content_category: "sales_rep",
      });

      toast.success("Application submitted successfully");

      window.localStorage.removeItem(APPLICATION_DRAFT_STORAGE_KEY);
      window.localStorage.removeItem(REFERRAL_CODE_STORAGE_KEY);

      router.push(
        `/apply/status?applicationId=${resolvedId}&type=sales`
      );
    } catch (error) {
      const message = humanizeNetworkError(error);
      toast.error(message);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  if (heroPhase) {
    return <ApplySalesHero onStart={() => setHeroPhase(false)} />;
  }

  const isLastStep = currentStep === LAST_STEP;
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <>
      <Navbar />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit}
          className="flex min-h-[calc(100dvh-4rem)] flex-col"
        >
          {/* Step header */}
          <div className="border-b border-border">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between py-5">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Step {currentStep + 1} of {STEPS.length}
                  </span>
                  <h2 className="mt-1 text-lg font-semibold">
                    {stepMeta[currentStep].title}
                  </h2>
                </div>

                <nav className="hidden items-center gap-3 sm:flex">
                  {STEPS.map((step, i) => (
                    <button
                      key={step.label}
                      type="button"
                      disabled={i > currentStep}
                      onClick={() => i <= currentStep && goToStep(i)}
                      className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        i === currentStep
                          ? "text-foreground"
                          : i < currentStep
                            ? "cursor-pointer text-muted-foreground hover:text-foreground"
                            : "text-muted-foreground/30"
                      }`}
                    >
                      {step.label}
                    </button>
                  ))}
                </nav>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:hidden">
                  {currentStep + 1}/{STEPS.length}
                </span>
              </div>
            </div>

            <div className="h-0.5 bg-muted">
              <div
                className="h-0.5 bg-pulse transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Form content */}
          <div className="flex-1">
            <div className="container mx-auto px-6 py-12">
              <div className="mx-auto max-w-2xl">
                <p className="mb-8 text-sm text-muted-foreground">
                  {stepMeta[currentStep].description}
                </p>

                {currentStep === 0 && (
                  <div className="space-y-4">
                    <StepPersonal />
                    <StepSalesProfessional />
                  </div>
                )}
                {currentStep === 1 && <StepWorkExperience />}
                {currentStep === 2 && <StepSalesTools />}
                {currentStep === 3 && <StepLinks />}
                {currentStep === 4 && <StepPreferences />}
                {currentStep === 5 && <StepVideoIntro />}
                {currentStep === 6 && (
                  <StepSalesReview onEditStep={goToStep} />
                )}
              </div>
            </div>
          </div>

          {/* Sticky bottom navigation */}
          <div className="sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
                className="gap-2 rounded-full"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>

              <div className="min-h-5 flex-1 px-4 text-center">
                {submitError ? (
                  <p className="text-sm text-destructive">{submitError}</p>
                ) : null}
              </div>

              {isLastStep ? (
                <Button
                  type="submit"
                  className="gap-2 rounded-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                  <Send className="size-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="gap-2 rounded-full"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export { ApplySalesForm };
