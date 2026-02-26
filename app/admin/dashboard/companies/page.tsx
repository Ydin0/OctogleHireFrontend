"use client";

import { useState } from "react";
import { Building2, CheckCircle2, Clock, MessageSquare, Search } from "lucide-react";

import {
  type CompanyStatus,
  companyStatusBadgeClass,
  companyStatusLabel,
  formatDate,
} from "../_components/dashboard-data";

type Company = {
  id: string;
  companyName: string;
  contactName: string;
  businessEmail: string;
  phone: string;
  companyWebsite: string;
  projectDescription: string;
  preferredEngagementType: string;
  estimatedStartDate: string;
  status: CompanyStatus;
  submittedAt: string;
};

const initialCompanies: Company[] = [];
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allCompanyStatuses: CompanyStatus[] = [
  "pending",
  "contacted",
  "active",
  "inactive",
];

const CompaniesPage = () => {
  const [data] = useState(initialCompanies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = data.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.businessEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = data.length;
  const activeCount = data.filter((c) => c.status === "active").length;
  const pendingCount = data.filter((c) => c.status === "pending").length;
  const contactedCount = data.filter((c) => c.status === "contacted").length;

  const companyKpis = [
    { label: "Total Companies", value: String(totalCount), icon: Building2 },
    { label: "Active", value: String(activeCount), icon: CheckCircle2 },
    { label: "Pending", value: String(pendingCount), icon: Clock },
    { label: "Contacted", value: String(contactedCount), icon: MessageSquare },
  ];

  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>
            Track company enquiries and engagement status.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {companyKpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
                {kpi.label}
              </CardDescription>
              <CardTitle className="text-2xl">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex size-8 items-center justify-center rounded-full bg-pulse/10">
                <kpi.icon className="size-4 text-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by company, contact, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {allCompanyStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {companyStatusLabel[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="pb-3 font-medium">Company Name</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Engagement Type</th>
                <th className="pb-3 font-medium">Start Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <tr key={company.id} className="border-b border-border/60">
                  <td className="py-3 font-medium">{company.companyName}</td>
                  <td className="py-3 text-muted-foreground">
                    {company.contactName}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {company.businessEmail}
                  </td>
                  <td className="py-3">{company.preferredEngagementType}</td>
                  <td className="py-3 font-mono text-muted-foreground">
                    {formatDate(company.estimatedStartDate)}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant="outline"
                      className={companyStatusBadgeClass(company.status)}
                    >
                      {companyStatusLabel[company.status]}
                    </Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {formatDate(company.submittedAt)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No companies match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
};

export default CompaniesPage;
