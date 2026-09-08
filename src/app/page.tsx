import Image from "next/image";
import Link from "next/link";
import { getHomeData } from "@/lib/data";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";
import { LeadForm } from "@/components/lead-form";
import { ArrowRight, BookOpen, Factory, Feather, Leaf, Ruler, Smartphone, Users } from "@/components/icons";

// Revalida o catálogo a cada hora sem precisar de novo deploy.
export const revalidate = 3600;

const collectionFeatures = [
  { icon: Leaf, title: "Tecnologia anti-pilling", text: "Tecidos que não formam bolinhas, mantendo a peça bonita lavagem após lavagem." },
  { icon: Feather, title: "Leve e flexível", text: "Fios mais leves e respiráveis para a temporada de verão, com toque macio." },
  { icon: Ruler, title: "Modelagem alinhada", text: "Peças remodeladas para abraçar melhor o corpo, com caimento perfeito." },
];

const structure = [
  {
    icon: Factory,
    title: "Fábrica própria",
    text: "Produção em Muriaé, MG, um dos maiores polos de moda íntima do país. Controle de qualidade do fio à etiqueta.",
  },
  {
    icon: Smartphone,
    title: "Plataforma B2B digital",
    text: "Representantes e lojistas fazem pedidos online, com catálogo, tabela de preço e acompanhamento em tempo real. Funciona até sem internet.",
  },
  {
    icon: BookOpen,
    title: "Catálogo digital",
    text: "Coleções atualizadas a cada temporada, com fotos, referências e grade completa para facilitar a sua compra.",
  },
  {
    icon: Users,
    title: "Representantes em todo o Brasil",
    text: "Atendimento próximo, na sua região, com reposição rápida e suporte pós-venda.",
  },
];

export default async function HomePage() {
  const { currentCollection, categories, newProducts, featuredProducts } = await getHomeData();
  const collectionHref = currentCollection ? `/colecoes/${currentCollection.slug}` : "/colecoes";
  const heroImage = currentCollection?.hero_image_url ?? "/images/hero-verao.jpg";

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink text-white">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/30 to-ink/25" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 md:px-8 md:pb-24">
          <p className="eyebrow text-butter">
            {currentCollection ? `Coleção ${currentCollection.season === "verao" ? "Verão" : currentCollection.season === "inverno" ? "Inverno" : ""} ${currentCollection.year ?? ""}`.trim() : "Moda íntima"}
          </p>
          <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
            {currentCollection?.name ?? site.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85 md:text-xl">
            {currentCollection?.headline ?? site.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={collectionHref} className="btn btn-light">
              Explorar coleção <ArrowRight width={18} height={18} />
            </Link>
            <Link href="/catalogo" className="btn border border-white/60 text-white hover:bg-white hover:text-ink">
              Receber catálogo
            </Link>
          </div>
        </div>
      </section>

      <Marquee />

      {/* Chegou agora */}
      {newProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Chegou agora" title="Chegaram novas tendências de mercado!" />
            <Link href={collectionHref} className="btn btn-outline">
              Ver coleção completa
            </Link>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-5 md:gap-8 lg:grid-cols-4">
            {newProducts.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Sobre a coleção */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28 lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Sobre a coleção"
              title={currentCollection?.name ?? "Nossa coleção"}
              description={
                currentCollection?.description ??
                "Peças remodeladas para abraçar melhor o corpo, com caimento perfeito e tecidos leves e respiráveis."
              }
            />
            <Link href={collectionHref} className="btn btn-primary mt-8">
              Explorar coleção <ArrowRight width={18} height={18} />
            </Link>
          </Reveal>
          <ul className="grid gap-4">
            {collectionFeatures.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 110} className="flex gap-5 rounded-card border border-line bg-cream p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                  <f.icon />
                </span>
                <div>
                  <h3 className="text-lg font-medium">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Em destaque */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading eyebrow="Em destaque" title="Os mais vendidos com nova modelagem!" />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-5 md:gap-8 lg:grid-cols-4">
            {featuredProducts.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Categorias */}
      {categories.length > 0 && (
        <section className="bg-cream-dark/60">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
            <Reveal>
              <SectionHeading eyebrow="Categorias" title="Linha completa para a temporada" align="center" />
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {categories.map((c, i) => (
                <Reveal key={c.id} delay={i * 90}>
                  <Link
                    href={`${collectionHref}?categoria=${c.slug}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-card bg-ink"
                  >
                    {c.image_url && (
                      <Image
                        src={c.image_url}
                        alt={c.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                      />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-ink/80 to-transparent" aria-hidden />
                    <span className="display absolute bottom-5 left-5 text-3xl text-white">{c.name}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Estrutura */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Estrutura"
              tone="light"
              title="Uma confecção conectada com o mercado"
              description="Mais de 25 anos de fábrica, com processos e tecnologia que dão ao lojista previsibilidade, agilidade e um parceiro sólido para crescer."
            />
          </Reveal>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {structure.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 100} className="rounded-card border border-white/10 bg-white/5 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-butter">
                  <s.icon />
                </span>
                <h3 className="mt-6 text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Receba acesso ao catálogo */}
      <section id="catalogo" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Para lojistas"
              title="Receba acesso ao catálogo"
              description="Ofereça o que há de melhor na moda aos seus clientes. Revenda uma marca forte, já conhecida nacionalmente."
            />
            <div className="relative mt-10 hidden aspect-[879/808] max-w-md lg:block">
              <Image src="/images/catalogo-mockup.png" alt="Catálogo digital da Corpo Sensual" fill sizes="450px" className="object-contain" />
            </div>
          </Reveal>
          <Reveal delay={120} className="relative rounded-card border border-line bg-white p-6 shadow-[0_20px_60px_-30px_rgba(28,25,23,0.35)] md:p-8">
            <p className="display text-2xl">Cadastre-se aqui</p>
            <p className="mt-1 text-sm text-ink-soft">Nossa equipe entra em contato e libera o catálogo digital.</p>
            <div className="mt-6">
              <LeadForm source="catalogo" submitLabel="Quero receber o catálogo" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sobre nós */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Sobre nós</p>
            <p className="display mt-4 text-2xl leading-snug md:text-4xl">
              Confeccionamos conforto e estilo, combinados a tecidos de boa qualidade, designs modernos e atenção aos
              detalhes para oferecer uma experiência excepcional ao consumidor.
            </p>
            <p className="mt-6 text-ink-soft">Já são mais de 25 anos de expertise dedicados ao bem-estar e à qualidade.</p>
            <Link href="/sobre" className="btn btn-outline mt-8">
              Conheça a Corpo Sensual
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
