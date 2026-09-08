import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { Steps } from "@/components/steps";
import { LeadForm } from "@/components/lead-form";
import { CommercialTerms } from "@/components/commercial-terms";
import { Reveal } from "@/components/reveal";
import { Check } from "@/components/icons";

export const metadata: Metadata = {
  title: "Fábrica de pijamas para lojistas",
  description:
    "Compre pijamas, camisolas e robes direto da fábrica. Grade completa, reposição rápida e atendimento por representante em todo o Brasil.",
};

const benefits = [
  "Preço de fábrica, sem intermediários",
  "Grade completa: feminino, masculino, juvenil e gestante",
  "Coleções novas a cada temporada",
  "Reposição rápida das referências que mais vendem",
  "Pedidos online pela plataforma B2B, com acompanhamento",
  "Representante dedicado na sua região",
];

const steps = [
  { title: "Cadastre a sua loja", description: "Preencha o formulário com seus dados e o CNPJ da loja." },
  { title: "Fale com o representante", description: "O representante da sua região apresenta o catálogo, preços e condições." },
  { title: "Faça o primeiro pedido", description: "Escolha as referências, monte a grade e acompanhe a produção e o envio." },
];

export default function FabricaPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src="/images/colecoes/frescor-3.jpg" alt="" fill sizes="100vw" className="object-cover object-[center_30%] opacity-40" priority />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/80 to-ink/30" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-36 md:grid-cols-[1.1fr_1fr] md:px-8 md:pb-28 md:pt-48">
          <Reveal>
            <SectionHeading
              level="h1"
              tone="light"
              eyebrow="Fábrica de pijamas"
              title="Pijamas direto da fábrica para a sua loja"
              description="Mais de 25 anos confeccionando moda íntima em Muriaé, MG. Uma marca conhecida nacionalmente, com estrutura para atender a sua loja com qualidade e agilidade."
            />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-butter text-ink">
                    <Check width={14} height={14} strokeWidth={2.4} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="rounded-card bg-white p-6 text-ink shadow-2xl md:p-8">
            <h2 className="display text-2xl md:text-3xl">Quero comprar da fábrica</h2>
            <p className="mt-1 text-sm text-ink-soft">Cadastre-se e receba o contato do representante da sua região.</p>
            <div className="mt-6">
              <LeadForm source="fabrica-de-pijamas" submitLabel="Quero ser lojista" withMessage />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <CommercialTerms />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading eyebrow="Como funciona" title="Três passos para começar a vender" />
        </Reveal>
        <div className="mt-12">
          <Steps steps={steps} />
        </div>
      </section>
    </>
  );
}
