import type { Metadata } from "next";
import Link from "next/link";
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
      <section className="mx-auto max-w-[1600px] px-5 pt-10 md:px-8 md:pt-16">
        <p className="label">Programa Cashback</p>
        <h1 className="h-display mt-3 max-w-3xl text-4xl md:text-6xl lg:text-7xl">Quem compra mais, ganha mais</h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          Nosso programa de fidelidade para lojistas devolve parte do valor de cada pedido em crédito para as próximas
          compras. Os percentuais, a validade do crédito e as regras completas são informados pelo seu representante no
          cadastro. Exclusivo para lojas com CNPJ ativo.
        </p>
        <a href="#formulario" className="btn btn-dark mt-6 w-full sm:w-auto">
          Quero participar
        </a>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
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
          <p className="mt-3 text-xs text-ink-soft">Programa sujeito a regulamento. Consulte as condições vigentes com o seu representante.</p>
          <p className="mt-6 text-sm text-ink-soft">
            Ainda não é lojista?{" "}
            <Link href="/fabrica-de-pijamas" className="underline">
              Veja como comprar da fábrica
            </Link>
            .
          </p>
        </div>
        <div id="formulario" className="scroll-mt-20 border-y border-line py-8 md:border md:p-8">
          <h2 className="h-display text-2xl md:text-3xl">Quero participar</h2>
          <p className="mt-2 text-sm text-ink-soft">Cadastre a sua loja e receba as regras do programa.</p>
          <div className="mt-6">
            <LeadForm source="programa-cashback" submitLabel="Participar do programa" />
          </div>
        </div>
      </section>
    </>
  );
}
