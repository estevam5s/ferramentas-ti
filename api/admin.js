import { admin, getUser, isAdminEmail, readJson } from "./_lib/server.js";

export default async function handler(req, res) {
  const user = await getUser(req);
  if (!user || !isAdminEmail(user.email)) return res.status(403).json({ error: "forbidden" });
  const db = admin();

  if (req.method === "GET") {
    const mod = (req.query?.module) || "overview";
    if (mod === "overview") {
      const [{ data: subs }, { data: plans }, { count: users }, { count: usage }] = await Promise.all([
        db.from("subscriptions").select("plan_slug,status,cycle"),
        db.from("plans").select("slug,price_month,price_year"),
        db.from("profiles").select("id", { count: "exact", head: true }),
        db.from("tool_usage").select("id", { count: "exact", head: true }),
      ]);
      const pm = Object.fromEntries((plans || []).map((p) => [p.slug, p]));
      const byPlan = {}; let mrr = 0;
      for (const s of subs || []) {
        byPlan[s.plan_slug] = (byPlan[s.plan_slug] || 0) + 1;
        if (["active", "trialing"].includes(s.status) && s.plan_slug !== "free") {
          const p = pm[s.plan_slug]; if (p) mrr += s.cycle === "year" ? p.price_year / 12 : p.price_month;
        }
      }
      const paying = (subs || []).filter((s) => s.plan_slug !== "free" && ["active", "trialing"].includes(s.status)).length;
      return res.json({ users: users || 0, usage: usage || 0, paying, byPlan, mrr: Math.round(mrr), arr: Math.round(mrr * 12), arpu: paying ? Math.round(mrr / paying) : 0 });
    }
    if (mod === "users") {
      const { data: profiles } = await db.from("profiles").select("id,email,full_name,created_at,trial_ends_at").order("created_at", { ascending: false }).limit(200);
      const { data: subs } = await db.from("subscriptions").select("user_id,plan_slug,status");
      const map = Object.fromEntries((subs || []).map((s) => [s.user_id, s]));
      return res.json({ users: (profiles || []).map((p) => ({ ...p, plan: map[p.id]?.plan_slug || "free", status: map[p.id]?.status || "trialing" })) });
    }
    if (mod === "usage") {
      const { data } = await db.from("tool_usage").select("tool_slug,category,is_ai,created_at").order("created_at", { ascending: false }).limit(100);
      return res.json({ usage: data || [] });
    }
    if (mod === "health") {
      return res.json({ ok: true, stripe: !!process.env.STRIPE_SECRET_KEY, webhook: !!process.env.STRIPE_WEBHOOK_SECRET, supabase: !!process.env.SUPABASE_SERVICE_ROLE, ai: !!process.env.OPENROUTER_API_KEY, time: new Date().toISOString() });
    }
    return res.status(400).json({ error: "módulo inválido" });
  }

  if (req.method === "POST") {
    const { action, user_id, slug } = await readJson(req);
    if (action === "set_plan" && user_id && slug) {
      await db.from("subscriptions").upsert({ user_id, plan_slug: slug, status: "active", updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      await db.from("admin_logs").insert({ actor_email: user.email, action: "set_plan", target: user_id, meta: { slug } });
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: "ação inválida" });
  }
  res.status(405).json({ error: "method" });
}
