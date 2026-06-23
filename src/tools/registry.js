// Registro central de TODAS as ferramentas (features.md).
// impl: true = tem componente funcional; false = "em breve" (placeholder).
// ai: usa IA. min: plano mínimo (free|pessoal|profissional|empresarial).

export const CATEGORIES = [
  { id: "pdf", name: "PDF", icon: "FileText", color: "#ef4444" },
  { id: "imagem", name: "Imagens", icon: "Image", color: "#8b5cf6" },
  { id: "seguranca", name: "Segurança e Senhas", icon: "ShieldCheck", color: "#0ea5e9" },
  { id: "ia", name: "Ferramentas com IA", icon: "Sparkles", color: "#f59e0b" },
  { id: "web", name: "Sites", icon: "Globe", color: "#10b981" },
  { id: "dev", name: "Desenvolvedores", icon: "Code2", color: "#6366f1" },
  { id: "escritorio", name: "Escritório", icon: "Table2", color: "#14b8a6" },
  { id: "midia", name: "Áudio e Vídeo", icon: "Video", color: "#ec4899" },
  { id: "financas", name: "Financeiras", icon: "DollarSign", color: "#22c55e" },
];

const T = (slug, name, cat, opts = {}) => ({
  slug, name, category: cat, impl: !!opts.impl, ai: !!opts.ai,
  min: opts.min || "free", desc: opts.desc || "",
});

