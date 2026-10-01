"use client";

import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
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

  const chips =
    disponiveis.length > 1 ? (
      <div
        role="group"
        aria-label="Filtrar por linha"
        className={
          vitrine
            ? "-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:mt-8 md:px-0"
            : // Presos no topo (abaixo da barra do cabeçalho) enquanto a grade passa: ficam
              // direto no contêiner da grade, sem invólucro, senão o sticky não tem onde andar.
              "sticky top-16 z-20 -mx-5 mt-3 flex gap-2 overflow-x-auto bg-paper px-5 py-3 [scrollbar-width:none] md:-mx-8 md:px-8 lg:static lg:mx-0 lg:mt-8 lg:flex-wrap lg:p-0"
        }
      >
        <button type="button" className={`chip shrink-0 whitespace-nowrap ${!active ? "chip-active" : ""}`} aria-pressed={!active} onClick={() => select("")}>
          Todas
        </button>
        {disponiveis.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`chip shrink-0 whitespace-nowrap ${active === c.slug ? "chip-active" : ""}`}
            aria-pressed={active === c.slug}
            onClick={() => select(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>
    ) : null;

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
      </div>

      {chips}

      {shown.length === 0 ? (
        <p className="mt-8 bg-sky-soft py-10 text-center text-muted">Nenhuma peça publicada nesta linha ainda.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:mt-10 lg:grid-cols-6">
          {shown.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}

      {/* Saída depois das peças: o catálogo é o próximo passo, não uma paginação. */}
      <div className="mt-12 flex flex-col items-start gap-5 bg-sky p-5 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <p className="max-w-xl text-[15px] leading-[1.6] text-ink md:text-base">
          No catálogo você vê as {TOTAL_REFERENCIAS} referências, a grade de tamanhos e os preços de atacado.
        </p>
        <Link href="/catalogo" className="btn btn-primary w-full shrink-0 whitespace-nowrap sm:w-auto">
          Quero receber o catálogo
          <ArrowRight width={18} height={18} className="seta" />
        </Link>
      </div>
    </div>
  );
}
