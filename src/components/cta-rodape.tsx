"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { ArrowRight } from "./icons";

type Chamada = { href: string; rotulo: string; nota: string };

/**
 * A chamada do rodapé muda com a página. Nas páginas de anúncio e de representante o
 * botão leva ao formulário da própria página (a pessoa não sai dela); no cadastro e no
 * obrigado não há chamada, porque a pessoa já está no fim do caminho.
 * Representante: sem números, como o dono pediu para aquela página.
 */
function chamadaDa(pathname: string): Chamada | null {
  if (pathname === "/catalogo" || pathname === "/obrigado") return null;
  if (pathname === "/fabrica-de-pijamas") {
    return { href: "#formulario", rotulo: "Quero a tabela de preços", nota: `${site.commercial.noMinOrder}. ${site.commercial.noCnpjNote}` };
  }
  if (pathname === "/seja-representante") {
    return { href: "#formulario", rotulo: "Quero ser representante", nota: "Depois do cadastro você fala direto com o nosso gerente comercial." };
  }
  return { href: "/catalogo", rotulo: "Receber catálogo", nota: `${site.commercial.noMinOrder}. ${site.commercial.noCnpjNote}` };
}

export function CtaRodape() {
  const pathname = usePathname();
  const chamada = chamadaDa(pathname);
  if (!chamada) return null;

  const conteudo = (
    <>
      {chamada.rotulo}
      <ArrowRight width={18} height={18} className="seta" />
    </>
  );
  return (
    <div className="mt-7">
      {chamada.href.startsWith("#") ? (
        <a href={chamada.href} className="btn btn-light btn-sm px-5">
          {conteudo}
        </a>
      ) : (
        <Link href={chamada.href} className="btn btn-light btn-sm px-5">
          {conteudo}
        </Link>
      )}
      <p className="mt-3 max-w-xs text-[13px] leading-[1.5] text-noite-texto">{chamada.nota}</p>
    </div>
  );
}
