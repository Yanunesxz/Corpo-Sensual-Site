"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { ArrowRight, ChevronRight, Close, Menu } from "./icons";

/** Navegação da tela larga, à esquerda da assinatura. "Contato" fica à direita, junto do catálogo. */
const NAV = [
  { href: "/colecoes", label: "Coleções" },
  { href: "/fabrica-de-pijamas", label: "Para lojistas" },
  { href: "/sobre", label: "Sobre a fábrica" },
];

/** Menu do celular: links grandes, na ordem em que a lojista procura. */
const MENU = [
  { href: "/", label: "Início" },
  { href: "/colecoes", label: "Coleções" },
  { href: "/fabrica-de-pijamas", label: "Para lojistas" },
  { href: "/sobre", label: "Sobre a fábrica" },
  { href: "/contato", label: "Contato" },
  { href: "/ajuda", label: "Já sou cliente" },
  { href: "/seja-representante", label: "Seja representante" },
];

const contatoLink = "inline-flex min-h-11 items-center self-start text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-ink";
const linkFaixa = "min-h-11 items-center whitespace-nowrap text-white underline decoration-white/45 underline-offset-4 transition-colors hover:decoration-white";

/**
 * Cabeçalho em duas partes. A faixa azul-noite (44 px) responde em 5 segundos o que a
 * lojista pergunta (atacado, mínimo, Pix, frete) e rola junto com a página; a barra
 * branca, com a assinatura no centro, fica presa no topo (sticky com top negativo).
 *
 * Abaixo de 1024 px o menu abre numa folha que sobe de baixo, perto do polegar:
 * trava a rolagem, deixa o resto da página inerte (o foco não sai da folha), fecha com
 * Esc, toque fora, escolha de link, troca de página ou largura de desktop, e devolve o
 * foco ao botão do menu.
 */
