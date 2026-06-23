import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Btn, TextArea, Input, CopyBtn, Field, Result } from "../ui";
import { apiFetch } from "../../lib/supabase";

// Componente genérico para ferramentas de IA (chama /api/ai com o "tool").
function AiTool({ tool, placeholder, extra, rows = 6, label = "Texto" }) {
  const [input, setInput] = useState(""); const [extraVal, setExtraVal] = useState("");
  const [out, setOut] = useState(""); const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const run = async () => {
    setLoading(true); setErr(""); setOut("");
    const finalInput = extra ? `${extraVal}\n\n${input}` : input;
    try {
      const res = await apiFetch("/api/ai", { method: "POST", body: JSON.stringify({ tool, input: finalInput }) });
      const d = await res.json();
      if (!res.ok) setErr(d.error || "IA indisponível.");
      else setOut(d.output || "");
    } catch { setErr("Falha ao consultar a IA."); } finally { setLoading(false); }
  };
  return (
    <div className="space-y-3">
      {extra && <Field label={extra}><Input value={extraVal} onChange={setExtraVal} placeholder={extra} /></Field>}
      <Field label={label}><TextArea value={input} onChange={setInput} placeholder={placeholder} rows={rows} /></Field>
      <Btn onClick={run} disabled={loading || !input.trim()}>{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando…</> : "Gerar com IA"}</Btn>
      {err && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">{err}</div>}
      {out && <Result><pre className="whitespace-pre-wrap text-sm">{out}</pre><div className="mt-3"><CopyBtn text={out} /></div></Result>}
    </div>
  );
}

export const IaResumir = () => <AiTool tool="resumir" placeholder="Cole o texto para resumir…" rows={8} />;
export const IaTraduzir = () => <AiTool tool="traduzir" extra="Idioma de destino" placeholder="Texto a traduzir…" />;
export const IaReescrever = () => <AiTool tool="reescrever" placeholder="Texto a reescrever…" />;
export const IaGramatica = () => <AiTool tool="gramatica" placeholder="Texto para corrigir…" />;
export const IaMelhorar = () => <AiTool tool="melhorar" placeholder="Texto para melhorar…" />;
export const IaEmail = () => <AiTool tool="email" label="Descreva o e-mail" placeholder="Ex.: cobrança gentil de fatura em atraso ao cliente João" />;
export const IaContrato = () => <AiTool tool="contrato" label="Descreva o contrato" placeholder="Ex.: prestação de serviço de design, R$ 2000, 30 dias" />;
export const IaProposta = () => <AiTool tool="proposta" label="Descreva a proposta" placeholder="Ex.: criação de site institucional para clínica" />;
export const IaDescricao = () => <AiTool tool="descricao" label="Descreva o produto" placeholder="Ex.: tênis de corrida leve, solado em EVA, unissex" />;
export const IaTitulos = () => <AiTool tool="titulos" label="Tema" placeholder="Ex.: como economizar na conta de luz" rows={2} />;
export const IaPosts = () => <AiTool tool="posts" label="Tema do post" placeholder="Ex.: lançamento de novo curso de Python" rows={2} />;
export const IaCurriculo = () => <AiTool tool="curriculo" label="Suas informações" placeholder="Nome, experiências, habilidades, objetivo…" rows={8} />;
export const IaChat = () => <AiTool tool="chat" label="Sua pergunta" placeholder="Pergunte qualquer coisa…" />;
