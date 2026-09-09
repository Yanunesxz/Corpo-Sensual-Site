import type { Metadata } from "next";
import Image from "next/image";
import { Steps } from "@/components/steps";
import { LeadForm } from "@/components/lead-form";
import { CommercialTerms } from "@/components/commercial-terms";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Fábrica de pijamas para lojistas",
  description:
    "Compre pijamas, camisolas e robes direto da fábrica. Grade completa, reposição rápida e atendimento por representante em todo o Brasil.",
};

const benefits = [
  "Preço de fábrica, sem intermediários",
  "Grade completa: feminino, masculino, infantil e gestante",
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
      <section className="shade relative h-[60svh] min-h-[420px] bg-stone">
        <Image src="/images/colecoes/frescor-3.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[center_30%]" />
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-10 text-white md:px-8 md:pb-14">
          <p className="label">Fábrica de pijamas</p>
          <h1 className="h-display mt-3 max-w-3xl text-4xl md:text-6xl lg:text-7xl">Pijamas direto da fábrica para a sua loja</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-14 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
        <div>
          <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
            Mais de 25 anos confeccionando moda íntima em Muriaé, MG. Uma marca conhecida nacionalmente, com estrutura
            para atender a sua loja com qualidade e agilidade.
          </p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {benefits.map((b) => (
              <li key={b} className="py-3 text-sm">
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <SectionHeading title="Como funciona" size="sm" />
            <div className="mt-6">
              <Steps steps={steps} />
            </div>
          </div>
        </div>
        <div className="border border-line p-6 md:p-8">
          <h2 className="h-display text-3xl">Quero comprar da fábrica</h2>
          <p className="mt-2 text-sm text-ink-soft">Cadastre-se e receba o contato do representante da sua região.</p>
          <div className="mt-6">
            <LeadForm source="fabrica-de-pijamas" submitLabel="Quero ser lojista" withMessage />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 pb-16 md:px-8">
        <CommercialTerms />
      </section>
    </>
  );
}
