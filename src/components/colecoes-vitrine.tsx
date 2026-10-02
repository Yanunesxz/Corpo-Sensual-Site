import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/types";
import { REFERENCIAS_POR_COLECAO, collectionShortName, seasonLabel } from "@/lib/site";
import { altCapa } from "@/lib/content/alt-fotos";
import { capaVertical } from "@/lib/content/capas";
import { HeroImage } from "./hero-image";
import { Trilho } from "./trilho";
import { ArrowRight } from "./icons";

type Props = {
  collections: Collection[];
  /**
   * spread: home. Trilho de cartões largos no celular; duas colunas no tablet; no
   * desktop, composição assimétrica de revista (6 colunas + 4 colunas deslocada para
   * baixo). A foto grande cabe inteira numa tela de 830 px de altura.
   * grande: /colecoes. Um cartão por linha no celular; a partir de 768 px, as duas
   * coleções lado a lado, em pé, com o texto branco sobre a base da foto.
   */
  variante: "spread" | "grande";
  /** Liga `priority` só na primeira foto (use quando o bloco é o topo da página). */
  prioridade?: boolean;
  /**
   * Linhas de cada coleção, pelo slug, para a linha de referências da variante grande:
   * { "delicias-de-verao": ["feminino", "masculino", "infantil"] } vira
   * "145 referências · feminino, masculino, infantil".
   */
  linhasPorColecao?: Record<string, string[]>;
};

/**
 * Ponto de interesse da foto em pé no cartão de /colecoes a partir de 768 px (4:5 no
 * tablet, 6:7 no desktop): os rostos ficam no terço de cima, longe do texto da base.
 */
const FOCO_CARTAO: Record<string, string> = {
  "delicias-de-verao": "center 35%",
  entrelacos: "center 12%",
};

function referencias(slug: string): string {
  const n = REFERENCIAS_POR_COLECAO[slug];
  return n ? `${n} referências` : "";
}

/** As coleções do ano, com a temporada, o nome, o número de referências e "Ver a coleção". */
export function ColecoesVitrine({ collections, variante, prioridade = false, linhasPorColecao }: Props) {
  if (variante === "grande") {
    return (
      <ul className="grid gap-5 md:grid-cols-2 md:gap-6 lg:gap-10">
        {collections.map((c, i) => {
          const nome = collectionShortName(c.name);
          const linhas = linhasPorColecao?.[c.slug];
          const refs = referencias(c.slug);
          const quaisLinhas = linhas?.length ? linhas.join(", ") : "";
          // Sempre a foto em pé (a do celular): é a que cabe num cartão em pé.
          const foto = capaVertical(c);
          return (
            <li key={c.id} data-reveal={i > 0 ? "" : undefined}>
              <Link
                href={`/colecoes/${c.slug}`}
                // Sempre em pé (as fotos de campanha são em pé): o cartão 16:9 de antes mostrava
                // um terço da foto. A 1440 px ou mais mede 652x760 e cabe numa tela de 830 px.
                className="zoom-img shade-capa group relative block aspect-[4/5] overflow-hidden bg-sky lg:aspect-[6/7]"
              >
                {foto && (
                  <HeroImage
                    // A mesma foto em todas as larguras; só o ponto de interesse muda.
                    desktop={foto}
                    desktopPosition={Object.hasOwn(FOCO_CARTAO, c.slug) ? FOCO_CARTAO[c.slug] : undefined}
                    alt={altCapa(c.slug, `Campanha da coleção ${nome}`)}
                    priority={prioridade && i === 0}
                    quality={80}
                    // Duas colunas dentro do .wrap: a partir de 1440 px o cartão para em 652 px.
                    sizes="(min-width: 1440px) 652px, (min-width: 768px) 46vw, 100vw"
                  />
                )}
                <span className="on-photo absolute inset-x-0 bottom-0 z-10 block p-5 text-white md:p-6 lg:p-8">
                  <span className="eyebrow text-white">{seasonLabel(c.season, c.year)}</span>
                  {/* Tablet (dois cartões de 340 px): título numa linha e só o número de referências,
                      para o bloco de texto ficar na parte escura do degradê. */}
                  <span className="t-titulo mt-2 block text-white md:max-lg:text-[1.625rem]">{nome}</span>
                  {(refs || quaisLinhas) && (
                    <span className="mt-2 block text-[15px] text-white">
                      {refs}
                      {quaisLinhas && <span className={refs ? "md:max-lg:hidden" : ""}>{refs ? " · " : ""}{quaisLinhas}</span>}
                    </span>
                  )}
                  <span className="mt-4 inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-button)] text-[15px] text-white underline decoration-white/60 underline-offset-[6px]">
                    Ver a coleção
                    <ArrowRight width={18} height={18} className="transition-transform duration-300 group-hover:translate-x-[3px]" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    // Tablet (768 a 1023 px): as duas cabem inteiras lado a lado, então o trilho vira grade
    // de duas colunas (e as setas somem sozinhas, porque não há o que rolar).
    <Trilho
      rotulo="Coleções do ano"
      className="trilho-largo trilho-lg-grade [--colunas:12] md:max-lg:mx-0 md:max-lg:grid-flow-row md:max-lg:grid-cols-2 md:max-lg:overflow-visible md:max-lg:px-0 lg:gap-x-10"
    >
      {collections.map((c, i) => {
        const nome = collectionShortName(c.name);
        const foto = capaVertical(c);
        const primeira = i === 0;
        return (
          <li key={c.id} className={primeira ? "lg:col-span-6" : "lg:col-span-4 lg:col-start-9 lg:mt-24"} data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
            {/* A foto repete o link do nome: fica fora do Tab e do leitor de tela. */}
            <Link href={`/colecoes/${c.slug}`} tabIndex={-1} aria-hidden className={`zoom-img relative block overflow-hidden bg-areia aspect-[4/5] ${primeira ? "lg:aspect-[6/7]" : "lg:aspect-[3/4]"}`}>
              {foto && (
                <Image
                  src={foto}
                  alt={altCapa(c.slug, `Campanha da coleção ${nome}`)}
                  fill
                  priority={prioridade && primeira}
                  sizes={
                    primeira
                      ? "(min-width: 1440px) 652px, (min-width: 1024px) 46vw, (min-width: 768px) 46vw, 84vw"
                      : "(min-width: 1440px) 421px, (min-width: 1024px) 30vw, (min-width: 768px) 46vw, 84vw"
                  }
                  className="object-cover"
                />
              )}
            </Link>
            <p className="eyebrow mt-5">{seasonLabel(c.season, c.year)}</p>
            {/* A primeira, maior, ganha o tamanho de título de seção no desktop. */}
            <h3 className={`t-sub mt-2 ${primeira ? "lg:text-[clamp(1.75rem,1.35rem+1.7vw,3rem)] lg:leading-[1.08]" : ""}`}>{nome}</h3>
            {referencias(c.slug) && <p className="legenda mt-1.5">{referencias(c.slug)}</p>}
            <Link href={`/colecoes/${c.slug}`} className="link-seta mt-2">
              Ver a coleção
              <ArrowRight width={18} height={18} />
            </Link>
          </li>
        );
      })}
    </Trilho>
  );
}
