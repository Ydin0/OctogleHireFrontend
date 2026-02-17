import { DollarSign, Receipt, Wallet } from "lucide-react";

import { phaseTwoFeatures } from "../_components/dashboard-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EarningsPage = () => {
  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Earnings & Payments</CardTitle>
          <CardDescription>
            Financial tracking area for invoices, payouts, and earnings trends.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Current Month
            </CardDescription>
            <CardTitle className="text-2xl">$0</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Activates after first active engagement.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Pending Payouts
            </CardDescription>
            <CardTitle className="text-2xl">$0</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            No pending payout records yet.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Avg Payment Time
            </CardDescription>
            <CardTitle className="text-2xl">-</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Calculated after first payment cycle.
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Payment Activation</CardTitle>
            <CardDescription>
              Earnings flows become active after your first matched engagement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-pulse/35 bg-pulse/10 p-4">
              <div className="flex items-center gap-2">
                <Receipt className="size-4 text-pulse" />
                <p className="text-sm font-semibold">Phase 2 financial tracking</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Invoice status, payout timelines, and earnings analytics are
                unlocked with your first engagement record.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-4">
              <p className="text-sm font-semibold">What to prepare now</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <DollarSign className="size-3.5 text-pulse" />
                  Keep legal name and payout details accurate
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="size-3.5 text-pulse" />
                  Confirm preferred currency and payment method
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="size-3.5 text-pulse" />
                  Monitor onboarding status for engagement activation
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Planned Features</CardTitle>
            <CardDescription>
              Roadmap items for earnings workspace in phase 2.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {phaseTwoFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-2 rounded-md p-2">
                <Wallet className="mt-0.5 size-4 text-pulse" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default EarningsPage;
