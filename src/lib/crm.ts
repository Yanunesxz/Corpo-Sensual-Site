// Só o servidor importa este módulo (a server action de leads). Nunca importe
// de um componente "use client": a chave ficaria exposta no navegador.
import type { LeadInsert, LeadSource } from "@/lib/types";

/**
 * Envio do lead para o CRM (CSP 360) — Edge Function `lead-site` do Supabase
 * do CRM. Roda SÓ no servidor: a chave vem de `LEAD_SITE_CHAVE`, variável de
 * ambiente sem o prefixo NEXT_PUBLIC, e nunca chega ao navegador.
 *
 * O CRM procura o cliente por CNPJ, telefone e e-mail; cria o prospecto com a
 * responsável e abre o negócio no "Funil de Vendas". Reenviar o mesmo lead não
 * duplica nada lá. Contrato e regras: repositório Projeto-CS-SP,
 * central/integracao-site.md (a função mora na branch feat/lead-site de lá).
 *
 * Quem já é cliente da Corpo Sensual não vira lead (pedido do Yan, 11/11/2026):
 * o cadastro pergunta ao CRM no passo do CNPJ/CPF (consultarClienteNoCrm) e o
 * envio leva `travar_cliente`, que faz a mesma conferência do lado de lá.
 */

/**
 * Endereço da função no Supabase do CRM.
 *
 * ATENÇÃO ao nome: a função foi publicada como `dynamic-endpoint`, que é o nome
 * que o editor do Supabase sugere sozinho, e não como `lead-site`, que é o nome
 * do código e da documentação. O site apontava para `lead-site` e levava 404 em
 * produção, então o lead não chegava ao CRM. Confirmado em 11/09/2026:
 * `lead-site` responde 404 e `dynamic-endpoint` responde 401 com a chave errada,
 * ou seja, só a segunda existe.
 *
 * Para arrumar de vez: republicar a função no Supabase com o nome `lead-site` e
 * trocar esta linha de volta. Enquanto isso, `LEAD_SITE_URL` continua podendo
 * sobrescrever o endereço sem mexer no código.
 */
const URL_PADRAO = "https://brwyvxrueogayjsqfkbo.supabase.co/functions/v1/dynamic-endpoint";
const TEMPO_LIMITE_MS = 8000;

/** Marca deste site no CRM. O site da Plumene usa "plumene". */
const MARCA = "cs";

/** Nome da página como aparece no CRM (campo "Página do site" e título do negócio). */
const PAGINAS: Record<LeadSource, string> = {
  catalogo: "Receber catálogo",
  "fabrica-de-pijamas": "LP Fábrica de Pijamas",
  colecao: "Coleção",
  contato: "Contato",
  representante: "Quero ser representante",
  varejo: "Varejo — onde comprar",
};

/** Cadastros que perguntam CNPJ/CPF: neles, quem já é cliente é travado. */
const ORIGENS_COM_TRAVA = new Set<LeadSource>(["catalogo", "fabrica-de-pijamas", "colecao", "contato"]);

export type ResultadoCrm =
  | { status: "enviado"; cliente: string | null; negocio: string | null; clienteNovo: boolean; negocioNovo: boolean }
  /** O documento é de quem já é cliente: o CRM não gravou nada e a pessoa vai para /ja-e-cliente. */
  | { status: "ja-cliente" }
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
    // O CRM procura o cliente pelo CNPJ, então o campo `cnpj` só leva CNPJ.
    // Quem não tem loja informa CPF, que vai num campo próprio.
    cnpj: lead.has_cnpj ? (lead.document ?? "") : "",
    cpf: lead.has_cnpj ? "" : (lead.document ?? ""),
    cidade: lead.city ?? "",
    uf: lead.state ?? "",
    mensagem: lead.message ?? "",
    travar_cliente: ORIGENS_COM_TRAVA.has(lead.source) && Boolean(lead.document),
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
    if (json.jaCliente === true) return { status: "ja-cliente" };
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

/** A consulta é rápida (uma linha no CRM); passou disso, o cadastro segue sem ela. */
const TEMPO_CONSULTA_MS = 5000;

/**
 * O CNPJ ou CPF (só os dígitos, já validados) é de quem já é cliente da Corpo
 * Sensual? true/false, ou null quando não deu para saber (sem chave, CRM fora,
 * tempo esgotado). Quem chama trata null como "não é": na dúvida, o cadastro
 * segue e o lead nunca se perde. O CRM responde só sim ou não, nenhum dado.
 */
export async function consultarClienteNoCrm(documento: string): Promise<boolean | null> {
  const chave = process.env.LEAD_SITE_CHAVE?.trim();
  if (!chave) return null;
  const url = process.env.LEAD_SITE_URL?.trim() || URL_PADRAO;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-chave": chave },
      body: JSON.stringify({ acao: "consultar", marca: MARCA, documento }),
      signal: AbortSignal.timeout(TEMPO_CONSULTA_MS),
      cache: "no-store",
    });
    if (!r.ok) return null;
    const json = (await r.json()) as { ok?: boolean; cliente?: unknown };
    return json.ok === true && typeof json.cliente === "boolean" ? json.cliente : null;
  } catch {
    return null;
  }
}
