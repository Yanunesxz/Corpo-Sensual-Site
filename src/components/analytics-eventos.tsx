"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ORIGENS_DE_COMPRA, consumirLead, depoisDaPageView, destinoWhatsApp, enviarConversaoAds, enviarEvento } from "@/lib/analytics";

/** De onde saiu o clique: cabeçalho, menu do celular, rodapé, botão flutuante ou corpo da página. */
function localDoLink(a: Element): string {
  const marcado = a.closest("[data-ga-local]")?.getAttribute("data-ga-local");
  if (marcado) return marcado;
  if (a.closest("#menu-mobile")) return "menu";
  if (a.closest("header")) return "cabecalho";
  if (a.closest("footer")) return "rodape";
  return "pagina";
}

/**
 * Os eventos que importam para a Corpo Sensual:
 * - generate_lead (lead_source): cadastro enviado, contado na página de obrigado, uma vez só.
 * - clique_whatsapp (destino, contato, local): vendedora, SAC, financeiro, gerente ou geral.
 * - clique_catalogo (local): qualquer link para /catalogo ("Receber catálogo").
 * Um ouvinte só no documento: nenhum botão precisa virar componente de cliente.
 */
export function AnalyticsEventos() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/obrigado") return;
    // O efeito do componente pai, que manda o page_view, roda depois deste: o setTimeout
    // espera por ele, e depoisDaPageView garante que o lead sai depois da visita.
    const t = window.setTimeout(
      () =>
        depoisDaPageView(() => {
          const origem = consumirLead(new URLSearchParams(window.location.search).get("origem") ?? "");
          if (!origem) return;
          enviarEvento("generate_lead", { lead_source: origem });
          if (ORIGENS_DE_COMPRA.has(origem)) enviarConversaoAds();
        }),
      0,
    );
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement)) return;
      let url: URL;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      if (url.hostname === "wa.me" || url.hostname === "api.whatsapp.com") {
        const numero = (url.hostname === "wa.me" ? url.pathname : (url.searchParams.get("phone") ?? "")).replace(/\D/g, "");
        // Só o destino. O link inteiro nunca vai: o ?text= pode ter o nome, a loja e a cidade.
        enviarEvento("clique_whatsapp", { ...destinoWhatsApp(numero), local: localDoLink(a) });
      } else if (url.origin === window.location.origin && url.pathname === "/catalogo") {
        enviarEvento("clique_catalogo", { local: localDoLink(a) });
      }
    };
    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return null;
}
