import Image from "next/image";
import Link from "next/link";
import { getCategories, getCollections, getProducts } from "@/lib/data";
import { collectionShortName, seasonLabel, site } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";

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
      {/* Hero: foto em tela cheia, texto no canto inferior */}
      <section className="shade relative h-[85svh] min-h-[520px] bg-stone">
        <Image
          src={current?.hero_image_url ?? "/images/colecoes/frescor-2.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-10 text-white md:px-8 md:pb-14">
          <p className="label">
            {current ? `Nova coleção · ${seasonLabel(current.season, current.year)}` : "Moda íntima"}
          </p>
          <h1 className="h-serif mt-3 text-6xl md:text-8xl lg:text-[9rem]">
            {current ? collectionShortName(current.name) : site.name}
          </h1>
          {current?.headline && <p className="mt-4 max-w-md text-[15px] md:text-base">{current.headline}</p>}
          <div className="mt-6 flex gap-7">
            <Link href={currentHref} className="link text-[13px]">
              Ver coleção
            </Link>
            <Link href="/catalogo" className="link text-[13px]">
              Receber catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias: mosaico com o nome na foto */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-2 pt-2 md:px-2">
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`${currentHref}?categoria=${c.slug}#pecas`} className="shade zoom-img relative block aspect-[4/5] overflow-hidden bg-stone">
                  {c.image_url && (
                    <Image src={c.image_url} alt={c.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  )}
                  <span className="h-display absolute inset-x-0 bottom-5 z-10 text-center text-2xl text-white md:text-3xl">
                    {c.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mais vendidas */}
      {products.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
          <SectionHeading title="Mais vendidas" link={{ href: currentHref, label: "Ver a coleção completa" }} />
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Coleções: dois blocos de foto */}
      {collections.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-2">
          <ul className="grid gap-2 md:grid-cols-2">
            {collections.slice(0, 2).map((c) => (
              <li key={c.id}>
                <Link href={`/colecoes/${c.slug}`} className="shade zoom-img relative block aspect-[4/5] overflow-hidden bg-stone md:aspect-square">
                  {c.hero_image_url && (
                    <Image src={c.hero_image_url} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white md:p-8">
                    <p className="label">{seasonLabel(c.season, c.year)}</p>
                    <p className="h-display mt-2 text-4xl md:text-5xl">{collectionShortName(c.name)}</p>
                    {c.headline && <p className="mt-2 max-w-sm text-sm text-white/90">{c.headline}</p>}
                    <span className="link mt-4 inline-block text-[13px]">Ver coleção</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Lojistas */}
      <section className="mt-16 bg-stone md:mt-24">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
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
              <li className="py-3">{commercial.minOrder}</li>
              <li className="py-3">{commercial.installments}</li>
              <li className="py-3">{commercial.freeShipping}*</li>
            </ul>
            <p className="mt-2 text-[11px] text-ink-soft">{commercial.exclusive} *{commercial.freeShippingNote}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href="/catalogo" className="btn btn-dark">
                Receber catálogo
              </Link>
              <Link href="/fabrica-de-pijamas" className="link text-[13px]">
                Fábrica de pijamas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marca */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
        <p className="font-serif text-2xl italic leading-snug md:text-4xl">
          Confeccionamos conforto e estilo, combinados a tecidos de boa qualidade, design moderno e atenção aos
          detalhes.
        </p>
        <p className="mt-5 text-sm text-ink-soft">Já são mais de 25 anos de expertise dedicados ao bem-estar e à qualidade.</p>
        <Link href="/sobre" className="link mt-6 inline-block text-[13px]">
          Sobre a Corpo Sensual
        </Link>
      </section>
    </>
  );
}
