"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

import {
  companyEnquirySchema,
  type CompanyEnquiry,
} from "@/lib/schemas/company-enquiry";
import { StepIndicator } from "@/components/shared/step-indicator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepCompanyInfo } from "./step-company-info";
import { StepNeeds } from "./step-needs";
import { StepPreferences } from "./step-preferences";
import { StepReview } from "./step-review";

const STEPS = [
  { label: "Company" },
  { label: "Needs" },
  { label: "Preferences" },
  { label: "Review" },
];

const stepFields: Record<number, (keyof CompanyEnquiry)[]> = {
  0: ["companyName", "contactName", "businessEmail", "phone", "companyWebsite"],
  1: ["projectDescription"],
  2: ["preferredEngagementType", "estimatedStartDate", "heardAbout"],
};

const stepMeta = [
  {
    title: "Company Information",
    description: "Share your business contact details so our team can reach you.",
  },
  {
    title: "Project Needs",
    description: "Tell us what role or project support you need.",
  },
  {
    title: "Hiring Preferences",
    description: "Set your preferred engagement model and timeline.",
  },
  {
    title: "Review & Submit",
    description: "Confirm your enquiry details before submitting.",
  },
];

const CompanySignupForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<CompanyEnquiry>({
    resolver: zodResolver(companyEnquirySchema),
    mode: "onTouched",
    defaultValues: {
      companyName: "",
      contactName: "",
      businessEmail: "",
      phone: "",
      companyWebsite: "",
      projectDescription: "",
      preferredEngagementType: undefined as unknown as CompanyEnquiry["preferredEngagementType"],
      estimatedStartDate: "",
      heardAbout: undefined as unknown as CompanyEnquiry["heardAbout"],
    },
  });

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleNext = async () => {
    if (currentStep >= STEPS.length - 1) return;

    const fields = stepFields[currentStep];
    const valid = await methods.trigger(fields);

    if (!valid) return;

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = methods.handleSubmit(() => {
    router.push("/companies/signup/status");
  });

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <div className="mx-auto mt-10 max-w-2xl">
          <StepIndicator steps={STEPS} currentStep={currentStep} />

          <Card className="mt-8 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">{stepMeta[currentStep].title}</h2>
              <p className="text-sm text-muted-foreground">
                {stepMeta[currentStep].description}
              </p>
            </div>

            {currentStep === 0 && <StepCompanyInfo />}
            {currentStep === 1 && <StepNeeds />}
            {currentStep === 2 && <StepPreferences />}
            {currentStep === 3 && <StepReview onEditStep={goToStep} />}

            <div className="mt-8 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>

              {isLastStep ? (
                <Button type="submit" className="gap-2">
                  Submit Enquiry
                  <Send className="size-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
};

export { CompanySignupForm };
