import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Lock, Sparkles } from "lucide-react";
import { CATEGORIES, TOOLS, canUseTool } from "../tools/registry";
import { IMPLEMENTATIONS } from "../tools/impl";
import { Icon } from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import AppShell from "../components/AppShell";

export default function Dashboard() {
  const { planSlug } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("todos");
  const term = q.trim().toLowerCase();

  const filtered = TOOLS.filter((t) => {
    const okCat = cat === "todos" || t.category === cat;
    const okTerm = !term || t.name.toLowerCase().includes(term) || (t.desc || "").toLowerCase().includes(term);
    return okCat && okTerm;
  });
  const catInfo = (id) => CATEGORIES.find((c) => c.id === id) || {};

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Ferramentas</h1>
        <p className="text-sm text-gray-500">{TOOLS.length}+ ferramentas numa só assinatura.</p>
      </div>

      <div className="relative mx-auto mb-5 max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar ferramenta…" className="h-11 w-full rounded-full border border-gray-300 pl-10 pr-4 text-sm outline-none focus:border-primary" />
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button onClick={() => setCat("todos")} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${cat === "todos" ? "border-primary bg-primary text-white" : "bg-white text-gray-600 hover:text-text"}`}>Todas</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${cat === c.id ? "border-primary bg-primary text-white" : "bg-white text-gray-600 hover:text-text"}`}>
            <Icon name={c.icon} className="h-3.5 w-3.5" /> {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((t) => {
          const ci = catInfo(t.category);
          const ok = canUseTool(t, planSlug);
          const ready = !!IMPLEMENTATIONS[t.slug];
          return (
            <Link key={t.slug} to={`/app/t/${t.slug}`} className="group relative flex flex-col gap-2 rounded-xl border bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
              <span className="grid h-9 w-9 place-items-center rounded-lg text-white" style={{ background: ci.color }}><Icon name={ci.icon} className="h-4.5 w-4.5" /></span>
              <div className="flex items-start justify-between gap-1">
                <h3 className="text-sm font-semibold leading-tight text-text">{t.name}</h3>
                {!ok && <Lock className="h-3.5 w-3.5 shrink-0 text-gray-400" title={`Plano ${t.min}+`} />}
              </div>
              {t.desc && <p className="line-clamp-2 text-xs text-gray-500">{t.desc}</p>}
              <div className="mt-auto flex items-center gap-1.5 pt-1">
                {t.ai && <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700"><Sparkles className="h-2.5 w-2.5" /> IA</span>}
                {!ready && <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">em breve</span>}
              </div>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="mt-8 text-center text-gray-500">Nenhuma ferramenta encontrada.</p>}
    </AppShell>
  );
}
