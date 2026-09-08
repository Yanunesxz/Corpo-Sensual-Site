import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/data";
import { seasonLabel } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { ArrowRight } from "@/components/icons";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Coleções",
  description: "Conheça as coleções de pijamas, camisolas, robes e moda íntima da Corpo Sensual.",
};

export default async function ColecoesPage() {
  const collections = await getCollections();
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8 md:pt-44">
      <Reveal>
        <SectionHeading level="h1" eyebrow="Coleções" title="Nossas coleções" description="Peças desenvolvidas para cada temporada, com modelagem atual e tecidos selecionados." />
      </Reveal>

      {collections.length === 0 ? (
        <p className="mt-12 text-ink-soft">Nenhuma coleção publicada no momento.</p>
      ) : (
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {collections.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 100}>
              <Link href={`/colecoes/${c.slug}`} className="group relative block aspect-[16/10] overflow-hidden rounded-card bg-ink text-white">
                {c.hero_image_url && (
                  <Image src={c.hero_image_url} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-90 transition duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/20 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="eyebrow text-butter">{seasonLabel(c.season, c.year)}</p>
                  <p className="display mt-2 text-3xl md:text-4xl">{c.name}</p>
                  {c.headline && <p className="mt-2 max-w-md text-sm text-white/80">{c.headline}</p>}
                  <span className="mt-4 inline-flex items-center gap-2 text-sm">
                    Ver peças <ArrowRight width={16} height={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
