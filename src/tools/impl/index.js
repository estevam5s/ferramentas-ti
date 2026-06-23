import * as dev from "./dev";
import * as seg from "./seguranca";
import * as txt from "./texto";
import * as fin from "./financas";
import * as img from "./imagem";
import * as pdf from "./pdf";
import * as ia from "./ia";
import * as web from "./web";

// Mapa slug → componente implementado.
export const IMPLEMENTATIONS = {
  // dev
  "json-formatter": dev.JsonFormatter, "xml-formatter": dev.XmlFormatter, "yaml-formatter": dev.YamlFormatter,
  "base64": dev.Base64, "url-encode": dev.UrlEncode, "regex-tester": dev.RegexTester, "sql-formatter": dev.SqlFormatter,
  "timestamp": dev.TimestampConv, "markdown": dev.MarkdownConv, "gerar-cpf": dev.GenCpf, "gerar-cnpj": dev.GenCnpj,
  "gerar-fake": dev.GenFake, "comparar-codigo": dev.CompareText,
  // segurança
  "gerar-senha": seg.GenPassword, "gerar-senha-lote": seg.GenPasswordBatch, "forca-senha": seg.PasswordStrength,
  "gerar-pin": seg.GenPin, "gerar-uuid": seg.GenUuid, "gerar-api-key": seg.GenApiKey, "gerar-jwt": seg.GenJwt,
  "hash-texto": seg.HashText, "criptografar-texto": seg.CryptoText, "gerar-qrcode": seg.GenQrcode, "ler-qrcode": seg.ReadQrcode,
  // texto/escritório
  "contar-palavras": txt.CountWords, "contar-caracteres": txt.CountChars, "mudar-caixa": txt.ChangeCase, "csv-excel": txt.CsvExcel,
  // finanças
  "conversor-moedas": fin.ConversorMoedas, "calc-juros": fin.CalcJuros, "calc-emprestimo": fin.CalcEmprestimo,
  "calc-investimento": fin.CalcInvestimento, "calc-impostos": fin.CalcImpostos,
  // imagem
  "comprimir-imagem": img.CompressImage, "redimensionar-imagem": img.ResizeImage, "converter-imagem": img.ConvertImage,
  "cortar-imagem": img.CropImage, "girar-imagem": img.RotateImage, "gerar-favicon": img.GenFavicon,
  "paleta-cores": img.ColorPalette, "marca-dagua-imagem": img.WatermarkImage,
  // pdf
  "juntar-pdf": pdf.MergePdf, "dividir-pdf": pdf.SplitPdf, "girar-pdf": pdf.RotatePdf, "numerar-pdf": pdf.NumberPdf,
  "marca-dagua-pdf": pdf.WatermarkPdf, "jpg-para-pdf": pdf.ImageToPdf, "extrair-paginas-pdf": pdf.ExtractPages,
  // ia
  "ia-resumir": ia.IaResumir, "ia-traduzir": ia.IaTraduzir, "ia-reescrever": ia.IaReescrever, "ia-gramatica": ia.IaGramatica,
  "ia-melhorar": ia.IaMelhorar, "ia-email": ia.IaEmail, "ia-contrato": ia.IaContrato, "ia-proposta": ia.IaProposta,
  "ia-descricao": ia.IaDescricao, "ia-titulos": ia.IaTitulos, "ia-posts": ia.IaPosts, "ia-curriculo": ia.IaCurriculo, "ia-chat": ia.IaChat,
  // web
  "minificar-html": web.MinifyHtml, "minificar-css": web.MinifyCss, "minificar-js": web.MinifyJs,
  "robots-txt": web.RobotsTxt, "sitemap-xml": web.SitemapXml, "screenshot-site": web.ScreenshotSite,
};
