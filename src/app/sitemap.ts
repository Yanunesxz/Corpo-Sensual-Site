import type { MetadataRoute } from "next";
import { urlImagem, urlOficial } from "@/lib/site";
import { getCollections } from "@/lib/data";
import { politicas } from "@/lib/content/politicas";
import { COLECOES_ATUALIZADAS, PAGINAS } from "@/lib/content/paginas";

/**
 * As páginas fixas e as datas vêm de src/lib/content/paginas.ts (quem muda o conteúdo
 * de uma página troca a data lá). /obrigado e as landing pages de coleção ficam de fora
 * (são noindex). As imagens entram no sitemap para o Google Imagens ligar cada foto à
 * página certa.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const collections = await getCollections();
  return [
    ...Object.entries(PAGINAS).map(([caminho, p]) => ({
      url: urlOficial(caminho),
      lastModified: p.atualizada,
      changeFrequency: p.frequencia,
      priority: p.prioridade,
      ...(p.imagem ? { images: [urlImagem(p.imagem)] } : {}),
    })),
    ...collections.map((c) => ({
      url: urlOficial(`/colecoes/${c.slug}`),
      lastModified: COLECOES_ATUALIZADAS,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...(c.hero_image_url ? { images: [urlImagem(c.hero_image_url)] } : {}),
    })),
    ...politicas.map((p) => ({
      url: urlOficial(`/politicas/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
