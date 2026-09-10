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
    <>
      {/* Abertura no desenho do site atual: fundo azul-claro, título, apoio e botão */}
      <section className="bg-sky">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
          <h1 className="h-hero text-[2rem] md:text-[2.375rem]">Coleções</h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-[1.6] text-body">
            Lançamos duas coleções por ano, uma de primavera/verão e uma de outono/inverno, com pijamas, short dolls,
            camisolas e robes nas linhas feminina, masculina, infantil e gestante. {site.commercial.salesNote}
          </p>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7">
            <Link href="/catalogo" className="btn btn-dark w-full whitespace-nowrap sm:w-auto">
              Receber catálogo e tabela
            </Link>
            <Link href="/fabrica-de-pijamas#perguntas" className="link self-start whitespace-nowrap text-base sm:self-auto">
              Como comprar
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
        {collections.length === 0 ? (
          <p className="text-base text-body">Nenhuma coleção publicada no momento.</p>
        ) : (
          <ul className="grid gap-4 md:gap-5">
            {collections.map((c, i) => (
              <li key={c.id}>
                <Link
                  href={`/colecoes/${c.slug}`}
                  className="shade zoom-img relative block aspect-[4/5] overflow-hidden rounded-media bg-sky-soft md:aspect-[3/2] lg:aspect-[21/9]"
                >
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
                  {/* Sobre a foto a cor precisa vir na própria classe: .label, .h-display e .link já definem cor. */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-10">
                    <p className="label text-white/90">{seasonLabel(c.season, c.year)}</p>
                    <p className="h-display mt-2 text-3xl text-white md:text-[2.5rem]">{collectionShortName(c.name)}</p>
                    {c.headline && <p className="mt-3 hidden max-w-md text-[1.125rem] leading-[1.6] text-white/90 lg:block">{c.headline}</p>}
                    {counts[i].total > 0 && (
                      <p className="mt-2 text-sm text-white/85">
                        {counts[i].total} peças
                        {counts[i].linhas.length > 0 && ` · ${counts[i].linhas.join(", ").toLowerCase()}`}
                      </p>
                    )}
                    <span className="link mt-3 inline-block text-base text-white">Ver coleção</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
