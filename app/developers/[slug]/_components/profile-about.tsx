import { Separator } from "@/components/ui/separator";
import type { Developer } from "@/lib/data/developers";

interface ProfileAboutProps {
  developer: Developer;
}

const ProfileAbout = ({ developer }: ProfileAboutProps) => {
  return (
    <section>
      <Separator className="mb-8" />
      <h2 className="text-2xl font-semibold tracking-tight">
        About {developer.name.split(" ")[0]}
      </h2>
      <p className="mt-4 max-w-3xl font-sans normal-case leading-relaxed tracking-normal text-muted-foreground">
        {developer.about}
      </p>
    </section>
  );
};

export { ProfileAbout };
