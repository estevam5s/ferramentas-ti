import { admin, stripe } from "./_lib/server.js";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let raw = "";
  await new Promise((r) => { req.on("data", (c) => (raw += c)); req.on("end", r); });

  let event;
  try {
    event = secret ? stripe().webhooks.constructEvent(raw, sig, secret) : JSON.parse(raw);
  } catch {
    return res.status(400).json({ error: "invalid signature" });
  }

  const db = admin();
  const { data: seen } = await db.from("payment_events").select("id").eq("id", event.id).maybeSingle();
  if (seen) return res.json({ received: true, duplicate: true });

  const REFUND_DAYS = Number(process.env.REFUND_DAYS || 7);
  const slugFromPrice = async (priceId) => {
    if (!priceId) return undefined;
    const { data } = await db.from("plans").select("slug").or(`stripe_price_month.eq.${priceId},stripe_price_year.eq.${priceId}`).maybeSingle();
    return data?.slug;
  };

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      const userId = s.metadata?.user_id, slug = s.metadata?.slug, cycle = s.metadata?.cycle || "month";
      if (userId && slug) {
        let periodEnd = null, subId = s.subscription || null;
        if (subId) {
          const full = await stripe().subscriptions.retrieve(subId);
          if (full?.current_period_end) periodEnd = new Date(full.current_period_end * 1000).toISOString();
        }
        await db.from("subscriptions").upsert({
          user_id: userId, plan_slug: slug, status: "active", cycle,
          stripe_customer_id: s.customer, stripe_subscription_id: subId,
          current_period_end: periodEnd, cancel_at_period_end: false,
          refund_eligible_until: new Date(Date.now() + REFUND_DAYS * 864e5).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
        await db.from("profiles").update({ is_demo: false }).eq("id", userId);
      }
    } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object, customer = sub.customer, priceId = sub.items?.data?.[0]?.price?.id;
      const updates = {
        status: event.type === "customer.subscription.deleted" ? "canceled" : sub.status,
        current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
        cancel_at_period_end: sub.cancel_at_period_end || false,
        stripe_subscription_id: sub.id, updated_at: new Date().toISOString(),
      };
      if (event.type === "customer.subscription.deleted") updates.plan_slug = "free";
      else { const slug = await slugFromPrice(priceId); if (slug) updates.plan_slug = slug; }
      await db.from("subscriptions").update(updates).eq("stripe_customer_id", customer);
    }
    await db.from("payment_events").insert({ id: event.id, type: event.type, payload: event });
  } catch (e) {
    console.error("webhook", e);
    return res.status(500).json({ error: "handler" });
  }
  res.json({ received: true });
}
