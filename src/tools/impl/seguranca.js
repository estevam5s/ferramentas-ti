import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Btn, TextArea, Input, CopyBtn, Field, Result, DownloadBtn } from "../ui";

function genPass(len, opts) {
  let chars = "abcdefghijklmnopqrstuvwxyz";
  if (opts.upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.num) chars += "0123456789";
  if (opts.sym) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const arr = new Uint32Array(len); crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}
export function GenPassword() {
  const [len, setLen] = useState(16);
  const [opts, setOpts] = useState({ upper: true, num: true, sym: true });
  const [pass, setPass] = useState("");
  useEffect(() => { setPass(genPass(len, opts)); }, [len, opts]);
  return (
    <div className="space-y-3">
      <Result><p className="break-all text-xl font-mono font-bold text-primary">{pass}</p></Result>
      <Field label={`Tamanho: ${len}`}><input type="range" min={8} max={64} value={len} onChange={(e) => setLen(Number(e.target.value))} className="w-full" /></Field>
      <div className="flex flex-wrap gap-3 text-sm">
        {[["upper", "Maiúsculas"], ["num", "Números"], ["sym", "Símbolos"]].map(([k, l]) => (
          <label key={k} className="flex items-center gap-1.5"><input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} /> {l}</label>
        ))}
      </div>
      <div className="flex gap-2"><Btn onClick={() => setPass(genPass(len, opts))}>Gerar novo</Btn><CopyBtn text={pass} /></div>
    </div>
  );
}
export function GenPasswordBatch() {
  const [n, setN] = useState(10); const [len, setLen] = useState(16);
  const [list, setList] = useState([]);
  const gen = () => setList(Array.from({ length: n }, () => genPass(len, { upper: true, num: true, sym: true })));
  return <div className="space-y-3"><div className="flex gap-2"><Field label="Quantidade"><Input type="number" value={n} onChange={(v) => setN(Number(v))} /></Field><Field label="Tamanho"><Input type="number" value={len} onChange={(v) => setLen(Number(v))} /></Field></div><Btn onClick={gen}>Gerar lote</Btn>{list.length > 0 && <><Result><pre className="text-sm font-mono">{list.join("\n")}</pre></Result><div className="flex gap-2"><CopyBtn text={list.join("\n")} /><DownloadBtn data={list.join("\n")} filename="senhas.txt" /></div></>}</div>;
}
export function PasswordStrength() {
  const [p, setP] = useState("");
  let score = 0;
  if (p.length >= 8) score++; if (p.length >= 12) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++; if (/[^A-Za-z0-9]/.test(p)) score++;
  const labels = ["Muito fraca", "Fraca", "Média", "Boa", "Forte", "Excelente"];
  const colors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#02897A"];
  return <div className="space-y-3"><Input type="text" value={p} onChange={setP} placeholder="Digite uma senha" /><Result><div className="h-2 w-full overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full transition-all" style={{ width: `${(score / 5) * 100}%`, background: colors[score] }} /></div><p className="mt-2 text-sm font-medium" style={{ color: colors[score] }}>{labels[score]}</p></Result></div>;
}
export function GenPin() { const [len, setLen] = useState(4); const [pin, setPin] = useState(""); const gen = () => { const a = new Uint32Array(len); crypto.getRandomValues(a); setPin(Array.from(a, (n) => n % 10).join("")); }; useEffect(gen, [len]); return <div className="space-y-3"><Result><p className="text-2xl font-mono font-bold tracking-widest">{pin}</p></Result><Field label={`Dígitos: ${len}`}><input type="range" min={3} max={10} value={len} onChange={(e) => setLen(Number(e.target.value))} className="w-full" /></Field><div className="flex gap-2"><Btn onClick={gen}>Gerar</Btn><CopyBtn text={pin} /></div></div>; }
export function GenUuid() { const [v, setV] = useState(crypto.randomUUID()); return <div className="space-y-3"><Result><p className="break-all text-lg font-mono font-bold">{v}</p></Result><div className="flex gap-2"><Btn onClick={() => setV(crypto.randomUUID())}>Gerar novo</Btn><CopyBtn text={v} /></div></div>; }
export function GenApiKey() { const gen = () => "sk_" + genPass(40, { upper: true, num: true }); const [v, setV] = useState(gen()); return <div className="space-y-3"><Result><p className="break-all text-sm font-mono font-bold">{v}</p></Result><div className="flex gap-2"><Btn onClick={() => setV(gen())}>Gerar nova</Btn><CopyBtn text={v} /></div></div>; }

