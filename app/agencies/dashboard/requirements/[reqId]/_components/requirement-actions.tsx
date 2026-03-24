"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { AgencyRequirementDetail } from "@/lib/api/agencies";
import { submitAgencyPitches } from "@/lib/api/agencies";

import { AgencyCurrentPitches } from "./agency-current-pitches";
import { AgencyDeveloperPool } from "./agency-developer-pool";
import { AgencyPitchDialog } from "./agency-pitch-dialog";
import type { PoolCandidate, PitchPayload } from "./types";

const RequirementActions = ({
  requirement,
}: {
  requirement: AgencyRequirementDetail;
}) => {
  const { getToken } = useAuth();
  const router = useRouter();

  const [selectedDevs, setSelectedDevs] = useState<PoolCandidate[]>([]);
  const [pitchDialogOpen, setPitchDialogOpen] = useState(false);

  const excludeDevIds = new Set(
    requirement.pitches.map((p) => p.developerId)
  );

  const handleDevsSelected = useCallback((devs: PoolCandidate[]) => {
    setSelectedDevs(devs);
    setPitchDialogOpen(true);
  }, []);

  const handleSubmitPitches = useCallback(
    async (pitches: PitchPayload[]) => {
      const token = await getToken();
      const result = await submitAgencyPitches(token, requirement.id, pitches);
      if (result) {
        toast.success("Pitches submitted successfully");
        setPitchDialogOpen(false);
        setSelectedDevs([]);
        router.refresh();
      }
      return result;
    },
    [getToken, requirement.id, router]
  );

  return (
    <>
      {requirement.pitches.length > 0 && (
        <AgencyCurrentPitches pitches={requirement.pitches} />
      )}

      <AgencyDeveloperPool
        requirement={requirement}
        excludeDevIds={excludeDevIds}
        onDevsSelected={handleDevsSelected}
      />

      <AgencyPitchDialog
        open={pitchDialogOpen}
        onOpenChange={setPitchDialogOpen}
        selectedDevs={selectedDevs}
        defaultCommissionRate={10}
        onSubmit={handleSubmitPitches}
      />
    </>
  );
};

export { RequirementActions };
