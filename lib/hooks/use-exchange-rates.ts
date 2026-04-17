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

interface RatesState {
  base: string;
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  stale: boolean;
}

export function useExchangeRates(
  baseCurrency: string,
  token: string | null,
): ExchangeRateResult {
  const [state, setState] = useState<RatesState>({
    base: baseCurrency,
    rates: { [baseCurrency]: 1 },
    loading: true,
    error: null,
    stale: false,
  });

  useEffect(() => {
    if (!token) {
      setState({
        base: baseCurrency,
        rates: { [baseCurrency]: 1 },
        loading: false,
        error: null,
        stale: false,
      });
      return;
    }

    let cancelled = false;
    setState({
      base: baseCurrency,
      rates: { [baseCurrency]: 1 },
      loading: true,
      error: null,
      stale: false,
    });

    fetch(
      `${apiBaseUrl}/api/admin/exchange-rates?base=${encodeURIComponent(baseCurrency)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    )
      .then((res) => res.json())
      .then((data: { rates: Record<string, number>; stale: boolean }) => {
        if (cancelled) return;
        setState({
          base: baseCurrency,
          rates: data.rates,
          loading: false,
          error: null,
          stale: data.stale,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch rates",
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [baseCurrency, token]);

  // If state is for a different base than what's being asked for (transient),
  // expose a safe placeholder so consumers don't apply mismatched rates.
  const safeRates =
    state.base === baseCurrency ? state.rates : { [baseCurrency]: 1 };

  return {
    rates: safeRates,
    loading: state.loading,
    error: state.error,
    stale: state.stale,
  };
}
