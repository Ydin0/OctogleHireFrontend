"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowLeft, ArrowRight, Globe, Send, X } from "lucide-react";

import { applicationSchema, type Application } from "@/lib/schemas/application";
import type { LinkedInFormValues, ApifyProfile } from "@/lib/linkedin";
import { Button } from "@/components/ui/button";
import { LinkedInImport } from "./linkedin-import";
import { StepPersonal } from "./step-personal";
import { StepProfessional } from "./step-professional";
import { StepWorkExperience } from "./step-work-experience";
import { StepEducation } from "./step-education";
import { StepTechStack } from "./step-tech-stack";
import { StepLinks } from "./step-links";
import { StepPreferences } from "./step-preferences";
import { StepReview } from "./step-review";

const STEPS = [
  { label: "About" },
  { label: "Experience" },
  { label: "Education" },
  { label: "Skills" },
  { label: "Links" },
  { label: "Preferences" },
  { label: "Review" },
];

const stepFields: Record<number, (keyof Application)[]> = {
  0: [
    "fullName",
    "email",
    "phone",
    "locationCity",
    "locationState",
    "professionalTitle",
    "yearsOfExperience",
    "bio",
  ],
  1: ["workExperience"],
  2: ["education"],
  3: ["primaryStack", "secondarySkills", "certifications"],
  4: [
    "linkedinUrl",
    "githubUrl",
    "portfolioUrl",
    "resumeFile",
    "profilePhoto",
  ],
  5: ["engagementType", "availability", "englishProficiency"],
};

const stepMeta = [
  {
    title: "About You",
    description: "Tell us about yourself and your professional background.",
  },
  {
    title: "Work Experience",
    description: "Add your relevant work experience.",
  },
  {
    title: "Education",
    description: "Add your educational background.",
  },
  {
    title: "Tech Stack & Skills",
    description: "Select your primary technologies and additional skills.",
  },
  {
    title: "Links & Uploads",
    description: "Share your profiles and upload your resume.",
  },
  {
    title: "Preferences",
    description: "Let us know how and when you'd like to work.",
  },
  {
    title: "Review & Submit",
    description: "Double-check everything before submitting.",
  },
];

const LAST_STEP = STEPS.length - 1;

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const APPLICATION_DRAFT_STORAGE_KEY = "developer_application_draft_id";

