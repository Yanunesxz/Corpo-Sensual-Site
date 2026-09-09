import type { Category, Collection, Product } from "./types";

/**
 * Dados usados quando o Supabase ainda não está configurado (ou quando uma
 * consulta falha). Em produção o conteúdo vem das tabelas (ver supabase/seed.sql).
 *
 * Produtos: referências do relatório "Ranking de vendas Corpo Sensual" do ERP
 * (01/07 a 09/09/2026). `rank` é a posição no ranking e vira o sort_order:
 * a home mostra as 10 primeiras. Fotos do servidor da empresa, tratadas para
 * 4:5 com scripts/foto-produto.mjs.
 */

export const fallbackCategories: Category[] = [
  { id: "cat-feminino", slug: "feminino", name: "Feminino", description: null, image_url: "/images/produtos/0126.jpg", sort_order: 1, active: true },
  { id: "cat-masculino", slug: "masculino", name: "Masculino", description: null, image_url: "/images/produtos/0716.jpg", sort_order: 2, active: true },
  { id: "cat-infantil", slug: "infantil", name: "Infantil", description: null, image_url: "/images/produtos/0810.jpg", sort_order: 3, active: true },
  { id: "cat-gestante", slug: "gestante", name: "Gestante", description: null, image_url: "/images/produtos/0325.jpg", sort_order: 4, active: true },
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

type CategorySlug = "feminino" | "masculino" | "infantil" | "gestante";
type Seed = { rank: number; ref: string; slug: string; name: string; description: string; category: CategorySlug };

const categoryName: Record<CategorySlug, string> = { feminino: "Feminino", masculino: "Masculino", infantil: "Infantil", gestante: "Gestante" };

const seeds: Seed[] = [
  { rank: 1, ref: "0810", slug: "short-doll-regata-mescla-infantil", name: "Short doll regata mescla infantil", description: "Regata em malha mescla com short estampado. Linha infantil feminina.", category: "infantil" },
  { rank: 2, ref: "0118", slug: "short-doll-regata-infantil", name: "Short doll regata infantil", description: "Regata estampada com short liso. Linha infantil feminina.", category: "infantil" },
  { rank: 3, ref: "0130", slug: "pijama-bordado-manga-masculino", name: "Pijama bordado de manga masculino", description: "Camiseta de manga curta com bordado e short. Linha masculina.", category: "masculino" },
  { rank: 4, ref: "1043", slug: "pijama-alca-suede-liso", name: "Pijama de alça suede liso", description: "Blusa de alça e short em suede liso. Tamanhos P ao XG.", category: "feminino" },
  { rank: 5, ref: "0131", slug: "short-malha-masculino", name: "Short de malha masculino", description: "Short em malha estampada com cós elástico. Linha masculina.", category: "masculino" },
  { rank: 6, ref: "0848", slug: "pijama-regata-canelado", name: "Pijama regata canelado", description: "Regata e short em malha canelada com acabamento contrastante.", category: "feminino" },
  { rank: 7, ref: "0115", slug: "short-doll-alca-malha", name: "Short doll de alça em malha", description: "Blusa de alça estampada com short liso em malha.", category: "feminino" },
  { rank: 8, ref: "2130", slug: "pijama-aberto-bordado-manga-masculino", name: "Pijama aberto bordado de manga masculino", description: "Camisa aberta de manga curta com bordado e short. Linha masculina.", category: "masculino" },
  { rank: 9, ref: "0123", slug: "pijama-aberto-manga-bordado", name: "Pijama aberto de manga bordado", description: "Camisa aberta de manga curta com detalhes estampados e bermuda.", category: "feminino" },
  { rank: 10, ref: "0550", slug: "short-liganete-masculino", name: "Short liganete masculino", description: "Short estampado em liganete com cós elástico. Linha masculina.", category: "masculino" },
  { rank: 11, ref: "1034", slug: "pijama-alca-canelado-listrado", name: "Pijama de alça canelado listrado", description: "Blusa de alça e short em malha canelada listrada.", category: "feminino" },
  { rank: 12, ref: "0126", slug: "camisola-bordada-aberta", name: "Camisola bordada aberta", description: "Camisola de manga curta com abertura frontal e bordado.", category: "feminino" },
  { rank: 13, ref: "1042", slug: "pijama-alca-suede-estampado", name: "Pijama de alça suede estampado", description: "Blusa de alça com estampa e short floral em suede. Tamanhos P ao XG.", category: "feminino" },
  { rank: 14, ref: "0851", slug: "pijama-americano-liso", name: "Pijama americano liso", description: "Camisa de manga curta com botões e short, em cor lisa.", category: "feminino" },
  { rank: 15, ref: "0502", slug: "short-doll-alca-liganete", name: "Short doll de alça em liganete", description: "Blusa de alça e short estampados em liganete.", category: "feminino" },
  { rank: 16, ref: "0390", slug: "short-doll-nadador", name: "Short doll nadador", description: "Regata nadador estampada com short liso.", category: "feminino" },
  { rank: 17, ref: "0080", slug: "short-doll-renda-liganete", name: "Short doll com renda em liganete", description: "Blusa de alça com renda e short em liganete.", category: "feminino" },
  { rank: 18, ref: "1035", slug: "pijama-alca-canelado-liso", name: "Pijama de alça canelado liso", description: "Blusa de alça e short em malha canelada lisa.", category: "feminino" },
  { rank: 19, ref: "0355", slug: "short-doll-regata-canelado", name: "Short doll regata canelado", description: "Regata e short em malha canelada com amarração.", category: "feminino" },
  { rank: 20, ref: "0135", slug: "short-estampado-masculino-malha-pv", name: "Short estampado masculino em malha PV", description: "Short estampado em malha PV com cós elástico. Linha masculina.", category: "masculino" },
  { rank: 28, ref: "0716", slug: "pijama-liganete-masculino", name: "Pijama de liganete masculino", description: "Camiseta de manga curta e bermuda em liganete. Linha masculina.", category: "masculino" },
  { rank: 48, ref: "0325", slug: "camisola-gestante-estampada", name: "Camisola gestante estampada", description: "Camisola de alça com abertura para amamentação e saia estampada. Linha gestante.", category: "gestante" },
];

export const fallbackProducts: Product[] = seeds.map((s) => ({
  id: `p-${s.ref}`,
  ref: s.ref,
  slug: s.slug,
  name: s.name,
  description: s.description,
  category_id: `cat-${s.category}`,
  collection_id: frescor,
  is_new: false,
  is_featured: s.rank <= 10,
  active: true,
  sort_order: s.rank,
  images: [{ id: `i-${s.ref}`, product_id: `p-${s.ref}`, url: `/images/produtos/${s.ref}.jpg`, alt: `${s.name}, ref. ${s.ref}`, sort_order: 1 }],
  category: { slug: s.category, name: categoryName[s.category] },
}));
