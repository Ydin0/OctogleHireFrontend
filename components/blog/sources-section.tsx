import Link from "next/link";

interface Source {
  title: string;
  url: string;
  publisher?: string;
}

interface SourcesSectionProps {
  sources: Source[];
}

export function SourcesSection({ sources }: SourcesSectionProps) {
  if (sources.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Sources
      </h2>
      <ol className="mt-4 space-y-2 list-decimal list-inside">
        {sources.map((source, i) => (
          <li
            key={i}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            <Link
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              {source.title}
            </Link>
            {source.publisher && (
              <span className="text-muted-foreground">
                {" "}
                — {source.publisher}
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
