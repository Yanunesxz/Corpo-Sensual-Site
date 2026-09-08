import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { Steps } from "@/components/steps";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Programa Cashback",
  description: "Programa de fidelidade da Corpo Sensual para lojistas: parte do valor dos seus pedidos volta como crédito para as próximas compras.",
};

const steps = [
  { title: "Cadastre-se", description: "Informe os dados da sua loja para participar do programa." },
  { title: "Compre normalmente", description: "Faça seus pedidos com o representante ou pela plataforma B2B." },
  { title: "Acumule crédito", description: "Parte do valor volta como cashback para usar nos próximos pedidos." },
];

export default function CashbackPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-32 md:px-8 md:pt-44">
        <Reveal>
          <SectionHeading
            level="h1"
            eyebrow="Programa Cashback"
            title="Quem compra mais, ganha mais"
            description="Nosso programa de fidelidade para lojistas devolve parte do valor de cada pedido em crédito para as próximas compras. As regras, percentuais e prazos são informados pelo seu representante no cadastro."
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <Steps steps={steps} />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="rounded-card bg-ink p-8 text-white md:p-10">
            <p className="eyebrow text-butter">Vantagens</p>
            <ul className="mt-6 space-y-4 text-white/85">
              <li>Crédito automático a cada pedido faturado.</li>
              <li>Saldo consultável com o representante e na plataforma B2B.</li>
              <li>Uso do crédito em qualquer coleção, sem burocracia.</li>
              <li>Condições especiais em lançamentos para participantes.</li>
            </ul>
            <p className="mt-8 text-xs text-white/50">Programa sujeito a regulamento. Consulte as condições vigentes com o seu representante.</p>
          </Reveal>
          <Reveal delay={100} className="rounded-card border border-line bg-white p-6 shadow-[0_20px_60px_-30px_rgba(28,25,23,0.35)] md:p-8">
            <h2 className="display text-2xl md:text-3xl">Quero participar</h2>
            <p className="mt-1 text-sm text-ink-soft">Cadastre a sua loja e receba as regras do programa.</p>
            <div className="mt-6">
              <LeadForm source="programa-cashback" submitLabel="Participar do programa" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
