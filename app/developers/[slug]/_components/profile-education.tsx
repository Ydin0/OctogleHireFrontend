import { Award, GraduationCap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Developer } from "@/lib/data/developers";

interface ProfileEducationProps {
  developer: Developer;
}

const ProfileEducation = ({ developer }: ProfileEducationProps) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">
        Education & Awards
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Education */}
        {developer.education.map((edu) => (
          <Card key={`${edu.institution}-${edu.year}`}>
            <CardContent className="flex gap-4 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                {edu.institutionLogoUrl ? (
                  <img
                    src={edu.institutionLogoUrl}
                    alt={edu.institution}
                    className="size-10 rounded-lg object-contain p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 text-muted-foreground"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>';
                    }}
                  />
                ) : (
                  <GraduationCap className="size-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                <p className="text-sm text-muted-foreground">
                  {edu.institution}
                </p>
                <p className="text-xs text-muted-foreground">{edu.year}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Awards */}
        {developer.awards.map((award) => (
          <Card key={`${award.title}-${award.year}`}>
            <CardContent className="flex gap-4 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-pulse/10">
                <Award className="size-5 text-pulse" />
              </div>
              <div>
                <h3 className="font-semibold">{award.title}</h3>
                <p className="text-sm text-muted-foreground">{award.issuer}</p>
                <p className="text-xs text-muted-foreground">{award.year}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export { ProfileEducation };
