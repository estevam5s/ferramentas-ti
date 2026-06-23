import { useState, useEffect, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2, Users, Activity, DollarSign } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, brl } from "../lib/supabase";

const TABS = [["overview", "Visão geral"], ["users", "Usuários"], ["usage", "Uso"], ["health", "Saúde"]];
const PLANS = ["free", "pessoal", "profissional", "empresarial"];

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const [tab, setTab] = useState("overview");
  const [cache, setCache] = useState({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (m) => {
    setBusy(true);
    const r = await apiFetch(`/api/admin?module=${m}`); const d = await r.json();
    setCache((c) => ({ ...c, [m]: d })); setBusy(false);
  }, []);
  useEffect(() => { if (isAdmin) load(tab); }, [tab, isAdmin, load]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!isAdmin) return <Navigate to="/app" replace />;

  const setPlan = async (user_id, slug) => { await apiFetch("/api/admin", { method: "POST", body: JSON.stringify({ action: "set_plan", user_id, slug }) }); load("users"); };
  const d = cache[tab];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/app" className="flex items-center gap-2 text-sm text-gray-500 hover:text-text"><ArrowLeft className="h-4 w-4" /> Painel</Link>
          <h1 className="text-lg font-bold text-text">Administração · Toolzz</h1>
        </div>
        <div className="mx-auto max-w-6xl px-6"><div className="flex gap-1 border-t">{TABS.map(([id, l]) => <button key={id} onClick={() => setTab(id)} className={`px-5 py-3 text-sm font-medium transition ${tab === id ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-text"}`}>{l}</button>)}</div></div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {busy && !d ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : <>
          {tab === "overview" && d && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat icon={Users} label="Usuários" value={d.users} />
                <Stat icon={Activity} label="Operações" value={d.usage} />
                <Stat icon={DollarSign} label="Pagantes" value={d.paying} />
                <Stat icon={DollarSign} label="MRR" value={brl(d.mrr || 0)} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card title="Receita"><Row k="MRR" v={brl(d.mrr || 0)} /><Row k="ARR" v={brl(d.arr || 0)} /><Row k="ARPU" v={brl(d.arpu || 0)} /></Card>
                <Card title="Usuários por plano">{Object.entries(d.byPlan || {}).map(([k, v]) => <Row key={k} k={k} v={String(v)} />)}</Card>
              </div>
            </div>
          )}
          {tab === "users" && d && (
            <div className="overflow-hidden rounded-xl border bg-white">
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500"><tr><th className="p-3 text-left">Usuário</th><th className="p-3 text-left">Plano</th><th className="p-3 text-left">Status</th></tr></thead>
                <tbody>{(d.users || []).map((u) => <tr key={u.id} className="border-t"><td className="p-3">{u.email}<div className="text-xs text-gray-400">{u.full_name}</div></td><td className="p-3"><select value={u.plan} onChange={(e) => setPlan(u.id, e.target.value)} className="rounded border px-2 py-1 text-xs">{PLANS.map((p) => <option key={p}>{p}</option>)}</select></td><td className="p-3 text-gray-500">{u.status}</td></tr>)}</tbody>
              </table>
            </div>
          )}
          {tab === "usage" && d && (
            <Card title="Últimas operações">{(d.usage || []).length === 0 ? <p className="text-sm text-gray-500">Nenhum uso ainda.</p> : (d.usage || []).slice(0, 40).map((u, i) => <div key={i} className="flex justify-between border-b py-1.5 text-sm"><span>{u.tool_slug} {u.is_ai && <span className="text-amber-600">· IA</span>}</span><span className="text-gray-400">{new Date(u.created_at).toLocaleString("pt-BR")}</span></div>)}</Card>
          )}
          {tab === "health" && d && <Card title="Saúde"><Row k="Stripe" v={d.stripe ? "✅" : "❌"} /><Row k="Webhook" v={d.webhook ? "✅" : "❌"} /><Row k="Supabase" v={d.supabase ? "✅" : "❌"} /><Row k="IA (OpenRouter)" v={d.ai ? "✅" : "❌"} /><Row k="Servidor" v={new Date(d.time).toLocaleString("pt-BR")} /></Card>}
        </>}
      </main>
    </div>
  );
}
function Stat({ icon: I, label, value }) { return <div className="rounded-xl border bg-white p-5"><div className="mb-2 flex items-center justify-between"><span className="text-sm text-gray-500">{label}</span><I className="h-4 w-4 text-gray-400" /></div><div className="text-2xl font-bold text-text">{value ?? 0}</div></div>; }
function Card({ title, children }) { return <div className="rounded-xl border bg-white p-6"><h3 className="mb-4 font-bold text-text">{title}</h3><div className="space-y-2 text-sm">{children}</div></div>; }
function Row({ k, v }) { return <div className="flex justify-between"><span className="capitalize text-gray-500">{k}</span><span className="font-medium text-text">{v}</span></div>; }
