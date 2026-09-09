import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCollectionBySlug, getCollections, getProducts } from "@/lib/data";
import { collectionShortName, seasonLabel } from "@/lib/site";
import { CommercialTerms } from "@/components/commercial-terms";
import { HeroImage } from "@/components/hero-image";
import { ProductGrid } from "@/components/product-grid";
import { ContactBlock } from "@/components/contact-block";

// Página estática, renovada a cada hora. O filtro por categoria roda no navegador.
export const revalidate = 3600;

type Props = PageProps<"/colecoes/[slug]">;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

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

export default async function ColecaoPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const [categories, ownProducts, collections] = await Promise.all([
    getCategories(),
    getProducts({ collectionId: collection.id }),
    getCollections(),
  ]);

  // Coleção sem peças cadastradas: mostra as mais vendidas para a página não ficar vazia.
  const showingBestSellers = ownProducts.length === 0;
  const products = showingBestSellers ? await getProducts({}) : ownProducts;
  const others = collections.filter((c) => c.id !== collection.id);
  const gallery = collection.gallery_urls ?? [];

  return (
    <>
      {/* Hero */}
      <section className="shade relative h-[70svh] min-h-[460px] max-h-[820px] bg-stone">
        {collection.hero_image_url && (
          <HeroImage desktop={collection.hero_image_url} mobile={collection.hero_mobile_url} priority desktopPosition="center 35%" mobilePosition="center 25%" />
        )}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-8 text-white md:px-8 md:pb-14">
          <p className="label text-[13px]">{seasonLabel(collection.season, collection.year)}</p>
          <h1 className="h-serif mt-2 text-6xl md:text-8xl lg:text-[8rem]">{collectionShortName(collection.name)}</h1>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <Link href="/catalogo" className="btn btn-light w-full sm:w-auto">
              Receber catálogo
            </Link>
            <a href="#pecas" className="link self-start text-[13px] sm:self-auto">
              Ver peças
            </a>
          </div>
        </div>
      </section>

      {/* Conceito */}
      {(collection.headline || collection.description) && (
        <section className="mx-auto grid max-w-[1600px] gap-4 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-[1fr_2fr] lg:gap-6">
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

      <section className="mx-auto max-w-[1600px] px-5 pt-12 md:px-8 md:pt-20">
        <CommercialTerms />
      </section>

      {/* Peças */}
      <section id="pecas" className="mx-auto max-w-[1600px] scroll-mt-20 px-5 py-12 md:px-8 md:py-20">
        <ProductGrid products={products} categories={categories} title={showingBestSellers ? "Mais vendidas" : "Peças da coleção"} />
      </section>

      {/* Fechamento: como comprar e contato */}
      <section className="bg-stone">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="h-display text-3xl md:text-5xl">Quer essas peças na sua loja?</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Vendemos no atacado para lojas com CNPJ. Cadastre-se para receber o catálogo completo com a tabela de
              preços, ou fale com a gente.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <Link href="/catalogo" className="btn btn-dark w-full whitespace-nowrap sm:w-auto">
                Receber catálogo
              </Link>
              <Link href="/fabrica-de-pijamas#perguntas" className="link self-start whitespace-nowrap text-[13px] sm:self-auto">
                Perguntas frequentes
              </Link>
            </div>
            {others.length > 0 && (
              <p className="mt-8 text-sm text-ink-soft">
                Veja também:{" "}
                {others.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && ", "}
                    <Link href={`/colecoes/${c.slug}`} className="underline">
                      {c.name}
                    </Link>
                  </span>
                ))}
                {" · "}
                <Link href="/colecoes" className="underline">
                  Todas as coleções
                </Link>
              </p>
            )}
          </div>
          <ContactBlock compact hideAddress />
        </div>
      </section>
    </>
  );
}
