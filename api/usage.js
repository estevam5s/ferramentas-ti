import { admin, getUser, isAdminEmail, readJson } from "./_lib/server.js";

// Registra uso de ferramenta e aplica gating de operações/dia por plano.
export default async function handler(req, res) {
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });
  const db = admin();
  const adminFlag = isAdminEmail(user.email);

  if (req.method === "GET") {
    const [{ data: total }, { data: ai }] = await Promise.all([
      db.rpc("usage_today", { p_user: user.id, p_ai: null }),
      db.rpc("usage_today", { p_user: user.id, p_ai: true }),
    ]);
    return res.json({ today: total ?? 0, ai_today: ai ?? 0 });
  }

  if (req.method === "POST") {
    const { tool, category, is_ai } = await readJson(req);
    if (!tool) return res.status(400).json({ error: "tool obrigatório" });

    if (!adminFlag) {
      const { data: sub } = await db.from("subscriptions").select("plan_slug").eq("user_id", user.id).maybeSingle();
      const { data: plan } = await db.from("plans").select("limits").eq("slug", sub?.plan_slug || "free").maybeSingle();
      const opsDay = plan?.limits?.ops_day ?? 5;
      if (opsDay !== -1) {
        const { data: used } = await db.rpc("usage_today", { p_user: user.id, p_ai: null });
        if ((used ?? 0) >= opsDay) {
          return res.status(403).json({ error: `Limite de ${opsDay} operações/dia atingido. Faça upgrade.`, code: "ops_limit" });
        }
      }
    }
    await db.from("tool_usage").insert({ user_id: user.id, tool_slug: tool, category: category || null, is_ai: !!is_ai });
    return res.json({ ok: true });
  }
  res.status(405).json({ error: "method" });
}
