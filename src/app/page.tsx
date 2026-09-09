import Image from "next/image";
import Link from "next/link";
import { getCategories, getCollections, getProducts } from "@/lib/data";
import { collectionShortName, seasonLabel, site } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { HeroImage } from "@/components/hero-image";

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
  const { commercial } = site;

  return (
    <>
      {/* Hero: foto em tela cheia (vertical no celular), texto no canto inferior */}
      <section className="shade relative h-[80svh] min-h-[520px] max-h-[900px] bg-stone">
        <HeroImage
          desktop={current?.hero_image_url ?? "/images/colecoes/frescor-2.jpg"}
          mobile={current?.hero_mobile_url}
          priority
          desktopPosition="center 35%"
          mobilePosition="center 25%"
        />
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-8 text-white md:px-8 md:pb-14">
          <p className="label">
            {current ? `Nova coleção · ${seasonLabel(current.season, current.year)}` : "Moda íntima"}
          </p>
          <h1 className="h-serif mt-2 text-6xl md:text-8xl lg:text-[9rem]">
            <span className="sr-only">Corpo Sensual, fábrica de pijamas e moda íntima. Nova coleção </span>
            {current ? collectionShortName(current.name) : site.name}
          </h1>
          {current?.headline && <p className="mt-3 max-w-md text-[15px] md:text-base">{current.headline}</p>}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <Link href="/catalogo" className="btn btn-light w-full sm:w-auto">
              Receber catálogo
            </Link>
            <Link href={currentHref} className="link self-start text-[13px] sm:self-auto">
              Ver coleção
            </Link>
          </div>
        </div>
      </section>

      {/* Quem somos, em uma linha, para quem chega pelo celular */}
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="max-w-2xl text-[15px] leading-relaxed">
            <strong className="font-medium">Fábrica de pijamas e moda íntima</strong> em Muriaé, MG, há mais de 25 anos. Vendemos no atacado para
            lojas de todo o Brasil, com coleções novas a cada temporada.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/fabrica-de-pijamas" className="link text-[13px]">
              Sou lojista
            </Link>
            <Link href="/contato" className="link text-[13px]">
              Fale conosco
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias: foto de estúdio com o nome abaixo */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-2 pt-2">
          <ul className="grid grid-cols-2 gap-x-2 gap-y-5 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`${currentHref}?categoria=${c.slug}#pecas`} className="group block">
                  <span className="zoom-img relative block aspect-[4/5] overflow-hidden bg-stone">
                    {c.image_url && (
                      <Image src={c.image_url} alt={c.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                    )}
                  </span>
                  <span className="h-display mt-3 block px-3 text-2xl transition-opacity group-hover:opacity-60 md:text-3xl">
                    {c.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mais vendidas: 6 no celular, 9 no tablet, 10 no desktop */}
      {products.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-24">
          <SectionHeading title="Mais vendidas" link={{ href: currentHref, label: "Ver a coleção completa" }} />
          <p className="mt-3 text-sm text-ink-soft">As peças com maior saída nas lojas neste trimestre. Venda no atacado, para lojas com CNPJ.</p>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-5 [&>*:nth-child(n+7)]:hidden md:[&>*:nth-child(n+7)]:block md:max-lg:[&>*:nth-child(10)]:hidden">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 md:hidden">
            <Link href={currentHref} className="btn btn-outline w-full">
              Ver todas as peças
            </Link>
          </div>
        </section>
      )}

      {/* Coleções: dois blocos de foto */}
      {collections.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-2">
          <ul className="grid gap-2 md:grid-cols-2">
            {collections.slice(0, 2).map((c, i) => {
              // Evita repetir a foto do hero no primeiro bloco.
              const photo = (i === 0 && c.gallery_urls?.[0]) || c.hero_mobile_url || c.hero_image_url;
              return (
                <li key={c.id}>
                  <Link href={`/colecoes/${c.slug}`} className="shade zoom-img relative block aspect-[4/5] overflow-hidden bg-stone md:aspect-square">
                    {photo && <Image src={photo} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[center_25%]" />}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white md:p-8">
                      <p className="label">{seasonLabel(c.season, c.year)}</p>
                      <p className="h-display mt-2 text-4xl md:text-5xl">{collectionShortName(c.name)}</p>
                      {c.headline && <p className="mt-2 max-w-sm text-sm text-white/90">{c.headline}</p>}
                      <span className="link mt-4 inline-block text-[13px]">Ver coleção</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Lojistas */}
      <section className="mt-14 bg-stone md:mt-24">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-14 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
          <h2 className="h-display text-4xl md:text-6xl lg:text-7xl">
            Revenda a<br />Corpo Sensual
          </h2>
          <div className="max-w-md">
            <p className="text-[15px] leading-relaxed">
              Mais de 25 anos de fábrica em Muriaé, MG, uma marca conhecida nacionalmente e coleções novas a cada
              temporada. Cadastre a sua loja para receber o catálogo digital e o contato do representante da sua
              região.
            </p>
            <ul className="mt-8 divide-y divide-line border-y border-line text-sm">
              <li className="py-3">{commercial.exclusive}</li>
              <li className="py-3">{commercial.minOrder}</li>
              <li className="py-3">{commercial.installments}</li>
              <li className="py-3">{commercial.freeShipping}*</li>
            </ul>
            <p className="mt-2 text-xs text-ink-soft">*{commercial.freeShippingNote}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link href="/catalogo" className="btn btn-dark w-full sm:w-auto">
                Receber catálogo
              </Link>
              <Link href="/fabrica-de-pijamas#perguntas" className="link self-start text-[13px] sm:self-auto">
                Perguntas frequentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marca */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center md:py-28">
        <p className="font-serif text-2xl italic leading-snug md:text-4xl">
          Confeccionamos conforto e estilo, combinados a tecidos de boa qualidade, design moderno e atenção aos
          detalhes.
        </p>
        <p className="mt-5 text-sm text-ink-soft">Já são mais de 25 anos de expertise dedicados ao bem‑estar e à qualidade.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/sobre" className="link text-[13px]">
            Sobre a Corpo Sensual
          </Link>
          <Link href="/contato" className="link text-[13px]">
            Onde estamos
          </Link>
        </div>
      </section>
    </>
  );
}
