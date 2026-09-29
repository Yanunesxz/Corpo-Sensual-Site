/**
 * Campos de rastreamento capturados nos formulários.
 * Os nomes seguem o padrão das URLs de campanha (utm_*).
 */
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export type Tracking = Record<UtmKey, string> & {
  page_url: string;
  referrer: string;
};

/** A campanha com que a pessoa entrou no site, guardada por src/instrumentation-client.ts. */
export function lerEntrada(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem("cs:entrada") ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

/** Lê a campanha (da URL atual ou da entrada no site), a página e o referrer. Só no navegador. */
export function readTracking(): Tracking {
  const empty: Tracking = {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
    page_url: "",
    referrer: "",
  };
  if (typeof window === "undefined") return empty;
  const params = new URLSearchParams(window.location.search);
  // A URL atual manda. Sem UTM nela, vale a campanha com que a pessoa entrou no site
  // (ex.: chegou em /colecoes/delicias-de-verao?utm_source=instagram e tocou em "Receber catálogo").
  const campanha: Record<string, string> = UTM_KEYS.some((k) => params.get(k)) ? Object.fromEntries(params) : lerEntrada();
  // Os cortes seguem os limites do leadSchema (src/app/actions/leads.ts): uma URL de
  // anúncio longa não pode travar o cadastro com erro num campo que a pessoa não vê.
  const out = { ...empty, page_url: window.location.href.slice(0, 600), referrer: document.referrer.slice(0, 600) };
  for (const key of UTM_KEYS) out[key] = (campanha[key] ?? "").slice(0, 200);
  return out;
}
