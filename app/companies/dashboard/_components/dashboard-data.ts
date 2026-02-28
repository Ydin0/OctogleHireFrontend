export type InvoiceStatus = "paid" | "pending" | "overdue";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const invoiceStatusBadgeClass = (status: InvoiceStatus) => {
  if (status === "paid") {
    return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
  }

  if (status === "overdue") {
    return "bg-red-500/10 text-red-600 border-red-600/20";
  }

  return "bg-amber-500/10 text-amber-700 border-amber-600/20";
};

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
