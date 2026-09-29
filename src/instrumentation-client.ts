/**
 * Roda uma vez por carregamento completo, antes de a página ficar interativa.
 *
 * Guarda com que campanha a pessoa entrou no site (UTM e gclid). Depois que ela
 * navega, a URL perde esses parâmetros; o formulário (src/lib/utm.ts) e o GA
 * (src/lib/analytics.ts) leem daqui. Fica no sessionStorage, some quando a aba
 * fecha e só sai do navegador junto com o cadastro que a pessoa envia.
 */
const CAMPOS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];

try {
  const params = new URLSearchParams(window.location.search);
  const campanha: Record<string, string> = {};
  for (const k of CAMPOS) {
    const v = params.get(k);
    if (v) campanha[k] = v.slice(0, 200);
  }
  // Grava na primeira página da aba, ou quando a pessoa volta por outra campanha.
  if (!sessionStorage.getItem("cs:entrada") || Object.keys(campanha).length > 0) {
    sessionStorage.setItem("cs:entrada", JSON.stringify(campanha));
  }
} catch {
  /* navegação privada: o formulário usa só a URL atual, como hoje */
}
