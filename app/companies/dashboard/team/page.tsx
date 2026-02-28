"use client";

import { useEffect, useState } from "react";
import { Loader2, Users } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import { getInitials } from "../_components/dashboard-data";
import { fetchCompanyTeam, type TeamMember } from "@/lib/api/companies";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TeamPage = () => {
  const { getToken } = useAuth();
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getToken();
      const data = await fetchCompanyTeam(token);
      if (!cancelled) {
        setTeam(data);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken]);

  const members = team ?? [];

  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>
            Team members in your company workspace.
          </CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Users className="size-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No team members yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Team members will appear here once they are added to your company workspace.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Name, email, role, and join date.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Member</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-border/60">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{member.name}</p>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{member.email}</td>
                    <td className="py-3">{member.role}</td>
                    <td className="py-3 text-muted-foreground">{formatDate(member.joinedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TeamPage;
