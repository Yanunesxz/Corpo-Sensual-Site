import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCollectionBySlug, getCollections, getProducts } from "@/lib/data";
import { collectionShortName, REFERENCIAS_POR_COLECAO, seasonLabel, site, TOTAL_REFERENCIAS, urlImagem } from "@/lib/site";
import { altCapa } from "@/lib/content/alt-fotos";
import { capaVertical } from "@/lib/content/capas";
import { trilhaJsonLd } from "@/lib/schema";
import { pecasDaVitrine } from "@/lib/vitrine";
import { JsonLd } from "@/components/json-ld";
import { HeroImage } from "@/components/hero-image";
import { Condicoes } from "@/components/condicoes";
import { ProductGrid } from "@/components/product-grid";
import { BlocoCadastro } from "@/components/bloco-cadastro";
import { ArrowRight } from "@/components/icons";
import { CampanhaColecao } from "@/components/colecao/campanha";
import { VejaTambem } from "@/components/colecao/veja-tambem";

// Página estática, renovada a cada hora. O filtro por categoria roda no navegador.
export const revalidate = 3600;

type Props = PageProps<"/colecoes/[slug]">;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

/**
 * Título, description e imagem de prévia de cada coleção para o Google e o WhatsApp.
 * A prévia é um recorte de 1200x630 com menos de 150 KB: a foto de campanha original
 * pesa demais e o WhatsApp mostra o link sem foto.
 * Coleção nova: acrescente a entrada aqui e gere a imagem em public/images/og
 * (conferindo se os rostos ficam no quadro). Sem entrada, vale o título calculado.
 */
const SEO_COLECAO: Record<string, { title: string; description: string; og: string }> = {
  "delicias-de-verao": {
    title: "Pijamas Delícias de Verão 2027 no atacado",
    description: `Primavera/Verão 2027: ${REFERENCIAS_POR_COLECAO["delicias-de-verao"]} referências de pijamas, short dolls, camisolas e robes feitos em Muriaé, MG. Atacado para lojistas, sem pedido mínimo.`,
    og: "/images/og/delicias-de-verao.jpg",
  },
  entrelacos: {
    title: "Pijamas Entrelaços Inverno 2026 no atacado",
    description: `Outono/Inverno 2026: ${REFERENCIAS_POR_COLECAO.entrelacos} referências de pijamas, camisolas e robes nas linhas feminina, masculina e infantil. Atacado para lojistas, sem pedido mínimo.`,
    og: "/images/og/entrelacos.jpg",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Coleção não encontrada" };
  const seo = Object.hasOwn(SEO_COLECAO, slug) ? SEO_COLECAO[slug] : null;
  const nome = collectionShortName(collection.name);
  const estacao = collection.season === "verao" ? "verão" : collection.season === "inverno" ? "inverno" : null;
  const titulo =
    estacao && !nome.toLowerCase().includes(estacao) ? `${nome}: pijamas de ${estacao} no atacado` : `${nome}: pijamas no atacado`;
  const imagem = seo
    ? { url: urlImagem(seo.og), width: 1200, height: 630, alt: collection.name }
    : collection.hero_image_url
      ? { url: urlImagem(collection.hero_image_url), alt: collection.name }
      : null;
  return {
    title: seo?.title ?? titulo,
    // A descrição longa vem antes da chamada: é ela que cita pijamas, camisolas e robes.
    description: seo?.description ?? collection.description ?? collection.headline ?? undefined,
    // ?categoria= é só um filtro da mesma página: o canonical fica sem ele.
    alternates: { canonical: `/colecoes/${collection.slug}` },
    // O openGraph da página substitui o do layout inteiro, então repete type, locale e siteName.
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.name,
      ...(imagem ? { images: [imagem] } : {}),
    },
  };
}

