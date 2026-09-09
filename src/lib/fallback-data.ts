import type { Category, Collection, Product } from "./types";

/**
 * Dados usados quando o Supabase ainda não está configurado (ou quando uma
 * consulta falha). Em produção o conteúdo vem das tabelas (ver supabase/seed.sql).
 *
 * Produtos: as 10 referências mais vendidas de 01/07 a 09/09/2026, conforme o
 * relatório "Ranking de vendas Corpo Sensual" do ERP. Fotos do servidor da
 * empresa (CATALOGO\FOTOS), tratadas para 4:5 com scripts/foto-produto.mjs.
 */

export const fallbackCategories: Category[] = [
  { id: "cat-feminino", slug: "feminino", name: "Feminino", description: null, image_url: "/images/colecoes/frescor-4.jpg", sort_order: 1, active: true },
  { id: "cat-masculino", slug: "masculino", name: "Masculino", description: null, image_url: "/images/categoria-2.jpg", sort_order: 2, active: true },
  { id: "cat-infantil", slug: "infantil", name: "Infantil", description: null, image_url: "/images/colecoes/entrelacos-3.jpg", sort_order: 3, active: true },
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

type Seed = { ref: string; slug: string; name: string; description: string; category: "feminino" | "masculino" | "infantil" | "gestante" };

const categoryName = { feminino: "Feminino", masculino: "Masculino", infantil: "Infantil", gestante: "Gestante" } as const;

// Ordem = posição no ranking de vendas.
const seeds: Seed[] = [
  { ref: "0810", slug: "short-doll-regata-mescla-infantil", name: "Short doll regata mescla infantil", description: "Regata em malha mescla com short estampado. Linha infantil feminina.", category: "infantil" },
  { ref: "0118", slug: "short-doll-regata-infantil", name: "Short doll regata infantil", description: "Regata estampada com short liso. Linha infantil feminina.", category: "infantil" },
  { ref: "0130", slug: "pijama-bordado-manga-masculino", name: "Pijama bordado de manga masculino", description: "Camiseta de manga curta com bordado e short. Linha masculina.", category: "masculino" },
  { ref: "1043", slug: "pijama-alca-suede-liso", name: "Pijama de alça suede liso", description: "Blusa de alça e short em suede liso. Tamanhos P ao XG.", category: "feminino" },
  { ref: "0131", slug: "short-malha-masculino", name: "Short de malha masculino", description: "Short em malha estampada com cós elástico. Linha masculina.", category: "masculino" },
  { ref: "0848", slug: "pijama-regata-canelado", name: "Pijama regata canelado", description: "Regata e short em malha canelada com acabamento contrastante.", category: "feminino" },
  { ref: "0115", slug: "short-doll-alca-malha", name: "Short doll de alça em malha", description: "Blusa de alça estampada com short liso em malha.", category: "feminino" },
  { ref: "2130", slug: "pijama-aberto-bordado-manga-masculino", name: "Pijama aberto bordado de manga masculino", description: "Camisa aberta de manga curta com bordado e short. Linha masculina.", category: "masculino" },
  { ref: "0123", slug: "pijama-aberto-manga-bordado", name: "Pijama aberto de manga bordado", description: "Camisa aberta de manga curta com detalhes estampados e bermuda.", category: "feminino" },
  { ref: "0550", slug: "short-liganete-masculino", name: "Short liganete masculino", description: "Short estampado em liganete com cós elástico. Linha masculina.", category: "masculino" },
];

export const fallbackProducts: Product[] = seeds.map((s, i) => ({
  id: `p-${s.ref}`,
  ref: s.ref,
  slug: s.slug,
  name: s.name,
  description: s.description,
  category_id: `cat-${s.category}`,
  collection_id: frescor,
  is_new: false,
  is_featured: i < 5,
  active: true,
  sort_order: i + 1,
  images: [{ id: `i-${s.ref}`, product_id: `p-${s.ref}`, url: `/images/produtos/${s.ref}.jpg`, alt: `${s.name}, ref. ${s.ref}`, sort_order: 1 }],
  category: { slug: s.category, name: categoryName[s.category] },
}));
