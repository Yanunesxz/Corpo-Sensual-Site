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
        <div className="relative aspect-[16/10] bg-stone sm:aspect-[16/9] lg:aspect-auto lg:min-h-[85svh]">
          <Image src="/images/colecoes/frescor-1.jpg" alt="Coleção Frescor" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[center_20%]" />
        </div>
        <div className="px-5 py-10 md:px-12 md:py-16 lg:px-16">
          <p className="label">Catálogo digital</p>
          <h1 className="h-display mt-3 text-4xl md:text-6xl">Receba o catálogo da nova coleção</h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Fábrica de pijamas e moda íntima em Muriaé, MG. O catálogo traz a coleção completa, com referências, grade de
            tamanhos e a tabela de preços de atacado. {site.commercial.exclusive}
          </p>
          <div className="mt-8 max-w-lg">
            <LeadForm source="catalogo" submitLabel="Quero receber o catálogo" />
          </div>
          <div className="mt-10">
            <h2 className="h-display text-2xl">Como funciona</h2>
            <div className="mt-4">
              <Steps steps={steps} />
            </div>
          </div>
          <p className="mt-6 text-sm text-ink-soft">
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
      </section>
      <section className="mx-auto max-w-[1600px] px-5 pb-16 pt-6 md:px-8">
        <CommercialTerms />
      </section>
    </>
  );
}
