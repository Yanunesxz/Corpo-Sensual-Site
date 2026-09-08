import type { Category, Collection, Product } from "./types";

/**
 * Dados de exemplo usados quando o Supabase ainda não está configurado
 * (ou quando uma consulta falha). Refletem o conteúdo do site anterior.
 * Em produção, o conteúdo real vem das tabelas do banco (ver supabase/seed.sql).
 */

export const fallbackCategories: Category[] = [
  { id: "cat-gestante", slug: "gestante", name: "Gestante", description: null, image_url: "/images/categoria-1.jpg", sort_order: 1, active: true },
  { id: "cat-masculino", slug: "masculino", name: "Masculino", description: null, image_url: "/images/categoria-2.jpg", sort_order: 2, active: true },
  { id: "cat-juvenil", slug: "juvenil", name: "Juvenil", description: null, image_url: "/images/novidade-1.jpg", sort_order: 3, active: true },
  { id: "cat-robes", slug: "robes", name: "Robes", description: null, image_url: "/images/destaque-2.jpg", sort_order: 4, active: true },
];

export const fallbackCollections: Collection[] = [
  {
    id: "col-verao-2024",
    slug: "verao-2024",
    name: "Coleção Verão 2024",
    season: "verao",
    year: 2024,
    headline: "Novo design e modelagem que irá te surpreender!",
    description:
      "A Nova Coleção Verão 2024 chegou com tudo! Nossas peças foram remodeladas para abraçar melhor o corpo, com um caimento perfeito. Tecidos mais leves e respiráveis para essa nova temporada de verão, com design inspirado nas maiores tendências do Brasil.",
    hero_image_url: "/images/hero-verao.jpg",
    active: true,
    sort_order: 1,
  },
];

const col = fallbackCollections[0].id;

export const fallbackProducts: Product[] = [
  {
    id: "p-1",
    ref: "CS-2401",
    slug: "pijama-curto-renda-azul",
    name: "Pijama curto com renda",
    description: "Modelagem alinhada, tecido leve e respirável.",
    category_id: "cat-juvenil",
    collection_id: col,
    is_new: true,
    is_featured: false,
    active: true,
    sort_order: 1,
    images: [{ id: "i-1", product_id: "p-1", url: "/images/novidade-1.jpg", alt: "Pijama curto com renda", sort_order: 1 }],
    category: { slug: "juvenil", name: "Juvenil" },
  },
  {
    id: "p-2",
    ref: "CS-2402",
    slug: "camisola-alcinha",
    name: "Camisola de alcinha",
    description: "Tecnologia anti-pilling e caimento perfeito.",
    category_id: "cat-juvenil",
    collection_id: col,
    is_new: true,
    is_featured: false,
    active: true,
    sort_order: 2,
    images: [{ id: "i-2", product_id: "p-2", url: "/images/novidade-2.jpg", alt: "Camisola de alcinha", sort_order: 1 }],
    category: { slug: "juvenil", name: "Juvenil" },
  },
  {
    id: "p-3",
    ref: "CS-2403",
    slug: "pijama-longo-estampado",
    name: "Pijama longo estampado",
    description: "Um dos mais vendidos, agora com nova modelagem.",
    category_id: "cat-gestante",
    collection_id: col,
    is_new: false,
    is_featured: true,
    active: true,
    sort_order: 3,
    images: [{ id: "i-3", product_id: "p-3", url: "/images/destaque-1.jpg", alt: "Pijama longo estampado", sort_order: 1 }],
    category: { slug: "gestante", name: "Gestante" },
  },
  {
    id: "p-4",
    ref: "CS-2404",
    slug: "robe-cetim",
    name: "Robe em cetim",
    description: "Leve e flexível para as noites de verão.",
    category_id: "cat-robes",
    collection_id: col,
    is_new: false,
    is_featured: true,
    active: true,
    sort_order: 4,
    images: [{ id: "i-4", product_id: "p-4", url: "/images/destaque-2.jpg", alt: "Robe em cetim", sort_order: 1 }],
    category: { slug: "robes", name: "Robes" },
  },
  {
    id: "p-5",
    ref: "CS-2405",
    slug: "conjunto-masculino",
    name: "Conjunto masculino",
    description: "Linha completa para a temporada de verão.",
    category_id: "cat-masculino",
    collection_id: col,
    is_new: false,
    is_featured: false,
    active: true,
    sort_order: 5,
    images: [{ id: "i-5", product_id: "p-5", url: "/images/categoria-2.jpg", alt: "Conjunto masculino", sort_order: 1 }],
    category: { slug: "masculino", name: "Masculino" },
  },
  {
    id: "p-6",
    ref: "CS-2406",
    slug: "camisola-gestante",
    name: "Camisola gestante",
    description: "Conforto para todas as fases.",
    category_id: "cat-gestante",
    collection_id: col,
    is_new: false,
    is_featured: false,
    active: true,
    sort_order: 6,
    images: [{ id: "i-6", product_id: "p-6", url: "/images/categoria-1.jpg", alt: "Camisola gestante", sort_order: 1 }],
    category: { slug: "gestante", name: "Gestante" },
  },
];
