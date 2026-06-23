import { useState } from "react";
import jsyaml from "js-yaml";
import { marked } from "marked";
import { Btn, TextArea, Input, CopyBtn, Field, Result } from "../ui";

export function JsonFormatter() {
  const [v, setV] = useState(""); const [out, setOut] = useState(""); const [err, setErr] = useState("");
  const fmt = (min) => { try { const o = JSON.parse(v); setOut(JSON.stringify(o, null, min ? 0 : 2)); setErr(""); } catch (e) { setErr(e.message); setOut(""); } };
  return (
    <div className="space-y-3">
      <TextArea value={v} onChange={setV} placeholder='{"exemplo": 1}' mono />
      <div className="flex gap-2"><Btn onClick={() => fmt(false)}>Formatar</Btn><Btn variant="outline" onClick={() => fmt(true)}>Minificar</Btn>{out && <CopyBtn text={out} />}</div>
      {err && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">JSON inválido: {err}</div>}
      {out && <Result><pre className="overflow-auto whitespace-pre-wrap text-sm font-mono">{out}</pre></Result>}
    </div>
  );
}

export function XmlFormatter() {
  const [v, setV] = useState(""); const [out, setOut] = useState("");
  const fmt = () => {
    let formatted = "", indent = 0;
    v.replace(/>\s*</g, "><").split(/(<[^>]+>)/).forEach((node) => {
      if (!node.trim()) return;
      if (node.match(/^<\//)) indent--;
      if (node.match(/^</)) formatted += "  ".repeat(Math.max(0, indent)) + node + "\n";
      else formatted += "  ".repeat(Math.max(0, indent)) + node.trim() + "\n";
      if (node.match(/^<[^/!?]/) && !node.match(/\/>$/)) indent++;
    });
    setOut(formatted.trim());
  };
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder="<root><item>1</item></root>" mono /><div className="flex gap-2"><Btn onClick={fmt}>Formatar</Btn>{out && <CopyBtn text={out} />}</div>{out && <Result><pre className="overflow-auto whitespace-pre-wrap text-sm font-mono">{out}</pre></Result>}</div>;
}

export function YamlFormatter() {
  const [v, setV] = useState(""); const [out, setOut] = useState(""); const [err, setErr] = useState("");
  const toJson = () => { try { setOut(JSON.stringify(jsyaml.load(v), null, 2)); setErr(""); } catch (e) { setErr(e.message); } };
  const toYaml = () => { try { setOut(jsyaml.dump(JSON.parse(v))); setErr(""); } catch (e) { setErr(e.message); } };
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder="cole YAML ou JSON" mono /><div className="flex gap-2"><Btn onClick={toJson}>YAML → JSON</Btn><Btn variant="outline" onClick={toYaml}>JSON → YAML</Btn>{out && <CopyBtn text={out} />}</div>{err && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</div>}{out && <Result><pre className="overflow-auto whitespace-pre-wrap text-sm font-mono">{out}</pre></Result>}</div>;
}

export function Base64() {
  const [v, setV] = useState(""); const [out, setOut] = useState("");
  const enc = () => { try { setOut(btoa(unescape(encodeURIComponent(v)))); } catch { setOut("erro"); } };
  const dec = () => { try { setOut(decodeURIComponent(escape(atob(v)))); } catch { setOut("Base64 inválido"); } };
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder="texto ou Base64" mono /><div className="flex gap-2"><Btn onClick={enc}>Codificar</Btn><Btn variant="outline" onClick={dec}>Decodificar</Btn>{out && <CopyBtn text={out} />}</div>{out && <Result><pre className="overflow-auto whitespace-pre-wrap text-sm font-mono">{out}</pre></Result>}</div>;
}

export function UrlEncode() {
  const [v, setV] = useState(""); const [out, setOut] = useState("");
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder="texto ou URL" mono rows={4} /><div className="flex gap-2"><Btn onClick={() => setOut(encodeURIComponent(v))}>Codificar</Btn><Btn variant="outline" onClick={() => { try { setOut(decodeURIComponent(v)); } catch { setOut("inválido"); } }}>Decodificar</Btn>{out && <CopyBtn text={out} />}</div>{out && <Result><pre className="overflow-auto whitespace-pre-wrap text-sm font-mono">{out}</pre></Result>}</div>;
}

export function RegexTester() {
  const [pat, setPat] = useState(""); const [flags, setFlags] = useState("g"); const [text, setText] = useState("");
  let matches = []; let err = "";
  try { if (pat) { const re = new RegExp(pat, flags); matches = [...text.matchAll(re.flags.includes("g") ? re : new RegExp(pat, flags + "g"))]; } } catch (e) { err = e.message; }
  return (
    <div className="space-y-3">
      <div className="flex gap-2"><Input value={pat} onChange={setPat} placeholder="\\d+" className="font-mono" /><Input value={flags} onChange={setFlags} placeholder="flags (g,i,m)" className="w-32 font-mono" /></div>
      <TextArea value={text} onChange={setText} placeholder="texto para testar" mono />
      {err ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</div> : <Result><p className="text-sm font-medium">{matches.length} correspondência(s)</p><div className="mt-2 flex flex-wrap gap-1">{matches.slice(0, 50).map((m, i) => <span key={i} className="rounded bg-teal-100 px-2 py-0.5 text-xs font-mono text-primary">{m[0]}</span>)}</div></Result>}
    </div>
  );
}

export function SqlFormatter() {
  const [v, setV] = useState(""); const [out, setOut] = useState("");
  const fmt = () => {
    const kw = ["SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE"];
    let s = v.replace(/\s+/g, " ").trim();
    kw.forEach((k) => { s = s.replace(new RegExp(`\\b${k}\\b`, "gi"), "\n" + k); });
    setOut(s.replace(/,/g, ",\n  ").trim());
  };
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder="SELECT * FROM users WHERE id = 1" mono /><div className="flex gap-2"><Btn onClick={fmt}>Formatar</Btn>{out && <CopyBtn text={out} />}</div>{out && <Result><pre className="overflow-auto whitespace-pre-wrap text-sm font-mono">{out}</pre></Result>}</div>;
}

export function TimestampConv() {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [dt, setDt] = useState("");
  const fromTs = ts && !isNaN(ts) ? new Date(Number(ts) * (String(ts).length > 10 ? 1 : 1000)).toLocaleString("pt-BR") : "";
  return (
    <div className="space-y-3">
      <Field label="Unix timestamp (segundos)"><Input value={ts} onChange={setTs} placeholder="1700000000" className="font-mono" /></Field>
      {fromTs && <Result><p className="text-sm">Data: <b>{fromTs}</b></p></Result>}
      <Field label="Data (yyyy-mm-ddThh:mm)"><Input type="datetime-local" value={dt} onChange={setDt} /></Field>
      {dt && <Result><p className="text-sm">Timestamp: <b className="font-mono">{Math.floor(new Date(dt).getTime() / 1000)}</b></p></Result>}
      <Btn variant="outline" onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>Agora</Btn>
    </div>
  );
}

export function MarkdownConv() {
  const [v, setV] = useState("# Olá\n\nTexto **markdown**.");
  const html = marked.parse(v || "");
  return <div className="grid gap-3 md:grid-cols-2"><TextArea value={v} onChange={setV} rows={14} mono /><div className="rounded-lg border p-4 prose-sm" dangerouslySetInnerHTML={{ __html: html }} /></div>;
}

// CPF/CNPJ válidos para teste
function rand(n) { return Math.floor(Math.random() * n); }
function cpf() {
  const n = Array.from({ length: 9 }, () => rand(10));
  const d1 = ((s) => (s % 11 < 2 ? 0 : 11 - (s % 11)))(n.reduce((a, v, i) => a + v * (10 - i), 0));
  const d2 = ((s) => (s % 11 < 2 ? 0 : 11 - (s % 11)))([...n, d1].reduce((a, v, i) => a + v * (11 - i), 0));
  const f = [...n, d1, d2].join("");
  return f.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function cnpj() {
  const n = Array.from({ length: 12 }, () => rand(10));
  const calc = (arr) => { const w = arr.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]; const s = arr.reduce((a, v, i) => a + v * w[i], 0); return s % 11 < 2 ? 0 : 11 - (s % 11); };
  const d1 = calc(n); const d2 = calc([...n, d1]);
  return [...n, d1, d2].join("").replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}
export function GenCpf() { const [v, setV] = useState(cpf()); return <div className="space-y-3"><Result><p className="text-xl font-mono font-bold">{v}</p></Result><div className="flex gap-2"><Btn onClick={() => setV(cpf())}>Gerar novo</Btn><CopyBtn text={v} /></div><p className="text-xs text-gray-400">CPF válido apenas para testes de software.</p></div>; }
export function GenCnpj() { const [v, setV] = useState(cnpj()); return <div className="space-y-3"><Result><p className="text-xl font-mono font-bold">{v}</p></Result><div className="flex gap-2"><Btn onClick={() => setV(cnpj())}>Gerar novo</Btn><CopyBtn text={v} /></div><p className="text-xs text-gray-400">CNPJ válido apenas para testes.</p></div>; }

const NOMES = ["Ana Silva", "Bruno Costa", "Carla Souza", "Diego Lima", "Elaine Rocha", "Felipe Alves", "Gabriela Dias", "Hugo Martins"];
const DOM = ["email.com", "teste.com.br", "exemplo.org"];
export function GenFake() {
  const gen = () => { const nome = NOMES[rand(NOMES.length)]; return { nome, email: nome.toLowerCase().replace(/ /g, ".") + "@" + DOM[rand(DOM.length)], telefone: `(${10 + rand(89)}) 9${rand(10000) + 1000}-${rand(10000)}`, cpf: cpf(), cidade: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba"][rand(4)] }; };
  const [d, setD] = useState(gen());
  return <div className="space-y-3"><Result><div className="space-y-1 text-sm">{Object.entries(d).map(([k, v]) => <div key={k}><span className="text-gray-500 capitalize">{k}:</span> <b className="font-mono">{v}</b></div>)}</div></Result><div className="flex gap-2"><Btn onClick={() => setD(gen())}>Gerar novo</Btn><CopyBtn text={JSON.stringify(d, null, 2)} /></div></div>;
}

export function CompareText() {
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const la = a.split("\n"), lb = b.split("\n");
  const max = Math.max(la.length, lb.length);
  const diffs = [];
  for (let i = 0; i < max; i++) if ((la[i] || "") !== (lb[i] || "")) diffs.push({ line: i + 1, a: la[i] || "", b: lb[i] || "" });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2"><TextArea value={a} onChange={setA} placeholder="Texto A" mono /><TextArea value={b} onChange={setB} placeholder="Texto B" mono /></div>
      <Result><p className="text-sm font-medium">{diffs.length} linha(s) diferente(s)</p>{diffs.slice(0, 30).map((d) => <div key={d.line} className="mt-1 text-xs font-mono"><span className="text-gray-400">L{d.line}:</span> <span className="text-red-600">- {d.a}</span> <span className="text-green-600">+ {d.b}</span></div>)}</Result>
    </div>
  );
}
