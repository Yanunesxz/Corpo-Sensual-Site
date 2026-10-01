"use client";

import { useEffect, useRef } from "react";
import { site, whatsappLink } from "@/lib/site";
import { WhatsApp } from "./icons";

/**
 * Botão flutuante do WhatsApp. Só existe com NEXT_PUBLIC_WHATSAPP configurado.
 *
 * Verde acessível (#0E7A3C, ícone branco a 5,43:1). Sobe acima do aviso de cookies
 * (--aviso-cookies-h, publicado pelo aviso). Abaixo de 1024 px some quando a barra
 * fixa está à vista, porque ela já traz o WhatsApp (html[data-cta-fixo], ver
 * globals.css), e some no celular enquanto a pessoa digita, para não cobrir o campo.
 * Tudo por atributo do DOM: nenhum estado do React.
 */
export function WhatsAppButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const ativo = Boolean(site.contact.whatsappUrl);

  useEffect(() => {
    const botao = ref.current;
    if (!botao) return;
    const celular = window.matchMedia("(max-width: 767px)");
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
      className="wa-flutuante"
    >
      <WhatsApp width={26} height={26} />
    </a>
  );
}
