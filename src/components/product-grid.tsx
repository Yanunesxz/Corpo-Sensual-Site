"use client";

import { useState, useSyncExternalStore } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./product-card";

const PAGE = 12;
const EVENT = "cs:categoria";

// A categoria ativa vive na URL (?categoria=...). Ler pela store externa mantém
// o HTML pré-renderizado com todas as peças (servidor devolve "") e sincroniza
// no navegador sem efeitos com setState.
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
 * Grade de peças com filtro por categoria e "Ver mais" no celular/tablet,
 * tudo no navegador. No desktop todas as peças aparecem de uma vez.
 */
export function ProductGrid({ products, categories, title = "Peças" }: Props) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [limits, setLimits] = useState<Record<string, number>>({});
  const limit = limits[active] ?? PAGE;

  const list = active ? products.filter((p) => p.category?.slug === active) : products;
  const activeName = categories.find((c) => c.slug === active)?.name;
  const hasMore = list.length > limit;

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
        <h2 className="h-display text-3xl md:text-5xl">{activeName ?? title}</h2>
        <p className="text-sm text-ink-soft">
          {list.length} {list.length === 1 ? "peça" : "peças"}
        </p>
      </div>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
        Venda no atacado, por grade, para lojas com CNPJ. Anote a referência de cada peça e informe ao representante.
      </p>

      {categories.length > 0 && (
        <div
          className="sticky top-16 z-20 -mx-5 mt-5 flex gap-2 overflow-x-auto bg-paper px-5 py-3 [scrollbar-width:none] md:static md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:py-0"
          role="group"
          aria-label="Filtrar por categoria"
        >
          <button type="button" className={`chip shrink-0 whitespace-nowrap ${!active ? "chip-active" : ""}`} aria-pressed={!active} onClick={() => select("")}>
            Todas
          </button>
          {categories.map((c) => (
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

      {list.length === 0 ? (
        <p className="mt-8 border-y border-line py-10 text-center text-sm text-ink-soft">Nenhuma peça publicada nesta categoria ainda.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-5">
          {list.map((p, i) => (
            <div key={p.id} className={i >= limit ? "hidden lg:block" : undefined}>
              <ProductCard product={p} priority={i < 2} />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 flex flex-col items-center gap-3 lg:hidden">
          <button type="button" className="btn btn-outline w-full sm:w-auto" onClick={() => setLimits({ ...limits, [active]: limit + PAGE })}>
            Ver mais peças
          </button>
          <p className="text-xs text-ink-soft">
            Mostrando {Math.min(limit, list.length)} de {list.length}
          </p>
        </div>
      )}
    </div>
  );
}
