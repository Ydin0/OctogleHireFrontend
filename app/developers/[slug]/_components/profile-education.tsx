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
                <GraduationCap className="size-5 text-muted-foreground" />
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
