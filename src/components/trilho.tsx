"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "./icons";

type Props = {
  /** Os itens, cada um num <li>. */
  children: ReactNode;
  /** Nome do trilho para leitores de tela, ex.: "Peças mais vendidas". */
  rotulo: string;
  /** Título da seção, à esquerda das setas. */
  cabecalho?: ReactNode;
  /** Linha entre o título e o trilho (ex.: chips de filtro). */
  filtros?: ReactNode;
  /** Quando muda (ex.: outro filtro), o trilho volta ao começo e remede as pontas. */
  reinicio?: string;
  /** Setas sobre fundo azul-noite. */
  escuro?: boolean;
  /** Lista numerada (<ol>) em vez de <ul>, quando a ordem importa (etapas da produção). */
  ordenada?: boolean;
  /**
   * Classes extras do trilho: largura dos cartões (trilho-largo, trilho-medio), virar
   * grade na tela larga (trilho-lg-grade [--colunas:5]) e margens (mt-6).
   */
  className?: string;
};

/** Onde o trilho está: no começo, no fim (ou nos dois, quando tudo cabe na tela). */
function pontas(el: HTMLElement) {
  return { inicio: el.scrollLeft < 8, fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 };
}

/**
 * Carrossel horizontal com scroll-snap: no celular é o dedo que passa, sem JavaScript.
 * A partir de 768 px entram duas setas (48 px) ao lado do título, que só rolam o
 * trilho e se apagam nas pontas; somem quando tudo cabe. A lista recebe foco, então as
 * setas do teclado também rolam. Nunca gera rolagem lateral na página: a sangria até a
 * borda da tela é a margem do .wrap (ver .trilho em globals.css).
 */
export function Trilho({ children, rotulo, cabecalho, filtros, reinicio, escuro = false, ordenada = false, className = "" }: Props) {
  const ref = useRef<HTMLUListElement & HTMLOListElement>(null);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(false);

  function medir() {
    const el = ref.current;
    if (!el) return;
    const p = pontas(el);
    setInicio(p.inicio);
    setFim(p.fim);
  }

  // O ResizeObserver avisa já na primeira medida: as setas nascem certas.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => medir());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Outro filtro: volta ao começo. A medida sai no quadro seguinte, já com o conteúdo novo.
  useEffect(() => {
    const el = ref.current;
    if (!el || reinicio === undefined) return;
    el.scrollTo({ left: 0 });
    const id = requestAnimationFrame(() => medir());
    return () => cancelAnimationFrame(id);
  }, [reinicio]);

  function mover(direcao: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direcao * el.clientWidth * 0.8, behavior: reduzido ? "auto" : "smooth" });
  }

  const seta = escuro
    ? "border-white/40 text-white hover:border-white hover:bg-white hover:text-ink disabled:opacity-30"
    : "border-line-strong bg-paper text-ink hover:border-ink hover:bg-ink hover:text-white disabled:opacity-30";
  // Na grade da tela larga não há o que rolar: as setas nem aparecem.
  const setasNoLg = className.includes("trilho-lg-grade") ? "lg:hidden" : "";
  const Lista = ordenada ? "ol" : "ul";

  const setas = (
    <div className={`hidden shrink-0 gap-2 ${inicio && fim ? "" : "md:flex"} ${setasNoLg}`}>
      <button
        type="button"
        aria-label="Ver anteriores"
        disabled={inicio}
        onClick={() => mover(-1)}
        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none ${seta}`}
      >
        <ChevronLeft width={20} height={20} />
      </button>
      <button
        type="button"
        aria-label="Ver mais"
        disabled={fim}
        onClick={() => mover(1)}
        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none ${seta}`}
      >
        <ChevronRight width={20} height={20} />
      </button>
    </div>
  );

  return (
    <div>
      {cabecalho ? (
        <div className="flex items-end justify-between gap-8">
          <div className="min-w-0 flex-1">{cabecalho}</div>
          {setas}
        </div>
      ) : (
        <div className={`hidden justify-end ${inicio && fim ? "" : "md:mb-5 md:flex"} ${setasNoLg}`}>{setas}</div>
      )}
      {filtros}
      <div role="region" aria-label={rotulo}>
        {/* A lista é o que rola: com foco, as setas do teclado rolam o trilho. */}
        <Lista ref={ref} onScroll={medir} tabIndex={0} className={`trilho focus-visible:outline-offset-[-2px] ${className}`}>
          {children}
        </Lista>
      </div>
    </div>
  );
}
