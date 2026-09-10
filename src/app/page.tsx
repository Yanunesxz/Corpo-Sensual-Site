import Image from "next/image";
import Link from "next/link";
import { getCategories, getCollections, getProducts } from "@/lib/data";
import { collectionShortName, seasonLabel, site, TOTAL_REFERENCIAS } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { HeroImage } from "@/components/hero-image";
import { ProducaoSection } from "@/components/producao-section";

// Revalida o catálogo a cada hora sem precisar de novo deploy.
export const revalidate = 3600;

export default async function HomePage() {
  const [collections, categories, products] = await Promise.all([
    getCollections(),
    getCategories(),
    getProducts({ limit: 10 }),
  ]);
  const current = collections[0] ?? null;
  const currentHref = current ? `/colecoes/${current.slug}` : "/colecoes";
  const outras = collections.filter((c) => c.id !== current?.id).slice(0, 2);
  const { commercial } = site;

  return (
    <>
      {/* Hero como no site atual: fundo azul-claro, título escuro, botão escuro e nota */}
      <section className="bg-sky">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <p className="label">
              {current ? `Nova coleção · ${seasonLabel(current.season, current.year)}` : "Moda íntima"}
            </p>
            <h1 className="h-hero mt-3 text-[2rem] md:text-[2.375rem]">
              <span className="sr-only">Corpo Sensual, fábrica de pijamas e moda íntima. Nova coleção </span>
              {current ? collectionShortName(current.name) : site.name}
            </h1>
            {current?.headline && <p className="mt-4 text-lg leading-[1.3] text-body">{current.headline}</p>}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
              <Link href="/catalogo" className="btn btn-dark w-full sm:w-auto">
                Receber catálogo
              </Link>
              <Link href={currentHref} className="link self-start text-[15px] sm:self-auto">
                Ver coleção
              </Link>
            </div>
            <p className="mt-5 text-sm text-body">*{commercial.salesNote} {commercial.noCnpjNote}</p>
          </div>
        </div>
      </section>

      {/* Foto de campanha em bloco cheio, logo abaixo do hero (sem cantos, como no site atual) */}
      <div className="relative h-[70svh] max-h-[860px] min-h-[420px] bg-sky-soft md:h-[80svh]">
        <HeroImage
          desktop={current?.hero_image_url ?? "/images/colecoes/delicias-campanha.jpg"}
          mobile={current?.hero_mobile_url}
          priority
          desktopPosition="center 35%"
          mobilePosition="center 25%"
        />
      </div>

      {/* Quem somos, em uma linha, para quem chega pelo celular */}
      <section className="bg-sky-soft">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:gap-10 md:px-8 md:py-20">
          <p className="max-w-2xl text-[1.125rem] leading-[1.6]">
            <strong className="font-medium">Fábrica própria de pijamas e moda íntima</strong> em Muriaé, MG, há mais de 25 anos. Produção
            verticalizada, do fio ao produto final. Vendemos no atacado para lojas de todo o Brasil.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/fabrica-de-pijamas" className="link text-[15px]">
              Sou lojista
            </Link>
            <Link href="/contato" className="link text-[15px]">
              Fale conosco
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias: foto de estúdio com o nome abaixo */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
          {/* As fotos levam à coleção já filtrada, que mostra só uma parte. Deixa isso claro. */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <p className="label max-w-xl">Aqui aparece uma parte de cada linha.</p>
            <Link href="/colecoes" className="link text-[15px]">
              Ver as coleções
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
            {categories.map((c, i) => {
              // Com três linhas, a última sobraria sozinha na grade de duas colunas
              // do celular: ela ocupa a largura toda, numa faixa mais baixa.
              const sozinha = categories.length % 2 === 1 && i === categories.length - 1;
              return (
              <li key={c.id} className={sozinha ? "col-span-2 lg:col-span-1" : undefined}>
                <Link href={`${currentHref}?categoria=${c.slug}#pecas`} className="group block">
                  <span className={`zoom-img relative block overflow-hidden rounded-media bg-sky-soft ${sozinha ? "aspect-[16/10] lg:aspect-[4/5]" : "aspect-[4/5]"}`}>
                    {c.image_url && (
                      <Image src={c.image_url} alt={c.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-[center_30%]" />
                    )}
                  </span>
                  <span className="h-display mt-3 block text-2xl transition-opacity group-hover:opacity-60 md:text-[1.75rem]">
                    {c.name}
                  </span>
                </Link>
              </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Mais vendidas: 4 no celular, 9 no tablet, 10 no desktop */}
      {products.length > 0 && (
        <section className="bg-sky-soft">
          <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
            <SectionHeading
              title="As que mais saem nas lojas"
              link={{ href: currentHref, label: "Ver mais referências" }}
              description={`Uma amostra do que mais sai. O mix tem ${TOTAL_REFERENCIAS} referências entre verão e inverno, e o catálogo digital traz todas, com grade e tabela de preços.`}
            />
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-5 max-md:[&>*:nth-child(n+5)]:hidden md:max-lg:[&>*:nth-child(10)]:hidden">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-8 md:hidden">
              <Link href={currentHref} className="btn btn-outline w-full">
                Ver mais peças da coleção
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Coleções: só as que ainda não apareceram no topo */}
      {outras.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
          <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
            {outras.map((c) => {
              const photo = c.hero_mobile_url || c.hero_image_url;
              return (
                <li key={c.id}>
                  <Link
                    href={`/colecoes/${c.slug}`}
                    className="shade zoom-img relative block aspect-[4/5] overflow-hidden rounded-media bg-sky-soft md:aspect-square"
                  >
                    {photo && <Image src={photo} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[center_25%]" />}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-8">
                      <p className="label text-white/85">{seasonLabel(c.season, c.year)}</p>
                      <p className="h-display mt-2 text-3xl text-white md:text-[2.5rem]">{collectionShortName(c.name)}</p>
                      {c.headline && <p className="mt-2 max-w-sm text-[15px] leading-[1.5] text-white/90">{c.headline}</p>}
                      <span className="link mt-3 inline-block text-[15px] text-white">Ver coleção</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Vídeo real da produção: a peça sendo confeccionada, embalada e despachada */}
      <ProducaoSection fundo="bg-paper" />

      {/* Lojistas: seção de destaque, no azul-claro cheio */}
      <section className="bg-sky">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:gap-16">
          <h2 className="h-display text-4xl md:text-[3.125rem]">
            Teste a marca sem<br />pedido mínimo
          </h2>
          <div className="max-w-md">
            <p className="text-[1.125rem] leading-[1.6]">
              Cadastre a sua loja e receba o catálogo digital e o contato do representante da região. 5% no Pix e troca em até 15 dias após receber, se a peça vier com defeito de fabricação.
            </p>
            {/* Divisória mais escura que a padrão para aparecer sobre o azul-claro */}
            <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-base leading-[1.5]">
              <li className="py-3">{commercial.wholesaleNote}</li>
              <li className="py-3">{commercial.pixDiscount}</li>
              <li className="py-3">{commercial.installments}</li>
              <li className="py-3">{commercial.freeShipping}*</li>
            </ul>
            <p className="mt-3 text-sm text-body">*{commercial.freeShippingNote}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <Link href="/catalogo" className="btn btn-dark w-full whitespace-nowrap sm:w-auto">
                Receber catálogo
              </Link>
              <Link href="/fabrica-de-pijamas#perguntas" className="link self-start whitespace-nowrap text-[15px] sm:self-auto">
                Perguntas frequentes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
