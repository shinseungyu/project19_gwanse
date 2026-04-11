"use client";

import { useState, useEffect } from "react";
import { EXCHANGE_RATE_API } from "@/lib/constants";

export interface ExchangeRates {
  KRW: number;
  JPY: number;
  CNY: number;
  EUR: number;
}

interface ExchangeRateResult {
  rate: number | null;
  rates: ExchangeRates | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export function useExchangeRate(): ExchangeRateResult {
  const [rate, setRate] = useState<number | null>(null);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRate() {
      setLoading(true);
      setError(null);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(EXCHANGE_RATE_API, { signal: controller.signal }).finally(() => clearTimeout(timer));
        if (!res.ok) throw new Error("환율 정보를 가져오지 못했습니다.");
        const data = await res.json();
        if (!cancelled) {
          const krw = data.rates?.KRW;
          const jpy = data.rates?.JPY;
          const cny = data.rates?.CNY;
          const eur = data.rates?.EUR;
          if (!krw || !jpy || !cny || !eur) throw new Error("환율 데이터를 찾을 수 없습니다.");
          setRate(krw);
          setRates({ KRW: krw, JPY: jpy, CNY: cny, EUR: eur });
          setLastUpdated(data.time_last_update_utc ?? null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRate();
    return () => { cancelled = true; };
  }, []);

  return { rate, rates, loading, error, lastUpdated };
}
