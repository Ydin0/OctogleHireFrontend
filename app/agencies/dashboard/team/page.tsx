import { auth } from "@clerk/nextjs/server";

import { fetchAgencyTeam } from "@/lib/api/agencies";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AgencyTeamPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const members = await fetchAgencyTeam(token);

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Team</h1>
        <p className="text-sm text-muted-foreground">
          Members of your agency workspace.
        </p>
      </div>

      {!members || members.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No team members found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {members.map((m) => {
                const initials = m.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div key={m.id} className="flex items-center gap-4 py-3">
                    <Avatar size="sm">
                      {m.avatar && <AvatarImage src={m.avatar} alt="" />}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {m.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {m.role}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
