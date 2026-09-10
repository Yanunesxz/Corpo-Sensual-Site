import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCollections, getProducts } from "@/lib/data";
import { collectionShortName, seasonLabel, site } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Coleções",
  description: "Conheça as coleções de pijamas, camisolas, robes e moda íntima da Corpo Sensual. Duas coleções por ano, venda no atacado para lojistas.",
};

export default async function ColecoesPage() {
  const collections = await getCollections();
  // Quantas peças e quais linhas cada coleção tem, para o card dizer algo concreto.
  const counts = await Promise.all(
    collections.map((c) =>
      getProducts({ collectionId: c.id }).then((p) => ({
        total: p.length,
        linhas: [...new Set(p.map((x) => x.category?.name).filter(Boolean))] as string[],
      })),
    ),
  );
  return (
    <section className="mx-auto max-w-[1600px] px-2 pb-16 pt-8 md:pt-14">
      <div className="px-3 md:px-6">
        <h1 className="h-display text-4xl md:text-6xl">Coleções</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          Lançamos duas coleções por ano, uma de primavera/verão e uma de outono/inverno, com pijamas, short dolls,
          camisolas e robes nas linhas feminina, masculina, infantil e gestante. {site.commercial.exclusive}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/catalogo" className="link text-[13px]">
            Receber catálogo e tabela
          </Link>
          <Link href="/fabrica-de-pijamas#perguntas" className="link text-[13px]">
            Como comprar
          </Link>
        </div>
      </div>

      {collections.length === 0 ? (
        <p className="mt-10 px-3 text-sm text-ink-soft md:px-6">Nenhuma coleção publicada no momento.</p>
      ) : (
        <ul className="mt-8 grid gap-2">
          {collections.map((c, i) => (
            <li key={c.id}>
              <Link href={`/colecoes/${c.slug}`} className="shade zoom-img relative block aspect-[4/5] overflow-hidden bg-stone md:aspect-[3/2] lg:aspect-[21/9]">
                {c.hero_mobile_url && (
                  <Image src={c.hero_mobile_url} alt="" fill sizes="100vw" className="object-cover object-[center_25%] md:hidden" />
                )}
                {c.hero_image_url && (
                  <Image
                    src={c.hero_image_url}
                    alt=""
                    fill
                    sizes="100vw"
                    className={`object-cover object-[center_35%] ${c.hero_mobile_url ? "hidden md:block" : ""}`}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white md:p-10">
                  <p className="label text-[13px]">{seasonLabel(c.season, c.year)}</p>
                  <p className="h-display mt-2 text-4xl md:text-6xl">{collectionShortName(c.name)}</p>
                  {c.headline && <p className="mt-2 hidden max-w-md text-base text-white/90 lg:block">{c.headline}</p>}
                  {counts[i].total > 0 && (
                    <p className="mt-2 text-sm text-white/85">
                      {counts[i].total} peças
                      {counts[i].linhas.length > 0 && ` · ${counts[i].linhas.join(", ").toLowerCase()}`}
                    </p>
                  )}
                  <span className="link mt-3 inline-block text-[13px]">Ver coleção</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
