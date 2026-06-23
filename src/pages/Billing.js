import { Crown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { brl } from "../lib/supabase";
import Pricing from "../components/Pricing";
import AppShell from "../components/AppShell";

export default function Billing() {
  const { sub, isAdmin } = useAuth();
  const plan = sub?.plan; const s = sub?.subscription;
  const currentSlug = isAdmin ? "empresarial" : plan?.slug || "free";
  const isPaid = currentSlug !== "free";
  const periodEnd = s?.current_period_end ? new Date(s.current_period_end).toLocaleDateString("pt-BR") : null;
  const refundUntil = s?.refund_eligible_until ? new Date(s.refund_eligible_until) : null;
  const refundActive = refundUntil ? refundUntil > new Date() : false;

  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-text">Meu plano</h1>
      <p className="text-sm text-gray-500">Gerencie sua assinatura. Cancele quando quiser.</p>

      <div className="my-8 rounded-2xl border bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">{isPaid && <Crown className="h-5 w-5 text-primary" />}<span className="text-sm text-gray-500">Plano atual</span></div>
            <h2 className="mt-1 text-2xl font-bold text-text">{plan?.name || "Grátis"}</h2>
            {isPaid && plan && <p className="mt-1 text-sm text-gray-500">{s?.cycle === "year" ? brl(plan.price_year) + "/ano" : brl(plan.price_month) + "/mês"}{periodEnd && <> · {s?.cancel_at_period_end ? "encerra" : "renova"} em {periodEnd}</>}</p>}
          </div>
          {isAdmin && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">Admin</span>}
        </div>
        {isPaid && refundActive && refundUntil && <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-primary">💰 Você pode pedir <b>reembolso integral</b> até {refundUntil.toLocaleDateString("pt-BR")} (7 dias).</div>}
      </div>

      <h3 className="mb-2 text-center text-xl font-bold text-text">{isPaid ? "Trocar de plano" : "Escolha seu plano"}</h3>
      <p className="mb-8 text-center text-sm text-gray-500">Em Reais, anual com −20%. Reembolso em até 7 dias.</p>
      <Pricing plans={sub?.plans || []} currentSlug={currentSlug} isPaid={isPaid} />
    </AppShell>
  );
}
