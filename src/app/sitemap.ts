import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getCollections } from "@/lib/data";
import { politicas } from "@/lib/content/politicas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/sobre", "/colecoes", "/catalogo", "/fabrica-de-pijamas", "/programa-cashback", "/contato"];
  const collections = await getCollections();

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...collections.map((c) => ({
      url: `${site.url}/colecoes/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...politicas.map((p) => ({
      url: `${site.url}/politicas/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
