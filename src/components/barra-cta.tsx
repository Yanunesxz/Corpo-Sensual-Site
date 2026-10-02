"use client";

import Link from "next/link";
import { useRota } from "@/lib/rota";
import { useEffect, useRef } from "react";
import { whatsappLink } from "@/lib/site";
import { ArrowRight, WhatsApp } from "./icons";

type Acao = { href: string; rotulo: string; whats: boolean };

const MENSAGEM_WHATS = "Olá! Vim pelo site da Corpo Sensual e quero saber mais sobre o catálogo.";

/**
 * A ação de cada página. Onde não há (catálogo, contato, ajuda, obrigado, políticas,
 * 404) a barra não existe: ali o formulário ou o atendimento já é a tela.
 * Representante: sem WhatsApp, o caminho é o cadastro e a conversa com o gerente.
 */
export function acaoDa(pathname: string): Acao | null {
  if (pathname === "/fabrica-de-pijamas") return { href: "#formulario", rotulo: "Quero a tabela de preços", whats: true };
  if (pathname === "/seja-representante") return { href: "#formulario", rotulo: "Quero ser representante", whats: false };
  if (pathname === "/" || pathname === "/sobre" || pathname === "/colecoes" || pathname.startsWith("/colecoes/")) {
    return { href: "/catalogo", rotulo: "Quero receber o catálogo", whats: true };
  }
  return null;
}

/**
 * Barra fixa do polegar, só abaixo de 1024 px.
 *
 * - Aparece quando o gatilho da página ([data-barra-depois], a capa) saiu por cima da tela.
 *   Página sem gatilho: a barra nunca aparece.
 * - Some quando qualquer [data-sem-barra] está na tela (formulário, fecho, rodapé), para
 *   não cobrir o botão de enviar, e enquanto a pessoa digita (teclado aberto).
 * - Some com o aviso de cookies aberto (CSS: html[data-aviso-cookies]).
 *
 * Nada de estado do React: os observadores mudam só atributos do DOM (data-visivel,
 * inert e html[data-cta-fixo], que esconde o WhatsApp flutuante no celular).
 */
export function BarraCta() {
  const pathname = useRota();
  const acao = acaoDa(pathname);
  const temAcao = acao !== null;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const barra = ref.current;
    if (!barra || !temAcao) return;
    const html = document.documentElement;
    let passou = false;
    let digitando = false;
    const cobrindo = new Set<Element>();

    const atualizar = () => {
      // Com o aviso de cookies aberto a barra espera (uma coisa na base da tela por vez).
      // Contar isso aqui, e não só no CSS, mantém o WhatsApp flutuante à vista acima do
      // aviso: html[data-cta-fixo] só liga quando a barra aparece de verdade.
      const aviso = html.dataset.avisoCookies !== undefined;
      const visivel = passou && cobrindo.size === 0 && !digitando && !aviso;
      barra.dataset.visivel = visivel ? "1" : "0";
      // Escondida, a barra sai da ordem do Tab e do leitor de tela.
      barra.inert = !visivel;
      if (visivel) html.dataset.ctaFixo = "1";
      else delete html.dataset.ctaFixo;
    };

    const gatilho = document.querySelector("[data-barra-depois]");
    // A área observada desce muito abaixo da tela: o gatilho só "sai" quando passa por
    // cima dela. Sem isso, um salto direto do meio da página para o topo (tecla Home,
    // link para o início) não cruzava nenhum limite, o observador não avisava e a barra
    // ficava à vista em cima da capa (na página de coleção o gatilho é o manifesto,
    // abaixo da capa presa).
    const io1 = new IntersectionObserver(
      ([e]) => {
        passou = !e.isIntersecting && e.boundingClientRect.top < 0;
        atualizar();
      },
      { rootMargin: "0px 0px 100000px 0px" },
    );
    if (gatilho) io1.observe(gatilho);

    const io2 = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) cobrindo.add(e.target);
        else cobrindo.delete(e.target);
      }
      atualizar();
    });
    document.querySelectorAll("[data-sem-barra]").forEach((el) => io2.observe(el));

    const ehCampo = (t: EventTarget | null) => t instanceof HTMLElement && t.matches(".field, .seg input");
    const entrou = (e: FocusEvent) => {
      if (!ehCampo(e.target)) return;
      digitando = true;
      atualizar();
    };
    const saiu = (e: FocusEvent) => {
      if (!ehCampo(e.target)) return;
      digitando = false;
      atualizar();
    };
    document.addEventListener("focusin", entrou);
    document.addEventListener("focusout", saiu);
    // O aviso de cookies publica html[data-aviso-cookies] enquanto está aberto.
    const mo = new MutationObserver(atualizar);
    mo.observe(html, { attributes: true, attributeFilter: ["data-aviso-cookies"] });
    atualizar();

    return () => {
      io1.disconnect();
      io2.disconnect();
      mo.disconnect();
      document.removeEventListener("focusin", entrou);
      document.removeEventListener("focusout", saiu);
      delete html.dataset.ctaFixo;
    };
  }, [pathname, temAcao]);

  if (!acao) return null;

  const whats = acao.whats ? whatsappLink(MENSAGEM_WHATS) : "";
  const classe = "btn btn-primary min-w-0 flex-1 px-4";
  const conteudo = (
    <>
      <span className="truncate">{acao.rotulo}</span>
      <ArrowRight width={18} height={18} className="seta hidden min-[380px]:block" />
    </>
  );

  return (
    <div ref={ref} data-visivel="0" inert data-ga-local="barra-fixa" className="cta-bar lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        {acao.href.startsWith("#") ? (
          <a href={acao.href} className={classe}>
            {conteudo}
          </a>
        ) : (
          <Link href={acao.href} className={classe}>
            {conteudo}
          </Link>
        )}
        {whats && (
          <a
            href={whats}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar no WhatsApp"
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-whats-soft text-whats ring-whats transition-shadow hover:ring-1"
          >
            <WhatsApp width={24} height={24} />
          </a>
        )}
      </div>
    </div>
  );
}
