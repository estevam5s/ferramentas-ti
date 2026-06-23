import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, brl } from "../lib/supabase";

export default function Pricing({ plans, currentSlug, isPaid }) {
  const { user } = useAuth();
  const [cycle, setCycle] = useState("month");
  const [busy, setBusy] = useState(null);

  const act = async (plan) => {
    if (!user) { window.location.href = "/login?mode=signup"; return; }
    if (plan.slug === currentSlug && isPaid) {
      setBusy(plan.slug);
      const r = await apiFetch("/api/portal", { method: "POST" }); const d = await r.json();
      if (d.url) window.location.href = d.url; else setBusy(null);
      return;
    }
    if (plan.slug === "free") { window.location.href = "/app"; return; }
    setBusy(plan.slug);
    const r = await apiFetch("/api/checkout", { method: "POST", body: JSON.stringify({ slug: plan.slug, cycle }) });
    const d = await r.json();
    if (d.url) window.location.href = d.url; else { alert(d.error || "Erro"); setBusy(null); }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className={`text-sm ${cycle === "month" ? "font-medium text-text" : "text-gray-400"}`}>Mensal</span>
        <button onClick={() => setCycle(cycle === "month" ? "year" : "month")} className="relative h-7 w-14 rounded-full border bg-gray-200">
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-primary transition-all ${cycle === "year" ? "left-7" : "left-0.5"}`} />
        </button>
        <span className={`text-sm ${cycle === "year" ? "font-medium text-text" : "text-gray-400"}`}>Anual <span className="font-medium text-primary">−20%</span></span>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const current = plan.slug === currentSlug;
          const price = plan.price_month === 0 ? "R$ 0" : cycle === "year" ? brl(Math.round(plan.price_year / 12)) : brl(plan.price_month);
          const sub = plan.price_month === 0 ? "7 dias grátis" : cycle === "year" ? `/mês · ${brl(plan.price_year)}/ano` : "/mês";
          return (
            <div key={plan.slug} className={`flex flex-col rounded-2xl border bg-white p-6 ${plan.highlighted ? "border-primary shadow-lg ring-1 ring-primary/20" : ""}`}>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-text">{plan.name}</h3>
                  {plan.highlighted && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">Popular</span>}
                  {current && <span className="rounded-full border px-2 py-0.5 text-[10px] text-gray-500">Atual</span>}
                </div>
                <div className="mt-2 text-3xl font-bold text-text">{price}</div>
                <p className="text-xs text-gray-400">{sub}</p>
                <p className="mt-2 min-h-[2.5rem] text-sm text-gray-500">{plan.description}</p>
              </div>
              <ul className="flex-1 space-y-2.5">
                {(plan.features || []).slice(0, 7).map((f) => <li key={f} className="flex items-start gap-2 text-sm text-gray-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}</li>)}
              </ul>
              <button onClick={() => act(plan)} disabled={(current && !isPaid) || busy === plan.slug} className={`mt-6 inline-flex h-10 items-center justify-center rounded-lg text-sm font-semibold transition ${plan.highlighted ? "bg-primary text-white hover:opacity-90" : "border border-gray-300 text-text hover:bg-gray-50"} disabled:opacity-60`}>
                {busy === plan.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : current && isPaid ? "Gerenciar" : current ? "Plano atual" : plan.slug === "free" ? "Começar grátis" : `Assinar ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
