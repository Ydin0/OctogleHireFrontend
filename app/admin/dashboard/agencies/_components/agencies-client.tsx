"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import type { Agency, AgencyEnquiry } from "@/lib/api/agencies";
import {
  createAdminAgency,
  convertAgencyEnquiry,
  updateAdminAgency,
  updateAdminAgencyEnquiry,
} from "@/lib/api/agencies";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";

// ── Status badge helpers ────────────────────────────────────────────────────

const statusBadgeClass: Record<string, string> = {
  new: "bg-blue-500/8 text-blue-500 border-blue-500/15",
  pending: "bg-amber-500/8 text-amber-500 border-amber-500/15",
  active: "bg-emerald-500/8 text-emerald-500 border-emerald-500/15",
  converted: "bg-emerald-500/8 text-emerald-500 border-emerald-500/15",
  suspended: "bg-rose-500/8 text-rose-500 border-rose-500/15",
  rejected: "bg-rose-500/8 text-rose-500 border-rose-500/15",
};

// ── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { value: "agencies", label: "Agencies" },
  { value: "enquiries", label: "Registrations" },
] as const;

type Tab = (typeof TABS)[number]["value"];

// ── Component ───────────────────────────────────────────────────────────────

interface AgenciesClientProps {
  agencies: Agency[];
  enquiries: AgencyEnquiry[];
  token: string;
}

function AgenciesClient({ agencies, enquiries, token }: AgenciesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentTab = (searchParams.get("tab") as Tab) ?? "agencies";
  const [searchQuery, setSearchQuery] = useState("");

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Edit dialog
  const [editTarget, setEditTarget] = useState<Agency | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    commissionRate: "",
    status: "active",
  });
  const [editSaving, setEditSaving] = useState(false);

  // Enquiry actions
  const [converting, setConverting] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const newEnquiriesCount = enquiries.filter((e) => e.status === "new").length;

  const switchTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (tab === "agencies") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // Filter agencies by search
  const filteredAgencies = useMemo(() => {
    if (!searchQuery) return agencies;
    const q = searchQuery.toLowerCase();
    return agencies.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.contactName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.referralCode.toLowerCase().includes(q),
    );
  }, [agencies, searchQuery]);

  // Client-side pagination
  const total = filteredAgencies.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const paginatedAgencies = filteredAgencies.slice(
    (safePage - 1) * limit,
    safePage * limit,
  );

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: (agency) => {
          setEditTarget(agency);
          setEditForm({
            name: agency.name,
            contactName: agency.contactName,
            email: agency.email,
            phone: agency.phone ?? "",
            commissionRate: String(agency.commissionRate),
            status: agency.status,
          });
        },
      }),
    [],
  );

  // Handlers
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    try {
      const form = new FormData(e.currentTarget);
      const result = await createAdminAgency(token, {
        name: form.get("name") as string,
        contactName: form.get("contactName") as string,
        email: form.get("email") as string,
        phone: (form.get("phone") as string) || undefined,
        commissionRate: Number(form.get("commissionRate")) || 10,
        status: "active",
      });
      if (result) {
        toast.success("Agency created");
        setCreateOpen(false);
        startTransition(() => router.refresh());
      } else {
        toast.error("Failed to create agency");
      }
    } catch {
      toast.error("Failed to create agency");
    }
    setCreating(false);
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setEditSaving(true);
    const result = await updateAdminAgency(token, editTarget.id, {
      name: editForm.name,
      contactName: editForm.contactName,
      email: editForm.email,
      phone: editForm.phone || null,
      commissionRate: Number(editForm.commissionRate),
      status: editForm.status,
    });
    if (result) {
      toast.success("Agency updated");
      setEditTarget(null);
      startTransition(() => router.refresh());
    } else {
      toast.error("Failed to update agency");
    }
    setEditSaving(false);
  };

  const handleConvert = async (enquiryId: string) => {
    setConverting(enquiryId);
    try {
      const result = await convertAgencyEnquiry(token, enquiryId);
      if (result) {
        toast.success("Registration approved");
        startTransition(() => router.refresh());
      } else {
        toast.error("Failed to approve registration");
      }
    } catch {
      toast.error("Failed to approve registration");
    }
    setConverting(null);
  };

  const handleReject = async (enquiryId: string) => {
    try {
      await updateAdminAgencyEnquiry(token, enquiryId, { status: "rejected" });
      toast.success("Registration rejected");
      startTransition(() => router.refresh());
    } catch {
      toast.error("Failed to reject registration");
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => switchTab(t.value)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              currentTab === t.value
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
                currentTab === t.value ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        ))}
      </div>

      {/* ── Agencies Tab ── */}
      {currentTab === "agencies" && (
        <>
          {/* Search + Add */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, contact, or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1.5 size-3.5" />
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
                    <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
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

          {/* Table */}
          {filteredAgencies.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {agencies.length === 0
                    ? "No agencies yet. Create one to get started."
                    : "No agencies match your search."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <DataTable
              columns={columns}
              data={paginatedAgencies}
              pagination={{ page: safePage, limit, total, totalPages }}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
              onRowClick={(agency) =>
                router.push(`/admin/dashboard/agencies/${agency.id}`)
              }
            />
          )}
        </>
      )}

      {/* ── Registrations Tab ── */}
      {currentTab === "enquiries" && (
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
            <div className="rounded-md border overflow-x-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs text-muted-foreground" style={{ width: 200 }}>Agency</TableHead>
                    <TableHead className="text-xs text-muted-foreground" style={{ width: 200 }}>Contact</TableHead>
                    <TableHead className="text-xs text-muted-foreground" style={{ width: 100 }}>Team Size</TableHead>
                    <TableHead className="text-xs text-muted-foreground" style={{ width: 100 }}>Status</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right" style={{ width: 160 }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="overflow-hidden" style={{ width: 200 }}>
                        <p className="truncate text-sm font-medium">{e.agencyName}</p>
                        {e.website && (
                          <a
                            href={e.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-xs text-muted-foreground hover:underline"
                          >
                            {e.website}
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="overflow-hidden" style={{ width: 200 }}>
                        <p className="truncate text-sm">{e.contactName}</p>
                        <p className="truncate text-xs text-muted-foreground">{e.email}</p>
                      </TableCell>
                      <TableCell className="overflow-hidden" style={{ width: 100 }}>
                        <span className="text-sm text-muted-foreground">{e.teamSize ?? "—"}</span>
                      </TableCell>
                      <TableCell className="overflow-hidden" style={{ width: 100 }}>
                        <Badge variant="outline" className={statusBadgeClass[e.status] ?? statusBadgeClass.pending}>
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="overflow-hidden text-right" style={{ width: 160 }}>
                        {e.status === "new" && (
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleReject(e.id)}>
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              disabled={converting === e.id}
                              onClick={() => handleConvert(e.id)}
                            >
                              {converting === e.id ? "Approving..." : "Approve"}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* ── Edit Agency Dialog ── */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Agency</DialogTitle>
            <DialogDescription>{editTarget?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agency Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input
                  value={editForm.contactName}
                  onChange={(e) => setEditForm((f) => ({ ...f, contactName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Commission Rate (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={editForm.commissionRate}
                  onChange={(e) => setEditForm((f) => ({ ...f, commissionRate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)} disabled={editSaving}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={editSaving}>
              {editSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { AgenciesClient };
