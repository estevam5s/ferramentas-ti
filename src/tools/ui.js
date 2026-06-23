// Componentes de UI compartilhados pelas ferramentas.
import { Copy, Check, Download } from "lucide-react";
import { useState } from "react";

export function Btn({ children, onClick, variant = "primary", type = "button", disabled, className = "" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50";
  const styles = variant === "primary" ? "bg-primary text-white hover:opacity-90" : variant === "outline" ? "border border-gray-300 text-text hover:bg-gray-50" : "text-primary hover:underline";
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>{children}</button>;
}

export function TextArea({ value, onChange, placeholder, rows = 8, mono }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    className={`w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-primary ${mono ? "font-mono" : ""}`} />;
}

export function Input({ value, onChange, placeholder, type = "text", className = "" }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    className={`w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary ${className}`} />;
}

export function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  return (
    <Btn variant="outline" onClick={() => { navigator.clipboard.writeText(text || ""); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      {done ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />} {done ? "Copiado" : "Copiar"}
    </Btn>
  );
}

export function DownloadBtn({ data, filename, mime = "text/plain", label = "Baixar" }) {
  const dl = () => {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return <Btn variant="outline" onClick={dl}><Download className="h-4 w-4" /> {label}</Btn>;
}

export function Field({ label, children }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-text">{label}</span>{children}</label>;
}

export function Result({ children }) {
  return <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">{children}</div>;
}

export function FileDrop({ accept, multiple, onFiles, label = "Selecione ou arraste arquivos" }) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); onFiles([...e.dataTransfer.files]); }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition ${drag ? "border-primary bg-teal-50" : "border-gray-300 hover:border-primary"}`}
    >
      <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => onFiles([...e.target.files])} />
      <span className="text-sm font-medium text-text">{label}</span>
      <span className="text-xs text-gray-400">{accept || "Qualquer arquivo"}</span>
    </label>
  );
}
