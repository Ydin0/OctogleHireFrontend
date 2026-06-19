"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useInterviewRequest } from "../../../_components/interview-request-context";

export function RequestInterviewButton({
  developerId,
  name,
}: {
  developerId: string;
  name: string;
}) {
  const { open, isRequested } = useInterviewRequest();
  const requested = isRequested(developerId);
  return (
    <Button
      size="lg"
      className="rounded-full"
      disabled={requested}
      onClick={() => open({ id: developerId, name })}
    >
      {requested ? "Interview requested" : "Request interview"}
      {!requested && <ArrowRight className="size-4" />}
    </Button>
  );
}
