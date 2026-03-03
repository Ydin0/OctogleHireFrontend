"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import { fetchAgencyReferralLink, type AgencyReferralLink } from "@/lib/api/agencies";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AgencyReferralLinkPage() {
  const { getToken } = useAuth();
  const [link, setLink] = useState<AgencyReferralLink | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Referral Link</h1>
        <p className="text-sm text-muted-foreground">
          Share this link with candidates. Applications through this link are
          automatically tracked to your agency.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="size-4" />
            Your Unique Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {link ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-md border border-border bg-muted/50 px-4 py-2.5">
                  <p className="break-all font-mono text-sm">{link.referralUrl}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="size-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Referral Code
                </p>
                <p className="font-mono text-sm font-medium">
                  {link.referralCode}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
