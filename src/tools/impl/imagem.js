import { useState, useRef } from "react";
import { Btn, Input, Field, Result, FileDrop } from "../ui";

function loadImg(file) { return new Promise((res) => { const img = new Image(); img.onload = () => res(img); img.src = URL.createObjectURL(file); }); }
function canvasToBlob(canvas, type, q) { return new Promise((res) => canvas.toBlob(res, type, q)); }
function download(blob, name) { const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = name; a.click(); URL.revokeObjectURL(u); }

export function CompressImage() {
  const [file, setFile] = useState(null); const [q, setQ] = useState(0.7); const [out, setOut] = useState(null);
  const run = async () => { const img = await loadImg(file); const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; c.getContext("2d").drawImage(img, 0, 0); const blob = await canvasToBlob(c, "image/jpeg", q); setOut({ blob, size: blob.size, url: URL.createObjectURL(blob) }); };
  return <div className="space-y-3"><FileDrop accept="image/*" onFiles={(f) => { setFile(f[0]); setOut(null); }} />{file && <><Field label={`Qualidade: ${Math.round(q * 100)}%`}><input type="range" min={0.1} max={1} step={0.05} value={q} onChange={(e) => setQ(Number(e.target.value))} className="w-full" /></Field><Btn onClick={run}>Comprimir</Btn></>}{out && <Result><img src={out.url} alt="" className="mb-2 max-h-64 rounded" /><p className="text-sm">Novo tamanho: <b>{(out.size / 1024).toFixed(1)} KB</b> ({file && ((1 - out.size / file.size) * 100).toFixed(0)}% menor)</p><Btn variant="outline" className="mt-2" onClick={() => download(out.blob, "comprimida.jpg")}>Baixar</Btn></Result>}</div>;
}

export function ResizeImage() {
  const [file, setFile] = useState(null); const [w, setW] = useState(800); const [h, setH] = useState(600); const [out, setOut] = useState(null);
  const run = async () => { const img = await loadImg(file); const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(img, 0, 0, w, h); const blob = await canvasToBlob(c, "image/png"); setOut(URL.createObjectURL(blob)); window._resizeBlob = blob; };
  return <div className="space-y-3"><FileDrop accept="image/*" onFiles={async (f) => { setFile(f[0]); const img = await loadImg(f[0]); setW(img.width); setH(img.height); }} />{file && <><div className="grid grid-cols-2 gap-3"><Field label="Largura"><Input type="number" value={w} onChange={(v) => setW(Number(v))} /></Field><Field label="Altura"><Input type="number" value={h} onChange={(v) => setH(Number(v))} /></Field></div><Btn onClick={run}>Redimensionar</Btn></>}{out && <Result><img src={out} alt="" className="mb-2 max-h-64 rounded" /><Btn variant="outline" onClick={() => download(window._resizeBlob, "redimensionada.png")}>Baixar</Btn></Result>}</div>;
}

export function ConvertImage() {
  const [file, setFile] = useState(null); const [fmt, setFmt] = useState("image/png"); const [out, setOut] = useState(null);
  const run = async () => { const img = await loadImg(file); const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; c.getContext("2d").drawImage(img, 0, 0); const blob = await canvasToBlob(c, fmt, 0.92); setOut(blob); };
  return <div className="space-y-3"><FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} />{file && <><Field label="Converter para"><select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" value={fmt} onChange={(e) => setFmt(e.target.value)}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WEBP</option></select></Field><Btn onClick={run}>Converter</Btn></>}{out && <Result><img src={URL.createObjectURL(out)} alt="" className="mb-2 max-h-64 rounded" /><Btn variant="outline" onClick={() => download(out, "convertida." + fmt.split("/")[1])}>Baixar</Btn></Result>}</div>;
}

export function CropImage() {
  const [file, setFile] = useState(null); const [crop, setCrop] = useState({ x: 0, y: 0, w: 200, h: 200 }); const [out, setOut] = useState(null);
  const run = async () => { const img = await loadImg(file); const c = document.createElement("canvas"); c.width = crop.w; c.height = crop.h; c.getContext("2d").drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h); const blob = await canvasToBlob(c, "image/png"); setOut(blob); };
  return <div className="space-y-3"><FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} />{file && <><div className="grid grid-cols-4 gap-2">{["x", "y", "w", "h"].map((k) => <Field key={k} label={k.toUpperCase()}><Input type="number" value={crop[k]} onChange={(v) => setCrop({ ...crop, [k]: Number(v) })} /></Field>)}</div><Btn onClick={run}>Recortar</Btn></>}{out && <Result><img src={URL.createObjectURL(out)} alt="" className="mb-2 max-h-64 rounded" /><Btn variant="outline" onClick={() => download(out, "recorte.png")}>Baixar</Btn></Result>}</div>;
}

