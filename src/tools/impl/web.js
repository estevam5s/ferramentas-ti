import { useState } from "react";
import { Btn, TextArea, Input, CopyBtn, Field, Result, DownloadBtn } from "../ui";

const minifyCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").trim();
const minifyHtml = (s) => s.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
const minifyJs = (s) => s.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{};=()<>+\-*/,:])\s*/g, "$1").trim();

function Minifier({ fn, ph }) {
  const [v, setV] = useState(""); const [out, setOut] = useState("");
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder={ph} mono rows={8} /><div className="flex gap-2"><Btn onClick={() => setOut(fn(v))}>Minificar</Btn>{out && <CopyBtn text={out} />}</div>{out && <Result><p className="mb-1 text-xs text-gray-500">{out.length} caracteres ({v.length ? Math.round((1 - out.length / v.length) * 100) : 0}% menor)</p><pre className="overflow-auto whitespace-pre-wrap text-sm font-mono">{out}</pre></Result>}</div>;
}
export const MinifyHtml = () => <Minifier fn={minifyHtml} ph="<html>…" />;
export const MinifyCss = () => <Minifier fn={minifyCss} ph=".classe { cor: azul; }" />;
export const MinifyJs = () => <Minifier fn={minifyJs} ph="function exemplo() { ... }" />;

export function RobotsTxt() {
  const [allow, setAllow] = useState(true); const [sitemap, setSitemap] = useState("https://seusite.com/sitemap.xml");
  const out = `User-agent: *\n${allow ? "Allow: /" : "Disallow: /"}\n\nSitemap: ${sitemap}`;
  return <div className="space-y-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={allow} onChange={(e) => setAllow(e.target.checked)} /> Permitir indexação</label><Field label="URL do sitemap"><Input value={sitemap} onChange={setSitemap} /></Field><Result><pre className="text-sm font-mono">{out}</pre></Result><div className="flex gap-2"><CopyBtn text={out} /><DownloadBtn data={out} filename="robots.txt" /></div></div>;
}

export function SitemapXml() {
  const [urls, setUrls] = useState("https://seusite.com/\nhttps://seusite.com/sobre");
  const out = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.split("\n").filter(Boolean).map((u) => `  <url>\n    <loc>${u.trim()}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </url>`).join("\n")}\n</urlset>`;
  return <div className="space-y-3"><Field label="URLs (uma por linha)"><TextArea value={urls} onChange={setUrls} rows={5} mono /></Field><Result><pre className="overflow-auto text-sm font-mono">{out}</pre></Result><div className="flex gap-2"><CopyBtn text={out} /><DownloadBtn data={out} filename="sitemap.xml" mime="application/xml" /></div></div>;
}

export function ScreenshotSite() {
  const [url, setUrl] = useState("https://"); const [img, setImg] = useState("");
  const run = () => { const target = url.startsWith("http") ? url : "https://" + url; setImg(`https://s.wordpress.com/mshots/v1/${encodeURIComponent(target)}?w=1200&h=800&vitrine=${Date.now()}`); };
  return <div className="space-y-3"><Field label="URL do site"><Input value={url} onChange={setUrl} placeholder="https://exemplo.com" /></Field><Btn onClick={run}>Capturar screenshot</Btn>{img && <Result><img src={img} alt="screenshot" className="w-full rounded-lg border" /><p className="mt-2 text-xs text-gray-400">A captura pode levar alguns segundos para gerar.</p></Result>}</div>;
}
