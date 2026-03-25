"use client";

import { useState } from "react";
import { DollarSign, Loader2, Percent } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import {
  updateCandidatePricing,
  type PricingType,
} from "@/lib/api/agencies";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CandidatePricingProps {
  candidateId: string;
  sourceTable: "application" | "saved";
  initialPricingType?: PricingType | null;
  initialPricingAmount?: number | null;
  initialPricingCurrency?: string | null;
}

const CandidatePricing = ({
  candidateId,
  sourceTable,
  initialPricingType,
  initialPricingAmount,
  initialPricingCurrency,
}: CandidatePricingProps) => {
  const { getToken } = useAuth();
  const [pricingType, setPricingType] = useState<PricingType | "">(
    initialPricingType ?? ""
  );
  const [amount, setAmount] = useState(
    initialPricingAmount != null ? String(initialPricingAmount) : ""
  );
  const [currency, setCurrency] = useState(
    initialPricingCurrency ?? "USD"
  );
  const [saving, setSaving] = useState(false);

  const hasChanged =
    pricingType !== (initialPricingType ?? "") ||
    amount !== (initialPricingAmount != null ? String(initialPricingAmount) : "") ||
    (pricingType === "flat" && currency !== (initialPricingCurrency ?? "USD"));

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      await updateCandidatePricing(token, candidateId, {
        pricingType: pricingType || null,
        pricingAmount: amount ? Number(amount) : null,
        pricingCurrency: pricingType === "flat" ? currency : null,
        sourceTable,
      });
      toast.success("Pricing updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update pricing"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      await updateCandidatePricing(token, candidateId, {
        pricingType: null,
        pricingAmount: null,
        pricingCurrency: null,
        sourceTable,
      });
      setPricingType("");
      setAmount("");
      setCurrency("USD");
      toast.success("Pricing cleared");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to clear pricing"
      );
    } finally {
      setSaving(false);
    }
  };

  // Display current price tag
  const priceDisplay =
    initialPricingType === "flat" && initialPricingAmount != null
      ? `${initialPricingCurrency ?? "USD"} ${initialPricingAmount.toLocaleString()}`
      : initialPricingType === "percentage" && initialPricingAmount != null
        ? `${initialPricingAmount}% of annual salary`
        : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {priceDisplay && (
          <div className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Current Price
            </p>
            <p className="font-mono text-lg font-semibold">{priceDisplay}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Pricing Type
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={pricingType === "flat" ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={() => setPricingType("flat")}
              >
                <DollarSign className="size-3.5" />
                Flat Fee
              </Button>
              <Button
                type="button"
                variant={pricingType === "percentage" ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={() => setPricingType("percentage")}
              >
                <Percent className="size-3.5" />
                Percentage
              </Button>
            </div>
          </div>

          {pricingType === "flat" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Amount</Label>
                <Input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  className="font-mono"
                />
              </div>
            </div>
          )}

          {pricingType === "percentage" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Percentage of Annual Salary</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="15"
                  className="font-mono pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          )}

          {pricingType && (
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={saving || !hasChanged || !amount}
                onClick={handleSave}
                className="gap-1.5"
              >
                {saving && <Loader2 className="size-3.5 animate-spin" />}
                Save
              </Button>
              {initialPricingType && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={saving}
                  onClick={handleClear}
                  className="text-muted-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { CandidatePricing };
