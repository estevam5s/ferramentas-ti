import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Lock, Clock, Sparkles } from "lucide-react";
import { toolBySlug, canUseTool, CATEGORIES } from "../tools/registry";
import { IMPLEMENTATIONS } from "../tools/impl";
import { Icon } from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/supabase";
import AppShell from "../components/AppShell";

export default function ToolPage() {
  const { slug } = useParams();
  const { planSlug } = useAuth();
  const tool = toolBySlug(slug);

  useEffect(() => {
    // registra uso (não bloqueia a UI; gating de IA é no /api/ai)
    if (tool && IMPLEMENTATIONS[slug] && !tool.ai) {
      apiFetch("/api/usage", { method: "POST", body: JSON.stringify({ tool: slug, category: tool.category }) }).catch(() => {});
    }
  }, [slug, tool]);

  if (!tool) {
    return <AppShell><p className="text-gray-500">Ferramenta não encontrada.</p></AppShell>;
  }
  const ci = CATEGORIES.find((c) => c.id === tool.category) || {};
  const ok = canUseTool(tool, planSlug);
  const Impl = IMPLEMENTATIONS[slug];

  return (
    <AppShell>
      <Link to="/app" className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-text"><ArrowLeft className="h-4 w-4" /> Todas as ferramentas</Link>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl text-white" style={{ background: ci.color }}><Icon name={ci.icon} className="h-6 w-6" /></span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text">{tool.name}</h1>
            {tool.ai && <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700"><Sparkles className="h-3 w-3" /> IA</span>}
          </div>
          {tool.desc && <p className="text-sm text-gray-500">{tool.desc}</p>}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        {!ok ? (
          <Paywall min={tool.min} />
        ) : Impl ? (
          <Impl />
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Clock className="h-10 w-10 text-gray-300" />
            <p className="font-medium text-text">Em breve</p>
            <p className="max-w-sm text-sm text-gray-500">Esta ferramenta está em desenvolvimento e será liberada em breve. Explore as outras 80+ já disponíveis.</p>
            <Link to="/app" className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Ver ferramentas</Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Paywall({ min }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-white"><Lock className="h-6 w-6" /></span>
      <p className="font-semibold text-text">Disponível no plano {min}+</p>
      <p className="max-w-sm text-sm text-gray-500">Faça upgrade para desbloquear esta e todas as outras ferramentas da plataforma.</p>
      <Link to="/app/billing" className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">Ver planos</Link>
    </div>
  );
}
