"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2, Users } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import { fetchAgencyReferralLink, type AgencyReferralLink } from "@/lib/api/agencies";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="size-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          Copy
        </>
      )}
    </Button>
  );
}

export default function AgencyReferralLinkPage() {
  const { getToken } = useAuth();
  const [link, setLink] = useState<AgencyReferralLink | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getToken();
      const data = await fetchAgencyReferralLink(token);
      if (!cancelled) setLink(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Referral Link</h1>
        <p className="text-sm text-muted-foreground">
          Share your personal link with candidates. Applications are
          automatically tracked to you.
        </p>
      </div>

      {link ? (
        <div className="space-y-6">
          {/* Personal referral link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Link2 className="size-4" />
                Your Personal Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-md border border-border bg-muted/50 px-4 py-2.5">
                  <p className="break-all font-mono text-sm">{link.referralUrl}</p>
                </div>
                <CopyButton text={link.referralUrl} />
              </div>
              <p className="text-xs text-muted-foreground">
                Candidates who sign up through this link are automatically attributed to you.
              </p>
            </CardContent>
          </Card>

          {/* Agency-wide referral link */}
          {link.agencyReferralUrl && link.agencyReferralUrl !== link.referralUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="size-4" />
                  Agency-Wide Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-md border border-border bg-muted/50 px-4 py-2.5">
                    <p className="break-all font-mono text-sm">{link.agencyReferralUrl}</p>
                  </div>
                  <CopyButton text={link.agencyReferralUrl} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Shared link for the whole agency. Candidates won't be attributed to a specific member.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
