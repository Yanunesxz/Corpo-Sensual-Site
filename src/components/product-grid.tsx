"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { TOTAL_REFERENCIAS } from "@/lib/site";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./product-card";

/**
 * Quantas peças de cada grupo a grade mostra. A linha infantil entra dividida
 * em menino e menina para as duas aparecerem, em vez de uma sumir por ter
 * referência mais bem ranqueada que a outra.
 */
const COTAS = [
  { categoria: "masculino", genero: null, quantas: 6 },
  { categoria: "feminino", genero: null, quantas: 6 },
  { categoria: "infantil", genero: "menino", quantas: 3 },
  { categoria: "infantil", genero: "menina", quantas: 3 },
] as const;
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
 * Mostra uma cota fixa de cada grupo, as mais vendidas primeiro: seis masculinas,
 * seis femininas, três infantis de menino e três de menina. Com filtro, mostra as
 * cotas daquela linha. Assim a vitrine tem sempre a mesma cara, e nenhuma linha
 * some só porque outra tem referência melhor ranqueada.
 * O restante do mix fica no catálogo digital, que o lojista recebe após o cadastro.
 */
/** As peças de uma cota, as mais vendidas primeiro (a lista já vem por sort_order). */
function daCota(products: Product[], cota: (typeof COTAS)[number]): Product[] {
  return products
    .filter((p) => p.category?.slug === cota.categoria && (!cota.genero || p.genero === cota.genero))
    .slice(0, cota.quantas);
}

/** Intercala as filas para a grade não sair em blocos de uma linha só. */
function intercalar(filas: Product[][]): Product[] {
  const maior = Math.max(0, ...filas.map((f) => f.length));
  const saida: Product[] = [];
  for (let i = 0; i < maior; i++) {
    for (const fila of filas) if (fila[i]) saida.push(fila[i]);
  }
  return saida;
}

export function ProductGrid({ products, categories, title = "Peças" }: Props) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const activeName = categories.find((c) => c.slug === active)?.name;
  // Só oferece as categorias que existem nesta coleção.
  const disponiveis = categories.filter((c) => products.some((p) => p.category?.slug === c.slug));
  // Com filtro, só as cotas daquela linha; sem filtro, todas. Em qualquer caso as
  // peças vêm das mais vendidas para as menos, que é a ordem em que a lista chega.
  const cotas = COTAS.filter((c) => !active || c.categoria === active);
  const shown = intercalar(cotas.map((c) => daCota(products, c)));

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
        Uma amostra das coleções. São {TOTAL_REFERENCIAS} referências no ano, e o{" "}
        <Link href="/catalogo" className="underline">
          catálogo digital
        </Link>{" "}
        traz todas.
      </p>

      {disponiveis.length > 1 && (
        <div
          className="sticky top-16 z-20 -mx-5 mt-6 flex flex-wrap gap-2 bg-paper px-5 py-3 md:static md:mx-0 md:px-0 md:py-0"
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
        <p className="text-base leading-[1.6] text-body">No catálogo você vê grade de tamanhos e preços antes de montar o pedido.</p>
        <Link href="/catalogo" className="btn btn-dark w-full shrink-0 whitespace-nowrap sm:w-auto">
          Quero receber o catálogo
        </Link>
      </div>
    </div>
  );
}