export function GenJwt() {
  const [payload, setPayload] = useState('{\n  "sub": "1234",\n  "name": "Estevam",\n  "iat": 1700000000\n}');
  const [secret, setSecret] = useState("seu-segredo");
  const [out, setOut] = useState("");
  const gen = async () => {
    try {
      const b64 = (o) => btoa(JSON.stringify(o)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      const head = b64({ alg: "HS256", typ: "JWT" });
      const body = b64(JSON.parse(payload));
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${head}.${body}`));
      const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      setOut(`${head}.${body}.${sigB64}`);
    } catch (e) { setOut("Erro: " + e.message); }
  };
  return <div className="space-y-3"><Field label="Payload (JSON)"><TextArea value={payload} onChange={setPayload} rows={6} mono /></Field><Field label="Segredo"><Input value={secret} onChange={setSecret} /></Field><div className="flex gap-2"><Btn onClick={gen}>Gerar JWT</Btn>{out && <CopyBtn text={out} />}</div>{out && <Result><p className="break-all text-sm font-mono">{out}</p></Result>}</div>;
}

async function hash(algo, text) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export function HashText() {
  const [v, setV] = useState(""); const [out, setOut] = useState({});
  const run = async () => { setOut({ "SHA-256": await hash("SHA-256", v), "SHA-512": await hash("SHA-512", v), "SHA-1": await hash("SHA-1", v) }); };
  return <div className="space-y-3"><TextArea value={v} onChange={setV} placeholder="texto para gerar hash" rows={3} /><Btn onClick={run}>Gerar hashes</Btn>{Object.entries(out).map(([k, val]) => <Result key={k}><p className="text-xs font-medium text-gray-500">{k}</p><p className="break-all text-sm font-mono">{val}</p></Result>)}</div>;
}

export function CryptoText() {
  const [text, setText] = useState(""); const [pass, setPass] = useState(""); const [out, setOut] = useState("");
  const deriveKey = async (p, salt) => { const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(p), "PBKDF2", false, ["deriveKey"]); return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]); };
  const enc = async () => { try { const salt = crypto.getRandomValues(new Uint8Array(16)); const iv = crypto.getRandomValues(new Uint8Array(12)); const key = await deriveKey(pass, salt); const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text)); const blob = new Uint8Array([...salt, ...iv, ...new Uint8Array(ct)]); setOut(btoa(String.fromCharCode(...blob))); } catch (e) { setOut("Erro: " + e.message); } };
  const dec = async () => { try { const blob = Uint8Array.from(atob(text), (c) => c.charCodeAt(0)); const salt = blob.slice(0, 16), iv = blob.slice(16, 28), ct = blob.slice(28); const key = await deriveKey(pass, salt); const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct); setOut(new TextDecoder().decode(pt)); } catch { setOut("Falha ao descriptografar (senha errada?)"); } };
  return <div className="space-y-3"><Field label="Texto / cifra"><TextArea value={text} onChange={setText} rows={4} mono /></Field><Field label="Senha"><Input type="password" value={pass} onChange={setPass} /></Field><div className="flex gap-2"><Btn onClick={enc}>Criptografar</Btn><Btn variant="outline" onClick={dec}>Descriptografar</Btn>{out && <CopyBtn text={out} />}</div>{out && <Result><p className="break-all text-sm font-mono">{out}</p></Result>}</div>;
}

export function GenQrcode() {
  const [text, setText] = useState("https://"); const [img, setImg] = useState("");
  const gen = async () => { setImg(await QRCode.toDataURL(text || " ", { width: 320, margin: 2 })); };
  useEffect(() => { gen(); /* eslint-disable-next-line */ }, []);
  return <div className="space-y-3"><Field label="Texto ou URL"><Input value={text} onChange={setText} /></Field><Btn onClick={gen}>Gerar QR Code</Btn>{img && <div className="flex flex-col items-center gap-3"><img src={img} alt="QR" className="rounded-lg border" /><DownloadBtn data={(() => { const b = atob(img.split(",")[1]); const a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return new Blob([a], { type: "image/png" }); })()} filename="qrcode.png" /></div>}</div>;
}
export function ReadQrcode() {
  return <div className="space-y-3"><p className="text-sm text-gray-500">Aponte a câmera não disponível aqui; cole o conteúdo de um QR já lido ou use o gerador. (Leitura por câmera no app completo.)</p></div>;
}
