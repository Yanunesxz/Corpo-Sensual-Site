import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategories, getCollections, getProducts } from "@/lib/data";
import { collectionShortName, REFERENCIAS_POR_COLECAO, seasonLabel, site, TOTAL_REFERENCIAS } from "@/lib/site";
import { pecasDaVitrine } from "@/lib/vitrine";
import { faqCurto } from "@/lib/content/faq";
import { altCapa, altFoto } from "@/lib/content/alt-fotos";
import { HeroImage } from "@/components/hero-image";
import { Beneficios } from "@/components/beneficios";
import { ProductGrid } from "@/components/product-grid";
import { ProducaoSection } from "@/components/producao-section";
import { SectionHeading } from "@/components/section-heading";
import { Faq } from "@/components/faq";
import { LeadForm } from "@/components/lead-form";
import { ArrowRight, Check } from "@/components/icons";

// Revalida o catálogo a cada hora sem precisar de novo deploy.
export const revalidate = 3600;

// Título e description vêm do layout (title.default).
export const metadata: Metadata = { alternates: { canonical: "/" } };

const FOTO_HERO = "/images/home/hero-familia.jpg";
const ALT_HERO = "Mãe, filha e filho com pijamas curtos combinando, azuis com short listrado, brincando com bolhas de sabão no gramado";
const FOTO_FECHO = "/images/home/fechamento.jpg";
const ALT_FECHO = "Modelo com conjunto de regata e short brancos molhando o pé na piscina, campanha Delícias de Verão";

/** Como a compra funciona, em três passos curtos (a versão longa está em /fabrica-de-pijamas). */
const PASSOS = [
  { titulo: "Cadastre a sua loja", texto: "Leva um minuto. CNPJ não é obrigatório." },
  { titulo: "Receba o catálogo", texto: "Com as referências, a grade e a tabela de preços." },
  { titulo: "Monte o seu pedido", texto: "Sem valor mínimo, com uma vendedora no WhatsApp." },
];

