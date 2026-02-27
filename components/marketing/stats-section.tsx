import { cn } from "@/lib/utils";

interface StatsSectionProps {
  className?: string;
}

const stats = [
  { value: "1,000+", label: "Vetted Developers" },
  { value: "150+", label: "Countries" },
  { value: "500+", label: "Companies Served" },
  { value: "48hrs", label: "Average Time to Hire" },
];

const StatsSection = ({ className }: StatsSectionProps) => {
  return (
    <section className={cn("bg-muted/50 py-20", className)}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span className="text-pulse text-4xl font-semibold tracking-tight lg:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { StatsSection };
