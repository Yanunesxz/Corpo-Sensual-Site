import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCollectionBySlug, getCollections, getProducts } from "@/lib/data";
import { collectionShortName, seasonLabel, site } from "@/lib/site";
import { CommercialTerms } from "@/components/commercial-terms";
import { HeroImage } from "@/components/hero-image";
import { ProductGrid } from "@/components/product-grid";
import { CampaignVideo } from "@/components/campaign-video";

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
  // Filmes gravados para a campanha desta coleção. Só a de verão tem ensaio filmado.
  const videos =
    collection.slug === "delicias-de-verao"
      ? [
          { src: "campanha/piquenique", legenda: "Cena de piquenique da campanha" },
          { src: "campanha/familia", legenda: "Crianças brincando de pijama, linha família" },
          { src: "campanha/verao", legenda: "Cena de verão da campanha" },
          { src: "campanha/fabrica", legenda: "Vista aérea da região da fábrica, em Muriaé", comAudio: false },
        ]
      : [];

  return (
    // Efeito do site atual: a foto de campanha fica presa e o conteúdo sobe por cima dela.
    <div className="relative">
      {/* Hero: foto de campanha em bloco cheio, sem cantos arredondados. A altura
          fica sempre dentro da tela — um bloco preso mais alto que a janela esconderia o botão. */}
      <section className="shade shade-hero sticky top-0 h-[70svh] bg-sky-soft md:h-screen">
        {collection.hero_image_url && (
          <HeroImage desktop={collection.hero_image_url} mobile={collection.hero_mobile_url} priority desktopPosition="center 35%" mobilePosition="center 25%" />
        )}
        {/* .label, .h-hero e .link já trazem cor própria: sobre a foto a cor branca vai em cada elemento. */}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-10 md:px-8 md:pb-16">
          <p className="label text-white/90">{seasonLabel(collection.season, collection.year)}</p>
          <h1 className="h-hero mt-2 text-4xl text-white md:text-5xl">{collectionShortName(collection.name)}</h1>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <Link href="/catalogo" className="btn btn-light w-full sm:w-auto">
              Receber catálogo
            </Link>
            <a href="#pecas" className="link self-start text-base text-white sm:self-auto">
              Ver peças
            </a>
          </div>
          <p className="mt-4 text-sm text-white/85">*{site.commercial.salesNote} {site.commercial.noCnpjNote}</p>
        </div>
      </section>

      {/* Fundo opaco: é este bloco que sobe por cima da foto presa */}
      <div className="relative bg-paper">
        {/* Conceito */}
        {collection.headline && (
          <section className="bg-sky">
            <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
              <p className="h-display text-3xl md:text-[2.5rem]">{collection.headline}</p>
            </div>
          </section>
        )}

        {/* Campanha */}
        {gallery.length > 0 && (
          <section className="mx-auto max-w-[1600px] px-5 pt-14 md:px-8 md:pt-20">
            <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
              {gallery.map((url, i) => (
                <li key={url} className="zoom-img relative aspect-[4/5] overflow-hidden rounded-media bg-sky-soft">
                  <Image src={url} alt={`${collection.name}, campanha ${i + 1}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Vídeos da campanha */}
        {videos.length > 0 && (
          <section className="mx-auto max-w-[1600px] px-5 pt-8 md:px-8 md:pt-10">
            <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
              {videos.map((v) => (
                <li key={v.src} className="overflow-hidden rounded-media bg-sky-soft">
                  <CampaignVideo src={v.src} legenda={v.legenda} comAudio={v.comAudio !== false} />
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
          <ProductGrid products={products} categories={categories} title={showingBestSellers ? "Mais vendidas" : "Peças da coleção"} />
        </section>

        {/* Fechamento: como comprar */}
        <section className="bg-sky">
          <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
            <h2 className="h-display text-3xl md:text-[2.5rem]">Quer essas peças na sua loja?</h2>
            <p className="mt-5 max-w-xl text-[1.125rem] leading-[1.6] text-body">
              Cadastre-se e receba o catálogo completo com a tabela de preços.
            </p>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <Link href="/catalogo" className="btn btn-dark w-full whitespace-nowrap sm:w-auto">
                Receber catálogo
              </Link>
              <Link href="/fabrica-de-pijamas#perguntas" className="link self-start whitespace-nowrap text-base sm:self-auto">
                Perguntas frequentes
              </Link>
            </div>
            {others.length > 0 && (
              <p className="mt-8 text-sm text-body">
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
        </section>
      </div>
    </div>
  );
}
