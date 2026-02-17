import {
  teamMembers,
  formatCurrency,
  getInitials,
  invoiceStatusBadgeClass,
  invoiceStatusLabel,
} from "../_components/dashboard-data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TeamPage = () => {
  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>
            All assigned developers with key engagement and billing stats.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Table</CardTitle>
          <CardDescription>
            Role, engagement type, utilization, rates, and invoice status.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="pb-3 font-medium">Developer</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Engagement Type</th>
                <th className="pb-3 font-medium">Hourly</th>
                <th className="pb-3 font-medium">Monthly</th>
                <th className="pb-3 font-medium">Project-Based</th>
                <th className="pb-3 font-medium">Utilization</th>
                <th className="pb-3 font-medium">Timezone Overlap</th>
                <th className="pb-3 font-medium">Invoice Status</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-border/60">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{member.role}</td>
                  <td className="py-3">{member.engagementType}</td>
                  <td className="py-3">{formatCurrency(member.hourlyRate)}</td>
                  <td className="py-3">{formatCurrency(member.monthlyRate)}</td>
                  <td className="py-3">{formatCurrency(member.projectRate)}</td>
                  <td className="py-3">{member.utilization}%</td>
                  <td className="py-3">{member.timezoneOverlapHours}h/day</td>
                  <td className="py-3">
                    <Badge
                      variant="outline"
                      className={invoiceStatusBadgeClass(member.invoiceStatus)}
                    >
                      {invoiceStatusLabel[member.invoiceStatus]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
};

export default TeamPage;
