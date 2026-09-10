import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Steps } from "@/components/steps";
import { LeadForm } from "@/components/lead-form";
import { CommercialTerms } from "@/components/commercial-terms";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Receber catálogo",
  description:
    "Cadastre sua loja e receba o catálogo digital da Corpo Sensual com a nova coleção de pijamas, camisolas e moda íntima e a tabela de preços de atacado.",
};

const steps = [
  { title: "Preencha o formulário", description: "Informe os dados da sua loja para nossa equipe conhecer você." },
  { title: "Contato rápido", description: "Nossa equipe faz um contato de 5 minutos por telefone ou WhatsApp." },
  { title: "Acesso ao catálogo", description: "Você recebe o catálogo digital completo, com referências, grade e tabela de atacado." },
];

export default function CatalogoPage() {
  return (
    <>
      <section className="grid lg:grid-cols-2">
        {/* Foto de campanha em bloco cheio: sem cantos arredondados, como no site atual */}
        <div className="relative aspect-[16/10] bg-sky-soft sm:aspect-[16/9] lg:aspect-auto lg:min-h-[85svh]">
          <Image src="/images/colecoes/frescor-1.jpg" alt="Coleção Frescor" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[center_20%]" />
        </div>
        {/* Formulário dentro do bloco azul-claro */}
        <div className="bg-sky px-5 py-14 md:px-12 md:py-20 lg:px-16">
          <h1 className="h-hero text-[2rem] md:text-[2.375rem]">Receba o catálogo da nova coleção</h1>
          <p className="mt-5 max-w-md text-[1.0625rem] leading-[1.6] text-body">
            Fábrica de pijamas e moda íntima em Muriaé, MG. Só a coleção de verão tem 145 referências, com grade de
            tamanhos e a tabela de preços de atacado. O site publica uma parte delas; o catálogo traz todas.{" "}
            {site.commercial.salesNote} {site.commercial.noCnpjNote}
          </p>
          <div className="mt-8 max-w-lg">
            {/* Os três termos comerciais em linha, acima do formulário */}
            <ul className="mb-7 flex flex-col gap-1.5 text-sm leading-relaxed text-body sm:flex-row sm:flex-wrap sm:gap-x-6">
              <li>{site.commercial.minOrder}</li>
              <li>{site.commercial.installments}</li>
              <li>{site.commercial.freeShipping}</li>
            </ul>
            <LeadForm source="catalogo" submitLabel="Quero receber o catálogo" withMessage />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <h2 className="h-display text-3xl md:text-[2.5rem]">Como funciona</h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.6] text-body">
              Quer ver as peças antes?{" "}
              <Link href="/colecoes" className="underline">
                Veja as coleções
              </Link>
              . Prefere falar com alguém?{" "}
              <Link href="/contato" className="underline">
                Contato
              </Link>
              .
            </p>
          </div>
          <Steps steps={steps} />
        </div>
      </section>

      <section className="bg-sky-soft">
        <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
          <CommercialTerms />
        </div>
      </section>
    </>
  );
}
