import type { Metadata } from "next";
import Image from "next/image";
import { Steps } from "@/components/steps";
import { LeadForm } from "@/components/lead-form";
import { CommercialTerms } from "@/components/commercial-terms";

export const metadata: Metadata = {
  title: "Receber catálogo",
  description:
    "Cadastre sua loja e receba acesso ao catálogo digital da Corpo Sensual, com a nova coleção de pijamas, camisolas e moda íntima.",
};

const steps = [
  { title: "Preencha o formulário", description: "Informe os dados da sua loja para nossa equipe conhecer você." },
  { title: "Contato rápido", description: "Nossa equipe faz um contato de 5 minutos por telefone ou WhatsApp." },
  { title: "Acesso ao catálogo", description: "Você recebe o catálogo digital completo, com referências e grade." },
];

export default function CatalogoPage() {
  return (
    <>
      <section className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/5] bg-stone lg:aspect-auto lg:min-h-[85svh]">
          <Image src="/images/colecoes/frescor-1.jpg" alt="Coleção Frescor" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="px-5 py-12 md:px-12 md:py-16 lg:px-16">
          <p className="label">Catálogo digital</p>
          <h1 className="h-display mt-3 text-4xl md:text-6xl">Receba o catálogo da nova coleção</h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Explore a coleção completa, com referências, grade de tamanhos e modelos validados no mercado.
          </p>
          <div className="mt-8">
            <Steps steps={steps} />
          </div>
          <div className="mt-10 max-w-lg">
            <LeadForm source="catalogo" submitLabel="Quero receber o catálogo" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1600px] px-5 pb-16 pt-6 md:px-8">
        <CommercialTerms />
      </section>
    </>
  );
}
