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

const FOTO_CAPA = "/images/colecoes/entrelacos-1.jpg";

/** Campanha: duas fotos de cada coleção, alternando verão e inverno. */
const CAMPANHA = [
  "/images/colecoes/delicias-1.jpg",
  "/images/colecoes/entrelacos-3.jpg",
  "/images/colecoes/delicias-2.jpg",
  "/images/colecoes/entrelacos-4.jpg",
];

/** A empresa em resumo. Só fatos da ESPEC-FINAL (0.1). */
const RESUMO = [
  { rotulo: "Sede e fábrica", valor: `${site.legal.cidade}, ${site.legal.uf}, polo nacional da moda íntima` },
  { rotulo: "Tempo de mercado", valor: "Mais de 25 anos" },
  { rotulo: "O que fabricamos", valor: "Pijamas, camisolas, robes, short dolls e moda íntima" },
  { rotulo: "Linhas", valor: "Feminina, masculina e infantil (menino e menina)" },
  { rotulo: "Coleções", valor: "Duas por ano: primavera/verão e outono/inverno" },
  { rotulo: "Produção", valor: "Corte, costura, revisão, etiqueta e embalagem na fábrica própria" },
  { rotulo: "Qualidade", valor: "Tecidos selecionados e tecnologia anti-pilling" },
  { rotulo: "Como vendemos", valor: "No atacado, por grade, por representantes, para lojas de todo o Brasil" },
  {
    rotulo: "Condições",
    valor: `${site.commercial.noMinOrder}, ${site.commercial.pixDiscount} e ${site.commercial.installments.toLowerCase()}`,
  },
];

export default async function SobrePage() {
  const [collections, categories] = await Promise.all([getCollections(), getCategories()]);
  const atual = collections[0] ?? null;
  const hrefColecao = atual ? `/colecoes/${atual.slug}` : "/colecoes";
  const instagram = site.contact.instagram;

  return (
    <>
      {/* 1. Capa dividida: texto no azul da marca, foto da Entrelaços ao lado (embaixo no celular).
          É o gatilho da barra fixa: ela só aparece depois que a capa inteira sai da tela. */}
      <section className="bg-sky lg:grid lg:grid-cols-2" data-barra-depois>
        <div className="wrap pb-12 pt-10 md:pb-16 md:pt-14 lg:flex lg:items-center lg:py-20 lg:pl-[max(3rem,calc((100vw-1440px)/2+3rem))] lg:pr-14">
          <div className="max-w-[36rem]">
            <SectionHeading
              level="h1"
              revelar={false}
              eyebrow="Sobre a fábrica"
              title="Do corte à caixa lacrada, em Muriaé"
              description="Fábrica própria de pijamas, camisolas, robes, short dolls e moda íntima em Muriaé, MG, polo nacional da moda íntima, há mais de 25 anos. Vendemos no atacado, por grade, para lojas de todo o Brasil, por representantes."
            />
            <div className="mt-8 flex flex-col items-start gap-x-8 gap-y-4 sm:flex-row sm:flex-wrap sm:items-center lg:mt-10">
              <Link href="/catalogo" className="btn btn-primary btn-lg w-full sm:w-auto" data-ga-local="hero">
                Quero receber o catálogo
                <ArrowRight width={18} height={18} className="seta" />
              </Link>
              <Link href="/fabrica-de-pijamas" className="link-seta">
                Como comprar da fábrica
                <ArrowRight width={18} height={18} />
              </Link>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/5] bg-sky-deep md:aspect-[4/3] lg:aspect-auto lg:min-h-[80svh]">
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
            className="object-cover object-[center_62%] lg:object-[center_70%]"
          />
        </div>
      </section>

      {/* 2. Dentro da fábrica: vídeo real, etapas e os números. */}
      <ProducaoSection escuro numeros comLink={false} cta={{ href: "/catalogo", label: "Quero receber o catálogo" }} />

      {/* 3. Linhas: cada uma leva à grade da coleção atual, já filtrada. */}
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

      {/* 4. Campanha: quatro fotos em escada, como página de revista. */}
      <section className="sec bg-sky-soft">
        <div className="wrap">
          <SectionHeading
            eyebrow="Campanha"
            title="Uma marca que se apresenta"
            description={`Cada coleção ganha campanha fotografada e filmada. Acompanhe no Instagram @${instagram}.`}
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

      {/* 5. A empresa em resumo: ficha de fatos. No celular, rótulo e valor na mesma linha. */}
      <section className="sec">
        <div className="wrap">
          <h2 className="t-titulo" data-reveal>
            A empresa em resumo
          </h2>
          <dl className="mt-8 border-t border-line sm:grid sm:grid-cols-2 sm:gap-x-10 lg:mt-12 lg:grid-cols-3" data-reveal>
            {RESUMO.map((f) => (
              <div key={f.rotulo} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 border-b border-line py-4 sm:block sm:py-6">
                <dt className="pt-[3px] text-[13px] leading-[1.4] text-muted sm:pt-0">{f.rotulo}</dt>
                <dd className="text-[17px] leading-[1.5] text-ink sm:mt-1.5">{f.valor}</dd>
              </div>
            ))}
          </dl>
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
          <p className="legenda mt-5">Atacado por grade, sem pedido mínimo. Ainda não tem CNPJ? Fale com a gente.</p>
        </div>
      </section>
    </>
  );
}
