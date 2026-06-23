import { useState } from "react";
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import { Btn, Input, Field, Result, FileDrop } from "../ui";

function dl(bytes, name) { const blob = new Blob([bytes], { type: "application/pdf" }); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = name; a.click(); URL.revokeObjectURL(u); }
const readBuf = (f) => f.arrayBuffer();

export function MergePdf() {
  const [files, setFiles] = useState([]); const [busy, setBusy] = useState(false);
  const run = async () => { setBusy(true); const out = await PDFDocument.create(); for (const f of files) { const src = await PDFDocument.load(await readBuf(f)); const pages = await out.copyPages(src, src.getPageIndices()); pages.forEach((p) => out.addPage(p)); } dl(await out.save(), "juntado.pdf"); setBusy(false); };
  return <div className="space-y-3"><FileDrop accept="application/pdf" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} label="Selecione 2+ PDFs" />{files.length > 0 && <Result><p className="text-sm">{files.length} arquivo(s): {files.map((f) => f.name).join(", ")}</p></Result>}<Btn onClick={run} disabled={files.length < 2 || busy}>{busy ? "Juntando…" : "Juntar PDFs"}</Btn></div>;
}

export function SplitPdf() {
  const [file, setFile] = useState(null); const [range, setRange] = useState("1-1"); const [info, setInfo] = useState("");
  const run = async () => { const src = await PDFDocument.load(await readBuf(file)); const total = src.getPageCount(); const [a, b] = range.split("-").map((x) => parseInt(x)); const start = Math.max(1, a) - 1, end = Math.min(total, b || a); const out = await PDFDocument.create(); const idx = []; for (let i = start; i < end; i++) idx.push(i); const pages = await out.copyPages(src, idx); pages.forEach((p) => out.addPage(p)); dl(await out.save(), "dividido.pdf"); };
  return <div className="space-y-3"><FileDrop accept="application/pdf" onFiles={async (f) => { setFile(f[0]); const src = await PDFDocument.load(await readBuf(f[0])); setInfo(`${src.getPageCount()} páginas`); }} />{info && <p className="text-sm text-gray-500">{info}</p>}{file && <><Field label="Intervalo (ex.: 1-3)"><Input value={range} onChange={setRange} /></Field><Btn onClick={run}>Extrair intervalo</Btn></>}</div>;
}

export function RotatePdf() {
  const [file, setFile] = useState(null);
  const run = async (deg) => { const src = await PDFDocument.load(await readBuf(file)); src.getPages().forEach((p) => p.setRotation(degrees(p.getRotation().angle + deg))); dl(await src.save(), "girado.pdf"); };
  return <div className="space-y-3"><FileDrop accept="application/pdf" onFiles={(f) => setFile(f[0])} />{file && <div className="flex gap-2"><Btn onClick={() => run(90)}>Girar 90°</Btn><Btn variant="outline" onClick={() => run(180)}>180°</Btn><Btn variant="outline" onClick={() => run(270)}>270°</Btn></div>}</div>;
}

export function NumberPdf() {
  const [file, setFile] = useState(null);
  const run = async () => { const src = await PDFDocument.load(await readBuf(file)); const font = await src.embedFont(StandardFonts.Helvetica); src.getPages().forEach((p, i) => { const { width } = p.getSize(); p.drawText(`${i + 1}`, { x: width / 2, y: 20, size: 11, font, color: rgb(0.3, 0.3, 0.3) }); }); dl(await src.save(), "numerado.pdf"); };
  return <div className="space-y-3"><FileDrop accept="application/pdf" onFiles={(f) => setFile(f[0])} />{file && <Btn onClick={run}>Adicionar numeração</Btn>}</div>;
}

export function WatermarkPdf() {
  const [file, setFile] = useState(null); const [text, setText] = useState("CONFIDENCIAL");
  const run = async () => { const src = await PDFDocument.load(await readBuf(file)); const font = await src.embedFont(StandardFonts.HelveticaBold); src.getPages().forEach((p) => { const { width, height } = p.getSize(); p.drawText(text, { x: width / 2 - 150, y: height / 2, size: 48, font, color: rgb(0.9, 0.2, 0.2), opacity: 0.25, rotate: degrees(45) }); }); dl(await src.save(), "marca-dagua.pdf"); };
  return <div className="space-y-3"><FileDrop accept="application/pdf" onFiles={(f) => setFile(f[0])} />{file && <><Field label="Texto"><Input value={text} onChange={setText} /></Field><Btn onClick={run}>Aplicar marca d'água</Btn></>}</div>;
}

export function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const run = async () => { const out = await PDFDocument.create(); for (const f of files) { const buf = await readBuf(f); const img = f.type.includes("png") ? await out.embedPng(buf) : await out.embedJpg(buf); const page = out.addPage([img.width, img.height]); page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height }); } dl(await out.save(), "imagens.pdf"); };
  return <div className="space-y-3"><FileDrop accept="image/png,image/jpeg" multiple onFiles={(f) => setFiles((p) => [...p, ...f])} label="Selecione imagens (JPG/PNG)" />{files.length > 0 && <Result><p className="text-sm">{files.length} imagem(ns)</p></Result>}<Btn onClick={run} disabled={!files.length}>Converter para PDF</Btn></div>;
}

export function ExtractPages() {
  const [file, setFile] = useState(null); const [pages, setPages] = useState("1,2"); const [info, setInfo] = useState("");
  const run = async () => { const src = await PDFDocument.load(await readBuf(file)); const idx = pages.split(",").map((x) => parseInt(x.trim()) - 1).filter((n) => n >= 0 && n < src.getPageCount()); const out = await PDFDocument.create(); const cp = await out.copyPages(src, idx); cp.forEach((p) => out.addPage(p)); dl(await out.save(), "paginas.pdf"); };
  return <div className="space-y-3"><FileDrop accept="application/pdf" onFiles={async (f) => { setFile(f[0]); const src = await PDFDocument.load(await readBuf(f[0])); setInfo(`${src.getPageCount()} páginas`); }} />{info && <p className="text-sm text-gray-500">{info}</p>}{file && <><Field label="Páginas (ex.: 1,3,5)"><Input value={pages} onChange={setPages} /></Field><Btn onClick={run}>Extrair</Btn></>}</div>;
}
