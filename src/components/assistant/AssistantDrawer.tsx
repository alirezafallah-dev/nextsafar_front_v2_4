"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, Maximize2, Plus, Send, Sparkles, X } from "lucide-react";
import { sendChatMessage } from "@/lib/api/assistant";
import { getPlanEntities } from "@/lib/api/map";
import { getTripPlanStatus } from "@/lib/api/ai-trip";
import type { ChatHistoryItem, ChatMessageItem } from "@/types/assistant";
import type { TripEntity } from "@/types/map";
import type { TripPlan } from "@/types/ai-trip";
import PlanCard from "./PlanCard";
import TripResultsView from "./TripResultsView";
import TripFormCard from "./TripFormCard";

let msgSeq = 0;
const nextId = () => `m${++msgSeq}_${Date.now()}`;

const LS_KEY = "ns_assistant_state_v1";
const LS_FAVS = "ns_assistant_favs_v1";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function AssistantDrawer({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activePlan, setActivePlan] = useState<TripPlan | null>(null);
  const [entities, setEntities] = useState<TripEntity[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const [resultsOpen, setResultsOpen] = useState(true);
  const [hiddenSlugs, setHiddenSlugs] = useState<string[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [restored, setRestored] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const autoOpened = useRef<Set<number>>(new Set());

  /* ═══ ✅ بازیابی از localStorage هنگام باز شدن ═══ */
  useEffect(() => {
    const s = loadJSON<any>(LS_KEY, null);
    setFavs(loadJSON<string[]>(LS_FAVS, []));
    if (s) {
      if (Array.isArray(s.messages)) setMessages(s.messages);
      if (typeof s.lastQuery === "string") setLastQuery(s.lastQuery);
      if (Array.isArray(s.hiddenSlugs)) setHiddenSlugs(s.hiddenSlugs);
      if (typeof s.resultsOpen === "boolean") setResultsOpen(s.resultsOpen);
      if (s.planId) {
        (async () => {
          try {
            const plan = await getTripPlanStatus(Number(s.planId));
            if (plan && plan.status === "completed") {
              setActivePlan(plan);
              autoOpened.current.add(plan.id);
              setEntities(await getPlanEntities(plan.id));
            }
          } catch {}
        })();
      }
    }
    setRestored(true);
  }, []);

  /* ═══ ✅ ذخیره خودکار ═══ */
  useEffect(() => {
    if (!restored) return;
    const lastPlan = [...messages].reverse().find((m) => m.kind === "plan" && m.planId);
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          messages,
          lastQuery,
          hiddenSlugs,
          resultsOpen,
          planId: lastPlan?.planId ?? null,
        }),
      );
    } catch {}
  }, [messages, lastQuery, hiddenSlugs, resultsOpen, restored]);

  useEffect(() => {
    try { localStorage.setItem(LS_FAVS, JSON.stringify(favs)); } catch {}
  }, [favs]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  const history = useCallback((): ChatHistoryItem[] => {
    return messages.filter((m) => m.kind === "text").slice(-8).map((m) => ({ role: m.role, content: m.text }));
  }, [messages]);

  const autoOpen = useCallback(async (plan: TripPlan) => {
    if (autoOpened.current.has(plan.id)) return;
    autoOpened.current.add(plan.id);
    setActivePlan(plan);
    setResultsOpen(true);
    setEntities(await getPlanEntities(plan.id));
  }, []);

  const deleteEntity = useCallback((slug: string) => {
    setHiddenSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const toggleFav = useCallback((slug: string) => {
    setFavs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || typing) return;
      setInput("");
      setMessages((prev) => [...prev, { id: nextId(), role: "user", kind: "text", text: clean }]);
      setTyping(true);
      try {
        const res = await sendChatMessage(clean, history());
        if (res.type === "plan" && res.plan_id) {
          setLastQuery(clean);
          setMessages((prev) => [
            ...prev,
            { id: nextId(), role: "assistant", kind: "plan", text: res.text, planId: res.plan_id },
          ]);
            } else {
              setMessages((prev) => [
                ...prev,
                { id: nextId(), role: "assistant", kind: "text", text: res.text, suggestions: res.suggestions },
              ]);

              /* ✅ نیت recommend: موجودیت‌ها را در پنل راست نشان بده */
              if (res.entities && res.entities.length > 0) {
                setEntities(res.entities);
                setActivePlan({
                  id: 0,
                  status: "completed",
                  title: res.panel_title ?? "پیشهادها",
                  summary: "",
                  days: [],
                  tips: [],
                  total_budget_min: null,
                  total_budget_max: null,
                  currency: "",
                  recommended_hotel: null,
                } as unknown as TripPlan);   /* ✅ cast دومرحله‌ای = بدون خطای TS */
                setResultsOpen(true);
              }
            }
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", kind: "text", text: e instanceof Error ? e.message : "خطا در ارتباط با دستیار" },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [typing, history],
  );

  const reset = () => {
    setMessages([]);
    setActivePlan(null);
    setEntities([]);
    setLastQuery("");
    setHiddenSlugs([]);
    setResultsOpen(true);
    autoOpened.current.clear();
    try { localStorage.removeItem(LS_KEY); } catch {}
  };

  return (
    <div className="fixed inset-0 z-[500] flex">
      {/* ═══ سمت راست: پنل نتایج یا backdrop ═══ */}
      <div className="flex-1 min-w-0">
        {activePlan && resultsOpen ? (
          <TripResultsView
            plan={activePlan}
            entities={entities}
            query={lastQuery}
            hiddenSlugs={hiddenSlugs}
            favs={favs}
            onDelete={deleteEntity}
            onToggleFav={toggleFav}
            onClose={() => setResultsOpen(false)}
          />
        ) : (
          <div className="w-full h-full bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
        )}
      </div>

      {/* ═══ ریل چت — سمت چپ ═══ */}
      <aside className="w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-divider">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </span>
            <div>
              <h2 className="font-extrabold text-sm">دستیار سفر</h2>
              <p className="text-[10px] text-text-muted">بپرس یا برنامه بساز</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={reset} className="p-2 rounded-lg hover:bg-bg-sec transition" title="گفتگوی جدید">
              <Plus className="w-4 h-4" />
            </button>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-bg-sec transition" title="بستن">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center pt-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-extrabold text-sm mb-2">سلام! من دستیار سفرتم 👋</h3>
              <p className="text-xs text-text-muted leading-6 mb-5">
                هر سوال سفری داری بپرس، یا بگو چه برنامه‌ای می‌خوای تا برات بچینم.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {["برنامه ۳ روزه استانبول", "هتل ارزان در دبی", "ویزای ترکیه چه مدارکی می‌خواد؟"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="px-3 py-1.5 rounded-full border border-border text-[11px] font-bold text-text-muted hover:border-primary hover:text-primary transition cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                📋 ساخت برنامه با فرم
              </button>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] ${m.role === "user" ? "" : "w-full"}`}>
                {m.kind === "text" && (
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-6 whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-es-sm"     /* ✅ من: راست، گوشه پایین-راص صاف */
                        : "bg-bg-sec text-text rounded-ee-sm"       /* ✅ AI: چپ، گوشه پایین-چپ صاف */
                    }`}
                  >
                    {m.text}
                  </div>
                )}
                {m.kind === "plan" && (
                  <>
                    <div className="px-4 py-2.5 rounded-2xl rounded-bs-sm bg-bg-sec text-xs leading-6 mb-1">{m.text}</div>
                    {m.planId && <PlanCard planId={m.planId} onReady={autoOpen} hiddenSlugs={hiddenSlugs} />}
                  </>
                )}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="px-2.5 py-1 rounded-full border border-border text-[10px] font-bold text-text-muted hover:border-primary hover:text-primary transition cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl rounded-bs-sm bg-bg-sec flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:240ms]" />
              </div>
            </div>
          )}
        </div>

        {/* ═══ ✅ نوار بازکردن نتایج (وقتی بسته است) ═══ */}
        {activePlan && !resultsOpen && (
          <button
            type="button"
            onClick={() => setResultsOpen(true)}
            className="mx-3 mb-2 flex items-center gap-2.5 rounded-xl border border-border bg-bg-sec px-3 py-2.5 text-start hover:border-primary/50 hover:bg-primary/5 transition cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Maximize2 className="w-4 h-4 text-primary" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[11px] font-extrabold truncate">
                باز کردن نتایج «{lastQuery || activePlan.title}»
              </span>
              <span className="block text-[10px] text-text-muted">
                {formatCount(visibleCount(entities, hiddenSlugs))} مکان • نقشه و لیست
              </span>
            </span>
          </button>
        )}

        {showForm && (
          <TripFormCard
            onClose={() => setShowForm(false)}
            onCreated={(planId) => {
              setMessages((prev) => [
                ...prev,
                { id: nextId(), role: "assistant", kind: "plan", text: "برنامه‌ات از طریق فرم ثبت شد؛ دارم می‌سازمش 🗺️", planId },
              ]);
            }}
          />
        )}

        <div className="p-3 border-t border-divider">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-end gap-2"
          >
            <button
              type="button"
              onClick={() => setShowForm((s) => !s)}
              title="ساخت برنامه با فرم"
              className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition cursor-pointer ${
                showForm ? "border-primary bg-primary/10 text-primary" : "border-border text-text-muted hover:border-primary hover:text-primary"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              rows={1}
              placeholder="بنویس: برنامه ۴ روزه استانبول با بودجه متوسط..."
              className="flex-1 resize-none rounded-xl border border-border bg-bg-sec px-4 py-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition max-h-28"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 hover:opacity-95 transition disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4 -scale-x-100" />
            </button>
          </form>
          <p className="text-[10px] text-text-subtle mt-2 text-center">Enter برای ارسال • Shift+Enter برای خط جدید</p>
        </div>
      </aside>
    </div>
  );
}

/* تعداد مکان‌های قابل نمایش */
function visibleCount(entities: TripEntity[], hidden: string[]): number {
  return entities.filter((e) => !hidden.includes(e.slug)).length;
}
function formatCount(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}