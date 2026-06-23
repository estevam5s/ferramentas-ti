import { admin, getUser, isAdminEmail, readJson } from "./_lib/server.js";

// Ferramentas de IA (OpenRouter — modelo Nvidia). Gating de uso diário por plano.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const key = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";
  if (!key) return res.status(503).json({ error: "IA não configurada" });

  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });

  const { tool, input, system } = await readJson(req);
  if (!tool || !input) return res.status(400).json({ error: "tool e input obrigatórios" });

  const db = admin();
  const adminFlag = isAdminEmail(user.email);

  // gating: usos de IA por dia conforme plano
  if (!adminFlag) {
    const { data: sub } = await db.from("subscriptions").select("plan_slug,status").eq("user_id", user.id).maybeSingle();
    const { data: plan } = await db.from("plans").select("limits").eq("slug", sub?.plan_slug || "free").maybeSingle();
    const aiDay = plan?.limits?.ai_day ?? 3;
    if (aiDay !== -1) {
      const { data: used } = await db.rpc("usage_today", { p_user: user.id, p_ai: true });
      if ((used ?? 0) >= aiDay) {
        return res.status(403).json({ error: `Limite de ${aiDay} usos de IA/dia atingido. Faça upgrade.`, code: "ai_limit" });
      }
    }
  }

  const PROMPTS = {
    resumir: "Resuma o texto a seguir de forma clara e concisa, em português do Brasil.",
    traduzir: "Traduza o texto a seguir para o idioma solicitado (ou para inglês, se não especificado). Mantenha o sentido.",
    reescrever: "Reescreva o texto a seguir de forma mais clara e profissional, mantendo o significado.",
    gramatica: "Corrija a gramática e ortografia do texto a seguir. Retorne apenas o texto corrigido.",
    email: "Escreva um e-mail profissional em português com base na descrição a seguir.",
    contrato: "Escreva uma minuta de contrato simples em português com base na descrição. Inclua aviso de que não substitui revisão jurídica.",
    proposta: "Escreva uma proposta comercial persuasiva em português com base na descrição.",
    descricao: "Escreva uma descrição de produto atraente e otimizada para venda, em português.",
    titulos: "Gere 8 títulos chamativos para blog/redes sociais com base no tema, em português.",
    melhorar: "Melhore o texto a seguir tornando-o mais envolvente e claro, em português.",
    curriculo: "Crie/melhore um currículo profissional com base nas informações, em português.",
    chat: "Você é um assistente útil. Responda em português do Brasil.",
  };
  const sys = (system || PROMPTS[tool] || PROMPTS.chat) +
    " Responda SEMPRE em português do Brasil, de forma direta e final, SEM mostrar seu raciocínio, sem '<think>' e sem explicar o que vai fazer. Devolva apenas o resultado solicitado.";

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "https://ferramentas-ti.vercel.app",
        "X-Title": "Toolzz IA",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: sys }, { role: "user", content: input }],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: `IA indisponível (${r.status})`, detail: t.slice(0, 150) });
    }
    const data = await r.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    // registra uso
    await db.from("tool_usage").insert({ user_id: user.id, tool_slug: tool, category: "ia", is_ai: true });
    res.json({ output: content, model });
  } catch (e) {
    res.status(502).json({ error: "Falha na IA", detail: String(e).slice(0, 150) });
  }
}
