import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Figura } from "@/components/figura";
import { ArrowRight } from "@/components/icons";
import { Linhas } from "@/components/linhas";
import { ProducaoSection } from "@/components/producao-section";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getCollections } from "@/lib/data";
import { site } from "@/lib/site";
import { altFoto } from "@/lib/content/alt-fotos";

export const metadata: Metadata = {
  title: "Sobre a fábrica de pijamas em Muriaé, MG",
  description:
    "Fábrica de pijamas no atacado em Muriaé, MG, há mais de 25 anos. Produção verticalizada, do corte ao pijama pronto, nas linhas feminina, masculina e infantil.",
  alternates: { canonical: "/sobre" },
};

/* As linhas vêm do catálogo (Supabase), como na home: a página se refaz a cada hora. */
export const revalidate = 3600;

/** Mãe e filha de frente, os dois rostos à vista (a foto de costas era uma mancha sob o degradê). */
const FOTO_CAPA = "/images/colecoes/entrelacos-2.jpg";

/**
 * Campanha: duas fotos de cada coleção, alternando verão e inverno. Nenhuma repete as de
 * "Uma fábrica, três linhas", logo acima (a delicias-2 é a mesma foto do cartão Feminino).
 */
const CAMPANHA = [
  "/images/colecoes/delicias-1.jpg",
  "/images/colecoes/entrelacos-3.jpg",
  "/images/colecoes/delicias-4.jpg",
  "/images/colecoes/entrelacos-4.jpg",
];

/**
 * A sede, vista de drone: em pé (3:5) e deitada (6:5). Lado a lado na mesma altura, a em pé
 * ocupa 1/3 da largura e a deitada 2/3, e as duas proporções fecham sem corte.
 * As originais chegaram em 228 px de largura e foram ampliadas 4x com Real-ESRGAN (ver README):
 * servem até uns 450 px de largura na tela; não as use em bloco cheio.
 */
const SEDE = [
  { src: "/images/sobre/predio-alto.jpg", sizes: "(min-width: 1024px) 17vw, 30vw" },
  { src: "/images/sobre/predio-frente.jpg", sizes: "(min-width: 1024px) 35vw, 60vw" },
];


