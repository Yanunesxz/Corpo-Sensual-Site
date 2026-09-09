import type { Metadata } from "next";
import { Steps } from "@/components/steps";
import { LeadForm } from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Programa Cashback",
  description: "Programa de fidelidade da Corpo Sensual para lojistas: parte do valor dos seus pedidos volta como crédito para as próximas compras.",
};

const steps = [
  { title: "Cadastre-se", description: "Informe os dados da sua loja para participar do programa." },
  { title: "Compre normalmente", description: "Faça seus pedidos com o representante ou pela plataforma B2B." },
  { title: "Acumule crédito", description: "Parte do valor volta como cashback para usar nos próximos pedidos." },
];

const perks = [
  "Crédito automático a cada pedido faturado",
  "Saldo consultável com o representante e na plataforma B2B",
  "Uso do crédito em qualquer coleção, sem burocracia",
  "Condições especiais em lançamentos para participantes",
];

export default function CashbackPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-12 md:px-8 md:pt-16">
        <p className="label">Programa Cashback</p>
        <h1 className="h-display mt-3 max-w-3xl text-4xl md:text-6xl lg:text-7xl">Quem compra mais, ganha mais</h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          Nosso programa de fidelidade para lojistas devolve parte do valor de cada pedido em crédito para as próximas
          compras. As regras, percentuais e prazos são informados pelo seu representante no cadastro.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-14 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
        <div>
          <Steps steps={steps} />
          <p className="label mt-10">Vantagens</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {perks.map((p) => (
              <li key={p} className="py-3 text-sm">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-ink-soft">Programa sujeito a regulamento. Consulte as condições vigentes com o seu representante.</p>
        </div>
        <div className="border border-line p-6 md:p-8">
          <h2 className="h-display text-3xl">Quero participar</h2>
          <p className="mt-2 text-sm text-ink-soft">Cadastre a sua loja e receba as regras do programa.</p>
          <div className="mt-6">
            <LeadForm source="programa-cashback" submitLabel="Participar do programa" />
          </div>
        </div>
      </section>
    </>
  );
}
