"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Check, Clock, Filter, X } from "lucide-react";

import {
  fetchCompanyTimeEntries,
  approveCompanyTimeEntry,
  rejectCompanyTimeEntry,
  type CompanyTimeEntryFull,
} from "@/lib/api/companies";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StatusFilter = "all" | "submitted" | "approved" | "rejected";

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  submitted: "outline",
  approved: "default",
  rejected: "destructive",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatPeriod(period: string): string {
  // period is YYYY-MM
  const [year, month] = period.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export default function TimesheetsPage() {
  const { getToken } = useAuth();
  const [entries, setEntries] = useState<CompanyTimeEntryFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const params = activeFilter !== "all" ? { status: activeFilter } : undefined;
      const data = await fetchCompanyTimeEntries(token, params);
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [getToken, activeFilter]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const token = await getToken();
      await approveCompanyTimeEntry(token, id);
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "approved", approvedAt: new Date().toISOString() } : e))
      );
    } catch {
      // silently fail — the entry stays in its current state
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const token = await getToken();
      await rejectCompanyTimeEntry(token, id);
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "rejected" } : e))
      );
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  // Group entries by period
  const grouped = entries.reduce<Record<string, CompanyTimeEntryFull[]>>((acc, entry) => {
    const key = entry.period;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const sortedPeriods = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const filters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const pendingCount = activeFilter === "all"
    ? entries.filter((e) => e.status === "submitted").length
    : 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Timesheets
        </p>
        <h1 className="text-lg font-semibold">Timesheet Approvals</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve submitted timesheets from your developers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="size-4 text-muted-foreground" />
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={activeFilter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(f.value)}
          >
            {f.label}
            {f.value === "submitted" && pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px]">
                {pendingCount}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <Card>
          <CardContent className="space-y-4 py-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!loading && entries.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="mb-3 size-10 text-muted-foreground/50" />
            <p className="text-sm font-medium">No timesheets found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {activeFilter !== "all"
                ? `No ${activeFilter} timesheets to display.`
                : "Time entries from your developers will appear here."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Entries grouped by period */}
      {!loading &&
        sortedPeriods.map((period) => {
          const periodEntries = grouped[period];
          const totalHours = periodEntries.reduce((sum, e) => sum + e.hours, 0);

          return (
            <Card key={period}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{formatPeriod(period)}</CardTitle>
                    <CardDescription>
                      {periodEntries.length} {periodEntries.length === 1 ? "entry" : "entries"}
                    </CardDescription>
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">
                    {totalHours}h total
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Developer</TableHead>
                      <TableHead>Role / Requirement</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periodEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-7">
                              {entry.developerAvatar && (
                                <AvatarImage src={entry.developerAvatar} alt={entry.developerName} />
                              )}
                              <AvatarFallback className="text-[10px]">
                                {getInitials(entry.developerName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{entry.developerName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">{entry.developerRole}</p>
                            <p className="text-xs text-muted-foreground/70">{entry.requirementTitle}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {entry.hours}h
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant[entry.status] ?? "outline"}>
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.status === "submitted" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 gap-1 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                                disabled={actionLoading === entry.id}
                                onClick={() => handleApprove(entry.id)}
                              >
                                <Check className="size-3.5" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 gap-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                                disabled={actionLoading === entry.id}
                                onClick={() => handleReject(entry.id)}
                              >
                                <X className="size-3.5" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {entry.status === "approved" && entry.approvedAt
                                ? `Approved ${new Date(entry.approvedAt).toLocaleDateString()}`
                                : "\u2014"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
