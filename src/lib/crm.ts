// Só o servidor importa este módulo (a server action de leads). Nunca importe
// de um componente "use client": a chave ficaria exposta no navegador.
import type { LeadInsert, LeadSource } from "@/lib/types";

/**
 * Envio do lead para o CRM (CSP 360) — Edge Function `lead-site` do Supabase
 * do CRM. Roda SÓ no servidor: a chave vem de `LEAD_SITE_CHAVE`, variável de
 * ambiente sem o prefixo NEXT_PUBLIC, e nunca chega ao navegador.
 *
 * O CRM procura o cliente por CNPJ, telefone e e-mail; cria o prospecto com a
 * responsável e abre o negócio no funil "Venda Direta — Leads". Reenviar o mesmo
 * lead não duplica nada lá. Contrato e regras: repositório Projeto-CS-SP,
 * central/integracao-site.md.
 */

const URL_PADRAO = "https://brwyvxrueogayjsqfkbo.supabase.co/functions/v1/lead-site";
const TEMPO_LIMITE_MS = 8000;

/** Marca deste site no CRM. O site da Plumene usa "plumene". */
const MARCA = "cs";

/** Nome da página como aparece no CRM (campo "Página do site" e título do negócio). */
const PAGINAS: Record<LeadSource, string> = {
  catalogo: "Receber catálogo",
  "fabrica-de-pijamas": "LP Fábrica de Pijamas",
  "programa-cashback": "Programa Cashback",
  colecao: "Coleção",
  contato: "Contato",
};

export type ResultadoCrm =
  | { status: "enviado"; cliente: string | null; negocio: string | null; clienteNovo: boolean; negocioNovo: boolean }
  | { status: "pendente"; erro: string };

export function isCrmConfigured(): boolean {
  return Boolean(process.env.LEAD_SITE_CHAVE?.trim());
}

/**
 * Chama o CRM e devolve o resultado. Nunca lança: falha vira `pendente` com o
 * motivo, para o lead ficar gravado no Supabase do site e ser reenviado depois.
 */
export async function enviarLeadParaCrm(lead: LeadInsert): Promise<ResultadoCrm> {
  const chave = process.env.LEAD_SITE_CHAVE?.trim();
  if (!chave) return { status: "pendente", erro: "LEAD_SITE_CHAVE não configurada" };
  const url = process.env.LEAD_SITE_URL?.trim() || URL_PADRAO;

  const corpo = {
    marca: MARCA,
    pagina: PAGINAS[lead.source] ?? lead.source,
    url: lead.page_url ?? "",
    nome: lead.name,
    nome_loja: lead.company ?? "",
    email: lead.email,
    whatsapp: lead.whatsapp,
    possui_cnpj: lead.has_cnpj ? "Sim" : "Não",
    cidade: lead.city ?? "",
    uf: lead.state ?? "",
    mensagem: lead.message ?? "",
    utm: {
      source: lead.utm_source ?? "",
      medium: lead.utm_medium ?? "",
      campaign: lead.utm_campaign ?? "",
      term: lead.utm_term ?? "",
    },
    enviado_em: new Date().toISOString(),
  };

  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-chave": chave },
      body: JSON.stringify(corpo),
      signal: controle.signal,
      cache: "no-store",
    });
    const texto = await r.text();
    let json: Record<string, unknown> = {};
    try {
      json = JSON.parse(texto) as Record<string, unknown>;
    } catch {
      /* resposta sem JSON */
    }
    if (!r.ok || json.ok !== true) {
      const erro = typeof json.erro === "string" ? json.erro : `HTTP ${r.status}`;
      return { status: "pendente", erro: erro.slice(0, 300) };
    }
    const cliente = (json.cliente ?? {}) as { codigo?: string | null; novo?: boolean };
    const negocio = (json.negocio ?? {}) as { codigo?: string | null; novo?: boolean };
    return {
      status: "enviado",
      cliente: cliente.codigo ?? null,
      negocio: negocio.codigo ?? null,
      clienteNovo: cliente.novo === true,
      negocioNovo: negocio.novo === true,
    };
  } catch (e) {
    const motivo = e instanceof Error && e.name === "AbortError" ? "tempo esgotado" : String((e as Error)?.message ?? e);
    return { status: "pendente", erro: motivo.slice(0, 300) };
  } finally {
    clearTimeout(timer);
  }
}
