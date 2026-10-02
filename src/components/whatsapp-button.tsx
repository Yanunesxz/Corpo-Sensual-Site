"use client";

import { useEffect, useRef } from "react";
import { useRota } from "@/lib/rota";
import { acaoDa } from "./barra-cta";
import { site, whatsappLink } from "@/lib/site";
import { WhatsApp } from "./icons";

/**
 * Botão flutuante do WhatsApp. Só existe com NEXT_PUBLIC_WHATSAPP configurado.
 *
 * Verde acessível (#0E7A3C, ícone branco a 5,43:1). Sobe acima do aviso de cookies
 * (--aviso-cookies-h, publicado pelo aviso). Abaixo de 1024 px some quando a barra
 * fixa está à vista, porque ela já traz o WhatsApp (html[data-cta-fixo], ver
 * globals.css), e some no celular enquanto a pessoa digita, para não cobrir o campo.
 * Abaixo de 1024 px, nas páginas com barra fixa ele nem aparece (.wa-com-barra): ali o
 * WhatsApp mora na barra, e o flutuante caía em cima do botão ou do título da capa.
 * Com o aviso de cookies aberto, também espera. Em /ajuda e /obrigado não existe: as
 * duas páginas já são feitas de botões de WhatsApp, cada um para quem resolve.
 * Tudo por atributo do DOM: nenhum estado do React.
 */
export function WhatsAppButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const pathname = useRota();
  const semFlutuante = pathname === "/ajuda" || pathname === "/obrigado";
  const ativo = Boolean(site.contact.whatsappUrl) && !semFlutuante;
  // Página com barra fixa: abaixo de 1024 px o WhatsApp mora na barra.
  const comBarra = acaoDa(pathname) !== null;

  useEffect(() => {
    const botao = ref.current;
    if (!botao) return;
    const celular = window.matchMedia("(max-width: 1023px)");
    const ehCampo = (t: EventTarget | null) => t instanceof HTMLElement && t.matches(".field, .seg input");
    const entrou = (e: FocusEvent) => {
      if (!ehCampo(e.target) || !celular.matches) return;
      botao.dataset.digitando = "";
      botao.tabIndex = -1;
    };
    const saiu = (e: FocusEvent) => {
      if (!ehCampo(e.target)) return;
      delete botao.dataset.digitando;
      botao.removeAttribute("tabindex");
    };
    document.addEventListener("focusin", entrou);
    document.addEventListener("focusout", saiu);
    return () => {
      document.removeEventListener("focusin", entrou);
      document.removeEventListener("focusout", saiu);
    };
  }, [ativo]);

  if (!ativo) return null;
  return (
    <a
      ref={ref}
      href={whatsappLink("Olá! Vim pelo site da Corpo Sensual e quero saber mais sobre o catálogo.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      data-ga-local="flutuante"
      className={`wa-flutuante ${comBarra ? "wa-com-barra" : ""}`}
    >
      <WhatsApp width={26} height={26} />
    </a>
  );
}
