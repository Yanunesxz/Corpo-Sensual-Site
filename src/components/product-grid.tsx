"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./product-card";

const PAGE = 12;

type Props = {
  products: Product[];
  categories: Category[];
  title?: string;
};

/**
 * Grade de peças com filtro por categoria e "Ver mais", tudo no navegador:
 * nada de recarregar a página a cada toque. A categoria fica na URL
 * (?categoria=...) para os links da home continuarem funcionando.
 */
export function ProductGrid({ products, categories, title = "Peças" }: Props) {
  const params = useSearchParams();
  const active = params.get("categoria") ?? "";
  const [limits, setLimits] = useState<Record<string, number>>({});
  const limit = limits[active] ?? PAGE;

  const list = active ? products.filter((p) => p.category?.slug === active) : products;
  const shown = list.slice(0, limit);
  const activeName = categories.find((c) => c.slug === active)?.name;

  function select(slug: string) {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("categoria", slug);
    else url.searchParams.delete("categoria");
    url.hash = "pecas";
    window.history.replaceState(null, "", url.toString());
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="h-display text-3xl md:text-5xl">{activeName ?? title}</h2>
        <p className="text-sm text-ink-soft">
          {list.length} {list.length === 1 ? "peça" : "peças"}
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          <button type="button" className={`chip ${!active ? "chip-active" : ""}`} aria-pressed={!active} onClick={() => select("")}>
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip ${active === c.slug ? "chip-active" : ""}`}
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
          {shown.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      )}

      {list.length > shown.length && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <button type="button" className="btn btn-outline w-full sm:w-auto" onClick={() => setLimits({ ...limits, [active]: limit + PAGE })}>
            Ver mais peças
          </button>
          <p className="text-xs text-ink-soft">
            Mostrando {shown.length} de {list.length}
          </p>
        </div>
      )}
    </div>
  );
}