/** Ponto de interesse da capa em cada coleção (rosto no quadro, nos dois recortes). */
const FOCO_CAPA: Record<string, { tela: string; celular: string }> = {
  "delicias-de-verao": { tela: "30% 35%", celular: "center 25%" },
  // Entrelaços: a foto larga é em pé (2:3); a 36% os dois rostos (mãe e filha) ficam no quadro.
  entrelacos: { tela: "center 36%", celular: "center 22%" },
};

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

  const nome = collectionShortName(collection.name);
  const referenciasDaColecao = !showingBestSellers && Object.hasOwn(REFERENCIAS_POR_COLECAO, collection.slug) ? REFERENCIAS_POR_COLECAO[collection.slug] : null;
  const foco = Object.hasOwn(FOCO_CAPA, collection.slug) ? FOCO_CAPA[collection.slug] : { tela: "center 35%", celular: "center 25%" };

  return (
    // Efeito do site atual: a foto de campanha fica presa e o conteúdo sobe por cima dela.
    <div className="relative">
      <JsonLd data={trilhaJsonLd([["Coleções", "/colecoes"], [collectionShortName(collection.name), `/colecoes/${collection.slug}`]])} />

      {/* 1. Capa presa. A altura fica sempre dentro da tela: um bloco preso mais alto
          que a janela esconderia o botão. No tablet e no desktop desconta o cabeçalho
          (faixa de 44 px + barra de 64/72 px), para o botão e a nota caberem na primeira tela. */}
      {/* No desktop o degradê vem da esquerda (.shade-lado), onde fica o texto: o resto da foto
          fica com a cor da campanha. No celular, o de baixo para cima (.shade-capa). */}
      <section className="shade-capa shade-lado sticky top-0 h-[70svh] overflow-hidden bg-sky md:h-[calc(100svh-6.75rem)] md:min-h-[34rem] lg:h-[calc(100svh-7.25rem)]">
        {collection.hero_image_url && (
          <HeroImage
            desktop={collection.hero_image_url}
            mobile={capaVertical(collection)}
            alt={altCapa(collection.slug, collection.name)}
            priority
            desktopPosition={foco.tela}
            mobilePosition={foco.celular}
          />
        )}
        {/* Celular baixo (iPhone SE, 360x640): o bloco de texto ocupa quase toda a capa e o
            rótulo de 12 px cai na parte clara do degradê. Reforço só nessas telas. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-linear-to-t from-noite/50 via-noite/30 via-60% to-transparent max-md:[@media(max-height:760px)]:block"
        />
        <div className="on-photo wrap absolute inset-x-0 bottom-0 z-10 pb-8 text-white md:pb-14 lg:pb-16">
          <p className="eyebrow text-white">{seasonLabel(collection.season, collection.year)}</p>
          <h1 className="t-hero mt-3 max-w-[14ch] text-white">{nome}</h1>
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-8 md:mt-8">
            <Link href="/catalogo" className="btn btn-light btn-lg w-full sm:w-auto" data-ga-local="hero">
              Quero receber o catálogo
              <ArrowRight width={18} height={18} className="seta" />
            </Link>
            <a href="#pecas" className="link text-white">
              Ver as peças
            </a>
          </div>
          <p className="mt-4 text-[13px] leading-snug text-white md:mt-5">Atacado por grade, sem pedido mínimo.</p>
        </div>
      </section>

      {/* Fundo opaco: é este bloco que sobe por cima da foto presa. */}
      <div className="relative bg-paper">
        {/* 2. Manifesto. O gatilho da barra fica aqui: a capa é presa e nunca sai da tela. */}
        {collection.headline && (
          <section className="bg-sky" data-barra-depois>
            <div className="wrap py-10 text-center md:py-[5.5rem] lg:py-[7.5rem]">
              <p className="t-titulo mx-auto max-w-[24ch]">{collection.headline}</p>
            </div>
          </section>
        )}

        {/* 3. Condições, logo depois do manifesto. Em areia: entre o azul do manifesto e o
            branco da grade (os chips presos da grade têm fundo branco), nada se repete. */}
        <section aria-label="Condições para lojistas" className="bg-areia" data-barra-depois={collection.headline ? undefined : ""}>
          <div className="wrap py-8 lg:py-11">
            <Condicoes variante="faixa" />
          </div>
        </section>

        {/* 4. Peças antes da inspiração. */}
        {/* cv-auto: a grade só é montada quando chega perto da tela (os chips presos continuam presos). */}
        <section id="pecas" className="cv-auto sec [contain-intrinsic-size:auto_1930px] md:[contain-intrinsic-size:auto_2800px] lg:[contain-intrinsic-size:auto_1500px] xl:[contain-intrinsic-size:auto_1700px]">
          {/* Os chips da grade ficam presos sob o cabeçalho no celular (top-16). */}
          <div className="wrap">
            <ProductGrid
              // Só as peças que a grade pode mostrar, com ou sem filtro (6/6/3/3): o resultado
              // na tela é o mesmo e o HTML não leva a coleção inteira ao navegador.
              products={pecasDaVitrine(products)}
              categories={categories}
              variant="grade"
              eyebrow={showingBestSellers ? "Mais vendidas" : "Peças da coleção"}
              title={showingBestSellers ? "As mais pedidas pelos lojistas" : "As mais vendidas"}
              description={
                referenciasDaColecao
                  ? `Uma amostra das ${referenciasDaColecao} referências desta coleção. O catálogo digital traz todas, com grade e preços.`
                  : `Uma amostra. São ${TOTAL_REFERENCIAS} referências no ano, e o catálogo digital traz todas.`
              }
            />
          </div>
        </section>

        {/* 5. Campanha: fotos em composição e filmes. Reserva de altura perto da real (com e
            sem filmes): com a reserva errada, a página pulava ao voltar. */}
        {(gallery.length > 0 || videos.length > 0) && (
          <section
            className={`cv-auto sec bg-areia ${
              videos.length > 0
                ? "[contain-intrinsic-size:auto_1400px] md:[contain-intrinsic-size:auto_2180px] lg:[contain-intrinsic-size:auto_1900px] xl:[contain-intrinsic-size:auto_2300px]"
                : "[contain-intrinsic-size:auto_880px] md:[contain-intrinsic-size:auto_1610px] lg:[contain-intrinsic-size:auto_1460px] xl:[contain-intrinsic-size:auto_1750px]"
            }`}
          >
            <div className="wrap">
              {/* As capas vão junto: no celular a galeria não repete a foto da capa. */}
              <CampanhaColecao
                nome={collection.name}
                fotos={gallery}
                videos={videos}
                capas={{ tela: collection.hero_image_url, celular: capaVertical(collection) }}
              />
            </div>
          </section>
        )}

        {/* 6. Fecho com formulário (origem "colecao"). A barra fixa some aqui. */}
        <section className="sec bg-sky" data-sem-barra>
          <div className="wrap grid gap-y-8 md:gap-y-10 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-10 lg:gap-y-0">
            <div className="lg:col-span-5 lg:row-start-2" data-reveal>
              <h2 className="t-titulo max-w-[14ch]">Quer essas peças na sua loja?</h2>
              <p className="lead mt-4 max-w-md">Cadastre a sua loja e receba o catálogo completo com a tabela de preços.</p>
            </div>
            <BlocoCadastro source="colecao" submitLabel="Quero receber o catálogo" className="lg:col-span-7 lg:col-start-6 lg:row-span-4 lg:row-start-1 xl:col-span-6 xl:col-start-7" />
            <VejaTambem outras={others} className="lg:col-span-5 lg:row-start-3 lg:mt-12" />
          </div>
        </section>
      </div>
    </div>
  );
}
