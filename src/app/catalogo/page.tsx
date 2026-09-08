import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { Steps } from "@/components/steps";
import { LeadForm } from "@/components/lead-form";
import { CommercialTerms } from "@/components/commercial-terms";
import { Reveal } from "@/components/reveal";

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
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-32 md:px-8 md:pt-44">
        <Reveal>
          <SectionHeading
            level="h1"
            eyebrow="Catálogo digital"
            title="Receba nosso catálogo!"
            description="Explore nossa nova coleção recheada de novidades e modelos de pijamas validados no mercado."
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <Steps steps={steps} />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <CommercialTerms />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="relative hidden aspect-[879/808] overflow-hidden rounded-card lg:block">
            <Image src="/images/catalogo-mockup.png" alt="Catálogo digital da Corpo Sensual" fill sizes="50vw" className="object-contain" />
          </Reveal>
          <Reveal delay={100} className="rounded-card border border-line bg-white p-6 shadow-[0_20px_60px_-30px_rgba(28,25,23,0.35)] md:p-8">
            <h2 className="display text-2xl md:text-3xl">Cadastre-se aqui</h2>
            <p className="mt-1 text-sm text-ink-soft">Leva menos de um minuto.</p>
            <div className="mt-6">
              <LeadForm source="catalogo" submitLabel="Quero receber o catálogo" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
