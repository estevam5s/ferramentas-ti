import { admin, stripe, siteUrl, getUser, readJson } from "./_lib/server.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });

  const { slug, cycle } = await readJson(req);
  if (!slug || slug === "free") return res.status(400).json({ error: "Plano inválido" });

  const db = admin();
  const { data: plan } = await db.from("plans").select("*").eq("slug", slug).single();
  if (!plan) return res.status(400).json({ error: "Plano não encontrado" });
  const price = cycle === "year" ? plan.stripe_price_year : plan.stripe_price_month;
  if (!price) return res.status(400).json({ error: "Preço não configurado" });

  const { data: sub } = await db.from("subscriptions").select("stripe_customer_id,plan_slug").eq("user_id", user.id).maybeSingle();
  let customer = sub?.stripe_customer_id;
  if (!customer) {
    const c = await stripe().customers.create({ email: user.email, metadata: { user_id: user.id } });
    customer = c.id;
    await db.from("subscriptions").upsert(
      { user_id: user.id, plan_slug: sub?.plan_slug || "free", stripe_customer_id: customer },
      { onConflict: "user_id" }
    );
  }

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price, quantity: 1 }],
    success_url: `${siteUrl()}/app/billing?success=1`,
    cancel_url: `${siteUrl()}/app/billing?canceled=1`,
    allow_promotion_codes: true,
    subscription_data: { metadata: { user_id: user.id, slug } },
    metadata: { user_id: user.id, slug, cycle: cycle || "month" },
  });
  res.json({ url: session.url });
}