export const TOOLS = [
  // ── PDF ──
  T("juntar-pdf", "Juntar PDF", "pdf", { impl: true, desc: "Combine vários PDFs em um só." }),
  T("dividir-pdf", "Dividir PDF", "pdf", { impl: true, desc: "Separe páginas em arquivos." }),
  T("girar-pdf", "Girar páginas", "pdf", { impl: true, desc: "Gire as páginas do PDF." }),
  T("numerar-pdf", "Numerar páginas", "pdf", { impl: true, desc: "Adicione números às páginas." }),
  T("marca-dagua-pdf", "Marca d'água no PDF", "pdf", { impl: true, min: "pessoal", desc: "Texto de marca d'água." }),
  T("jpg-para-pdf", "JPG/PNG para PDF", "pdf", { impl: true, desc: "Converta imagens em PDF." }),
  T("extrair-paginas-pdf", "Extrair páginas", "pdf", { impl: true, desc: "Selecione páginas para um novo PDF." }),
  T("comprimir-pdf", "Comprimir PDF", "pdf", { min: "pessoal", desc: "Reduza o tamanho do PDF." }),
  T("pdf-para-word", "PDF para Word", "pdf", { min: "pessoal" }),
  T("pdf-para-jpg", "PDF para JPG", "pdf", { min: "pessoal" }),
  T("word-para-pdf", "Word para PDF", "pdf", { min: "pessoal" }),
  T("proteger-pdf", "Proteger PDF", "pdf", { min: "pessoal" }),
  T("ocr-pdf", "OCR PDF", "pdf", { min: "profissional" }),
  T("resumir-pdf-ia", "Resumir PDF com IA", "pdf", { ai: true, min: "pessoal" }),
  T("traduzir-pdf", "Traduzir PDF", "pdf", { ai: true, min: "pessoal" }),
  T("assinar-pdf", "Assinar PDF", "pdf", { min: "pessoal" }),

  // ── Imagens ──
  T("comprimir-imagem", "Comprimir imagem", "imagem", { impl: true, desc: "Reduza o peso de imagens." }),
  T("redimensionar-imagem", "Redimensionar imagem", "imagem", { impl: true, desc: "Mude largura e altura." }),
  T("converter-imagem", "Converter imagem", "imagem", { impl: true, desc: "JPG, PNG, WEBP." }),
  T("cortar-imagem", "Cortar imagem", "imagem", { impl: true, desc: "Recorte a imagem." }),
  T("girar-imagem", "Girar/espelhar imagem", "imagem", { impl: true }),
  T("gerar-favicon", "Gerar favicon", "imagem", { impl: true, desc: "Crie um favicon a partir de uma imagem." }),
  T("paleta-cores", "Extrair paleta de cores", "imagem", { impl: true, desc: "Cores predominantes da imagem." }),
  T("marca-dagua-imagem", "Marca d'água na imagem", "imagem", { impl: true, min: "pessoal" }),
  T("remover-fundo", "Remover fundo", "imagem", { min: "profissional" }),
  T("upscale-imagem", "Aumentar resolução (IA)", "imagem", { ai: true, min: "profissional" }),
  T("restaurar-foto", "Restaurar fotos antigas", "imagem", { min: "profissional" }),

  // ── Segurança ──
  T("gerar-senha", "Gerador de senhas", "seguranca", { impl: true, desc: "Senhas fortes e aleatórias." }),
  T("gerar-senha-lote", "Gerador de senhas em lote", "seguranca", { impl: true, min: "pessoal" }),
  T("forca-senha", "Verificador de força", "seguranca", { impl: true, desc: "Avalie a força da senha." }),
  T("gerar-pin", "Gerador de PIN", "seguranca", { impl: true }),
  T("gerar-uuid", "Gerador UUID", "seguranca", { impl: true }),
  T("gerar-api-key", "Gerador de chave API", "seguranca", { impl: true }),
  T("gerar-jwt", "Gerador de Token JWT", "seguranca", { impl: true, min: "pessoal" }),
  T("hash-texto", "Hash (MD5/SHA-256/512)", "seguranca", { impl: true, desc: "Gere hashes de texto." }),
  T("criptografar-texto", "Criptografar/descriptografar", "seguranca", { impl: true, min: "pessoal", desc: "AES no navegador." }),
  T("gerar-qrcode", "Gerador de QR Code", "seguranca", { impl: true, desc: "Crie QR Codes." }),
  T("ler-qrcode", "Leitor de QR Code", "seguranca", { impl: true }),
  T("gerar-2fa", "Gerador de códigos 2FA", "seguranca", { min: "pessoal" }),
  T("vazamento-senha", "Verificar vazamento de senha", "seguranca", { min: "pessoal" }),

  // ── IA ──
  T("ia-resumir", "Resumir textos", "ia", { impl: true, ai: true, desc: "Resumo automático." }),
  T("ia-traduzir", "Traduzir textos", "ia", { impl: true, ai: true }),
  T("ia-reescrever", "Reescrever textos", "ia", { impl: true, ai: true }),
  T("ia-gramatica", "Corrigir gramática", "ia", { impl: true, ai: true }),
  T("ia-melhorar", "Melhorar textos", "ia", { impl: true, ai: true }),
  T("ia-email", "Gerar e-mails", "ia", { impl: true, ai: true }),
  T("ia-contrato", "Gerar contratos", "ia", { impl: true, ai: true, min: "pessoal" }),
  T("ia-proposta", "Gerar propostas comerciais", "ia", { impl: true, ai: true, min: "pessoal" }),
  T("ia-descricao", "Descrições de produtos", "ia", { impl: true, ai: true }),
  T("ia-titulos", "Títulos para blog/redes", "ia", { impl: true, ai: true }),
  T("ia-curriculo", "Criar currículo com IA", "ia", { impl: true, ai: true, min: "pessoal" }),
  T("ia-chat", "Chat IA integrado", "ia", { impl: true, ai: true, desc: "Assistente conversacional." }),
  T("ia-posts", "Posts para redes sociais", "ia", { impl: true, ai: true }),

  // ── Web ──
  T("screenshot-site", "Screenshot de site", "web", { impl: true, desc: "Capture a tela de um site." }),
  T("minificar-html", "Minificar HTML", "web", { impl: true }),
  T("minificar-css", "Minificar CSS", "web", { impl: true }),
  T("minificar-js", "Minificar JavaScript", "web", { impl: true }),
  T("robots-txt", "Gerador robots.txt", "web", { impl: true }),
  T("sitemap-xml", "Gerador sitemap.xml", "web", { impl: true }),
  T("verificar-ssl", "Verificador SSL", "web", { min: "pessoal" }),
  T("whois", "WHOIS", "web", { min: "pessoal" }),
  T("analisar-seo", "Analisador SEO", "web", { min: "profissional" }),

  // ── Dev ──
  T("json-formatter", "JSON Formatter/Validator", "dev", { impl: true, desc: "Formate e valide JSON." }),
  T("xml-formatter", "XML Formatter", "dev", { impl: true }),
  T("yaml-formatter", "YAML ⇄ JSON", "dev", { impl: true }),
  T("base64", "Base64 Encode/Decode", "dev", { impl: true }),
  T("url-encode", "URL Encode/Decode", "dev", { impl: true }),
  T("regex-tester", "Regex Tester", "dev", { impl: true }),
  T("sql-formatter", "SQL Formatter", "dev", { impl: true }),
  T("timestamp", "Conversor Timestamp/Unix", "dev", { impl: true }),
  T("markdown", "Conversor Markdown", "dev", { impl: true }),
  T("gerar-cpf", "Gerador de CPF", "dev", { impl: true, desc: "CPF válido para testes." }),
  T("gerar-cnpj", "Gerador de CNPJ", "dev", { impl: true }),
  T("gerar-fake", "Gerador de dados fake", "dev", { impl: true, desc: "Nome, e-mail, endereço." }),
  T("comparar-codigo", "Comparador de textos/código", "dev", { impl: true }),

  // ── Escritório ──
  T("csv-excel", "CSV ⇄ Excel", "escritorio", { impl: true, desc: "Converta CSV e tabelas." }),
  T("contar-palavras", "Contador de palavras", "escritorio", { impl: true }),
  T("contar-caracteres", "Contador de caracteres", "escritorio", { impl: true }),
  T("mudar-caixa", "Maiúsculas/minúsculas", "escritorio", { impl: true, desc: "Transforme o texto." }),
  T("gerar-certificado", "Gerador de certificados", "escritorio", { min: "pessoal" }),
  T("assinatura-eletronica", "Assinatura eletrônica", "escritorio", { min: "profissional" }),

  // ── Áudio e Vídeo ──
  T("mp4-mp3", "MP4 para MP3", "midia", { min: "pessoal" }),
  T("video-gif", "Vídeo para GIF", "midia", { min: "pessoal" }),
  T("comprimir-video", "Comprimir vídeo", "midia", { min: "profissional" }),
  T("transcrever-audio", "Transcrição automática", "midia", { ai: true, min: "profissional" }),
  T("gerar-legendas", "Gerar legendas", "midia", { ai: true, min: "profissional" }),

  // ── Finanças ──
  T("conversor-moedas", "Conversor de moedas", "financas", { impl: true, desc: "Cotações atualizadas." }),
  T("calc-juros", "Calculadora de juros", "financas", { impl: true, desc: "Juros simples e compostos." }),
  T("calc-emprestimo", "Calculadora de empréstimo", "financas", { impl: true }),
  T("calc-investimento", "Calculadora de investimentos", "financas", { impl: true }),
  T("calc-impostos", "Calculadora de impostos", "financas", { impl: true }),
];

export const PLAN_RANK = { free: 0, pessoal: 1, profissional: 2, empresarial: 3 };
export const toolBySlug = (slug) => TOOLS.find((t) => t.slug === slug);
export const toolsByCategory = (cat) => TOOLS.filter((t) => t.category === cat);
export const canUseTool = (tool, planSlug) => (PLAN_RANK[planSlug] ?? 0) >= (PLAN_RANK[tool.min] ?? 0);
