import Link from "next/link";
import {
  AlertTriangle,
  CreditCard,
  Download,
  Search,
  ShieldCheck,
} from "lucide-react";

import {
  alerts,
  formatCurrency,
  getInitials,
  invoiceStatusBadgeClass,
  invoiceStatusLabel,
  invoices,
  kpis,
  squads,
  timezoneCoverage,
  teamMembers,
} from "./_components/dashboard-data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CompanyOverviewPage = () => {
  return (
    <>
      <Card className="overflow-hidden border-pulse/30 bg-gradient-to-br from-card via-card to-pulse/5">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="gap-1.5 border-pulse/40 bg-pulse/10 text-pulse">
                <ShieldCheck className="size-3.5" />
                Company Workspace
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                Operations Overview
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Track offshore team utilization, invoice obligations, and delivery
                risk from a single control layer.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <AvatarGroup>
                  {teamMembers.slice(0, 5).map((member) => (
                    <Avatar key={member.id} size="sm">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                  ))}
                  <AvatarGroupCount>+{Math.max(0, teamMembers.length - 5)}</AvatarGroupCount>
                </AvatarGroup>
                <span className="text-xs text-muted-foreground">Active contributors</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/marketplace">
                  <Search className="size-4" />
                  Browse Talent
                </Link>
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                Export Report
              </Button>
              <Button className="col-span-2 gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90 sm:col-auto">
                <CreditCard className="size-4" />
                Pay Outstanding
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
                {kpi.label}
              </CardDescription>
              <CardTitle className="text-2xl">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{kpi.hint}</span>
              <div className="flex size-8 items-center justify-center rounded-full bg-pulse/10">
                <kpi.icon className="size-4 text-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Invoice Pipeline</CardTitle>
            <CardDescription>Upcoming and unresolved invoice items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoices.slice(0, 4).map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col gap-3 rounded-lg border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.developerName} - {invoice.project}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(invoice.amount)}</p>
                    <p className="text-xs text-muted-foreground">Due {invoice.dueOn}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={invoiceStatusBadgeClass(invoice.status)}
                  >
                    {invoiceStatusLabel[invoice.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 border-pulse/25">
          <CardHeader>
            <CardTitle>Offshore Coverage</CardTitle>
            <CardDescription>Timezone and handoff confidence metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {timezoneCoverage.map((item) => (
              <div key={item.region}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.region}</span>
                  <span className="font-medium">{item.hours}</span>
                </div>
                <Progress value={item.score} className="bg-muted" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Squad Health</CardTitle>
            <CardDescription>Allocation and budget usage by squad.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {squads.map((squad) => (
              <div key={squad.name} className="rounded-lg border border-border/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{squad.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Lead: {squad.lead} - {squad.activePeople} active contributors
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      squad.deliveryHealth === "healthy"
                        ? "border-emerald-600/20 bg-emerald-500/10 text-emerald-600"
                        : "border-amber-600/20 bg-amber-500/10 text-amber-700"
                    }
                  >
                    {squad.deliveryHealth === "healthy" ? "Healthy" : "Watch"}
                  </Badge>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Allocation</span>
                      <span>{squad.allocation}%</span>
                    </div>
                    <Progress value={squad.allocation} />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Budget used</span>
                      <span>{squad.budgetUsed}%</span>
                    </div>
                    <Progress value={squad.budgetUsed} className="bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Risk Alerts</CardTitle>
            <CardDescription>Operations items requiring attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert}
                className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" />
                <p className="text-sm text-foreground/90">{alert}</p>
              </div>
            ))}
            <Button className="w-full" variant="outline">Open Operations Center</Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default CompanyOverviewPage;
