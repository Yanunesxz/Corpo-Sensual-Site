import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Receber catálogo",
  description:
    "Cadastre sua loja e receba o catálogo digital da Corpo Sensual com a nova coleção de pijamas, camisolas e moda íntima e a tabela de preços de atacado.",
};

export default function CatalogoPage() {
  return (
    <>
      <section className="grid lg:grid-cols-2">
        {/* Foto de campanha em bloco cheio: sem cantos arredondados, como no site atual */}
        <div className="relative aspect-[16/10] bg-sky-soft sm:aspect-[16/9] lg:aspect-auto lg:min-h-[85svh]">
          <Image src="/images/colecoes/delicias-3.jpg" alt="Peça da coleção Delícias de Verão" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[center_20%]" />
        </div>
        {/* Formulário dentro do bloco azul-claro */}
        <div className="bg-sky px-5 py-14 md:px-12 md:py-20 lg:px-16">
          <h1 className="h-hero text-[2rem] md:text-[2.375rem]">Receba o catálogo com grade e tabela de preços</h1>
          <p className="mt-5 max-w-md text-[1.0625rem] leading-[1.6] text-body">
            São 145 referências na Delícias de Verão, e o{" "}
            <Link href="/colecoes" className="underline">
              site publica só uma parte
            </Link>
            . Preencha os dados da sua loja: a nossa equipe entra em contato e apresenta o representante da sua região.{" "}
            {site.commercial.noCnpjNote}
          </p>
          <div className="mt-8 max-w-lg">
            {/* Condições comerciais em linha, acima do formulário */}
            <ul className="mb-7 flex flex-col gap-1.5 text-sm leading-relaxed text-body sm:flex-row sm:flex-wrap sm:gap-x-6">
              <li>{site.commercial.noMinOrder}</li>
              <li>{site.commercial.pixDiscount}</li>
              <li>{site.commercial.installments}</li>
              <li>Frete grátis a partir de R$ 1.200,00 no Sudeste</li>
            </ul>
            <LeadForm source="catalogo" submitLabel="Quero receber o catálogo" withMessage />
          </div>
        </div>
      </section>
    </>
  );
}
