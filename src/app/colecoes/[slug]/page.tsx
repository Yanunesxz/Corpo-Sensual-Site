import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCollectionBySlug, getProducts } from "@/lib/data";
import { collectionShortName, seasonLabel } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { CommercialTerms } from "@/components/commercial-terms";

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

  const [categories, ownProducts] = await Promise.all([
    getCategories(),
    getProducts({ collectionId: collection.id, categorySlug }),
  ]);

  // Coleção sem peças cadastradas: mostra as mais vendidas para a página não ficar vazia.
  const showingBestSellers = ownProducts.length === 0;
  const products = showingBestSellers ? await getProducts({ categorySlug, limit: 10 }) : ownProducts;

  const base = `/colecoes/${collection.slug}`;
  const gallery = collection.gallery_urls ?? [];
  const activeCategory = categorySlug ? categories.find((c) => c.slug === categorySlug) : undefined;
  const heading = activeCategory ? activeCategory.name : showingBestSellers ? "Mais vendidas" : "Referências";

  return (
    <>
      {/* Hero */}
      <section className="shade relative h-[70svh] min-h-[460px] bg-stone">
        {collection.hero_image_url && (
          <Image src={collection.hero_image_url} alt="" fill priority sizes="100vw" className="object-cover object-[center_35%]" />
        )}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-10 text-white md:px-8 md:pb-14">
          <p className="label">{seasonLabel(collection.season, collection.year)}</p>
          <h1 className="h-serif mt-3 text-6xl md:text-8xl lg:text-[8rem]">{collectionShortName(collection.name)}</h1>
          <div className="mt-6 flex gap-7">
            <a href="#pecas" className="link text-[13px]">
              Ver peças
            </a>
            <Link href="/catalogo" className="link text-[13px]">
              Receber catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Conceito */}
      {(collection.headline || collection.description) && (
        <section className="mx-auto grid max-w-[1600px] gap-6 px-5 py-14 md:grid-cols-[1fr_2fr] md:px-8 md:py-20">
          <p className="label">A coleção</p>
          <div className="max-w-2xl">
            {collection.headline && <p className="h-display text-3xl md:text-5xl">{collection.headline}</p>}
            {collection.description && <p className="mt-5 text-[15px] leading-relaxed text-ink-soft md:text-base">{collection.description}</p>}
          </div>
        </section>
      )}

      {/* Campanha */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-2">
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {gallery.map((url, i) => (
              <li key={url} className="zoom-img relative aspect-[4/5] overflow-hidden bg-stone">
                <Image src={url} alt={`${collection.name}, campanha ${i + 1}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-[1600px] px-5 pt-14 md:px-8 md:pt-20">
        <CommercialTerms />
      </section>

      {/* Peças */}
      <section id="pecas" className="mx-auto max-w-[1600px] scroll-mt-20 px-5 py-14 md:px-8 md:py-20">
        <SectionHeading title={heading} link={{ href: "/catalogo", label: "Receber catálogo completo" }} />

        {categories.length > 0 && (
          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
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
          <p className="mt-10 border-y border-line py-10 text-center text-sm text-ink-soft">
            Nenhuma peça publicada nesta categoria ainda.{" "}
            <Link href="/catalogo" className="underline">
              Peça o catálogo completo
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
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
      className={`label border px-3 py-2 transition ${active ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}
    >
      {children}
    </Link>
  );
}
