import { cn } from "@/lib/utils";

interface SlideShellProps {
  eyebrow?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}

export const SlideShell = ({
  eyebrow,
  className,
  innerClassName,
  children,
}: SlideShellProps) => {
  return (
    <div
      className={cn(
        "relative flex min-h-[100dvh] flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-1 items-center justify-center px-6 pb-28 pt-12 md:px-14 md:pb-32 md:pt-20 lg:px-24",
          innerClassName,
        )}
      >
        <div className="w-full max-w-7xl">
          {eyebrow && (
            <div className="mb-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-8 bg-border" />
              {eyebrow}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
