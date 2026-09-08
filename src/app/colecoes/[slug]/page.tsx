import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCollectionBySlug, getProducts } from "@/lib/data";
import { seasonLabel } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { CommercialTerms } from "@/components/commercial-terms";
import { Reveal } from "@/components/reveal";
import { ArrowRight } from "@/components/icons";

type Props = PageProps<"/colecoes/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Coleção não encontrada" };
  return {
    title: collection.name,
    description: collection.headline ?? collection.description ?? undefined,
    openGraph: collection.hero_image_url ? { images: [{ url: collection.hero_image_url }] } : undefined,
  };
}

export default async function ColecaoPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { categoria } = await searchParams;
  const categorySlug = typeof categoria === "string" ? categoria : undefined;

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ collectionId: collection.id, categorySlug }),
  ]);

  const base = `/colecoes/${collection.slug}`;
  const gallery = collection.gallery_urls ?? [];

  return (
    <>
      {/* Hero da coleção */}
      <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-ink text-white">
        {collection.hero_image_url && (
          <Image src={collection.hero_image_url} alt="" fill priority sizes="100vw" className="object-cover object-[center_35%]" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/30 to-ink/15" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-40 md:px-8 md:pb-20">
          <p className="eyebrow text-butter">{seasonLabel(collection.season, collection.year)}</p>
          <h1 className="display mt-3 text-4xl md:text-6xl lg:text-7xl">{collection.name}</h1>
          {collection.headline && <p className="mt-4 max-w-xl text-lg text-white/85">{collection.headline}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalogo" className="btn btn-light">
              Baixar catálogo <ArrowRight width={18} height={18} />
            </Link>
            <a href="#pecas" className="btn border border-white/60 text-white hover:bg-white hover:text-ink">
              Ver peças
            </a>
          </div>
        </div>
      </section>

      {/* Conceito + galeria de campanha */}
      {(collection.description || gallery.length > 0) && (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          {collection.description && (
            <Reveal>
              <SectionHeading eyebrow="A coleção" title={collection.headline ?? collection.name} description={collection.description} />
            </Reveal>
          )}
          {gallery.length > 0 && (
            <ul className="mt-12 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
              {gallery.map((url, i) => (
                <Reveal as="li" key={url} delay={i * 90} className="relative aspect-[3/4] overflow-hidden rounded-card bg-cream-dark">
                  <Image
                    src={url}
                    alt={`${collection.name}, foto de campanha ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </Reveal>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Condições comerciais */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <CommercialTerms />
      </section>

      {/* Peças */}
      <section id="pecas" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Peças"
            title={categorySlug ? categories.find((c) => c.slug === categorySlug)?.name ?? "Peças" : "Referências da coleção"}
          />
          <Link href="/catalogo" className="btn btn-primary">
            Receber catálogo completo <ArrowRight width={18} height={18} />
          </Link>
        </div>

        {categories.length > 0 && (
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
            <Chip href={`${base}#pecas`} active={!categorySlug}>
              Todas
            </Chip>
            {categories.map((c) => (
              <Chip key={c.id} href={`${base}?categoria=${c.slug}#pecas`} active={categorySlug === c.slug}>
                {c.name}
              </Chip>
            ))}
          </nav>
        )}

        {products.length === 0 ? (
          <div className="mt-12 rounded-card border border-dashed border-line p-10 text-center text-ink-soft">
            Nenhuma peça publicada nesta categoria ainda.{" "}
            <Link href="/catalogo" className="underline">
              Peça o catálogo completo
            </Link>
            .
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-5 md:gap-8 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"
      }`}
    >
      {children}
    </Link>
  );
}
