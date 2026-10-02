"use client";

import Link from "next/link";
import { useRota } from "@/lib/rota";
import { site } from "@/lib/site";
import { ArrowRight } from "./icons";

/**
 * Páginas que já terminam com a própria chamada (formulário, fecho com botão) ou que
 * são o fim do caminho (cadastro e obrigado). Nelas o rodapé não repete o botão que a
 * pessoa acabou de ver logo acima: era o mesmo "Quero a tabela de preços" duas vezes
 * em 300 px na landing, e um segundo formulário igual depois do da home e da coleção.
 */
function temChamadaPropria(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/sobre" ||
    pathname === "/catalogo" ||
    pathname === "/obrigado" ||
    pathname === "/fabrica-de-pijamas" ||
    pathname === "/seja-representante" ||
    pathname === "/colecoes" ||
    pathname.startsWith("/colecoes/")
  );
}

/**
 * A chamada do rodapé só onde a página não fecha com a sua: ajuda, contato, políticas
 * e a página não encontrada. Leva ao cadastro do catálogo.
 */
export function CtaRodape() {
  const pathname = useRota();
  if (temChamadaPropria(pathname)) return null;

  return (
    <div className="mt-6 md:mt-7">
      <Link href="/catalogo" className="btn btn-light btn-sm px-5">
        Receber catálogo
        <ArrowRight width={18} height={18} className="seta" />
      </Link>
      <p className="mt-3 max-w-xs text-[13px] leading-[1.5] text-noite-texto">
        {site.commercial.noMinOrder}. {site.commercial.noCnpjNote}
      </p>
    </div>
  );
}
