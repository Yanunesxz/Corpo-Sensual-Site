import type { Metadata } from "next";
import { PaginaColecaoLanding } from "@/components/landing/pagina-colecao";
import { LANDING } from "@/lib/content/landing-colecoes";

/** Landing page dos anúncios, cópia da página do Wix. Fora do menu, do sitemap e do Google. */
export const metadata: Metadata = {
  title: { absolute: LANDING.verao.titulo },
  alternates: { canonical: "/colecao-verao" },
  robots: { index: false, follow: true },
  openGraph: { title: LANDING.verao.titulo, url: "/colecao-verao" },
};

export default function Page() {
  return <PaginaColecaoLanding colecao="verao" />;
}
