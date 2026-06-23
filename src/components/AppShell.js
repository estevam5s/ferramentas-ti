import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, CreditCard, LogOut, Settings, ShieldCheck, Wrench, Crown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ children }) {
  const { user, isAdmin, sub, signOut, trialActive } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const planName = sub?.plan?.name || "Grátis";

  const items = [
    { to: "/app", label: "Ferramentas", icon: LayoutGrid },
    { to: "/app/billing", label: "Meu plano", icon: CreditCard },
    { to: "/app/conta", label: "Conta", icon: Settings },
  ];
  const trialDays = sub?.trial_ends_at && sub?.subscription?.plan_slug === "free"
    ? Math.max(0, Math.ceil((new Date(sub.trial_ends_at) - Date.now()) / 864e5)) : null;

  const out = async () => { await signOut(); nav("/"); };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-white p-4 md:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-white"><Wrench className="h-4 w-4" /></span>
          <span className="font-bold text-text">Toolzz</span>
        </Link>
        <nav className="space-y-1">
          {items.map((i) => {
            const active = loc.pathname === i.to;
            return <Link key={i.to} to={i.to} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-teal-50 font-medium text-primary" : "text-gray-600 hover:bg-gray-100"}`}><i.icon className="h-4 w-4" /> {i.label}</Link>;
          })}
          {isAdmin && <Link to="/admin" className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${loc.pathname.startsWith("/admin") ? "bg-red-50 font-medium text-red-600" : "text-gray-600 hover:bg-gray-100"}`}><ShieldCheck className="h-4 w-4" /> Admin</Link>}
        </nav>
        <div className="mt-auto space-y-3 border-t pt-4">
          <div className="px-2">
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
            <p className="flex items-center gap-1 text-xs font-medium text-primary"><Crown className="h-3 w-3" /> {planName}</p>
          </div>
          <button onClick={out} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"><LogOut className="h-4 w-4" /> Sair</button>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b bg-white p-3 md:hidden">
          <Link to="/" className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-white"><Wrench className="h-3.5 w-3.5" /></span><span className="font-bold">Toolzz</span></Link>
          <button onClick={out} className="text-sm text-gray-600">Sair</button>
        </div>
        {trialActive && trialDays !== null && (
          <div className="border-b bg-teal-50 px-6 py-2 text-center text-sm text-primary">
            🎁 Teste grátis: <b>{trialDays} dia{trialDays !== 1 && "s"}</b> restante{trialDays !== 1 && "s"}. <Link to="/app/billing" className="font-semibold underline">Escolher um plano</Link>
          </div>
        )}
        <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
