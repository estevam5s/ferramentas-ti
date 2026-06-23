import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isAdminEmail, apiFetch } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState(null); // { subscription, plan, plans, is_admin, trial_active, trial_ends_at }

  const loadSub = useCallback(async () => {
    try {
      const res = await apiFetch("/api/subscription");
      if (res.ok) setSub(await res.json());
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) loadSub();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadSub();
      else setSub(null);
    });
    return () => subscription.unsubscribe();
  }, [loadSub]);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };
  const signUp = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    return { error };
  };
  const signOut = async () => { await supabase.auth.signOut(); setSub(null); };

  const isAdmin = isAdminEmail(user?.email);
  const planSlug = isAdmin ? "empresarial" : sub?.plan?.slug || "free";
  const limits = sub?.plan?.limits || {};
  const trialActive = !!sub?.trial_active;
  // acesso pleno: admin, plano pago ativo, ou trial válido
  const hasAccess = isAdmin || (sub?.subscription && sub.subscription.plan_slug !== "free" && ["active", "trialing"].includes(sub.subscription.status)) || trialActive;

  return (
    <AuthContext.Provider value={{ user, session, loading, sub, signIn, signUp, signOut, isAdmin, planSlug, limits, trialActive, hasAccess, reloadSub: loadSub }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
