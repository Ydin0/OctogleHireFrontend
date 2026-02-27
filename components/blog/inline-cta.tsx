import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface InlineCtaProps {
  title: string;
  description: string;
  href: string;
  label: string;
}

export function InlineCta({ title, description, href, label }: InlineCtaProps) {
  return (
    <aside className="not-prose my-8 rounded-2xl border border-border bg-muted/30 p-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-pulse"
      >
        {label}
        <ArrowRight className="size-3.5" />
      </Link>
    </aside>
  );
}
