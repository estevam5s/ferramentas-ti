import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Wrench } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

/* olhos que seguem o cursor (login.md) */
function useMouse() {
  const [m, setM] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => setM({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return m;
}
function EyeBall({ size = 18, pupil = 7, max = 5, blink = false, mouse }) {
  const ref = useRef(null);
  let x = 0, y = 0;
  if (ref.current) {
    const r = ref.current.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2), dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.hypot(dx, dy), max), a = Math.atan2(dy, dx);
    x = Math.cos(a) * dist; y = Math.sin(a) * dist;
  }
  return (
    <div ref={ref} className="flex items-center justify-center overflow-hidden rounded-full bg-white" style={{ width: size, height: blink ? 2 : size, transition: "height .15s" }}>
      {!blink && <div className="rounded-full" style={{ width: pupil, height: pupil, background: "#0f3d38", transform: `translate(${x}px,${y}px)`, transition: "transform .1s ease-out" }} />}
    </div>
  );
}
function Characters() {
  const mouse = useMouse();
  const [bA, setBA] = useState(false), [bB, setBB] = useState(false);
  const aRef = useRef(null), bRef = useRef(null);
  useEffect(() => { let t; const loop = () => { t = setTimeout(() => { setBA(true); setTimeout(() => { setBA(false); loop(); }, 150); }, Math.random() * 4000 + 3000); }; loop(); return () => clearTimeout(t); }, []);
  useEffect(() => { let t; const loop = () => { t = setTimeout(() => { setBB(true); setTimeout(() => { setBB(false); loop(); }, 150); }, Math.random() * 4000 + 3500); }; loop(); return () => clearTimeout(t); }, []);
  const lean = (ref) => { if (!ref.current) return 0; const r = ref.current.getBoundingClientRect(); return Math.max(-6, Math.min(6, -(mouse.x - (r.left + r.width / 2)) / 120)); };
  return (
    <div className="relative" style={{ width: 460, height: 340 }}>
      <div ref={aRef} className="absolute bottom-0" style={{ left: 60, width: 150, height: 340, background: "#02897A", borderRadius: "12px 12px 0 0", zIndex: 1, transform: `skewX(${lean(aRef)}deg)`, transformOrigin: "bottom center", transition: "transform .7s" }}>
        <div className="absolute flex gap-6" style={{ left: 40, top: 38 }}><EyeBall mouse={mouse} blink={bA} /><EyeBall mouse={mouse} blink={bA} /></div>
      </div>
      <div ref={bRef} className="absolute bottom-0" style={{ left: 205, width: 104, height: 268, background: "#0f3d38", borderRadius: "10px 10px 0 0", zIndex: 2, transform: `skewX(${lean(bRef) * 1.4}deg)`, transformOrigin: "bottom center", transition: "transform .7s" }}>
        <div className="absolute flex gap-5" style={{ left: 24, top: 30 }}><EyeBall mouse={mouse} size={15} pupil={6} max={4} blink={bB} /><EyeBall mouse={mouse} size={15} pupil={6} max={4} blink={bB} /></div>
      </div>
      <div className="absolute bottom-0" style={{ left: 0, width: 200, height: 165, background: "#34d3c0", borderRadius: "100px 100px 0 0", zIndex: 3 }}>
        <div className="absolute flex gap-6" style={{ left: 68, top: 78 }}><span className="rounded-full" style={{ width: 11, height: 11, background: "#0f3d38" }} /><span className="rounded-full" style={{ width: 11, height: 11, background: "#0f3d38" }} /></div>
      </div>
      <div className="absolute bottom-0" style={{ left: 272, width: 120, height: 198, background: "#0aa697", borderRadius: "60px 60px 0 0", zIndex: 4 }}>
        <div className="absolute flex gap-5" style={{ left: 44, top: 36 }}><span className="rounded-full" style={{ width: 11, height: 11, background: "white" }} /><span className="rounded-full" style={{ width: 11, height: 11, background: "white" }} /></div>
        <div className="absolute rounded-full" style={{ left: 34, top: 78, width: 52, height: 4, background: "white" }} />
      </div>
    </div>
  );
}

