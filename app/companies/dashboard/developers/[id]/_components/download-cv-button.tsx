"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export function DownloadCVButton({ developerId }: { developerId: string }) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `${apiBaseUrl}/api/companies/developers/${developerId}/cv`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        alert(data?.message ?? "Failed to download CV");
        return;
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="(.+)"/);
      const fileName = match?.[1] ?? "CV_OctogleHire.pdf";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      disabled={loading}
      onClick={handleDownload}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Download className="size-3.5" />
      )}
      {loading ? "Generating CV..." : "Download CV"}
    </Button>
  );
}
