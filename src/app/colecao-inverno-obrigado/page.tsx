import type { Metadata } from "next";
import { PaginaObrigadoLanding } from "@/components/landing/pagina-obrigado";
import { OBRIGADO } from "@/lib/content/landing-colecoes";

/** Obrigado da landing page, cópia do Wix: o botão leva ao arquivo do catálogo. */
export const metadata: Metadata = {
  title: { absolute: OBRIGADO.inverno.titulo },
  alternates: { canonical: "/colecao-inverno-obrigado" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PaginaObrigadoLanding colecao="inverno" />;
}
