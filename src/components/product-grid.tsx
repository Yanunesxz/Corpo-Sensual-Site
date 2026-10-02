"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { TOTAL_REFERENCIAS } from "@/lib/site";
import type { Category, Product } from "@/lib/types";
import { COTAS, daCota, intercalar } from "@/lib/vitrine";
import { ProductCard } from "./product-card";
import { Trilho } from "./trilho";
import { ArrowRight } from "./icons";

const EVENT = "cs:categoria";

// A categoria ativa vive na URL (?categoria=...). Ler pela store externa mantém
// o HTML pré-renderizado (servidor devolve "") e sincroniza no navegador.
function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
}
const getSnapshot = () => new URLSearchParams(window.location.search).get("categoria") ?? "";
const getServerSnapshot = () => "";

type Props = {
  products: Product[];
  categories: Category[];
  title?: string;
  /**
   * vitrine: trilho em todas as larguras (home e landing), terminando num cartão
   * "210" que leva ao catálogo. grade: a página da coleção, em 2, 3 e 6 colunas.
   */
  variant?: "grade" | "vitrine";
  /** Rótulo acima do título, com o fio do fólio. */
  eyebrow?: string;
  /** Texto abaixo do título. Na grade, o padrão explica que é uma amostra. */
  description?: ReactNode;
  /** Cartão final da vitrine. Padrão: "/catalogo" e "Receber o catálogo". Na landing: "#formulario". */
  fim?: { href: string; rotulo: string };
};

const SIZES_VITRINE = "(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw";

/** Grade do celular: quantas peças aparecem antes do "Ver mais peças" (quatro linhas de duas). */
const NO_CELULAR = 8;

/*
 * Cartão "210" no fim da grade: ocupa as colunas que sobram na última linha. Classes
 * escritas por extenso para o Tailwind encontrar (2 colunas no celular, 3 no tablet, 6 no desktop).
 */
const SPAN_BASE: Record<number, string> = { 1: "col-span-1", 2: "col-span-2" };
const SPAN_MD: Record<number, string> = { 1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3" };
const SPAN_LG: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
};
const sobra = (n: number, colunas: number) => colunas - (n % colunas);

/**
 * Peças mais vendidas, com filtro por linha no navegador.
 *
 * Mostra uma cota fixa de cada grupo, as mais vendidas primeiro: seis masculinas,
 * seis femininas, três infantis de menino e três de menina (lib/vitrine.ts). Com
 * filtro, só as cotas daquela linha. O restante do mix fica no catálogo digital,
 * que a lojista recebe depois do cadastro.
 */
