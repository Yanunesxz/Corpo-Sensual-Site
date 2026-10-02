import type { Product } from "./types";

/**
 * Quantas peças de cada grupo a vitrine mostra (pedido do dono): seis masculinas,
 * seis femininas, três infantis de menino e três de menina. A linha infantil entra
 * dividida em menino e menina para as duas aparecerem, em vez de uma sumir por ter
 * referência mais bem ranqueada que a outra.
 */
export const COTAS = [
  { categoria: "masculino", genero: null, quantas: 6 },
  { categoria: "feminino", genero: null, quantas: 6 },
  { categoria: "infantil", genero: "menino", quantas: 3 },
  { categoria: "infantil", genero: "menina", quantas: 3 },
] as const;

export type Cota = (typeof COTAS)[number];

/** As peças de uma cota, as mais vendidas primeiro (a lista já vem por sort_order). */
export function daCota(products: Product[], cota: Cota): Product[] {
  return products
    .filter((p) => p.category?.slug === cota.categoria && (!cota.genero || p.genero === cota.genero))
    .slice(0, cota.quantas);
}

/** Intercala as filas para a grade não sair em blocos de uma linha só. */
export function intercalar(filas: Product[][]): Product[] {
  const maior = Math.max(0, ...filas.map((f) => f.length));
  const saida: Product[] = [];
  for (let i = 0; i < maior; i++) {
    for (const fila of filas) if (fila[i]) saida.push(fila[i]);
  }
  return saida;
}

/**
 * Só as peças que podem aparecer na vitrine, com ou sem filtro (no máximo 18).
 * A home e a landing mandam ao navegador esta lista, e não o catálogo inteiro:
 * o resultado na tela é o mesmo e a página fica bem mais leve.
 */
export function pecasDaVitrine(products: Product[]): Product[] {
  return intercalar(COTAS.map((c) => daCota(products, c)));
}
