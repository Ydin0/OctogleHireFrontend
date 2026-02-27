"use client";

import { useState } from "react";
import { ArrowRight, Linkedin, Loader2 } from "lucide-react";

import {
  fetchLinkedInProfile,
  mapProfileToFormValues,
  type LinkedInFormValues,
  type ApifyProfile,
} from "@/lib/linkedin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Navbar } from "@/components/marketing/navbar";

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
    <>
      <Navbar />
      <section className="flex min-h-[calc(100dvh-4rem)] items-center justify-center py-12">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-md">
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
                className="w-full gap-2 rounded-full"
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

              <div className="text-center">
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
        </div>
      </section>
    </>
  );
};

export { LinkedInImport };
