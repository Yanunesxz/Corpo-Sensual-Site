import type { MetadataRoute } from "next";
import { SITE_ORIGIN, urlOficial } from "@/lib/site";

/**
 * Robôs de busca e de IA que leem o site para responder perguntas (ChatGPT, Claude,
 * Perplexity, Gemini, Copilot, Meta AI). Todos liberados de propósito: quando um lojista
 * pergunta "fábrica de pijamas no atacado em Muriaé" a um assistente, a resposta vem do
 * que ele leu aqui. A regra "*" já libera tudo; os nomes abaixo deixam a intenção explícita
 * e sobrevivem se um dia alguém restringir o "*".
 */
const ROBOS_DE_IA = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "DuckAssistBot",
  "cohere-ai",
  "CCBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    // /obrigado fica liberado de propósito: a página já tem noindex, e o Google só lê
    // o noindex se puder abri-la. Com Disallow ela podia aparecer como "indexada,
    // embora bloqueada". Fora do domínio oficial, o cabeçalho X-Robots-Tag do
    // next.config.ts tira todas as páginas do Google.
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ROBOS_DE_IA, allow: "/" },
    ],
    sitemap: urlOficial("/sitemap.xml"),
    host: SITE_ORIGIN,
  };
}
