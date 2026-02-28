import { FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const InvoicesPage = () => {
  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Manage pending, overdue, and paid invoices for your offshore team.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <FileText className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">No invoices yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Invoices will appear here once billing is set up for your active engagements.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default InvoicesPage;
