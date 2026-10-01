import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { altFoto } from "@/lib/content/alt-fotos";

export const metadata: Metadata = {
  title: "Sobre a fábrica de pijamas em Muriaé, MG",
  description:
    "Fábrica de pijamas no atacado em Muriaé, MG, há mais de 25 anos. Produção verticalizada, do corte ao pijama pronto, nas linhas feminina, masculina e infantil.",
  alternates: { canonical: "/sobre" },
};

const facts = [
  { label: "Sede e fábrica", value: `${site.legal.cidade}, ${site.legal.uf}, polo nacional de moda íntima` },
  { label: "Tempo de mercado", value: "Mais de 25 anos" },
  { label: "O que fabricamos", value: "Pijamas, short dolls, camisolas e robes" },
  { label: "Linhas", value: "Feminina, masculina e infantil" },
  { label: "Coleções", value: "Duas por ano: primavera/verão e outono/inverno" },
  { label: "Fábrica própria", value: "Produção verticalizada, do corte ao produto final" },
  { label: "Qualidade", value: "Tecidos selecionados, tecnologia anti-pilling e acabamento cuidado" },
  { label: "Como vendemos", value: "No atacado, por grade, por representantes em todo o Brasil" },
  { label: "Condições", value: `${site.commercial.noMinOrder}, ${site.commercial.installments.toLowerCase()} e ${site.commercial.pixDiscount.toLowerCase()}` },
];

export default function SobrePage() {
  return (
    <>
      {/* Abertura da página: único título com .h-hero (letter-spacing do site atual) */}
      <section className="wrap pt-12 pb-14 md:pt-20 md:pb-20" data-barra-depois>
        <h1 className="h-hero max-w-3xl text-[2rem] md:text-[2.375rem]">
          Do corte ao pijama pronto, na nossa fábrica
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-[1.3] text-body">
          Fábrica própria de pijamas, camisolas, robes e moda íntima em {site.legal.cidade}, {site.legal.uf}, polo
          nacional do setor. Há mais de 25 anos produzimos do corte ao produto final e vendemos no atacado para lojistas
          de todo o Brasil, por representantes.
        </p>
      </section>

      <section className="wrap pb-14 md:pb-20">
        <div className="relative aspect-[3/2] overflow-hidden rounded-media bg-sky-soft md:aspect-[16/9]">
          <Image
            src="/images/colecoes/entrelacos-1.jpg"
            alt={altFoto("/images/colecoes/entrelacos-1.jpg", "Coleção Entrelaços")}
            fill
            sizes="100vw"
            className="object-cover object-[center_25%] md:object-[center_30%]"
          />
        </div>
      </section>

      <section className="wrap py-14 md:py-20">
        <h2 className="h-display text-3xl md:text-[2.5rem]">A empresa em resumo</h2>
        <dl className="mt-8 grid border-t border-line sm:grid-cols-2 sm:gap-x-10 md:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="border-b border-line py-5">
              <dt className="label">{f.label}</dt>
              <dd className="mt-1 text-[1.0625rem] leading-[1.5]">{f.value}</dd>
            </div>
          ))}
        </dl>
        <Link href="/fabrica-de-pijamas" className="link mt-6 text-sm">
          Como comprar da fábrica
        </Link>
      </section>

      <section className="bg-sky">
        <div className="wrap flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-24">
          <h2 className="h-display text-3xl md:text-[3.125rem]">
            Corpo Sensual<br />na sua loja?
          </h2>
          <div className="md:max-w-md md:shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo" className="btn btn-dark w-full whitespace-nowrap sm:w-auto">
                Receber catálogo
              </Link>
              <Link href="/contato" className="btn btn-outline w-full whitespace-nowrap sm:w-auto">
                Falar com a gente
              </Link>
            </div>
            <p className="mt-3 text-sm text-body">*{site.commercial.salesNote} {site.commercial.noCnpjNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
