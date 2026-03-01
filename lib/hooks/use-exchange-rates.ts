"use client";

import { useState, useEffect } from "react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface ExchangeRateResult {
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  stale: boolean;
}

export function useExchangeRates(
  baseCurrency: string,
  token: string | null,
): ExchangeRateResult {
  const [rates, setRates] = useState<Record<string, number>>({ [baseCurrency]: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(
      `${apiBaseUrl}/api/admin/exchange-rates?base=${encodeURIComponent(baseCurrency)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    )
      .then((res) => res.json())
      .then((data: { rates: Record<string, number>; stale: boolean }) => {
        if (cancelled) return;
        setRates(data.rates);
        setStale(data.stale);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to fetch rates");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [baseCurrency, token]);

  return { rates, loading, error, stale };
}