export function ProductGrid({ products, categories, title = "Peças", variant = "grade", eyebrow, description, fim }: Props) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Grade do celular: começa com oito peças; "Ver mais peças" mostra o resto.
  const [todas, setTodas] = useState(false);
  const lista = useRef<HTMLUListElement>(null);

  const activeName = categories.find((c) => c.slug === active)?.name;
  // Só oferece as categorias que existem nesta lista.
  const disponiveis = categories.filter((c) => products.some((p) => p.category?.slug === c.slug));
  const cotas = COTAS.filter((c) => !active || c.categoria === active);
  const shown = intercalar(cotas.map((c) => daCota(products, c)));
  const vitrine = variant === "vitrine";

  function select(slug: string) {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("categoria", slug);
    else url.searchParams.delete("categoria");
    url.hash = "pecas";
    window.history.replaceState(null, "", url.toString());
    window.dispatchEvent(new Event(EVENT));
  }

  // Abaixo de 640 px os chips encolhem (13 px, respiro menor) para os quatro caberem na
  // largura do celular; se ainda sobrar, o fim esmaece, para o corte ler como "role para o lado".
  const chip = "chip shrink-0 whitespace-nowrap max-sm:px-3 max-sm:text-[13px]";
  const chips =
    disponiveis.length > 1 ? (
      <div
        role="group"
        aria-label="Filtrar por linha"
        className={
          vitrine
            ? "-mx-5 mt-6 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] max-[379px]:[mask-image:linear-gradient(to_right,#000_86%,transparent)] sm:gap-2 md:mx-0 md:mt-8 md:px-0"
            : // Presos no topo (abaixo da barra do cabeçalho) enquanto a grade passa: ficam
              // direto no contêiner da grade, sem invólucro, senão o sticky não tem onde andar.
              "sticky top-16 z-20 -mx-5 mt-3 flex gap-1.5 overflow-x-auto bg-paper px-5 py-3 [scrollbar-width:none] max-[379px]:[mask-image:linear-gradient(to_right,#000_86%,transparent)] sm:gap-2 md:-mx-8 md:px-8 lg:static lg:mx-0 lg:mt-8 lg:flex-wrap lg:p-0"
        }
      >
        <button type="button" className={`${chip} ${!active ? "chip-active" : ""}`} aria-pressed={!active} onClick={() => select("")}>
          Todas
        </button>
        {disponiveis.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`${chip} ${active === c.slug ? "chip-active" : ""}`}
            aria-pressed={active === c.slug}
            onClick={() => select(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>
    ) : null;

  // Trocar o filtro muda a lista sem recarregar: o leitor de tela ouve quantas peças ficaram.
  const aviso = (
    <p className="sr-only" aria-live="polite">
      {shown.length} {shown.length === 1 ? "peça" : "peças"}
      {activeName ? ` da linha ${activeName}` : ""}
    </p>
  );

  if (vitrine) {
    const destino = fim ?? { href: "/catalogo", rotulo: "Receber o catálogo" };
    const conteudoFim = (
      <>
        <span className="eyebrow">Catálogo completo</span>
        <span>
          <span className="t-numeral block">{TOTAL_REFERENCIAS}</span>
          <span className="mt-3 block max-w-[16rem] text-[15px] leading-snug text-noite-texto">
            referências no catálogo, com grade de tamanhos e tabela de preços
          </span>
        </span>
        <span className="inline-flex items-center gap-2 font-[family-name:var(--font-button)] text-[15px] text-white">
          {destino.rotulo}
          <ArrowRight width={18} height={18} className="transition-transform duration-300 group-hover:translate-x-[3px]" />
        </span>
      </>
    );
    const classeFim = "on-dark group flex aspect-[4/5] flex-col justify-between bg-noite p-5 transition-colors hover:bg-noite-hover md:p-6";

    return (
      <Trilho
        rotulo={activeName ? `Peças da linha ${activeName}` : "Peças mais pedidas"}
        reinicio={active}
        cabecalho={
          <div className="max-w-2xl" data-reveal>
            {eyebrow && <p className="eyebrow eyebrow-fio">{eyebrow}</p>}
            <h2 className={`t-titulo ${eyebrow ? "mt-3" : ""}`}>{activeName ? `${activeName}: as mais pedidas` : title}</h2>
            {description && <p className="lead mt-4">{description}</p>}
            {aviso}
          </div>
        }
        filtros={chips}
        className="mt-6 md:mt-8"
      >
        {shown.length === 0 ? (
          <li className="col-span-full flex aspect-[4/5] items-center justify-center bg-paper p-6 text-center text-[15px] text-muted">
            Nenhuma peça publicada nesta linha ainda.
          </li>
        ) : (
          shown.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} sizes={SIZES_VITRINE} />
            </li>
          ))
        )}
        <li>
          {destino.href.startsWith("#") ? (
            <a href={destino.href} data-ga-local="vitrine" className={classeFim}>
              {conteudoFim}
            </a>
          ) : (
            <Link href={destino.href} data-ga-local="vitrine" className={classeFim}>
              {conteudoFim}
            </Link>
          )}
        </li>
      </Trilho>
    );
  }

  // Grade: o cartão "210" fecha a última linha, ocupando as colunas que sobram (a linha
  // inteira quando ela já está cheia). Sozinho na linha, vira faixa, com o texto ao lado.
  const n = shown.length;
  const recolhida = !todas && n > NO_CELULAR;
  const naTelaDoCelular = recolhida ? NO_CELULAR : n;
  const spanBase = sobra(naTelaDoCelular, 2);
  const spanMd = sobra(n, 3);
  const spanLg = sobra(n, 6);
  const faixaBase = spanBase === 2;
  const faixaMd = spanMd >= 2;
  const faixaLg = spanLg >= 3;
  const desenhoFim = [
    faixaBase ? "flex-row flex-wrap items-end justify-between gap-x-8 gap-y-6" : "flex-col justify-between gap-8",
    faixaMd ? "md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-x-8" : "md:flex-col md:justify-between md:gap-8",
    faixaLg ? "lg:flex-row lg:flex-nowrap lg:items-end lg:justify-between lg:gap-x-10" : "lg:flex-col lg:justify-between lg:gap-8",
  ].join(" ");

  function verMais() {
    setTodas(true);
    // O botão some: o foco vai para a lista, que o leitor de tela anuncia com as peças novas.
    requestAnimationFrame(() => lista.current?.focus({ preventScroll: true }));
  }

  return (
    <div>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow eyebrow-fio">{eyebrow}</p>}
        <h2 className={`t-titulo ${eyebrow ? "mt-3" : ""}`}>{activeName ?? title}</h2>
        <p className="lead mt-4">
          {description ?? (
            <>
              Uma amostra das coleções. São {TOTAL_REFERENCIAS} referências no ano, e o{" "}
              <Link href="/catalogo" className="link">
                catálogo digital
              </Link>{" "}
              traz todas.
            </>
          )}
        </p>
        {aviso}
      </div>

      {chips}

      {n === 0 ? (
        <p className="mt-8 bg-sky-soft py-10 text-center text-muted">Nenhuma peça publicada nesta linha ainda.</p>
      ) : (
        <ul
          ref={lista}
          tabIndex={-1}
          aria-label={activeName ? `Peças da linha ${activeName}` : "Peças da coleção"}
          className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 outline-none md:grid-cols-3 md:gap-x-5 md:gap-y-8 lg:mt-10 lg:grid-cols-6"
        >
          {shown.map((p, i) => (
            // As oito primeiras já trazem as três linhas (a ordem é intercalada).
            <li key={p.id} className={recolhida && i >= NO_CELULAR ? "max-md:hidden" : undefined}>
              <ProductCard product={p} />
            </li>
          ))}
          {recolhida && (
            <li className="col-span-2 md:hidden">
              <button type="button" className="btn btn-outline w-full" onClick={verMais}>
                Ver mais peças
              </button>
            </li>
          )}
          <li className={`${SPAN_BASE[spanBase]} ${SPAN_MD[spanMd]} ${SPAN_LG[spanLg]}`}>
            <Link
              href="/catalogo"
              className={`on-dark group flex h-full bg-noite p-5 transition-colors hover:bg-noite-hover md:p-6 lg:p-8 ${desenhoFim}`}
            >
              <span className="flex min-w-0 flex-col gap-4">
                <span className="eyebrow">Catálogo completo</span>
                <span>
                  <span className="t-numeral block">{TOTAL_REFERENCIAS}</span>
                  <span className="mt-3 block max-w-[17rem] text-[15px] leading-snug text-noite-texto">
                    referências no catálogo, com grade de tamanhos e tabela de preços
                  </span>
                </span>
              </span>
              <span className="inline-flex items-center gap-2 font-[family-name:var(--font-button)] text-[15px] text-white">
                Quero receber o catálogo
                <ArrowRight width={18} height={18} className="transition-transform duration-300 group-hover:translate-x-[3px]" />
              </span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
