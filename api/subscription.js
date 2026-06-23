import { admin, getUser, isAdminEmail } from "./_lib/server.js";

export default async function handler(req, res) {
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });
  const db = admin();
  const [{ data: plans }, { data: sub }, { data: profile }] = await Promise.all([
    db.from("plans").select("*").eq("active", true).order("sort_order"),
    db.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
    db.from("profiles").select("trial_ends_at,is_demo").eq("id", user.id).maybeSingle(),
  ]);
  const adminFlag = isAdminEmail(user.email);
  const slug = adminFlag ? "empresarial" : sub?.plan_slug || "free";
  const plan = (plans || []).find((p) => p.slug === slug) || null;
  const trialEndsAt = profile?.trial_ends_at || null;
  const trialActive = !!trialEndsAt && new Date(trialEndsAt) > new Date();
  res.json({ subscription: sub || null, plan, plans: plans || [], is_admin: adminFlag, trial_ends_at: trialEndsAt, trial_active: trialActive });
}
