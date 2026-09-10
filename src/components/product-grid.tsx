"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./product-card";

/** Quantas peças a página mostra. O resto vai no catálogo digital. */
const MOSTRAR = 10;
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
 * Grade de peças da coleção: mostra no máximo 10 referências, com filtro por
 * categoria no navegador. O restante do mix fica no catálogo digital, que o
 * lojista recebe depois do cadastro.
 */
export function ProductGrid({ products, categories, title = "Peças" }: Props) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const list = active ? products.filter((p) => p.category?.slug === active) : products;
  const shown = list.slice(0, MOSTRAR);
  const activeName = categories.find((c) => c.slug === active)?.name;
  // Só oferece as categorias que existem nesta coleção.
  const disponiveis = categories.filter((c) => products.some((p) => p.category?.slug === c.slug));

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
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="h-display text-3xl md:text-[2.5rem]">{activeName ?? title}</h2>
        <p className="text-sm text-body">
          {shown.length < list.length ? `${shown.length} de ${list.length} peças` : `${list.length} ${list.length === 1 ? "peça" : "peças"}`}
        </p>
      </div>
      <p className="mt-4 max-w-xl text-[1.125rem] leading-[1.6] text-body">
        Uma amostra da coleção. Venda no atacado, por grade e com pedido mínimo.
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

      {/* O catálogo completo é o próximo passo, não uma paginação. */}
      <div className="mt-12 rounded-media bg-sky p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 md:p-8">
        <div className="max-w-md">
          <p className="h-display text-2xl md:text-3xl">Veja a coleção completa</p>
          <p className="mt-3 text-base leading-[1.6] text-body">
            {list.length > MOSTRAR
              ? "Estas são algumas peças. O catálogo digital traz o mix completo, com grade de tamanhos, cores e a tabela de preços de atacado."
              : "O catálogo digital traz o mix completo, com grade de tamanhos, cores e a tabela de preços de atacado."}
          </p>
        </div>
        <Link href="/catalogo" className="btn btn-dark mt-5 w-full shrink-0 whitespace-nowrap sm:mt-0 sm:w-auto">
          Quero receber o catálogo
        </Link>
      </div>
    </div>
  );
}