export default async function HomePage() {
  const [collections, categories, products] = await Promise.all([getCollections(), getCategories(), getProducts({})]);
  const current = collections[0] ?? null;
  const currentHref = current ? `/colecoes/${current.slug}` : "/colecoes";
  const { commercial } = site;

  return (
    <>
      {/* 1. Abertura: proposta de valor, botão e foto da linha família.
          Celular: foto no topo e o texto num painel que sobe por cima dela, para
          título, botão e nota caberem na primeira tela. Desktop: texto à esquerda,
          foto sangrando até a borda direita. */}
      <section className="relative bg-sky" data-barra-depois>
        <div className="lg:grid lg:min-h-[max(36rem,min(calc(100svh-230px),44rem))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="relative h-[40svh] max-h-[400px] min-h-[260px] bg-sky-deep lg:order-2 lg:h-auto lg:max-h-none">
            <HeroImage desktop={FOTO_HERO} alt={ALT_HERO} priority quality={85} sizes="(min-width: 1024px) 52vw, 100vw" desktopPosition="center 45%" mobilePosition="center 38%" />
            <p className="tag absolute left-4 top-4 shadow-sm lg:left-6 lg:top-6">
              <span className="h-1.5 w-1.5 rounded-full bg-noite" aria-hidden />
              {current ? `Nova coleção · ${seasonLabel(current.season, current.year)}` : "Nova coleção"}
            </p>
            {current && (
              <Link
                href={currentHref}
                className="group absolute bottom-6 left-6 hidden items-center gap-4 rounded-card bg-paper/95 p-4 pr-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 lg:flex"
              >
                <span className="relative h-16 w-14 flex-none overflow-hidden rounded-xl bg-sky">
                  <Image src="/images/colecoes/delicias-4.jpg" alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block font-[family-name:var(--font-display)] text-lg leading-tight text-ink">{collectionShortName(current.name)}</span>
                  <span className="mt-0.5 block whitespace-nowrap text-[13px] text-muted">
                    {REFERENCIAS_POR_COLECAO[current.slug] ? `${REFERENCIAS_POR_COLECAO[current.slug]} referências · ` : ""}Ver coleção
                  </span>
                </span>
                <ArrowRight width={18} height={18} className="flex-none text-noite transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          <div className="relative z-10 -mt-7 rounded-t-[1.75rem] bg-sky px-5 pb-9 pt-7 md:px-8 lg:mt-0 lg:flex lg:items-center lg:rounded-none lg:py-16 lg:pl-[max(3rem,calc((100vw-1360px)/2+3rem))] lg:pr-14">
            <div className="max-w-[36rem]">
              <h1>
                <span className="eyebrow">Pijamas e moda íntima no atacado</span>
                <span className="t-hero mt-3 block lg:mt-5">Direto da fábrica para a sua loja</span>
              </h1>
              <p className="lead mt-4 lg:mt-6">
                Pijamas, camisolas, robes e short dolls nas linhas feminina, masculina e infantil. Compre por grade, sem
                pedido mínimo.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-9">
                <Link href="/catalogo" className="btn btn-primary btn-lg w-full whitespace-nowrap sm:w-auto" data-ga-local="hero">
                  Quero receber o catálogo
                  <ArrowRight width={18} height={18} className="seta" />
                </Link>
                <a href="#pecas" className="btn btn-outline btn-lg hidden whitespace-nowrap sm:inline-flex">
                  Ver as mais pedidas
                </a>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted lg:mt-4">
                Grátis e leva 1 minuto. Com grade e tabela de preços. {commercial.noCnpjNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. As quatro condições, logo abaixo da dobra: respondem "tem mínimo? e o frete?" */}
      <section className="border-b border-line bg-paper" aria-label="Condições para lojistas">
        <div className="wrap py-8 lg:py-11">
          <Beneficios />
        </div>
      </section>

      {/* 3. Vitrine: as mais vendidas em cotas 6/6/3/3, com filtro por linha. */}
      <section id="pecas" className="sec scroll-mt-20">
        <div className="wrap">
          <ProductGrid
            variant="vitrine"
            products={pecasDaVitrine(products)}
            categories={categories}
            eyebrow="Mais vendidas"
            title="As mais pedidas pelos lojistas"
            description={`Uma amostra das ${TOTAL_REFERENCIAS} referências do ano, as mais vendidas primeiro. O catálogo traz todas, com grade e preços.`}
          />
        </div>
      </section>

      {/* 4. As três linhas: um fornecedor para a família inteira. */}
      {categories.length > 0 && (
        <section className="bg-sky-soft">
          <div className="wrap sec">
            <SectionHeading
              eyebrow="Uma fábrica, três linhas"
              title="Feminino, masculino e infantil no mesmo pedido"
              description="Peças que combinam para a família inteira: a sua loja atende a mãe, o pai e as crianças com um fornecedor só."
            />
            <ul className="mt-8 grid grid-cols-3 gap-2.5 md:mt-10 md:gap-5">
              {categories.map((c, i) => (
                <li key={c.id} data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
                  <Link href={`${currentHref}?categoria=${c.slug}#pecas`} className="group block">
                    <span className="zoom-img relative block aspect-[3/4] overflow-hidden rounded-media bg-sky md:aspect-[4/5]">
                      {c.image_url && (
                        <Image src={c.image_url} alt={altFoto(c.image_url, c.name)} fill sizes="(min-width: 1360px) 420px, 33vw" className="object-cover object-[center_30%]" />
                      )}
                    </span>
                    <span className="mt-3 flex items-center justify-between gap-2">
                      <span className="font-[family-name:var(--font-display)] text-base text-ink md:text-2xl">{c.name}</span>
                      <ArrowRight width={20} height={20} className="hidden flex-none text-noite transition-transform group-hover:translate-x-1 md:block" />
                    </span>
                    {c.slug === "infantil" && <span className="block text-[13px] text-muted md:text-sm">Menino e menina</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 5. Prova de estrutura: o vídeo da produção, os números e o botão. */}
      <ProducaoSection escuro numeros cta={{ href: "/catalogo", label: "Quero receber o catálogo" }} />

      {/* 6. As duas coleções do ano. */}
      {collections.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <SectionHeading
              eyebrow="Duas coleções por ano"
              title="Coleção nova a cada estação"
              description="Verão e inverno, cada uma com campanha fotografada e filmada. No site você vê uma parte; o catálogo traz todas as referências."
              link={{ href: "/colecoes", label: "Ver as coleções" }}
            />
            <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-5">
              {collections.slice(0, 2).map((c) => {
                const foto = c.hero_mobile_url || c.hero_image_url;
                const refs = REFERENCIAS_POR_COLECAO[c.slug];
                return (
                  <li key={c.id} data-reveal>
                    <Link href={`/colecoes/${c.slug}`} className="shade zoom-img group relative block aspect-[5/4] overflow-hidden rounded-card bg-sky md:aspect-[5/6] lg:aspect-[6/5]">
                      {foto && <Image src={foto} alt={altCapa(c.slug, c.name)} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[center_28%]" />}
                      <span className="absolute left-4 top-4 z-10 tag md:left-6 md:top-6">{seasonLabel(c.season, c.year)}</span>
                      <span className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 text-white md:p-8">
                        <span>
                          <span className="block font-[family-name:var(--font-display)] text-[2rem] leading-none md:text-[2.5rem]">{collectionShortName(c.name)}</span>
                          {refs && <span className="mt-2 block text-[15px] text-white/90">{refs} referências</span>}
                        </span>
                        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-paper text-noite transition-transform group-hover:translate-x-1">
                          <ArrowRight width={20} height={20} />
                          <span className="sr-only">Ver coleção</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* 7. Objeções: as cinco dúvidas que seguram o primeiro pedido, e como comprar. */}
      <section id="perguntas" className="scroll-mt-20 bg-areia">
        <div className="wrap sec grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="Antes do primeiro pedido" title="O que todo lojista pergunta" />
            <ol className="mt-8 space-y-5">
              {PASSOS.map((p, i) => (
                <li key={p.titulo} className="flex gap-4">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-noite font-[family-name:var(--font-button)] text-sm text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1.5">
                    <span className="block font-medium text-ink">{p.titulo}</span>
                    <span className="block text-[15px] text-body">{p.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-[15px] text-body">
              Outra dúvida?{" "}
              <Link href="/fabrica-de-pijamas#perguntas" className="link">
                Veja todas as perguntas
              </Link>{" "}
              ou{" "}
              <Link href="/contato" className="link">
                fale com a gente
              </Link>
              .
            </p>
          </div>
          <Faq items={faqCurto} abrirPrimeira />
        </div>
      </section>

      {/* 8. Fecho: o formulário na própria home, sem mais um clique até o catálogo. */}
      <section id="receber" className="scroll-mt-20 bg-sky" data-sem-barra>
        <div className="wrap sec grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="relative hidden overflow-hidden rounded-card bg-sky-deep lg:block">
            <Image src={FOTO_FECHO} alt={ALT_FECHO} fill sizes="(min-width: 1360px) 620px, 45vw" className="object-cover object-[center_35%]" />
            <ul className="absolute inset-x-6 bottom-6 space-y-2 rounded-card bg-paper/95 p-5 text-[15px] text-ink shadow-[var(--shadow-card)]">
              {["Sem pedido mínimo", "Frete grátis a partir de R$ 1.200 no Sudeste", "5% de desconto no Pix", "Referências a pronta entrega"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <Check width={18} height={18} className="flex-none text-noite" strokeWidth={2} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Catálogo digital</p>
            <h2 className="t-titulo mt-3">Receba o catálogo completo com a tabela de preços</h2>
            <p className="lead mt-4">
              As {TOTAL_REFERENCIAS} referências das duas coleções, com grade de tamanhos e preços de atacado. Depois do
              cadastro, você escolhe com quem falar no WhatsApp.
            </p>
            <div className="mt-7 rounded-card bg-paper p-5 shadow-[var(--shadow-card)] md:p-8">
              <LeadForm source="catalogo" submitLabel="Quero receber o catálogo" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