export default async function SobrePage() {
  const [collections, categories] = await Promise.all([getCollections(), getCategories()]);
  const atual = collections[0] ?? null;
  const hrefColecao = atual ? `/colecoes/${atual.slug}` : "/colecoes";
  const instagram = site.contact.instagram;

  return (
    <>
      {/* 1. Capa dividida: texto no azul da marca, foto da Entrelaços ao lado. No celular a
          foto vem antes, numa faixa (como na home): a primeira tela já mostra moda.
          É o gatilho da barra fixa: ela só aparece depois que a capa inteira sai da tela. */}
      <section className="flex flex-col bg-sky lg:grid lg:grid-cols-2" data-barra-depois>
        <div className="wrap pb-12 pt-7 [@media(max-width:767px)_and_(max-height:700px)]:pt-5 md:pb-16 md:pt-12 lg:flex lg:items-center lg:py-20 lg:max-w-none lg:pl-[max(3rem,calc((100vw-1440px)/2+3rem))] lg:pr-14">
          <div className="max-w-[36rem]">
            <SectionHeading
              level="h1"
              revelar={false}
              eyebrow="Sobre a fábrica"
              title="Fábrica própria em Muriaé, há mais de 25 anos"
              description="Pijamas, camisolas, robes, short dolls e moda íntima, feitos no polo nacional da moda íntima. Vendemos no atacado, por grade, para lojas de todo o Brasil, por representantes."
            />
            {/* Desktop: empilhados até 1439 px e lado a lado (sem quebra) a partir de 1440. Com
                flex-wrap, perto de 1350 px os dois cabiam por um fio numa linha: com a fonte de
                reserva quebravam, com a da marca não, e o bloco inteiro (centralizado na altura)
                pulava 30 px quando a fonte chegava (CLS 0,06 no Lighthouse do desktop). */}
            <div className="mt-8 flex flex-col items-start gap-x-8 gap-y-4 [@media(max-width:767px)_and_(max-height:700px)]:mt-5 sm:flex-row sm:flex-wrap sm:items-center lg:mt-10 lg:flex-col lg:flex-nowrap lg:items-start min-[90rem]:flex-row min-[90rem]:items-center min-[90rem]:gap-x-6">
              <Link href="/catalogo" className="btn btn-primary btn-lg w-full whitespace-nowrap sm:w-auto" data-ga-local="hero">
                Quero receber o catálogo
                <ArrowRight width={18} height={18} className="seta" />
              </Link>
              <Link href="/fabrica-de-pijamas" className="link-seta whitespace-nowrap">
                Como comprar da fábrica
                <ArrowRight width={18} height={18} />
              </Link>
            </div>
          </div>
        </div>
        <div className="relative order-first h-[36svh] max-h-[380px] min-h-[240px] bg-sky-deep [@media(max-width:767px)_and_(max-height:700px)]:h-[20svh] [@media(max-width:767px)_and_(max-height:700px)]:min-h-[128px] md:h-[min(56vw,58svh)] md:max-h-none lg:order-none lg:h-auto lg:max-h-none lg:min-h-[80svh]">
          {/* A única foto priority da página (LCP). Qualidade 75: no celular a diferença para
              80 não aparece e o arquivo cai uns 20 KB. (Testado: fetchPriority="high" junto
              com o priority piorou o LCP simulado do Lighthouse, de 3,6 s para 4,0 s.) */}
          <Image
            src={FOTO_CAPA}
            alt={altFoto(FOTO_CAPA, "Mãe e filha com pijama da coleção Entrelaços")}
            fill
            priority
            quality={75}
            sizes="(min-width: 1024px) 50vw, 100vw"
            // No tablet a faixa é mais larga que alta: sobe um pouco, para as duas cabeças caberem.
            className="object-cover object-[center_35%] md:max-lg:object-[center_30%]"
          />
        </div>
      </section>

      {/* 2. Dentro da fábrica: vídeo real, etapas e os números. */}
      <ProducaoSection escuro numeros comLink={false} cta={{ href: "/catalogo", label: "Quero receber o catálogo" }} />

      {/* 3. A sede: as duas fotos de drone do prédio na mesma altura, sem legenda.
          Desktop: texto e mapa à esquerda, fotos à direita. Celular: texto, fotos, mapa.
          Branca entre o azul-noite da produção e a seção das linhas, também branca: o fio
          do fólio separa as duas. */}
      <section className="sec">
        <div className="wrap grid gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-14 lg:gap-y-6">
          <SectionHeading
            className="lg:col-start-1 lg:row-start-1 lg:self-end"
            eyebrow="A sede"
            title="Tudo sob o mesmo teto, na Rua São Geraldo"
            description={`Prédio próprio no bairro Dornelas, em Muriaé: corte, costura, acabamento, estoque e expedição no mesmo endereço, com energia solar na cobertura. ${site.address.line}.`}
          />
          {/* O quadro 9:5 com colunas 1:2 dá 3:5 à em pé e 6:5 à deitada (o vão some no cover). */}
          <ul className="grid aspect-[9/5] grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-x-3 md:gap-x-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center lg:gap-x-6">
            {SEDE.map((foto, i) => (
              <li key={foto.src} className="h-full" data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
                <Figura
                  src={foto.src}
                  alt={altFoto(foto.src, "Prédio da fábrica Corpo Sensual em Muriaé")}
                  proporcao="h-full"
                  className="h-full"
                  sizes={foto.sizes}
                />
              </li>
            ))}
          </ul>
          <a
            href={site.address.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="link-seta justify-self-start lg:col-start-1 lg:row-start-2 lg:self-start"
          >
            Ver no mapa
            <span className="sr-only"> (abre em outra aba)</span>
            <ArrowRight width={18} height={18} />
          </a>
        </div>
      </section>

      {/* 4. Linhas: cada uma leva à grade da coleção atual, já filtrada. */}
      <section className="sec">
        <div className="wrap">
          <SectionHeading
            eyebrow="Linhas"
            title="Uma fábrica, três linhas"
            description="Pijamas, camisolas, robes, short dolls e moda íntima nas linhas feminina, masculina e infantil, de menino e de menina, com peças que combinam para a família."
          />
          <div className="mt-8 lg:mt-12">
            <Linhas categories={categories} hrefBase={hrefColecao} />
          </div>
        </div>
      </section>

      {/* 5. Campanha: quatro fotos em escada, como página de revista. */}
      {/* Em areia: o fecho logo abaixo é azul-claro (dois azuis seguidos liam como uma faixa só). */}
      <section className="sec bg-areia">
        <div className="wrap">
          <SectionHeading
            eyebrow="Campanha"
            title="Fotografada e filmada a cada coleção"
            description={`Acompanhe as campanhas no Instagram @${instagram}.`}
          />
          <ul className="mt-8 grid grid-cols-2 gap-x-3 md:grid-cols-4 md:gap-x-5 lg:mt-12 lg:gap-x-6">
            {CAMPANHA.map((foto, i) => (
              <li key={foto} className={i % 2 ? "mt-10 md:mt-14 lg:mt-20" : ""} data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
                <Figura src={foto} alt={altFoto(foto, "Foto de campanha da Corpo Sensual")} sizes="(min-width: 1024px) 23vw, 46vw" />
              </li>
            ))}
          </ul>
          <a
            href={`https://www.instagram.com/${instagram}/`}
            target="_blank"
            rel="noreferrer"
            className="link-seta mt-8 lg:mt-4"
          >
            Seguir @{instagram}
            <span className="sr-only"> (abre em outra aba)</span>
            <ArrowRight width={18} height={18} />
          </a>
        </div>
      </section>

      {/* 6. Fecho: a barra fixa some aqui (data-sem-barra), o botão já está na tela. */}
      <section className="sec bg-sky" data-sem-barra>
        <div className="wrap text-center" data-reveal>
          <h2 className="t-titulo mx-auto max-w-[16ch]">A Corpo Sensual na sua loja</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:mt-10">
            <Link href="/catalogo" className="btn btn-primary btn-lg">
              Quero receber o catálogo
              <ArrowRight width={18} height={18} className="seta" />
            </Link>
            <Link href="/contato" className="btn btn-outline btn-lg">
              Falar com a gente
            </Link>
          </div>
          <p className="legenda mt-5">Atacado por grade, direto da fábrica. {site.commercial.noCnpjNote}</p>
        </div>
      </section>
    </>
  );
}
