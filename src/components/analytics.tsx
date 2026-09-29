"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ADS_CONVERSAO,
  GA_ID,
  assinarCookies,
  desligarGtag,
  enviarPageView,
  lerEscolha,
  ligarGtag,
  painelEstaAberto,
  salvarEscolha,
  type Escolha,
} from "@/lib/analytics";
import { AnalyticsEventos } from "./analytics-eventos";

const escolhaNoServidor = () => "servidor" as const;
const painelNoServidor = () => false;

/**
 * Google Analytics com aviso de cookies. Só entra na página quando NEXT_PUBLIC_GA_ID
 * existe (ver layout.tsx). A escolha é lida no navegador, e não no servidor, para as
 * páginas continuarem estáticas no cache da Vercel.
 */
export function Analytics() {
  const escolha = useSyncExternalStore<Escolha | "servidor">(assinarCookies, lerEscolha, escolhaNoServidor);
  const painel = useSyncExternalStore(assinarCookies, painelEstaAberto, painelNoServidor);
  const pathname = usePathname();
  const aceito = escolha === "aceito";

  useEffect(() => {
    if (escolha === "aceito") ligarGtag();
    else if (escolha === "recusado") desligarGtag();
  }, [escolha]);

  // Uma visita por rota. Trocar só o ?categoria= da grade de peças não conta de novo.
  useEffect(() => {
    if (aceito) enviarPageView();
  }, [aceito, pathname]);

  return (
    <>
      {aceito && <Script id="gtag-js" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />}
      {aceito && <AnalyticsEventos />}
      {(painel || escolha === "") && <AvisoCookies />}
    </>
  );
}

function AvisoCookies() {
  const caixa = useRef<HTMLDivElement>(null);
  const [digitando, setDigitando] = useState(false);

  // Reserva no fim da página a altura do aviso: ele não cobre o rodapé nem o botão de enviar.
  // ResizeObserver porque a altura muda ao girar o celular e enquanto as fontes carregam.
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new ResizeObserver(() => {
      document.body.style.paddingBottom = `${el.offsetHeight}px`;
    });
    observador.observe(el);
    return () => {
      observador.disconnect();
      document.body.style.paddingBottom = "";
    };
  }, []);

  // No celular o aviso some enquanto a pessoa digita num campo, como o botão do WhatsApp.
  useEffect(() => {
    const celular = window.matchMedia("(max-width: 767px)");
    const ehCampo = (t: EventTarget | null) => t instanceof HTMLElement && t.classList.contains("field");
    const entrou = (e: FocusEvent) => {
      if (ehCampo(e.target) && celular.matches) setDigitando(true);
    };
    const saiu = (e: FocusEvent) => {
      if (ehCampo(e.target)) setDigitando(false);
    };
    document.addEventListener("focusin", entrou);
    document.addEventListener("focusout", saiu);
    return () => {
      document.removeEventListener("focusin", entrou);
      document.removeEventListener("focusout", saiu);
    };
  }, []);

  return (
    <div
      ref={caixa}
      role="region"
      aria-label="Aviso de cookies"
      className={`fixed inset-x-0 bottom-0 z-[45] border-t border-line bg-paper shadow-[0_-6px_20px_rgba(27,25,25,0.08)] ${digitando ? "invisible" : ""}`}
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-3 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-4">
        <p className="text-sm leading-[1.5] text-body">
          {ADS_CONVERSAO
            ? "Usamos cookies do Google para contar as visitas e medir os nossos anúncios."
            : "Usamos cookies do Google Analytics para contar as visitas e melhorar o site."}{" "}
          <Link href="/politicas/cookies" className="link">
            Saiba mais
          </Link>
        </p>
        <div className="grid shrink-0 grid-cols-2 gap-3">
          <button type="button" className="btn btn-outline min-h-11 px-6 text-[15px]" onClick={() => salvarEscolha("recusado")}>
            Recusar
          </button>
          <button type="button" className="btn btn-dark min-h-11 px-6 text-[15px]" onClick={() => salvarEscolha("aceito")}>
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
