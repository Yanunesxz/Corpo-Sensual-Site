import type { Metadata } from "next";
import { PaginaColecaoLanding } from "@/components/landing/pagina-colecao";
import { LANDING } from "@/lib/content/landing-colecoes";

/** Landing page dos anúncios, cópia da página do Wix. Fora do menu, do sitemap e do Google. */
export const metadata: Metadata = {
  title: { absolute: LANDING.inverno.titulo },
  alternates: { canonical: "/colecao-inverno" },
  robots: { index: false, follow: true },
  openGraph: { title: LANDING.inverno.titulo, url: "/colecao-inverno" },
};

export default function Page() {
  return <PaginaColecaoLanding colecao="inverno" />;
}
