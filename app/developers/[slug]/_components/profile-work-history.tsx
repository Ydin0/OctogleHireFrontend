"use client";

import { Briefcase } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TECH_ICONS } from "@/lib/tech-icons";
import type { Developer } from "@/lib/data/developers";

interface ProfileWorkHistoryProps {
  developer: Developer;
}

const ProfileWorkHistory = ({ developer }: ProfileWorkHistoryProps) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">
        Work History
      </h2>
      <div className="mt-4 space-y-4">
        {developer.workHistory.map((item) => (
          <Card key={`${item.company}-${item.role}`}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Company logo */}
                <div className="hidden shrink-0 sm:block">
                  {item.companyLogoUrl ? (
                    <img
                      src={item.companyLogoUrl}
                      alt={item.company}
                      className="size-10 rounded-lg border border-border object-contain p-1"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        if (item.companyDomain) {
                          el.src = `https://www.google.com/s2/favicons?domain=${item.companyDomain}&sz=128`;
                          el.onerror = () => { el.style.display = "none"; };
                        } else {
                          el.style.display = "none";
                        }
                      }}
                    />
                  ) : item.companyDomain ? (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${item.companyDomain}&sz=128`}
                      alt={item.company}
                      className="size-10 rounded-lg border border-border object-contain p-1"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted">
                      <Briefcase className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-semibold">
                      {item.role}{" "}
                      <span className="font-normal text-muted-foreground">
                        at {item.company}
                      </span>
                    </h3>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.duration}
                    </span>
                  </div>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.techUsed.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="flex items-center gap-1.5 rounded-full text-xs"
                      >
                        {TECH_ICONS[tech] && (
                          <img
                            src={TECH_ICONS[tech]}
                            alt=""
                            className="size-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export { ProfileWorkHistory };
