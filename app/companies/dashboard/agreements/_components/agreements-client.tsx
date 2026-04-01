"use client";

import Link from "next/link";
import { FileSignature, FileText, Check } from "lucide-react";

import type { Agreement } from "@/lib/api/companies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface AgreementsClientProps {
  agreements: Agreement[];
}

export function AgreementsClient({ agreements }: AgreementsClientProps) {
  const pending = agreements.filter((a) => a.status === "pending");
  const signed = agreements.filter((a) => a.status === "signed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Agreements</h1>
        <p className="text-sm text-muted-foreground">
          Review and sign your legal agreements.
        </p>
      </div>

      {agreements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileSignature className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No agreements yet. Agreements will appear here when your account
              manager sends them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Awaiting Signature
              </p>
              {pending.map((a) => (
                <AgreementRow key={a.id} agreement={a} />
              ))}
            </div>
          )}

          {signed.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Signed
              </p>
              {signed.map((a) => (
                <AgreementRow key={a.id} agreement={a} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AgreementRow({ agreement }: { agreement: Agreement }) {
  const isSigned = agreement.status === "signed";
  const label =
    agreement.type === "msa"
      ? "Master Services Agreement"
      : `Resource Engagement Addendum${agreement.role ? ` — ${agreement.role}` : ""}`;
  const subtitle =
    agreement.type === "rea" && agreement.developerName
      ? agreement.developerName
      : null;

  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border">
          {isSigned ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <FileText className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{label}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {isSigned
              ? `Signed ${formatDate(agreement.signedAt!)} by ${agreement.signedByName}`
              : `Sent ${formatDate(agreement.createdAt)}`}
          </p>
        </div>

        <Badge
          variant={isSigned ? "secondary" : "outline"}
          className={
            isSigned
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
          }
        >
          {agreement.type.toUpperCase()}
        </Badge>

        <Button
          variant={isSigned ? "ghost" : "default"}
          size="sm"
          className="rounded-full"
          asChild
        >
          <Link href={`/companies/dashboard/agreements/${agreement.id}`}>
            {isSigned ? "View" : "Review & Sign"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
