import { getSupabase } from "./supabase/client";
import { fallbackCategories, fallbackCollections, fallbackProducts } from "./fallback-data";
import type { Category, Collection, Product, ProductImage } from "./types";

/**
 * Camada de acesso a dados do catálogo.
 * Cada função consulta o Supabase e, se ele não estiver configurado ou a
 * consulta falhar, devolve os dados de exemplo para o site nunca quebrar.
 */

const PRODUCT_SELECT =
  "id, ref, slug, name, description, category_id, collection_id, is_new, is_featured, active, sort_order, images:product_images(id, product_id, url, alt, sort_order), category:categories(slug, name)";

type ProductRow = Omit<Product, "images" | "category"> & {
  images: ProductImage[] | null;
  category: { slug: string; name: string } | { slug: string; name: string }[] | null;
};

function normalizeProduct(row: ProductRow): Product {
  const category = Array.isArray(row.category) ? row.category[0] ?? null : row.category;
  const images = [...(row.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return { ...row, images, category };
}

function logFallback(scope: string, error: unknown) {
  console.warn(`[data] usando dados de exemplo em ${scope}:`, error instanceof Error ? error.message : error);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackCategories;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) {
    logFallback("getCategories", error);
    return fallbackCategories;
  }
  return data as Category[];
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackCollections;
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) {
    logFallback("getCollections", error);
    return fallbackCollections;
  }
  return data as Collection[];
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const supabase = getSupabase();
  if (!supabase) return fallbackCollections.find((c) => c.slug === slug) ?? null;
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) {
    logFallback("getCollectionBySlug", error);
    return fallbackCollections.find((c) => c.slug === slug) ?? null;
  }
  return (data as Collection | null) ?? null;
}

export type ProductFilter = {
  collectionId?: string;
  categorySlug?: string;
  onlyNew?: boolean;
  onlyFeatured?: boolean;
  limit?: number;
};

export async function getProducts(filter: ProductFilter = {}): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return filterFallback(filter);

  let query = supabase.from("products").select(PRODUCT_SELECT).eq("active", true).order("sort_order");
  if (filter.collectionId) query = query.eq("collection_id", filter.collectionId);
  if (filter.onlyNew) query = query.eq("is_new", true);
  if (filter.onlyFeatured) query = query.eq("is_featured", true);
  if (filter.limit) query = query.limit(filter.limit);

  const { data, error } = await query;
  if (error) {
    logFallback("getProducts", error);
    return filterFallback(filter);
  }
  let products = (data as unknown as ProductRow[]).map(normalizeProduct);
  // Filtro por categoria é feito aqui porque a relação é aninhada no select.
  if (filter.categorySlug) {
    products = products.filter((p) => p.category?.slug === filter.categorySlug);
  }
  return products;
}

function filterFallback(filter: ProductFilter): Product[] {
  let list = fallbackProducts;
  if (filter.collectionId) list = list.filter((p) => p.collection_id === filter.collectionId);
  if (filter.categorySlug) list = list.filter((p) => p.category?.slug === filter.categorySlug);
  if (filter.onlyNew) list = list.filter((p) => p.is_new);
  if (filter.onlyFeatured) list = list.filter((p) => p.is_featured);
  if (filter.limit) list = list.slice(0, filter.limit);
  return list;
}

/** Dados da home em uma única chamada. */
export async function getHomeData() {
  const [collections, categories, newProducts, featuredProducts] = await Promise.all([
    getCollections(),
    getCategories(),
    getProducts({ onlyNew: true, limit: 4 }),
    getProducts({ onlyFeatured: true, limit: 4 }),
  ]);
  return {
    currentCollection: collections[0] ?? null,
    categories,
    newProducts,
    featuredProducts,
  };
}
