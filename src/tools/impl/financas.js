import { useState, useEffect } from "react";
import { Input, Field, Result, Btn } from "../ui";

const brl = (n) => (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ConversorMoedas() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD"); const [to, setTo] = useState("BRL");
  const [rate, setRate] = useState(null); const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const convert = async () => {
    setLoading(true); setErr("");
    try {
      const r = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
      const d = await r.json();
      if (d.result != null) setRate(d.result); else { const r2 = await fetch(`https://open.er-api.com/v6/latest/${from}`); const d2 = await r2.json(); setRate((d2.rates?.[to] || 0) * amount); }
    } catch { setErr("Não foi possível obter a cotação agora."); } finally { setLoading(false); }
  };
  const moedas = ["BRL", "USD", "EUR", "GBP", "ARS", "JPY", "CAD", "AUD", "CHF", "CNY"];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Valor"><Input type="number" value={amount} onChange={(v) => setAmount(Number(v))} /></Field>
        <Field label="De"><select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" value={from} onChange={(e) => setFrom(e.target.value)}>{moedas.map((m) => <option key={m}>{m}</option>)}</select></Field>
        <Field label="Para"><select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" value={to} onChange={(e) => setTo(e.target.value)}>{moedas.map((m) => <option key={m}>{m}</option>)}</select></Field>
      </div>
      <Btn onClick={convert} disabled={loading}>{loading ? "Convertendo…" : "Converter"}</Btn>
      {err && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">{err}</div>}
      {rate != null && <Result><p className="text-2xl font-bold text-primary">{amount} {from} = {rate.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} {to}</p></Result>}
    </div>
  );
}

export function CalcJuros() {
  const [p, setP] = useState(1000); const [i, setI] = useState(1); const [n, setN] = useState(12); const [tipo, setTipo] = useState("composto");
  const r = i / 100;
  const montante = tipo === "composto" ? p * Math.pow(1 + r, n) : p * (1 + r * n);
  return <div className="space-y-3"><div className="grid grid-cols-3 gap-3"><Field label="Capital (R$)"><Input type="number" value={p} onChange={(v) => setP(Number(v))} /></Field><Field label="Taxa (% ao mês)"><Input type="number" value={i} onChange={(v) => setI(Number(v))} /></Field><Field label="Meses"><Input type="number" value={n} onChange={(v) => setN(Number(v))} /></Field></div><div className="flex gap-3 text-sm"><label className="flex items-center gap-1.5"><input type="radio" checked={tipo === "composto"} onChange={() => setTipo("composto")} /> Composto</label><label className="flex items-center gap-1.5"><input type="radio" checked={tipo === "simples"} onChange={() => setTipo("simples")} /> Simples</label></div><Result><p className="text-sm text-gray-500">Montante final</p><p className="text-2xl font-bold text-primary">{brl(montante)}</p><p className="text-sm text-gray-500">Juros: <b>{brl(montante - p)}</b></p></Result></div>;
}

export function CalcEmprestimo() {
  const [val, setVal] = useState(10000); const [taxa, setTaxa] = useState(2); const [meses, setMeses] = useState(24);
  const r = taxa / 100;
  const parcela = r === 0 ? val / meses : (val * r) / (1 - Math.pow(1 + r, -meses));
  return <div className="space-y-3"><div className="grid grid-cols-3 gap-3"><Field label="Valor (R$)"><Input type="number" value={val} onChange={(v) => setVal(Number(v))} /></Field><Field label="Taxa (% a.m.)"><Input type="number" value={taxa} onChange={(v) => setTaxa(Number(v))} /></Field><Field label="Parcelas"><Input type="number" value={meses} onChange={(v) => setMeses(Number(v))} /></Field></div><Result><p className="text-sm text-gray-500">Parcela mensal (Tabela Price)</p><p className="text-2xl font-bold text-primary">{brl(parcela)}</p><p className="text-sm text-gray-500">Total: <b>{brl(parcela * meses)}</b> · Juros: <b>{brl(parcela * meses - val)}</b></p></Result></div>;
}

export function CalcInvestimento() {
  const [inicial, setInicial] = useState(1000); const [mensal, setMensal] = useState(300); const [taxa, setTaxa] = useState(0.8); const [meses, setMeses] = useState(36);
  const r = taxa / 100; let total = inicial;
  for (let m = 0; m < meses; m++) total = total * (1 + r) + mensal;
  const investido = inicial + mensal * meses;
  return <div className="space-y-3"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Field label="Inicial (R$)"><Input type="number" value={inicial} onChange={(v) => setInicial(Number(v))} /></Field><Field label="Aporte/mês"><Input type="number" value={mensal} onChange={(v) => setMensal(Number(v))} /></Field><Field label="Taxa (% a.m.)"><Input type="number" value={taxa} onChange={(v) => setTaxa(Number(v))} /></Field><Field label="Meses"><Input type="number" value={meses} onChange={(v) => setMeses(Number(v))} /></Field></div><Result><p className="text-sm text-gray-500">Montante final</p><p className="text-2xl font-bold text-primary">{brl(total)}</p><p className="text-sm text-gray-500">Investido: <b>{brl(investido)}</b> · Rendimento: <b>{brl(total - investido)}</b></p></Result></div>;
}

export function CalcImpostos() {
  const [salario, setSalario] = useState(5000);
  // INSS 2024 simplificado + IRRF
  const inss = (() => { let s = salario, t = 0; const faixas = [[1412, 0.075], [2666.68, 0.09], [4000.03, 0.12], [7786.02, 0.14]]; let prev = 0; for (const [lim, aliq] of faixas) { if (s > prev) { t += (Math.min(s, lim) - prev) * aliq; prev = lim; } } return Math.min(t, 908.86); })();
  const base = salario - inss;
  const irrf = (() => { if (base <= 2259.20) return 0; if (base <= 2826.65) return base * 0.075 - 169.44; if (base <= 3751.05) return base * 0.15 - 381.44; if (base <= 4664.68) return base * 0.225 - 662.77; return base * 0.275 - 896.00; })();
  return <div className="space-y-3"><Field label="Salário bruto (R$)"><Input type="number" value={salario} onChange={(v) => setSalario(Number(v))} /></Field><div className="grid grid-cols-3 gap-3">{[["INSS", inss], ["IRRF", Math.max(0, irrf)], ["Líquido", salario - inss - Math.max(0, irrf)]].map(([l, n]) => <Result key={l}><p className="text-xs text-gray-500">{l}</p><p className="text-lg font-bold text-primary">{brl(n)}</p></Result>)}</div><p className="text-xs text-gray-400">Estimativa com tabelas vigentes. Confirme com seu contador.</p></div>;
}
