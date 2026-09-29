/**
 * Google Analytics 4 (e, se configurada, a conversão do Google Ads) com Consent Mode v2
 * no modo básico: o gtag.js só é baixado depois que a pessoa clica em "Aceitar".
 *
 * - Sem ID de medição nada disto roda e nenhum script do Google é baixado.
 * - As prévias da Vercel (cada branch) não medem: só a produção e o teste local.
 * - A escolha fica no localStorage do navegador ("cs:cookies") por 12 meses.
 *
 * Regra: parâmetro novo só entra em PERMITIDOS se não identificar a pessoa. Nunca mandar
 * nome, loja, cidade, telefone, e-mail, CNPJ, CPF nem o link do WhatsApp: os links wa.me
 * do /obrigado levam o nome no ?text=. Por isso o painel do GA4 precisa estar com
 * "Cliques de saída" DESLIGADO e o parâmetro de consulta "text" encoberto
 * (docs/seo-e-analytics.md).
 */
import { lerEntrada } from "@/lib/utm";
import { equipe, site } from "@/lib/site";

/** ID de medição do fluxo da Web do GA4 (G-XXXXXXXXXX). A variável na Vercel, se existir, manda. */
const GA_ID_DO_SITE = "";

export const GA_ID =
  process.env.AMBIENTE_VERCEL === "preview" ? "" : ((process.env.NEXT_PUBLIC_GA_ID ?? "").trim() || GA_ID_DO_SITE);
/** Conversão do Google Ads no formato "AW-CONTA/RÓTULO". Vazia = o site não fala com o Google Ads. */
export const ADS_CONVERSAO = GA_ID ? (process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSAO ?? "").trim() : "";
const ADS_ID = ADS_CONVERSAO.split("/")[0];

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// ---------- Escolha da pessoa ----------

export type Escolha = "aceito" | "recusado" | "";
const CHAVE = "cs:cookies";
const AVISO = "cs:cookies";
const DOZE_MESES = 365 * 24 * 60 * 60 * 1000;
/** Para a navegação privada que bloqueia o localStorage: vale até fechar a aba. */
let escolhaEmMemoria: Escolha = "";
let painelAberto = false;

export function lerEscolha(): Escolha {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? "null") as { escolha?: string; em?: number } | null;
    const valida = salvo?.em && Date.now() - salvo.em < DOZE_MESES;
    if (valida && (salvo.escolha === "aceito" || salvo.escolha === "recusado")) return salvo.escolha;
    return escolhaEmMemoria;
  } catch {
    return escolhaEmMemoria;
  }
}

export const painelEstaAberto = () => painelAberto;

export function assinarCookies(avisar: () => void) {
  window.addEventListener(AVISO, avisar);
  window.addEventListener("storage", avisar); // escolha feita em outra aba
  return () => {
    window.removeEventListener(AVISO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

/** Link "Preferências de cookies" do rodapé: reabre o aviso. */
export function abrirPreferencias() {
  painelAberto = true;
  window.dispatchEvent(new Event(AVISO));
}

export function salvarEscolha(escolha: "aceito" | "recusado") {
  escolhaEmMemoria = escolha;
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ escolha, em: Date.now() }));
  } catch {
    /* sem armazenamento: a escolha vale só nesta aba */
  }
  painelAberto = false;
  window.dispatchEvent(new Event(AVISO));
}

// ---------- gtag ----------

const NEGADO = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;
let ligado = false;
let iniciado = false;

/** O gtag.js só entende o objeto `arguments` de uma função comum, não um array. */
const gtag: (...args: unknown[]) => void = function () {
  // eslint-disable-next-line prefer-rest-params
  (window.dataLayer ??= []).push(arguments);
};

/** Bandeira oficial do GA para parar de enviar dados daquele ID. */
function bloquearGa(sim: boolean) {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = sim;
}

