import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Wrench, Shield, Sparkles, Zap, Lock } from "lucide-react";
import { CATEGORIES, TOOLS } from "../tools/registry";
import { Icon } from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { supabase, brl } from "../lib/supabase";

const ALT = [
  ["iLovePDF", "PDF"], ["iLoveIMG", "Imagens"], ["LastPass", "Senhas"], ["Canva", "Design"], ["ChatGPT", "IA"],
];

export default function Home() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  useEffect(() => { supabase.from("plans").select("*").eq("active", true).order("sort_order").then(({ data }) => setPlans(data || [])); }, []);

  return (
    <div className="min-h-screen bg-white text-text">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white"><Wrench className="h-4.5 w-4.5" /></span><span className="text-lg font-bold">Toolzz</span></Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#ferramentas" className="text-gray-600 hover:text-text">Ferramentas</a>
            <a href="#precos" className="text-gray-600 hover:text-text">Preços</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? <Link to="/app" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Ir para o painel</Link> : <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-text">Entrar</Link>
              <Link to="/login?mode=signup" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Começar grátis</Link>
            </>}
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute -top-32 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> {TOOLS.length}+ ferramentas numa só assinatura</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Todas as suas ferramentas digitais <span className="text-primary">num só lugar</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">PDF, imagens, IA, segurança, desenvolvimento, finanças e muito mais. A alternativa brasileira ao Adobe, iLovePDF, LastPass e Canva — em português e em Reais.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/login?mode=signup" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white hover:opacity-90">Começar grátis <ArrowRight className="h-4 w-4" /></Link>
            <a href="#ferramentas" className="inline-flex items-center rounded-full border px-7 py-3.5 text-sm font-semibold hover:bg-gray-50">Ver ferramentas</a>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400"><Check className="h-3.5 w-3.5 text-primary" /> 7 dias grátis · sem cartão para começar</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <span>Substitui:</span>
            {ALT.map(([n]) => <span key={n} className="font-medium text-gray-500 line-through decoration-primary/40">{n}</span>)}
          </div>
        </div>
      </section>

      {/* categorias */}
      <section id="ferramentas" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">10 categorias, {TOOLS.length}+ ferramentas</h2>
          <p className="mt-3 text-gray-500">Tudo o que você precisa para o dia a dia digital — sem instalar nada.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const count = TOOLS.filter((t) => t.category === c.id).length;
            return (
              <Link to={user ? "/app" : "/login?mode=signup"} key={c.id} className="group flex items-start gap-4 rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: c.color }}><Icon name={c.icon} className="h-5 w-5" /></span>
                <div><h3 className="font-semibold">{c.name}</h3><p className="text-sm text-gray-500">{count} ferramentas</p></div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* diferenciais */}
      <section className="border-y bg-gray-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
          {[[Shield, "Privacidade", "A maioria das ferramentas roda no seu navegador — seus arquivos não saem do dispositivo."], [Zap, "Rápido e sem instalar", "Acesse de qualquer lugar, direto no navegador. Sem downloads, sem cadastro complicado."], [Sparkles, "IA integrada", "Resuma, traduza, reescreva e gere conteúdo com inteligência artificial em português."]].map(([I, t, d]) => (
            <div key={t} className="rounded-xl border bg-white p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-primary"><I className="h-5 w-5" /></span><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1 text-sm text-gray-500">{d}</p></div>
          ))}
        </div>
      </section>

      {/* preços */}
      {plans.length > 0 && (
        <section id="precos" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-primary">Planos</span>
            <h2 className="mt-4 text-3xl font-bold">Uma assinatura no lugar de cinco</h2>
            <p className="mt-3 text-gray-500">7 dias grátis · em Reais · anual com −20% · reembolso em até 7 dias.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <div key={p.slug} className={`flex flex-col rounded-2xl border bg-white p-6 ${p.highlighted ? "border-primary shadow-lg ring-1 ring-primary/20" : ""}`}>
                <div className="flex items-center gap-2"><h3 className="text-lg font-bold">{p.name}</h3>{p.highlighted && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">Popular</span>}</div>
                <div className="mt-2 text-3xl font-bold">{p.price_month === 0 ? "R$ 0" : brl(p.price_month)}</div>
                <p className="text-xs text-gray-400">{p.price_month === 0 ? "7 dias grátis" : "/mês"}</p>
                <p className="mt-2 min-h-[2.5rem] text-sm text-gray-500">{p.description}</p>
                <ul className="mt-3 flex-1 space-y-2">{(p.features || []).slice(0, 6).map((f) => <li key={f} className="flex items-start gap-2 text-sm text-gray-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}</li>)}</ul>
                <Link to="/login?mode=signup" className={`mt-6 inline-flex h-10 items-center justify-center rounded-lg text-sm font-semibold ${p.highlighted ? "bg-primary text-white" : "border border-gray-300 text-text hover:bg-gray-50"}`}>{p.slug === "free" ? "Começar grátis" : `Assinar ${p.name}`}</Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">Pagamento seguro via Stripe · Cancele quando quiser · Reembolso em até 7 dias (CDC art. 49)</p>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-10 text-center text-white md:p-14">
          <h2 className="text-3xl font-bold md:text-4xl">Comece grátis hoje</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">7 dias com acesso completo a todas as ferramentas. Sem cartão para começar.</p>
          <Link to="/login?mode=signup" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary hover:bg-gray-50">Criar minha conta <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
          <div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-white"><Wrench className="h-3.5 w-3.5" /></span><span className="font-bold">Toolzz</span></div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Toolzz · Todas as ferramentas num só lugar</p>
        </div>
      </footer>
    </div>
  );
}
