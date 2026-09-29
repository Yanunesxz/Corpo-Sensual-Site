"use client";

import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { WhatsApp } from "./icons";

/**
 * Botão flutuante. Só aparece se NEXT_PUBLIC_WHATSAPP estiver configurado.
 *
 * No celular ele some enquanto a pessoa digita num campo, para não cobrir o
 * formulário quando o teclado abre. Antes isso era feito em CSS com
 * `body:has(.field:focus)`, que obriga o navegador a reavaliar a página inteira a
 * cada mudança de foco. Aqui é um ouvinte só, e só existe quando o botão existe.
 */
export function WhatsAppButton() {
  const [digitando, setDigitando] = useState(false);

  useEffect(() => {
    const celular = window.matchMedia("(max-width: 767px)");
    const ehCampo = (t: EventTarget | null) => t instanceof HTMLElement && t.classList.contains("field");
    const entrou = (e: FocusEvent) => ehCampo(e.target) && celular.matches && setDigitando(true);
    const saiu = (e: FocusEvent) => ehCampo(e.target) && setDigitando(false);
    document.addEventListener("focusin", entrou);
    document.addEventListener("focusout", saiu);
    return () => {
      document.removeEventListener("focusin", entrou);
      document.removeEventListener("focusout", saiu);
    };
  }, []);

  if (!site.contact.whatsappUrl) return null;
  const href = whatsappLink("Olá! Vim pelo site da Corpo Sensual e quero saber mais sobre o catálogo.");
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      aria-hidden={digitando || undefined}
      tabIndex={digitando ? -1 : undefined}
      className={`fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 md:bottom-5 md:right-5 md:h-14 md:w-14 ${
        digitando ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <WhatsApp width={26} height={26} />
    </a>
  );
}
