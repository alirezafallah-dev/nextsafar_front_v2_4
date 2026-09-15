"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateTripPlan, getTripPlanStatus } from "@/lib/api/ai-trip";
import type { TripInput, TripPlan } from "@/types/ai-trip";

export type PlannerPhase = "idle" | "loading" | "result" | "error";

const MAX_POLLS = 30; // حداکثر ۳۰ تلاش ≈ ۱۲۰ ثانیه
const POLL_INTERVAL = 4000; // هر ۴ ثانیه

/**
 * هوک مرکزی برنامه‌ریز سفر
 * استفاده:
 *   const { phase, plan, error, submit, reset } = useTripPlanner();
 */
export function useTripPlanner() {
  const [phase, setPhase] = useState<PlannerPhase>("idle");
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState("");
  const stoppedRef = useRef(false);

  /* پاکسازی هنگام خارج شدن از صفحه */
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
    };
  }, []);

  /* پولینگ وضعیت تا تکمیل یا خطا */
  const pollStatus = useCallback(async (planId: number) => {
    let tries = 0;
    while (tries < MAX_POLLS && !stoppedRef.current) {
      tries++;
      try {
        const data = await getTripPlanStatus(planId);
        if (stoppedRef.current) return;

        if (data.status === "completed") {
          setPlan(data);
          setPhase("result");
          return;
        }
        if (data.status === "failed") {
          setError(data.meta?.error_message || "خطا در ساخت برنامه.");
          setPhase("error");
          return;
        }
      } catch {
        /* خطای شبکه → ادامه پولینگ */
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    }

    if (!stoppedRef.current) {
      setError("ساخت برنامه بیش از حد طول کشید. دوباره تلاش کن.");
      setPhase("error");
    }
  }, []);

  /* ثبت درخواست ساخت */
  const submit = useCallback(
    async (input: TripInput) => {
      setPhase("loading");
      setError("");
      stoppedRef.current = false;

      try {
        const res = await generateTripPlan(input);
        if (stoppedRef.current) return;

        /* کش بود → مستقیم نتیجه */
        if (res.status === "completed" && res.plan) {
          setPlan(res.plan);
          setPhase("result");
          return;
        }
        /* وگرنه پولینگ */
        pollStatus(res.plan_id);
      } catch (e) {
        if (stoppedRef.current) return;
        setError(e instanceof Error ? e.message : "خطا در ارتباط با سرور.");
        setPhase("error");
      }
    },
    [pollStatus]
  );

  /* ریست برای ساخت برنامه جدید */
  const reset = useCallback(() => {
    stoppedRef.current = true;
    setPhase("idle");
    setPlan(null);
    setError("");
  }, []);

  return { phase, plan, error, submit, reset };
}