/**
 * Tipos das tabelas do Supabase (ver supabase/migrations/0001_init.sql).
 * Mantenha em sincronia com o banco ao alterar o schema.
 */

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  season: "verao" | "inverno" | "atemporal";
  year: number | null;
  headline: string | null;
  description: string | null;
  hero_image_url: string | null;
  active: boolean;
  sort_order: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  ref: string | null;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  collection_id: string | null;
  is_new: boolean;
  is_featured: boolean;
  active: boolean;
  sort_order: number;
  images: ProductImage[];
  category?: Pick<Category, "slug" | "name"> | null;
};

export type LeadSource =
  | "catalogo"
  | "fabrica-de-pijamas"
  | "programa-cashback"
  | "colecao"
  | "contato";

export type LeadInsert = {
  name: string;
  email: string;
  whatsapp: string;
  has_cnpj: boolean;
  company: string | null;
  city: string | null;
  state: string | null;
  message: string | null;
  source: LeadSource;
  page_url: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
};
