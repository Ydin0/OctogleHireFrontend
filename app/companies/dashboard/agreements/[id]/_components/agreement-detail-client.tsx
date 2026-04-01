"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import type { AgreementDetail } from "@/lib/api/companies";
import { signAgreement } from "@/lib/api/companies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface AgreementDetailClientProps {
  agreement: AgreementDetail;
  token: string;
}

export function AgreementDetailClient({
  agreement,
  token,
}: AgreementDetailClientProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  const isSigned = agreement.status === "signed";
  const canSign = !isSigned && name.trim() && title.trim() && agreed;

  const typeLabel =
    agreement.type === "msa"
      ? "Master Services Agreement"
      : "Resource Engagement Addendum";

  async function handleSign() {
    if (!canSign) return;
    setSigning(true);

    const result = await signAgreement(token, agreement.id, {
      name: name.trim(),
      title: title.trim(),
    });

    if (result.success) {
      toast.success("Agreement signed successfully");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to sign agreement");
    }

    setSigning(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/companies/dashboard/agreements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{typeLabel}</h1>
          <p className="text-xs text-muted-foreground">
            Created {formatDate(agreement.createdAt)}
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            isSigned
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
          }
        >
          {isSigned ? "Signed" : "Pending"}
        </Badge>
      </div>

      {/* Agreement Content */}
      <Card>
        <CardContent className="py-6">
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: agreement.contentSnapshot }}
          />
        </CardContent>
      </Card>

      {/* Signed confirmation */}
      {isSigned && (
        <Card className="border-emerald-500/30">
          <CardContent className="flex items-start gap-4 py-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Agreement Signed</p>
              <p className="text-xs text-muted-foreground">
                Signed by {agreement.signedByName} ({agreement.signedByTitle})
                on {formatDate(agreement.signedAt!)}
              </p>
              {agreement.signedByEmail && (
                <p className="text-xs text-muted-foreground">
                  {agreement.signedByEmail}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signing Form */}
      {!isSigned && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sign Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="signer-name" className="text-xs">
                  Full Name
                </Label>
                <Input
                  id="signer-name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signer-title" className="text-xs">
                  Title / Position
                </Label>
                <Input
                  id="signer-title"
                  placeholder="e.g. CEO, CTO, Director"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="agree-check"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="mt-0.5"
              />
              <Label
                htmlFor="agree-check"
                className="text-xs leading-snug text-muted-foreground"
              >
                I have read and agree to the terms set out in this agreement.
              </Label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="max-w-xs text-[10px] text-muted-foreground">
                By clicking &ldquo;I Agree &amp; Sign&rdquo;, your name, title,
                IP address, and timestamp will be recorded as your electronic
                signature.
              </p>
              <Button
                className="rounded-full"
                disabled={!canSign || signing}
                onClick={handleSign}
              >
                {signing ? (
                  "Signing..."
                ) : (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5" />I Agree &amp; Sign
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
