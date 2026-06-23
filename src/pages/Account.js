import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import AppShell from "../components/AppShell";

export default function Account() {
  const { user } = useAuth();
  const [pw, setPw] = useState(""); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  const change = async () => {
    if (pw.length < 6) { setMsg("A senha deve ter ao menos 6 caracteres."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false); setMsg(error ? "Erro ao alterar a senha." : "Senha alterada com sucesso."); if (!error) setPw("");
  };
  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-text">Conta</h1>
      <div className="my-6 rounded-2xl border bg-white p-6"><p className="text-sm text-gray-500">E-mail</p><p className="font-medium text-text">{user?.email}</p></div>
      <div className="max-w-md rounded-2xl border bg-white p-6">
        <h3 className="font-semibold text-text">Alterar senha</h3>
        {msg && <p className="mt-2 text-sm text-primary">{msg}</p>}
        <div className="mt-3 flex gap-2">
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Nova senha" className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-primary" />
          <button onClick={change} disabled={busy} className="inline-flex items-center rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}</button>
        </div>
      </div>
    </AppShell>
  );
}
