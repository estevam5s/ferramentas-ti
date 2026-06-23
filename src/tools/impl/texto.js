import { useState } from "react";
import { Btn, TextArea, CopyBtn, Result, DownloadBtn } from "../ui";

export function CountWords() {
  const [v, setV] = useState("");
  const words = v.trim() ? v.trim().split(/\s+/).length : 0;
  const lines = v ? v.split("\n").length : 0;
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder="cole seu texto" rows={8} /><div className="grid grid-cols-3 gap-3">{[["Palavras", words], ["Caracteres", v.length], ["Linhas", lines]].map(([l, n]) => <Result key={l}><p className="text-2xl font-bold text-primary">{n}</p><p className="text-xs text-gray-500">{l}</p></Result>)}</div></div>;
}
export function CountChars() {
  const [v, setV] = useState("");
  const noSpace = v.replace(/\s/g, "").length;
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder="cole seu texto" rows={8} /><div className="grid grid-cols-2 gap-3"><Result><p className="text-2xl font-bold text-primary">{v.length}</p><p className="text-xs text-gray-500">Com espaços</p></Result><Result><p className="text-2xl font-bold text-primary">{noSpace}</p><p className="text-xs text-gray-500">Sem espaços</p></Result></div></div>;
}
export function ChangeCase() {
  const [v, setV] = useState("");
  const T = (fn) => fn(v);
  const title = (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  const [out, setOut] = useState("");
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder="cole seu texto" rows={5} /><div className="flex flex-wrap gap-2"><Btn onClick={() => setOut(T((s) => s.toUpperCase()))}>MAIÚSCULAS</Btn><Btn variant="outline" onClick={() => setOut(T((s) => s.toLowerCase()))}>minúsculas</Btn><Btn variant="outline" onClick={() => setOut(title(v))}>Título</Btn><Btn variant="outline" onClick={() => setOut(T((s) => s.charAt(0).toUpperCase() + s.slice(1)))}>Primeira</Btn>{out && <CopyBtn text={out} />}</div>{out && <Result><p className="whitespace-pre-wrap text-sm">{out}</p></Result>}</div>;
}

export function CsvExcel() {
  const [rows, setRows] = useState([]);
  const onFile = (f) => { const r = new FileReader(); r.onload = () => { const txt = r.result; const sep = txt.includes(";") && !txt.includes(",") ? ";" : ","; setRows(txt.split(/\r?\n/).filter(Boolean).map((l) => l.split(sep))); }; r.readAsText(f); };
  const toCsv = () => rows.map((r) => r.join(",")).join("\n");
  return (
    <div className="space-y-3">
      <input type="file" accept=".csv,.txt,.tsv" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} className="text-sm" />
      {rows.length > 0 && <>
        <div className="overflow-auto rounded-lg border"><table className="w-full text-sm">{rows.slice(0, 20).map((r, i) => <tr key={i} className={i === 0 ? "bg-gray-100 font-semibold" : ""}>{r.map((c, j) => <td key={j} className="border px-2 py-1">{c}</td>)}</tr>)}</table></div>
        <p className="text-xs text-gray-500">{rows.length} linhas. Exporte como CSV (abre no Excel/Sheets).</p>
        <div className="flex gap-2"><DownloadBtn data={toCsv()} filename="dados.csv" mime="text/csv" label="Baixar CSV" /><CopyBtn text={toCsv()} /></div>
      </>}
    </div>
  );
}
