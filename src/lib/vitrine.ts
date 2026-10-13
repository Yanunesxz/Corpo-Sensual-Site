import type { Product } from "./types";

/**
 * Quantas peças de cada grupo a vitrine mostra: poucas de propósito (pedido do dono),
 * para dar vontade de ver o resto no catálogo. Três masculinas, três femininas, uma
 * infantil de menino e uma de menina: oito ao todo. A linha infantil entra dividida em
 * menino e menina para as duas aparecerem, em vez de uma sumir por ter referência mais
 * bem ranqueada que a outra.
 */
export const COTAS = [
  { categoria: "masculino", genero: null, quantas: 3 },
  { categoria: "feminino", genero: null, quantas: 3 },
  { categoria: "infantil", genero: "menino", quantas: 1 },
  { categoria: "infantil", genero: "menina", quantas: 1 },
] as const;

/** Cartões "espiados" depois das peças: a foto embaçada das próximas, "só no catálogo". */
export const ESPIADAS = 3;

export type Cota = (typeof COTAS)[number];

/**
 * As peças de uma cota, as mais vendidas primeiro (a lista já vem por sort_order).
 * Com `depois`, as que vêm logo em seguida (as espiadas) em vez das da cota.
 */
export function daCota(products: Product[], cota: Cota, depois = 0): Product[] {
  const doGrupo = products.filter((p) => p.category?.slug === cota.categoria && (!cota.genero || p.genero === cota.genero));
  return depois ? doGrupo.slice(cota.quantas, cota.quantas + depois) : doGrupo.slice(0, cota.quantas);
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
 * Só as peças que podem aparecer na vitrine, com ou sem filtro: as das cotas e, de cada
 * grupo, as próximas que podem virar espiadas. As páginas mandam ao navegador esta
 * lista, e não o catálogo inteiro: o resultado na tela é o mesmo e a página fica leve.
 */
export function pecasDaVitrine(products: Product[]): Product[] {
  return intercalar(COTAS.map((c) => [...daCota(products, c), ...daCota(products, c, ESPIADAS)]));
}
