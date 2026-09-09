import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/data";
import { collectionShortName, seasonLabel } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Coleções",
  description: "Conheça as coleções de pijamas, camisolas, robes e moda íntima da Corpo Sensual.",
};

export default async function ColecoesPage() {
  const collections = await getCollections();
  return (
    <section className="mx-auto max-w-[1600px] px-2 pb-16 pt-10 md:pt-14">
      <SectionHeading level="h1" title="Coleções" className="px-3 md:px-6" />

      {collections.length === 0 ? (
        <p className="mt-10 px-3 text-sm text-ink-soft md:px-6">Nenhuma coleção publicada no momento.</p>
      ) : (
        <ul className="mt-8 grid gap-2">
          {collections.map((c) => (
            <li key={c.id}>
              <Link href={`/colecoes/${c.slug}`} className="shade zoom-img relative block aspect-[4/5] overflow-hidden bg-stone md:aspect-[21/9]">
                {c.hero_image_url && (
                  <Image src={c.hero_image_url} alt="" fill sizes="100vw" className="object-cover object-[center_35%]" />
                )}
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white md:p-10">
                  <p className="label">{seasonLabel(c.season, c.year)}</p>
                  <p className="h-display mt-2 text-5xl md:text-7xl">{collectionShortName(c.name)}</p>
                  {c.headline && <p className="mt-2 max-w-md text-sm text-white/90 md:text-base">{c.headline}</p>}
                  <span className="link mt-4 inline-block text-[13px]">Ver coleção</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