/** Liga a medição depois do aceite. Pode ser chamada mais de uma vez. */
export function ligarGtag() {
  if (!GA_ID || ligado) return;
  ligado = true;
  bloquearGa(false);
  if (!iniciado) gtag("consent", "default", NEGADO);
  gtag("consent", "update", {
    analytics_storage: "granted",
    // Com Google Ads configurado, o aviso também pede licença para medir anúncios.
    // ad_personalization continua negado: o site não faz remarketing.
    ...(ADS_ID ? { ad_storage: "granted", ad_user_data: "granted" } : {}),
  });
  if (!iniciado) {
    iniciado = true;
    gtag("js", new Date());
    gtag("config", GA_ID, {
      send_page_view: false, // as visitas saem de enviarPageView(), uma por rota
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    // Grava o gclid da página de entrada no cookie _gcl_aw: a conversão no /obrigado
    // chega sem o ?gclid= na URL e depende dele para ser atribuída ao anúncio.
    if (ADS_ID) gtag("config", ADS_ID);
  }
}

/** Desliga a medição depois de uma recusa e apaga os cookies do Google deste site. */
export function desligarGtag() {
  if (!GA_ID) return;
  if (ligado) gtag("consent", "update", NEGADO);
  ligado = false;
  bloquearGa(true);
  const base = location.hostname.replace(/^www\./, "");
  for (const nome of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (!/^(_ga|_gid|_gcl)/.test(nome)) continue;
    for (const dominio of ["", `; domain=${location.hostname}`, `; domain=.${base}`]) {
      document.cookie = `${nome}=; max-age=0; path=/${dominio}`;
    }
  }
}

// ---------- Eventos ----------

const PERMITIDOS = new Set(["page_location", "page_title", "lead_source", "destino", "contato", "local"]);

export const medindo = () => Boolean(GA_ID) && lerEscolha() === "aceito";

/** Única saída para o Google. Parâmetro fora da lista é descartado. */
export function enviarEvento(nome: string, params: Record<string, string> = {}) {
  if (!medindo()) return;
  ligarGtag();
  const limpos = Object.fromEntries(Object.entries(params).filter(([k, v]) => PERMITIDOS.has(k) && v !== ""));
  gtag("event", nome, limpos);
}

let tituloAnterior = "";

/** A campanha de entrada vai uma vez só por aba: no primeiro page_view depois do aceite. */
function campanhaPendente(url: URL): boolean {
  try {
    if (sessionStorage.getItem("cs:ga-campanha")) return false;
    sessionStorage.setItem("cs:ga-campanha", "1");
  } catch {
    return false;
  }
  return ![...url.searchParams.keys()].some((k) => k.startsWith("utm_") || k === "gclid");
}
let ultimaPageView: Promise<void> = Promise.resolve();

/**
 * Na navegação interna o Next esvazia o <title> e só põe o novo alguns milissegundos
 * depois. Espera o título da página nova (no máximo 1,5 s) para o relatório não sair
 * com título vazio ou com o da página anterior.
 */
function esperarTitulo(): Promise<void> {
  return new Promise((pronto) => {
    const ok = () => document.title !== "" && document.title !== tituloAnterior;
    if (ok()) return pronto();
    const observador = new MutationObserver(() => ok() && fim());
    const limite = window.setTimeout(fim, 1500);
    function fim() {
      observador.disconnect();
      window.clearTimeout(limite);
      pronto();
    }
    observador.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
  });
}

/** Uma visualização por rota. A 404 sai com título próprio para aparecer no relatório. */
export function enviarPageView() {
  const url = new URL(location.href);
  url.hash = "";
  // Aceitou depois de navegar: a campanha com que entrou volta no primeiro page_view.
  if (campanhaPendente(url)) {
    for (const [k, v] of Object.entries(lerEntrada())) url.searchParams.set(k, v);
  }
  ultimaPageView = esperarTitulo().then(() => {
    tituloAnterior = document.title;
    const titulo = document.querySelector("[data-ga-404]") ? "Página não encontrada (404)" : document.title;
    enviarEvento("page_view", { page_location: url.toString(), page_title: titulo });
  });
}

/** Roda `fn` depois que o page_view da página atual saiu (o lead vem depois da visita). */
export function depoisDaPageView(fn: () => void) {
  void ultimaPageView.then(fn);
}

/** Conversão do Google Ads, só quando NEXT_PUBLIC_GOOGLE_ADS_CONVERSAO existe. */
export function enviarConversaoAds() {
  if (!ADS_CONVERSAO || !medindo()) return;
  ligarGtag();
  gtag("event", "conversion", { send_to: ADS_CONVERSAO });
}

// ---------- Lead e WhatsApp ----------

const CHAVE_LEAD = "cs:lead-ga";
const TRINTA_MINUTOS = 30 * 60 * 1000;
/** Cadastros de quem quer comprar: são os que contam como conversão no Google Ads. */
export const ORIGENS_DE_COMPRA = new Set(["catalogo", "colecao", "fabrica-de-pijamas"]);

/**
 * Chamada no envio do formulário. Só a página de obrigado que vem logo depois conta o
 * lead: recarregar, voltar ou abrir um link antigo de obrigado do Wix não conta.
 */
export function marcarLeadEnviado(origem: string) {
  try {
    sessionStorage.setItem(CHAVE_LEAD, JSON.stringify({ origem, em: Date.now() }));
  } catch {
    /* sem armazenamento: o lead vai para o CRM normalmente, só não é contado no GA */
  }
}

/** A origem do lead recém-enviado, uma vez só. */
export function consumirLead(origemDaUrl: string): string {
  try {
    const d = JSON.parse(sessionStorage.getItem(CHAVE_LEAD) ?? "null") as { origem?: string; em?: number } | null;
    if (!d?.origem || d.origem !== origemDaUrl || !d.em || Date.now() - d.em > TRINTA_MINUTOS) return "";
    sessionStorage.removeItem(CHAVE_LEAD);
    return d.origem;
  } catch {
    return "";
  }
}

/** Para quem o botão de WhatsApp leva. Nunca o texto da mensagem, que pode ter o nome da pessoa. */
export function destinoWhatsApp(numero: string): { destino: string; contato: string } {
  if (numero === equipe.sac.numero) return { destino: "sac", contato: "" };
  if (numero === equipe.financeiro.numero) return { destino: "financeiro", contato: "" };
  if (numero === equipe.gerenteComercial.numero) return { destino: "gerente", contato: equipe.gerenteComercial.nome };
  const vendedora = equipe.vendedoras.find((v) => v.numero === numero);
  if (vendedora) return { destino: "vendedora", contato: vendedora.nome };
  if (numero && numero === site.contact.whatsapp) return { destino: "geral", contato: "" };
  return { destino: "outro", contato: "" };
}