const PERKS = ["150+ ferramentas numa só assinatura", "PDF, imagem, IA, dev, segurança e mais", "7 dias grátis · cancele quando quiser"];

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const next = params.get("next") || "/app";
  const [mode, setMode] = useState(params.get("mode") === "signup" ? "signup" : "login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  useEffect(() => { if (user) navigate(next, { replace: true }); }, [user, navigate, next]);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setInfo(""); setLoading(true);
    if (isSignup) {
      if (!form.name || !form.email || form.password.length < 6) { setError("Preencha nome, e-mail e senha (mín. 6)."); setLoading(false); return; }
      const { error } = await signUp(form.email, form.password, form.name);
      if (error) setError(/registered|exists/i.test(error.message) ? "Este e-mail já está cadastrado." : "Erro ao criar conta.");
      else navigate(next);
    } else {
      const { error } = await signIn(form.email, form.password);
      if (error) setError("E-mail ou senha incorretos."); else navigate(next);
    }
    setLoading(false);
  };
  const recover = async () => {
    setError(""); setInfo("");
    if (!form.email) { setError("Digite seu e-mail acima."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo: `${window.location.origin}/login` });
    setError(error ? "Não foi possível enviar o e-mail." : ""); setInfo(error ? "" : "Enviamos um link de redefinição.");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex" style={{ background: "linear-gradient(135deg,#02897A,#0aa697 55%,#066b60)" }}>
        <div className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="relative z-10 flex items-center gap-2 text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 backdrop-blur"><Wrench className="h-4 w-4" /></span> Toolzz
        </Link>
        <div className="relative z-10 flex items-end justify-center"><Characters /></div>
        <div className="relative z-10 max-w-sm">
          <h2 className="text-2xl font-bold">Todas as suas ferramentas, num só lugar.</h2>
          <ul className="mt-5 space-y-2.5">
            {PERKS.map((p) => <li key={p} className="flex items-center gap-2.5 text-sm text-white/90"><span className="grid h-5 w-5 place-items-center rounded-full bg-white/20"><Check className="h-3 w-3" /></span>{p}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link>
          <h1 className="text-3xl font-bold tracking-tight text-text">{isSignup ? "Criar conta" : "Bem-vindo de volta"}</h1>
          <p className="mt-1.5 text-sm text-gray-500">{isSignup ? "Comece grátis com 7 dias de teste." : "Entre para acessar suas ferramentas."}</p>

          <div className="mt-6 mb-6 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
            {["login", "signup"].map((m) => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(""); setInfo(""); }} className={`rounded-lg py-2 text-sm font-semibold transition ${mode === m ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}>{m === "login" ? "Entrar" : "Criar conta"}</button>
            ))}
          </div>

          {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {info && <div className="mb-5 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-primary">{info}</div>}

          <form onSubmit={submit} className="space-y-4">
            {isSignup && <Field label="Nome"><input className="inp" placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>}
            <Field label="E-mail"><input type="email" className="inp" placeholder="voce@email.com" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Senha" trailing={!isSignup && <button type="button" onClick={recover} className="text-xs font-medium text-primary hover:underline">Esqueceu?</button>}>
              <div className="relative">
                <input type={show ? "text" : "password"} className="inp pr-11" placeholder="••••••••" autoComplete={isSignup ? "new-password" : "current-password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
            </Field>
            <button type="submit" disabled={loading} className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isSignup ? "Criar conta grátis" : "Entrar"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            {isSignup ? "Já tem conta? " : "Ainda não tem conta? "}
            <button type="button" onClick={() => { setMode(isSignup ? "login" : "signup"); setError(""); }} className="font-semibold text-primary hover:underline">{isSignup ? "Entrar" : "Criar agora"}</button>
          </p>
        </div>
      </div>
      <style>{`.inp{width:100%;height:2.75rem;border:1px solid #e5e7eb;border-radius:.5rem;padding:0 .875rem;font-size:.875rem;outline:none;color:#22343D}.inp:focus{border-color:#02897A;box-shadow:0 0 0 3px rgba(2,137,122,.15)}`}</style>
    </div>
  );
}
function Field({ label, trailing, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-text">{label}{trailing}</span>
      {children}
    </label>
  );
}
