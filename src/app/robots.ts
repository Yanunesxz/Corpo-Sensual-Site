import type { MetadataRoute } from "next";
import { urlOficial } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /obrigado fica liberado de propósito: a página já tem noindex, e o Google só lê
    // o noindex se puder abri-la. Com Disallow ela podia aparecer como "indexada,
    // embora bloqueada". Fora do domínio oficial, o cabeçalho X-Robots-Tag do
    // next.config.ts tira todas as páginas do Google.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: urlOficial("/sitemap.xml"),
  };
}
