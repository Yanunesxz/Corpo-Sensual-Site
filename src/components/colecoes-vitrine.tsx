import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/types";
import { REFERENCIAS_POR_COLECAO, collectionShortName, seasonLabel } from "@/lib/site";
import { altCapa } from "@/lib/content/alt-fotos";
import { HeroImage } from "./hero-image";
import { Trilho } from "./trilho";
import { ArrowRight } from "./icons";

type Props = {
  collections: Collection[];
  /**
   * spread: home. Trilho de cartões largos no celular; no desktop, composição
   * assimétrica de revista (7 colunas + 4 colunas deslocada para baixo).
   * grande: /colecoes. Cartões em largura total com o texto branco sobre a foto.
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

function referencias(slug: string): string {
  const n = REFERENCIAS_POR_COLECAO[slug];
  return n ? `${n} referências` : "";
}

/** As coleções do ano, com a temporada, o nome, o número de referências e "Ver a coleção". */
export function ColecoesVitrine({ collections, variante, prioridade = false, linhasPorColecao }: Props) {
  if (variante === "grande") {
    return (
      <ul className="grid gap-5 md:gap-8">
        {collections.map((c, i) => {
          const nome = collectionShortName(c.name);
          const linhas = linhasPorColecao?.[c.slug];
          const meta = [referencias(c.slug), linhas?.length ? linhas.join(", ") : ""].filter(Boolean).join(" · ");
          return (
            <li key={c.id} data-reveal={i > 0 ? "" : undefined}>
              <Link
                href={`/colecoes/${c.slug}`}
                className="zoom-img shade-capa group relative block aspect-[4/5] overflow-hidden bg-sky md:aspect-[3/2] lg:aspect-[21/9]"
              >
                {c.hero_image_url && (
                  <HeroImage
                    desktop={c.hero_image_url}
                    mobile={c.hero_mobile_url}
                    alt={altCapa(c.slug, `Campanha da coleção ${nome}`)}
                    priority={prioridade && i === 0}
                    quality={80}
                  />
                )}
                <span className="on-photo absolute inset-x-0 bottom-0 z-10 block p-5 text-white md:p-8 lg:p-12">
                  <span className="eyebrow text-white">{seasonLabel(c.season, c.year)}</span>
                  <span className="t-titulo mt-2 block text-white">{nome}</span>
                  {meta && <span className="mt-2 block text-[15px] text-white">{meta}</span>}
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
    <Trilho rotulo="Coleções do ano" className="trilho-largo trilho-lg-grade [--colunas:12] lg:gap-x-10">
      {collections.map((c, i) => {
        const nome = collectionShortName(c.name);
        const foto = c.hero_mobile_url || c.hero_image_url;
        const primeira = i === 0;
        return (
          <li key={c.id} className={primeira ? "lg:col-span-7" : "lg:col-span-4 lg:col-start-9 lg:mt-40"} data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
            {/* A foto repete o link do nome: fica fora do Tab e do leitor de tela. */}
            <Link href={`/colecoes/${c.slug}`} tabIndex={-1} aria-hidden className={`zoom-img relative block overflow-hidden bg-areia aspect-[4/5] ${primeira ? "lg:aspect-[6/7]" : "lg:aspect-[3/4]"}`}>
              {foto && (
                <Image
                  src={foto}
                  alt={altCapa(c.slug, `Campanha da coleção ${nome}`)}
                  fill
                  priority={prioridade && primeira}
                  sizes={primeira ? "(min-width: 1024px) 55vw, (min-width: 768px) 56vw, 84vw" : "(min-width: 1024px) 30vw, (min-width: 768px) 56vw, 84vw"}
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
