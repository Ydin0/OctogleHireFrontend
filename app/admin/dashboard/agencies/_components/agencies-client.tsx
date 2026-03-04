"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import type { Agency, AgencyEnquiry } from "@/lib/api/agencies";
import {
  createAdminAgency,
  convertAgencyEnquiry,
  updateAdminAgencyEnquiry,
} from "@/lib/api/agencies";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusBadge: Record<string, string> = {
  new: "border-blue-600/20 bg-blue-500/10 text-blue-700",
  pending: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  active: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  converted: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  suspended: "border-red-600/20 bg-red-500/10 text-red-600",
  rejected: "border-red-600/20 bg-red-500/10 text-red-600",
};

type Tab = "agencies" | "enquiries";

interface AgenciesClientProps {
  agencies: Agency[];
  enquiries: AgencyEnquiry[];
  token: string;
}

function AgenciesClient({ agencies, enquiries, token }: AgenciesClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("agencies");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [converting, setConverting] = useState<string | null>(null);

  const newEnquiriesCount = enquiries.filter((e) => e.status === "new").length;

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    const form = new FormData(e.currentTarget);
    const result = await createAdminAgency(token, {
      name: form.get("name") as string,
      contactName: form.get("contactName") as string,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      commissionRate: Number(form.get("commissionRate")) || 10,
      status: "active",
    });

    setCreating(false);

    if (result) {
      setOpen(false);
      router.refresh();
    }
  };

  const handleConvert = async (enquiryId: string) => {
    setConverting(enquiryId);
    const result = await convertAgencyEnquiry(token, enquiryId);
    setConverting(null);

    if (result) {
      router.refresh();
    }
  };

  const handleReject = async (enquiryId: string) => {
    await updateAdminAgencyEnquiry(token, enquiryId, { status: "rejected" });
    router.refresh();
  };

  return (
    <>
      {/* Tab selector */}
      <div className="flex gap-0 border-b border-border">
        {(
          [
            { value: "agencies", label: "Agencies" },
            { value: "enquiries", label: "Registrations" },
          ] as const
        ).map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors duration-200",
              tab === t.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              {t.label}
              {t.value === "enquiries" && newEnquiriesCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                  {newEnquiriesCount}
                </span>
              )}
            </span>
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
                tab === t.value ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        ))}
      </div>

      {tab === "agencies" && (
        <>
          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="size-4" />
                  Add Agency
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Agency</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agency Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input id="contactName" name="contactName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      name="commissionRate"
                      type="number"
                      defaultValue={10}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={creating}>
                      {creating ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {agencies.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No agencies yet. Create one to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {agencies.length} agenc{agencies.length === 1 ? "y" : "ies"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="pb-2 pr-4 text-left font-medium">Name</th>
                        <th className="pb-2 pr-4 text-left font-medium">Contact</th>
                        <th className="pb-2 pr-4 text-left font-medium">Referral Code</th>
                        <th className="pb-2 pr-4 text-right font-medium">Rate</th>
                        <th className="pb-2 pr-4 text-right font-medium">Status</th>
                        <th className="pb-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {agencies.map((a) => (
                        <tr key={a.id} className="group">
                          <td className="py-3 pr-4">
                            <Link
                              href={`/admin/dashboard/agencies/${a.id}`}
                              className="font-medium hover:underline"
                            >
                              {a.name}
                            </Link>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {a.contactName}
                            <br />
                            <span className="text-xs">{a.email}</span>
                          </td>
                          <td className="py-3 pr-4">
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                              {a.referralCode}
                            </code>
                          </td>
                          <td className="py-3 pr-4 text-right font-mono">
                            {a.commissionRate}%
                          </td>
                          <td className="py-3 pr-4 text-right">
                            <Badge
                              variant="outline"
                              className={statusBadge[a.status] ?? statusBadge.pending}
                            >
                              {a.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
                            {a.status === "pending" && !a.clerkOrgId && (
                              <Link href={`/admin/dashboard/agencies/${a.id}`}>
                                <Button size="sm" variant="outline">
                                  Activate
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {tab === "enquiries" && (
        <>
          {enquiries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No agency registrations yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {enquiries.length} registration{enquiries.length === 1 ? "" : "s"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="pb-2 pr-4 text-left font-medium">Agency</th>
                        <th className="pb-2 pr-4 text-left font-medium">Contact</th>
                        <th className="pb-2 pr-4 text-left font-medium">Team Size</th>
                        <th className="pb-2 pr-4 text-left font-medium">Status</th>
                        <th className="pb-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {enquiries.map((e) => (
                        <tr key={e.id}>
                          <td className="py-3 pr-4">
                            <span className="font-medium">{e.agencyName}</span>
                            {e.website && (
                              <>
                                <br />
                                <a
                                  href={e.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-muted-foreground hover:underline"
                                >
                                  {e.website}
                                </a>
                              </>
                            )}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {e.contactName}
                            <br />
                            <span className="text-xs">{e.email}</span>
                            <br />
                            <span className="text-xs">{e.phone}</span>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {e.teamSize ?? "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              variant="outline"
                              className={statusBadge[e.status] ?? statusBadge.pending}
                            >
                              {e.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
                            {e.status === "new" && (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(e.id)}
                                >
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={converting === e.id}
                                  onClick={() => handleConvert(e.id)}
                                >
                                  {converting === e.id ? "Converting..." : "Approve"}
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
}

export { AgenciesClient };