export function SiteHeader() {
  const pathname = usePathname();
  // Guarda a rota em que o menu abriu: trocou de página, ele já nasce fechado
  // (sem setState dentro de efeito).
  const [abertoEm, setAbertoEm] = useState<string | null>(null);
  const open = abertoEm === pathname;
  const fechar = () => setAbertoEm(null);

  const botaoMenu = useRef<HTMLButtonElement>(null);
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const faixa = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLDivElement>(null);

  // Menu aberto: trava a rolagem, põe o resto da página fora do Tab e do leitor de
  // tela (inert) e leva o foco ao "Fechar menu". Ao fechar, desfaz tudo.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const fora = [
      faixa.current,
      barra.current,
      ...document.querySelectorAll<HTMLElement>("main, footer, .cta-bar, .wa-flutuante, [aria-label='Aviso de cookies']"),
    ].filter((el): el is HTMLElement => el !== null);
    const antes = fora.map((el) => el.inert);
    for (const el of fora) el.inert = true;
    botaoFechar.current?.focus();
    const voltar = botaoMenu.current;
    return () => {
      html.style.overflow = "";
      document.body.style.overflow = "";
      fora.forEach((el, i) => {
        // A barra fixa cuida do próprio inert: volta conforme estiver à vista agora.
        el.inert = el.classList.contains("cta-bar") ? el.dataset.visivel !== "1" : antes[i];
      });
      voltar?.focus({ preventScroll: true });
    };
  }, [open]);

  // Fecha com Esc e ao girar o aparelho para uma largura em que o menu some.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbertoEm(null);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setAbertoEm(null);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  const ativo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // Na página de representante o dono pediu zero números: a faixa fala da estrutura.
  const representante = pathname.startsWith("/seja-representante");
  const faixaCurta = representante ? "Fábrica própria em Muriaé, MG" : `Atacado ${site.commercial.noMinOrder.toLowerCase()}`;
  const faixaLonga = representante
    ? ["Fábrica própria em Muriaé, MG", "Coleção nova a cada estação", "Feminino, masculino e infantil"]
    : ["Atacado para lojistas de todo o Brasil", site.commercial.noMinOrder, site.commercial.pixDiscount, site.commercial.freeShippingSudeste];

  return (
    <header className="sticky top-[-2.75rem] z-50">
      {/* Faixa de condições: rola e some; a barra de baixo fica presa. */}
      <div ref={faixa} className="on-dark h-11 bg-noite text-[13px] font-medium text-noite-texto">
        <div className="wrap flex h-full items-center justify-between gap-4">
          <p className="min-w-0 truncate">
            <span className="text-white lg:hidden">{faixaCurta}</span>
            <span className="hidden lg:inline">
              {faixaLonga.map((item, i) => (
                // A quarta condição (frete) só entra onde cabe numa linha.
                <span key={item} className={i === 3 ? "hidden xl:inline" : undefined}>
                  {i > 0 && (
                    <span aria-hidden className="mx-2.5 text-white/40">
                      ·
                    </span>
                  )}
                  <span className={i === 0 ? "text-white" : undefined}>{item}</span>
                </span>
              ))}
            </span>
          </p>
          <nav aria-label="Atalhos" className="flex shrink-0 items-center gap-6">
            <Link href="/ajuda" className={`${linkFaixa} inline-flex`}>
              Já sou cliente
            </Link>
            <Link href="/seja-representante" className={`${linkFaixa} hidden lg:inline-flex`}>
              Seja representante
            </Link>
          </nav>
        </div>
      </div>

      {/* Barra: menu ou navegação à esquerda, assinatura no centro, catálogo à direita. */}
      <div ref={barra} className="border-b border-line bg-paper">
        {/* No celular a assinatura fica ao lado do menu (centralizada ela não cabe com o
            botão do catálogo sem ficar torta); a partir de 768 px, no centro. */}
        <div className="wrap grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 md:grid-cols-[1fr_auto_1fr] lg:h-[4.5rem] lg:gap-6">
          <div className="flex items-center">
            <button
              ref={botaoMenu}
              type="button"
              className="-ml-2.5 flex h-11 w-11 items-center justify-center text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label="Abrir menu"
              onClick={() => setAbertoEm(pathname)}
            >
              <Menu />
            </button>
            <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex xl:gap-9">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={ativo(item.href) ? "page" : undefined}
                  className={`relative inline-flex h-11 items-center whitespace-nowrap font-[family-name:var(--font-button)] text-[14px] tracking-[0.01em] text-ink transition-colors hover:text-noite after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:bg-ink after:transition-transform after:duration-300 ${
                    ativo(item.href) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Assinatura. Sem aria-label: o nome acessível é o próprio texto visível (WCAG 2.5.3). */}
          <Link href="/" className="inline-flex h-11 min-w-0 items-center gap-2 justify-self-start text-ink md:justify-self-center lg:gap-3" onClick={fechar}>
            {/* eager, e não priority, para não disputar o preload com a foto da capa */}
            <Image src="/images/logo-cs-tinta.png" alt="" width={56} height={56} loading="eager" className="h-7 w-7 lg:h-8 lg:w-8" />
            <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[12.5px] uppercase leading-none tracking-[0.14em] min-[380px]:tracking-[0.2em] lg:text-[15px]">
              {site.name}
            </span>
            <span className="sr-only">, página inicial</span>
          </Link>

          <div className="flex items-center justify-end gap-7">
            <Link
              href="/contato"
              aria-current={ativo("/contato") ? "page" : undefined}
              className="hidden h-11 items-center font-[family-name:var(--font-button)] text-[14px] tracking-[0.01em] text-ink underline-offset-[6px] transition-colors hover:text-noite hover:underline lg:inline-flex"
            >
              Contato
            </Link>
            <Link href="/catalogo" className="btn btn-primary btn-sm px-4 lg:hidden">
              Catálogo
            </Link>
            <Link href="/catalogo" className="btn btn-primary btn-sm hidden lg:inline-flex">
              Receber catálogo
              <ArrowRight width={16} height={16} className="seta" />
            </Link>
          </div>
        </div>
      </div>

      {open && <MenuFolha botaoFechar={botaoFechar} fechar={fechar} ativo={ativo} />}
    </header>
  );
}

function MenuFolha({
  botaoFechar,
  fechar,
  ativo,
}: {
  botaoFechar: React.RefObject<HTMLButtonElement | null>;
  fechar: () => void;
  ativo: (href: string) => boolean;
}) {
  const c = site.contact;
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Fundo: tocar fora fecha. Não recebe foco (o "Fechar menu" já faz isso). */}
      <div aria-hidden className="folha-fundo absolute inset-0" onClick={fechar} />
      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-titulo"
        className="folha absolute inset-x-0 bottom-0 mx-auto max-h-[88svh] max-w-xl overflow-y-auto overscroll-contain"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-paper px-5 pb-1 pt-5">
          <span aria-hidden className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-line" />
          <p id="menu-titulo" className="font-[family-name:var(--font-display)] text-[1.5rem] leading-none text-ink">
            Menu
          </p>
          <button
            ref={botaoFechar}
            type="button"
            className="-mr-1.5 flex h-11 w-11 items-center justify-center rounded-full bg-sky text-ink transition-colors hover:bg-sky-deep"
            aria-label="Fechar menu"
            onClick={fechar}
          >
            <Close width={20} height={20} />
          </button>
        </div>

        <div className="px-5 pb-[calc(1.75rem+env(safe-area-inset-bottom))]">
          <nav aria-label="Menu">
            <ul className="mt-2">
              {MENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={fechar}
                    aria-current={ativo(item.href) ? "page" : undefined}
                    className={`flex min-h-14 items-center justify-between gap-4 border-b border-line text-[17px] text-ink ${ativo(item.href) ? "font-medium" : ""}`}
                  >
                    {item.label}
                    <ChevronRight width={18} height={18} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/catalogo" onClick={fechar} className="btn btn-primary btn-lg mt-6 w-full">
              Quero receber o catálogo
              <ArrowRight width={18} height={18} className="seta" />
            </Link>
            <p className="legenda mt-3 text-center">
              {site.commercial.noMinOrder}. {site.commercial.noCnpjNote}
            </p>
          </nav>

          <div className="mt-8 bg-sky-soft p-5 text-[15px] leading-relaxed text-body">
            <p className="eyebrow">Fábrica e atendimento</p>
            <p className="mt-3">
              {site.legal.endereco}
              <br />
              {site.legal.cidade}, {site.legal.uf}
            </p>
            <div className="mt-1 flex flex-col">
              {c.whatsappUrl && (
                <a className={contatoLink} href={c.whatsappUrl} target="_blank" rel="noreferrer">
                  WhatsApp {c.whatsappLabel}
                </a>
              )}
              {c.phoneUrl && (
                <a className={contatoLink} href={c.phoneUrl}>
                  Telefone {c.phoneLabel}
                </a>
              )}
              {c.email && (
                <a className={contatoLink} href={`mailto:${c.email}`}>
                  {c.email}
                </a>
              )}
              {c.instagram && (
                <a className={contatoLink} href={`https://www.instagram.com/${c.instagram}/`} target="_blank" rel="noreferrer">
                  Instagram @{c.instagram}
                </a>
              )}
              <Link className={contatoLink} href="/contato" onClick={fechar}>
                Todos os contatos
              </Link>
            </div>
            {c.hours && <p className="mt-2">{c.hours}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
