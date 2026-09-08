import type { Category, Collection, Product } from "./types";

/**
 * Dados de exemplo usados quando o Supabase ainda não está configurado
 * (ou quando uma consulta falha). Em produção, o conteúdo real vem das
 * tabelas do banco (ver supabase/seed.sql).
 *
 * As coleções e fotos de campanha são reais (Frescor e Entrelaços, 2026).
 * Os PRODUTOS abaixo são provisórios: serão trocados pelas 10 referências
 * mais vendidas, com as fotos do catálogo.
 */

export const fallbackCategories: Category[] = [
  { id: "cat-feminino", slug: "feminino", name: "Feminino", description: null, image_url: "/images/colecoes/frescor-4.jpg", sort_order: 1, active: true },
  { id: "cat-masculino", slug: "masculino", name: "Masculino", description: null, image_url: "/images/categoria-2.jpg", sort_order: 2, active: true },
  { id: "cat-juvenil", slug: "juvenil", name: "Juvenil", description: null, image_url: "/images/colecoes/entrelacos-3.jpg", sort_order: 3, active: true },
  { id: "cat-gestante", slug: "gestante", name: "Gestante", description: null, image_url: "/images/categoria-1.jpg", sort_order: 4, active: true },
];

export const fallbackCollections: Collection[] = [
  {
    id: "col-frescor",
    slug: "frescor",
    name: "Coleção Frescor",
    season: "verao",
    year: 2026,
    headline: "Respire o agora. Viva o momento!",
    description:
      "Nesta coleção, convidamos você a desacelerar: respirar fundo, vestir o presente e se deixar levar pelo frescor. Pijamas com tecidos leves que abraçam o corpo com suavidade e conectam você ao que realmente importa: o bem-estar.",
    hero_image_url: "/images/colecoes/frescor-2.jpg",
    gallery_urls: [
      "/images/colecoes/frescor-1.jpg",
      "/images/colecoes/frescor-4.jpg",
      "/images/colecoes/frescor-3.jpg",
      "/images/colecoes/frescor-2.jpg",
    ],
    active: true,
    sort_order: 1,
  },
  {
    id: "col-entrelacos",
    slug: "entrelacos",
    name: "Coleção Entrelaços",
    season: "inverno",
    year: 2026,
    headline: "Nossa coleção nasce do encontro entre pessoas, rotinas e histórias.",
    description:
      "Uma coleção que valoriza o conforto, o ritmo do dia a dia e os momentos simples que criam laços. Tecidos aconchegantes, com estética acolhedora e modelagem pensada para abraçar o corpo.",
    hero_image_url: "/images/colecoes/entrelacos-2.jpg",
    gallery_urls: [
      "/images/colecoes/entrelacos-3.jpg",
      "/images/colecoes/entrelacos-1.jpg",
      "/images/colecoes/entrelacos-4.jpg",
      "/images/colecoes/entrelacos-2.jpg",
    ],
    active: true,
    sort_order: 2,
  },
];

const frescor = fallbackCollections[0].id;

export const fallbackProducts: Product[] = [
  {
    id: "p-1",
    ref: "CS-0001",
    slug: "pijama-curto-renda",
    name: "Pijama curto com renda",
    description: "Modelagem alinhada, tecido leve e respirável.",
    category_id: "cat-feminino",
    collection_id: frescor,
    is_new: true,
    is_featured: false,
    active: true,
    sort_order: 1,
    images: [{ id: "i-1", product_id: "p-1", url: "/images/novidade-1.jpg", alt: "Pijama curto com renda", sort_order: 1 }],
    category: { slug: "feminino", name: "Feminino" },
  },
  {
    id: "p-2",
    ref: "CS-0002",
    slug: "camisola-alcinha",
    name: "Camisola de alcinha",
    description: "Tecnologia anti-pilling e caimento perfeito.",
    category_id: "cat-feminino",
    collection_id: frescor,
    is_new: true,
    is_featured: false,
    active: true,
    sort_order: 2,
    images: [{ id: "i-2", product_id: "p-2", url: "/images/novidade-2.jpg", alt: "Camisola de alcinha", sort_order: 1 }],
    category: { slug: "feminino", name: "Feminino" },
  },
  {
    id: "p-3",
    ref: "CS-0003",
    slug: "pijama-longo-estampado",
    name: "Pijama longo estampado",
    description: "Um dos mais vendidos, agora com nova modelagem.",
    category_id: "cat-gestante",
    collection_id: frescor,
    is_new: false,
    is_featured: true,
    active: true,
    sort_order: 3,
    images: [{ id: "i-3", product_id: "p-3", url: "/images/destaque-1.jpg", alt: "Pijama longo estampado", sort_order: 1 }],
    category: { slug: "gestante", name: "Gestante" },
  },
  {
    id: "p-4",
    ref: "CS-0004",
    slug: "robe-cetim",
    name: "Robe em cetim",
    description: "Leve e flexível para as noites de verão.",
    category_id: "cat-feminino",
    collection_id: frescor,
    is_new: false,
    is_featured: true,
    active: true,
    sort_order: 4,
    images: [{ id: "i-4", product_id: "p-4", url: "/images/destaque-2.jpg", alt: "Robe em cetim", sort_order: 1 }],
    category: { slug: "feminino", name: "Feminino" },
  },
  {
    id: "p-5",
    ref: "CS-0005",
    slug: "conjunto-masculino",
    name: "Conjunto masculino",
    description: "Linha completa para a temporada de verão.",
    category_id: "cat-masculino",
    collection_id: frescor,
    is_new: false,
    is_featured: false,
    active: true,
    sort_order: 5,
    images: [{ id: "i-5", product_id: "p-5", url: "/images/categoria-2.jpg", alt: "Conjunto masculino", sort_order: 1 }],
    category: { slug: "masculino", name: "Masculino" },
  },
  {
    id: "p-6",
    ref: "CS-0006",
    slug: "camisola-gestante",
    name: "Camisola gestante",
    description: "Conforto para todas as fases.",
    category_id: "cat-gestante",
    collection_id: frescor,
    is_new: false,
    is_featured: false,
    active: true,
    sort_order: 6,
    images: [{ id: "i-6", product_id: "p-6", url: "/images/categoria-1.jpg", alt: "Camisola gestante", sort_order: 1 }],
    category: { slug: "gestante", name: "Gestante" },
  },
];
