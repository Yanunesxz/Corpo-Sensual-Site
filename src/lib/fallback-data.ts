import catalogo from "@/data/catalogo.json";
import type { Category, Collection, Product } from "./types";

/**
 * Dados usados quando o Supabase ainda não está configurado (ou quando uma
 * consulta falha). A fonte é src/data/catalogo.json, o mesmo arquivo que gera
 * o supabase/seed.sql (`npm run seed`). Edite o JSON, não este arquivo.
 */

type CategoriaJson = { slug: string; nome: string; imagem: string };
type ColecaoJson = {
  slug: string;
  nome: string;
  temporada: "verao" | "inverno" | "atemporal";
  ano: number | null;
  chamada: string | null;
  descricao: string | null;
  capa: string | null;
  capaCelular?: string | null;
  galeria: string[];
};
type ProdutoJson = { ref: string; rank: number; nome: string; descricao: string; categoria: string; colecao: string; genero?: "menino" | "menina" };

const categorias = catalogo.categorias as CategoriaJson[];
const colecoes = catalogo.colecoes as ColecaoJson[];
const produtos = (catalogo.produtos as ProdutoJson[]).slice().sort((a, b) => a.rank - b.rank);

/** "Pijama de alça suede liso" -> "pijama-de-alca-suede-liso" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const fallbackCategories: Category[] = categorias.map((c, i) => ({
  id: `cat-${c.slug}`,
  slug: c.slug,
  name: c.nome,
  description: null,
  image_url: c.imagem,
  sort_order: i + 1,
  active: true,
}));

export const fallbackCollections: Collection[] = colecoes.map((c, i) => ({
  id: `col-${c.slug}`,
  slug: c.slug,
  name: c.nome,
  season: c.temporada,
  year: c.ano,
  headline: c.chamada,
  description: c.descricao,
  hero_image_url: c.capa,
  hero_mobile_url: c.capaCelular ?? null,
  gallery_urls: c.galeria,
  active: true,
  sort_order: i + 1,
}));

const categoryName = Object.fromEntries(categorias.map((c) => [c.slug, c.nome]));

export const fallbackProducts: Product[] = produtos.map((p) => ({
  id: `p-${p.ref}`,
  ref: p.ref,
  slug: slugify(p.nome),
  name: p.nome,
  description: p.descricao,
  category_id: `cat-${p.categoria}`,
  collection_id: `col-${p.colecao}`,
  is_new: false,
  is_featured: p.rank <= 10,
  active: true,
  sort_order: p.rank,
  images: [
    { id: `i-${p.ref}`, product_id: `p-${p.ref}`, url: `/images/produtos/${p.ref}.jpg`, alt: `${p.nome}, ref. ${p.ref}`, sort_order: 1 },
  ],
  category: { slug: p.categoria, name: categoryName[p.categoria] ?? p.categoria },
  genero: p.genero ?? null,
}));
