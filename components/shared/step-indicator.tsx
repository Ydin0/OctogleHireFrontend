import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  isCurrent &&
                    "border-pulse bg-background text-pulse",
                  !isCompleted &&
                    !isCurrent &&
                    "border-muted-foreground/30 bg-background text-muted-foreground/50",
                )}
              >
                {isCompleted ? (
                  <Check className="size-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isCurrent && "text-foreground",
                  isCompleted && "text-foreground",
                  !isCompleted && !isCurrent && "text-muted-foreground/50",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 rounded-full transition-colors",
                  index < currentStep
                    ? "bg-primary"
                    : "bg-muted-foreground/20",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export { StepIndicator };
