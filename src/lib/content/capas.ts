import type { Collection } from "@/lib/types";

/**
 * Foto vertical de cada coleção (capa do celular, cartões 4:5 da home, de /colecoes e
 * do "Veja também"), quando a do catálogo não serve. Fica aqui para o catalogo.json
 * não mudar.
 *
 * Entrelaços: a do catálogo (entrelacos-1) mostra mãe e filha de costas; sob o degradê
 * do celular virava uma mancha marrom. A 3 tem os dois rostos no terço de cima, longe
 * do texto da capa.
 */
const CAPA_VERTICAL: Record<string, string> = {
  entrelacos: "/images/colecoes/entrelacos-3.jpg",
};

export function capaVertical(c: Pick<Collection, "slug" | "hero_mobile_url" | "hero_image_url">): string | null {
  if (Object.hasOwn(CAPA_VERTICAL, c.slug)) return CAPA_VERTICAL[c.slug];
  return c.hero_mobile_url || c.hero_image_url || null;
}
