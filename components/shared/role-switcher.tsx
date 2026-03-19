"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Building2, Briefcase, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const roleConfig: Record<string, { label: string; icon: typeof Building2; dashboard: string }> = {
  company: { label: "Company Dashboard", icon: Building2, dashboard: "/companies/dashboard" },
  agency: { label: "Agency Dashboard", icon: Briefcase, dashboard: "/agencies/dashboard" },
};

interface RoleSwitcherProps {
  roles: string[];
  activeRole: string;
}

export function RoleSwitcher({ roles, activeRole }: RoleSwitcherProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [switching, setSwitching] = useState(false);

  const switchableRoles = roles.filter((r) => r in roleConfig);
  if (switchableRoles.length < 2) return null;

  const current = roleConfig[activeRole];

  const handleSwitch = async (role: string) => {
    if (role === activeRole || switching) return;
    setSwitching(true);
    try {
      const token = await getToken();
      await fetch(`${apiBaseUrl}/api/auth/switch-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      const target = roleConfig[role]?.dashboard;
      if (target) router.push(target);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between gap-2 px-3 text-xs font-mono uppercase tracking-wider text-muted-foreground"
          disabled={switching}
        >
          <span className="truncate">{current?.label ?? activeRole}</span>
          <ChevronsUpDown className="size-3 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Switch workspace
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {switchableRoles.map((role) => {
          const config = roleConfig[role];
          if (!config) return null;
          const Icon = config.icon;
          const isActive = role === activeRole;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleSwitch(role)}
              className={isActive ? "bg-accent" : ""}
              disabled={switching}
            >
              <Icon className="mr-2 size-4" />
              {config.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
