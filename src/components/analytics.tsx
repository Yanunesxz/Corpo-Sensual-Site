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

/*
 * Celular: o aviso só aparece depois da primeira rolagem. Na primeira tela ele cobria o
 * botão da capa (em 375x667, o botão inteiro). Nada do Google carrega antes do aceite,
 * então esperar não muda nada da LGPD. Trava em true: rolou uma vez, fica.
 */
let rolou = false;
function assinarRolagem(cb: () => void) {
  const aoRolar = () => {
    if (window.scrollY > 80) {
      rolou = true;
      cb();
    }
  };
  window.addEventListener("scroll", aoRolar, { passive: true });
  return () => window.removeEventListener("scroll", aoRolar);
}
const podeMostrar = () => rolou || !window.matchMedia("(max-width: 767px)").matches;
const podeMostrarNoServidor = () => false;
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
  const mostrarAviso = useSyncExternalStore(assinarRolagem, podeMostrar, podeMostrarNoServidor);

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
      {(painel || (escolha === "" && mostrarAviso)) && <AvisoCookies />}
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
    // Também publica a altura e a presença do aviso: o WhatsApp flutuante sobe acima
    // dele e a barra fixa do celular espera ele sair (uma coisa na base da tela por vez).
    const html = document.documentElement;
    const observador = new ResizeObserver(() => {
      document.body.style.paddingBottom = `${el.offsetHeight}px`;
      html.style.setProperty("--aviso-cookies-h", `${el.offsetHeight}px`);
      html.dataset.avisoCookies = "1";
    });
    observador.observe(el);
    return () => {
      observador.disconnect();
      document.body.style.paddingBottom = "";
      html.style.removeProperty("--aviso-cookies-h");
      delete html.dataset.avisoCookies;
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
      className={`fixed inset-x-0 bottom-0 z-[45] border-t border-line bg-paper shadow-[var(--shadow-bar)] ${digitando ? "invisible" : ""}`}
    >
      {/* Compacto no celular (texto e botões numa linha só, ~63 px); como antes a partir de 768 px. */}
      <div className="wrap flex items-center gap-3 py-2 md:justify-between md:gap-8 md:py-4">
        <p className="min-w-0 flex-1 text-[13px] leading-[1.35] text-body md:flex-none md:text-sm md:leading-[1.5]">
          <span className="md:hidden">
            {ADS_CONVERSAO ? "Usamos cookies do Google para medir visitas e anúncios." : "Usamos cookies do Google para contar as visitas."}
          </span>
          <span className="max-md:hidden">
            {ADS_CONVERSAO
              ? "Usamos cookies do Google para contar as visitas e medir os nossos anúncios."
              : "Usamos cookies do Google Analytics para contar as visitas e melhorar o site."}
          </span>{" "}
          <Link href="/politicas/cookies" className="link">
            Saiba mais
          </Link>
        </p>
        <div className="flex shrink-0 gap-2 md:grid md:grid-cols-2 md:gap-3">
          <button type="button" className="btn btn-outline btn-sm px-3.5 md:px-6" onClick={() => salvarEscolha("recusado")}>
            Recusar
          </button>
          <button type="button" className="btn btn-primary btn-sm px-3.5 md:px-6" onClick={() => salvarEscolha("aceito")}>
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
