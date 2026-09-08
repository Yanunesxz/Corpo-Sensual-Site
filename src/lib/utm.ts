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

/** Lê os parâmetros da URL atual. Só funciona no navegador. */
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
  const out = { ...empty, page_url: window.location.href, referrer: document.referrer };
  for (const key of UTM_KEYS) out[key] = params.get(key) ?? "";
  return out;
}
