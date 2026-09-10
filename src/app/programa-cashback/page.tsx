import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Programa Cashback",
  description: "Programa de fidelidade da Corpo Sensual para lojistas: parte do valor dos seus pedidos volta como crédito para as próximas compras.",
};

const perks = [
  "Crédito automático a cada pedido faturado",
  "Saldo consultável com o representante e na plataforma B2B",
  "Uso do crédito em qualquer coleção, sem burocracia",
  "Condições especiais em lançamentos para participantes",
];

export default function CashbackPage() {
  return (
    <>
      <section className="bg-sky">
        <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
          <p className="label">Programa Cashback</p>
          <h1 className="h-hero mt-3 max-w-3xl text-[2rem] md:text-[2.375rem]">Quem compra mais, ganha mais</h1>
          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.6] text-body">
            Nosso programa de fidelidade para lojistas devolve parte do valor de cada pedido em crédito para as próximas
            compras. Os percentuais, a validade do crédito e as regras completas são informados pelo seu representante no
            cadastro.
          </p>
          <a href="#formulario" className="btn btn-dark mt-7 w-full sm:w-auto">
            Quero participar
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="h-display text-2xl md:text-3xl">Vantagens</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {perks.map((p) => (
              <li key={p} className="py-3.5 text-[15px]">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-body">Programa sujeito a regulamento.</p>
          <p className="mt-6 text-sm text-body">
            Ainda não é lojista?{" "}
            <Link href="/fabrica-de-pijamas" className="underline">
              Veja como comprar da fábrica
            </Link>
            .
          </p>
        </div>
        {/* Formulário dentro do bloco azul-claro, com o botão escuro no fim */}
        <div id="formulario" className="scroll-mt-20 rounded-media bg-sky p-6 md:p-8">
          <h2 className="h-display text-3xl md:text-[2.5rem]">Quero participar</h2>
          <div className="mt-7">
            <LeadForm source="programa-cashback" submitLabel="Participar do programa" />
          </div>
        </div>
      </section>
    </>
  );
}
