"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Agency } from "@/lib/api/agencies";
import { updateAdminAgency } from "@/lib/api/agencies";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgencyDetailClientProps {
  agency: Agency;
  token: string;
}

function AgencyDetailClient({ agency, token }: AgencyDetailClientProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    await updateAdminAgency(token, agency.id, { status: newStatus });
    setUpdating(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        defaultValue={agency.status}
        onValueChange={handleStatusChange}
        disabled={updating}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export { AgencyDetailClient };
