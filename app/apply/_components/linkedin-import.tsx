"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Linkedin, Loader2, X } from "lucide-react";

import {
  fetchLinkedInProfile,
  mapProfileToFormValues,
  type LinkedInFormValues,
  type ApifyProfile,
} from "@/lib/linkedin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface LinkedInImportProps {
  onImport: (values: LinkedInFormValues, profile: ApifyProfile) => void;
  onSkip: () => void;
}

const isValidLinkedInUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.includes("linkedin.com") &&
      /\/in\/[^/]+/.test(parsed.pathname)
    );
  } catch {
    return false;
  }
};

const LinkedInImport = ({ onImport, onSkip }: LinkedInImportProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!isValidLinkedInUrl(url)) {
      setError("Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/yourname)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = await fetchLinkedInProfile(url);
      const values = mapProfileToFormValues(profile, url);
      onImport(values, profile);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch LinkedIn profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      {/* Top bar */}
      <header className="shrink-0 border-b">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="size-6" />
            <span className="text-lg font-semibold tracking-tighter">
              OctogleHire
            </span>
          </Link>
          <Link
            href="/"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </Link>
        </div>
      </header>

      {/* Centered content */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto">
        <div className="mx-auto w-full max-w-md px-6">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <Linkedin className="size-6" />
            </div>
            <h2 className="text-lg font-semibold">Import from LinkedIn</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Speed up your application by importing your LinkedIn profile.
            </p>
          </div>

          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="linkedin-url">LinkedIn Profile URL</FieldLabel>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="linkedin-url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="pl-10"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                />
              </div>
              <div className="min-h-5">
                {error && <FieldError>{error}</FieldError>}
              </div>
            </Field>

            <Button
              type="button"
              className="w-full gap-2"
              onClick={handleImport}
              disabled={loading || !url.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Importing... This may take a moment
                </>
              ) : (
                <>
                  Import Profile
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Pinned bottom */}
      <div className="shrink-0 border-t bg-background">
        <div className="mx-auto flex max-w-2xl items-center justify-center px-6 py-3">
          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip and fill manually
          </button>
        </div>
      </div>
    </div>
  );
};

export { LinkedInImport };