export function RotateImage() {
  const [file, setFile] = useState(null); const [out, setOut] = useState(null);
  const run = async (deg, flip) => { const img = await loadImg(file); const c = document.createElement("canvas"); const rad = (deg * Math.PI) / 180; if (deg % 180) { c.width = img.height; c.height = img.width; } else { c.width = img.width; c.height = img.height; } const ctx = c.getContext("2d"); ctx.translate(c.width / 2, c.height / 2); if (flip) ctx.scale(-1, 1); ctx.rotate(rad); ctx.drawImage(img, -img.width / 2, -img.height / 2); const blob = await canvasToBlob(c, "image/png"); setOut(blob); };
  return <div className="space-y-3"><FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} />{file && <div className="flex flex-wrap gap-2"><Btn onClick={() => run(90)}>Girar 90°</Btn><Btn variant="outline" onClick={() => run(180)}>180°</Btn><Btn variant="outline" onClick={() => run(0, true)}>Espelhar</Btn></div>}{out && <Result><img src={URL.createObjectURL(out)} alt="" className="mb-2 max-h-64 rounded" /><Btn variant="outline" onClick={() => download(out, "girada.png")}>Baixar</Btn></Result>}</div>;
}

export function GenFavicon() {
  const [file, setFile] = useState(null); const [out, setOut] = useState(null);
  const run = async () => { const img = await loadImg(file); const c = document.createElement("canvas"); c.width = 64; c.height = 64; c.getContext("2d").drawImage(img, 0, 0, 64, 64); const blob = await canvasToBlob(c, "image/png"); setOut(blob); };
  return <div className="space-y-3"><FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} />{file && <Btn onClick={run}>Gerar favicon 64×64</Btn>}{out && <Result><img src={URL.createObjectURL(out)} alt="" className="mb-2 rounded border" width={64} /><Btn variant="outline" onClick={() => download(out, "favicon.png")}>Baixar favicon.png</Btn></Result>}</div>;
}

export function ColorPalette() {
  const [colors, setColors] = useState([]);
  const run = async (file) => { const img = await loadImg(file); const c = document.createElement("canvas"); const s = 80; c.width = s; c.height = s; const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0, s, s); const data = ctx.getImageData(0, 0, s, s).data; const map = {}; for (let i = 0; i < data.length; i += 4) { const r = Math.round(data[i] / 32) * 32, g = Math.round(data[i + 1] / 32) * 32, b = Math.round(data[i + 2] / 32) * 32; const k = `${r},${g},${b}`; map[k] = (map[k] || 0) + 1; } const top = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => { const [r, g, b] = k.split(","); return "#" + [r, g, b].map((x) => Number(x).toString(16).padStart(2, "0")).join(""); }); setColors(top); };
  return <div className="space-y-3"><FileDrop accept="image/*" onFiles={(f) => run(f[0])} />{colors.length > 0 && <Result><div className="flex flex-wrap gap-2">{colors.map((c) => <div key={c} className="text-center"><div className="h-16 w-16 rounded-lg border" style={{ background: c }} /><p className="mt-1 text-xs font-mono">{c}</p></div>)}</div></Result>}</div>;
}

export function WatermarkImage() {
  const [file, setFile] = useState(null); const [text, setText] = useState("© Toolzz"); const [out, setOut] = useState(null);
  const run = async () => { const img = await loadImg(file); const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0); ctx.font = `${Math.max(20, img.width / 20)}px sans-serif`; ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.textAlign = "right"; ctx.fillText(text, img.width - 20, img.height - 20); const blob = await canvasToBlob(c, "image/png"); setOut(blob); };
  return <div className="space-y-3"><FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} />{file && <><Field label="Texto da marca d'água"><Input value={text} onChange={setText} /></Field><Btn onClick={run}>Aplicar</Btn></>}{out && <Result><img src={URL.createObjectURL(out)} alt="" className="mb-2 max-h-64 rounded" /><Btn variant="outline" onClick={() => download(out, "marca-dagua.png")}>Baixar</Btn></Result>}</div>;
}