const buildApplicationFormData = (
  values: Application,
  params: {
    applicationId: string | null;
    step?: number;
    includeFiles: boolean;
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
  formData.append("professionalTitle", values.professionalTitle);

  if (typeof values.yearsOfExperience === "number") {
    formData.append("yearsOfExperience", String(values.yearsOfExperience));
  }

  formData.append("bio", values.bio);
  formData.append("workExperience", JSON.stringify(values.workExperience ?? []));
  formData.append("education", JSON.stringify(values.education ?? []));
  formData.append("primaryStack", JSON.stringify(values.primaryStack));
  formData.append("secondarySkills", values.secondarySkills ?? "");
  formData.append("certifications", values.certifications ?? "");
  formData.append("linkedinUrl", values.linkedinUrl);
  formData.append("githubUrl", values.githubUrl);
  formData.append("portfolioUrl", values.portfolioUrl ?? "");
  formData.append("engagementType", JSON.stringify(values.engagementType));

  if (values.availability) {
    formData.append("availability", values.availability);
  }

  if (values.englishProficiency) {
    formData.append("englishProficiency", values.englishProficiency);
  }

  if (params.includeFiles) {
    if (values.resumeFile) {
      formData.append("resumeFile", values.resumeFile);
    }

    if (values.profilePhoto) {
      formData.append("profilePhoto", values.profilePhoto);
    }
  }

  return formData;
};

const readErrorMessage = async (response: Response): Promise<string> => {
  const payload = (await response.json().catch(() => null)) as
    | { message?: string; issues?: unknown[] }
    | null;

  if (!payload) {
    return "Unable to process your application right now. Please try again.";
  }

  // Surface specific validation issues if available
  if (payload.issues && Array.isArray(payload.issues) && payload.issues.length > 0) {
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

const ApplyForm = () => {
  const router = useRouter();
  const [importPhase, setImportPhase] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const draftId = window.localStorage.getItem(APPLICATION_DRAFT_STORAGE_KEY);
    if (draftId) {
      setApplicationId(draftId);
    }
  }, []);

  const methods = useForm<Application>({
    resolver: standardSchemaResolver(applicationSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      locationCity: "",
      locationState: "",
      professionalTitle: "",
      yearsOfExperience: undefined as unknown as number,
      bio: "",
      workExperience: [],
      education: [],
      primaryStack: [],
      secondarySkills: "",
      certifications: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      resumeFile: undefined as unknown as File,
      profilePhoto: undefined as unknown as File,
      engagementType: [],
      availability: undefined as unknown as Application["availability"],
      englishProficiency: undefined as unknown as Application["englishProficiency"],
    },
  });

  const handleLinkedInImport = async (
    values: LinkedInFormValues,
    profile: ApifyProfile,
  ) => {
    const current = methods.getValues();
    const merged: Record<string, unknown> = { ...current };
    for (const [key, val] of Object.entries(values)) {
      if (val !== undefined && val !== null && val !== "") {
        merged[key] = val;
      }
    }

    // Auto-import profile photo from R2 if backend provided a URL
    const photoUrl =
      (profile._profilePhotoR2Url as string | undefined) ??
      (profile.profilePicture as string | undefined);
    if (photoUrl && typeof photoUrl === "string" && photoUrl.startsWith("http")) {
      try {
        const response = await fetch(photoUrl);
        if (response.ok) {
          const blob = await response.blob();
          const extension = blob.type === "image/png" ? ".png" : ".jpg";
          const file = new File([blob], `linkedin-photo${extension}`, {
            type: blob.type || "image/jpeg",
          });
          if (file.size <= 2 * 1024 * 1024) {
            merged.profilePhoto = file;
          }
        }
      } catch {
        // Silently skip — user can upload manually
      }
    }

    methods.reset(merged as Application, { keepDefaultValues: false });
    setImportPhase(false);
  };

  const handleSkipImport = () => {
    setImportPhase(false);
  };

  const applicationIdRef = { current: applicationId };
  applicationIdRef.current = applicationId;

  const persistDraft = async (step: number): Promise<string | null> => {
    const values = methods.getValues();
    const includeFiles = step >= 4;
    const formData = buildApplicationFormData(values, {
      applicationId: applicationIdRef.current,
      step,
      includeFiles,
    });

    const response = await fetch(
      `${apiBaseUrl}/api/public/developer-applications/draft`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const payload = (await response.json()) as { applicationId?: string };
    if (payload.applicationId && payload.applicationId !== applicationIdRef.current) {
      applicationIdRef.current = payload.applicationId;
      setApplicationId(payload.applicationId);
      window.localStorage.setItem(
        APPLICATION_DRAFT_STORAGE_KEY,
        payload.applicationId,
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
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save this step right now. Please try again.";
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
      if (!values.resumeFile || !values.profilePhoto) {
        throw new Error("Please upload your resume and profile photo.");
      }

      const resolvedId = await persistDraft(currentStep);

      const formData = buildApplicationFormData(values, {
        applicationId: resolvedId,
        step: LAST_STEP,
        includeFiles: true,
      });

      const response = await fetch(`${apiBaseUrl}/api/public/developer-applications`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      window.localStorage.removeItem(APPLICATION_DRAFT_STORAGE_KEY);

      router.push(`/apply/verify?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit your application right now. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  // Show LinkedIn import phase
  if (importPhase) {
    return (
      <LinkedInImport
        onImport={handleLinkedInImport}
        onSkip={handleSkipImport}
      />
    );
  }

  const isLastStep = currentStep === LAST_STEP;
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex h-dvh flex-col">
        {/* Top bar */}
        <header className="shrink-0 border-b">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Globe className="size-6" />
              <span className="text-lg font-semibold tracking-tighter">
                OctogleHire
              </span>
            </Link>

            <div className="flex items-center gap-5">
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
                Step {currentStep + 1}/{STEPS.length}
              </span>

              <Link
                href="/"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </Link>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-0.5 bg-muted">
            <div
              className="h-0.5 bg-pulse transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-6 py-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {stepMeta[currentStep].title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {stepMeta[currentStep].description}
              </p>
            </div>

            {currentStep === 0 && (
              <div className="space-y-4">
                <StepPersonal />
                <StepProfessional />
              </div>
            )}
            {currentStep === 1 && <StepWorkExperience />}
            {currentStep === 2 && <StepEducation />}
            {currentStep === 3 && <StepTechStack />}
            {currentStep === 4 && <StepLinks />}
            {currentStep === 5 && <StepPreferences />}
            {currentStep === 6 && <StepReview onEditStep={goToStep} />}
          </div>
        </div>

        {/* Pinned bottom navigation */}
        <div className="shrink-0 border-t bg-background">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className="gap-2"
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
              <Button type="submit" className="gap-2" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
                <Send className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="gap-2"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export { ApplyForm };
