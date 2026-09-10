"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { TOTAL_REFERENCIAS } from "@/lib/site";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./product-card";

/** Teto de peças por linha. O resto do mix vai no catálogo digital. */
const POR_LINHA = 6;
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
};

/**
 * Grade de peças da coleção, com filtro por categoria no navegador.
 *
 * Sem filtro mostra o mesmo tanto de cada linha, intercaladas; com filtro mostra
 * esse mesmo tanto da linha escolhida. A grade fica do mesmo tamanho em qualquer
 * filtro, e nenhuma linha parece menor só porque tem menos peça publicada aqui.
 * O restante do mix fica no catálogo digital, que o lojista recebe após o cadastro.
 */
/** Pega as `porLinha` primeiras de cada categoria e intercala, para a grade não sair em blocos. */
function equilibrar(products: Product[], categories: Category[], porLinha: number): Product[] {
  const filas = categories
    .map((c) => products.filter((p) => p.category?.slug === c.slug).slice(0, porLinha))
    .filter((f) => f.length > 0);
  const saida: Product[] = [];
  for (let i = 0; i < porLinha; i++) {
    for (const fila of filas) if (fila[i]) saida.push(fila[i]);
  }
  return saida;
}

export function ProductGrid({ products, categories, title = "Peças" }: Props) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const activeName = categories.find((c) => c.slug === active)?.name;
  // Só oferece as categorias que existem nesta coleção.
  const disponiveis = categories.filter((c) => products.some((p) => p.category?.slug === c.slug));
  // Quantas cabem em TODAS as linhas desta coleção. Assim a grade tem sempre o
  // mesmo tamanho, com ou sem filtro, e nenhuma linha aparece menor que as outras.
  const porLinha = Math.min(
    POR_LINHA,
    ...disponiveis.map((c) => products.filter((p) => p.category?.slug === c.slug).length),
  );
  const shown = active
    ? products.filter((p) => p.category?.slug === active).slice(0, porLinha)
    : equilibrar(products, disponiveis, porLinha);

  function select(slug: string) {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("categoria", slug);
    else url.searchParams.delete("categoria");
    url.hash = "pecas";
    window.history.replaceState(null, "", url.toString());
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <div>
      <h2 className="h-display text-3xl md:text-[2.5rem]">{activeName ?? title}</h2>
      <p className="mt-4 max-w-xl text-[1.125rem] leading-[1.6] text-body">
        Uma amostra da coleção. As duas coleções do ano somam {TOTAL_REFERENCIAS} referências, todas no{" "}
        <Link href="/catalogo" className="underline">
          catálogo digital
        </Link>
        .
      </p>

      {disponiveis.length > 1 && (
        <div
          className="sticky top-16 z-20 -mx-5 mt-6 flex gap-2 overflow-x-auto bg-paper px-5 py-3 [scrollbar-width:none] md:static md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:py-0"
          role="group"
          aria-label="Filtrar por categoria"
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
      )}

      {shown.length === 0 ? (
        <p className="mt-8 rounded-media border border-line bg-sky-soft py-10 text-center text-base text-body">
          Nenhuma peça publicada nesta categoria ainda.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-5">
          {shown.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      )}

      {/* Saída depois das peças: o catálogo é o próximo passo, não uma paginação. */}
      <div className="mt-10 flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base leading-[1.6] text-body">Veja mais referências no catálogo, com grade de tamanhos e tabela de preços.</p>
        <Link href="/catalogo" className="btn btn-dark w-full shrink-0 whitespace-nowrap sm:w-auto">
          Quero receber o catálogo
        </Link>
      </div>
    </div>
  );
}
