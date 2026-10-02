import type { MetadataRoute } from "next";
import { urlOficial } from "@/lib/site";
import { getCollections } from "@/lib/data";
import { politicas } from "@/lib/content/politicas";

/**
 * lastmod = data da última mudança de CONTEÚDO da página (AAAA-MM-DD): texto, fotos,
 * produtos, perguntas do FAQ, campos do formulário. Layout, cor e desempenho não contam.
 * Quem mudar o conteúdo de uma página troca a data dela aqui, no mesmo commit.
 * Não use new Date(): o Google aprende a ignorar data que muda a cada build.
 * /obrigado fica de fora (é noindex).
 */
const paginas = [
  { path: "/", atualizada: "2026-10-01" },
  { path: "/sobre", atualizada: "2026-10-01" },
  { path: "/colecoes", atualizada: "2026-10-01" },
  { path: "/catalogo", atualizada: "2026-10-01" },
  { path: "/fabrica-de-pijamas", atualizada: "2026-10-01" },
  { path: "/contato", atualizada: "2026-10-01" },
  { path: "/ajuda", atualizada: "2026-10-01" },
  { path: "/seja-representante", atualizada: "2026-10-01" },
];

/**
 * Última mudança de conteúdo das páginas /colecoes/[slug] (página, src/data/catalogo.json
 * ou fotos). Quando o catálogo vier do Supabase, use uma data que considere também os
 * produtos da coleção.
 */
const COLECOES_ATUALIZADAS = "2026-10-01";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const collections = await getCollections();
  return [
    ...paginas.map((p) => ({ url: urlOficial(p.path), lastModified: p.atualizada })),
    ...collections.map((c) => ({ url: urlOficial(`/colecoes/${c.slug}`), lastModified: COLECOES_ATUALIZADAS })),
    ...politicas.map((p) => ({ url: urlOficial(`/politicas/${p.slug}`), lastModified: p.updatedAt })),
  ];
}
