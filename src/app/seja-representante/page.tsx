import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quero ser representante",
  description:
    "Trabalhe como representante comercial da Corpo Sensual, fábrica de pijamas e moda íntima em Muriaé, MG. Cadastre a sua região e a nossa equipe comercial entra em contato.",
};

/**
 * Por que representar. Só o que a empresa sustenta: fábrica, mix, condições que o
 * lojista recebe e o app de pedidos que o representante já usa.
 * Nada de comissão, ganho ou exclusividade de região: isso é conversa do gerente
 * comercial, e o CRM tem regra expressa de não prometer território.
 */
const motivos = [
  {
    title: "Fábrica própria há mais de 25 anos",
    description: "Você vende direto de quem fabrica, em Muriaé, MG, com produção do fio ao produto final.",
  },
  {
    title: "Sem pedido mínimo para o lojista",
    description: "Abrir loja nova fica mais fácil: o cliente começa com o valor que quiser.",
  },
  {
    title: "Mix para a família inteira",
    description: "São 210 referências por ano nas linhas feminina, masculina e infantil. Um pedido abastece a loja toda.",
  },
  {
    title: "Duas coleções por ano",
    description: "Motivo certo para voltar a cada cliente na temporada, com lançamento novo no mostruário.",
  },
  {
    title: "Condições que ajudam a fechar",
    description: "5% no Pix, parcelamento sem juros, frete grátis a partir de R$ 1.200 no Sudeste e troca em até 15 dias por defeito.",
  },
  {
    title: "App de pedidos no celular",
    description: "Catálogo com preços, pedidos e acompanhamento num app feito para o representante.",
  },
];

/** O que o comercial precisa saber antes de conversar. Serve de roteiro para a mensagem. */
const oQuePrecisamos = [
  "A região que você atende hoje e as cidades que cobre",
  "Há quanto tempo trabalha com representação e em quais marcas",
  "Quantas lojas de moda íntima ou pijama você já visita",
];

export default function RepresentantePage() {
  return (
    <>
      <section className="bg-sky">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="label">Representação comercial</p>
            <h1 className="h-hero mt-3 text-[2rem] md:text-[2.375rem]">Quero ser representante</h1>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.6] text-body">
              A Corpo Sensual atende lojas de todo o Brasil por representantes comerciais. Se você já visita o setor e
              quer levar a marca para a sua região, deixe os seus dados: a nossa equipe comercial entra em contato.
            </p>

            <h2 className="h-display mt-10 text-2xl">O que contar no cadastro</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {oQuePrecisamos.map((item) => (
                <li key={item} className="py-3.5 text-[15px] leading-[1.6]">
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-body">
              É lojista e não representante?{" "}
              <Link href="/fabrica-de-pijamas" className="underline">
                Veja como comprar da fábrica
              </Link>
              .
            </p>
          </div>

          {/* Mesmo cadastro básico das outras páginas, dentro do bloco azul-claro */}
          <div id="formulario" className="scroll-mt-20">
            <LeadForm source="representante" submitLabel="Quero representar a marca" withMessage />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
        <h2 className="h-display text-3xl md:text-[2.5rem]">Por que representar a Corpo Sensual</h2>
        <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {motivos.map((m) => (
            <li key={m.title} className="border-t border-line pt-4">
              <h3 className="h-display text-xl md:text-[1.375rem]">{m.title}</h3>
              <p className="mt-1.5 text-[15px] leading-[1.6] text-body">{m.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-sky-soft">
        <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
          <div className="max-w-2xl">
            <h2 className="h-display text-3xl md:text-[2.5rem]">Como funciona a conversa</h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.6] text-body">
              Depois do cadastro você fala direto com o gerente comercial pelo WhatsApp. Ele apresenta as coleções, a
              tabela de preços e as condições de representação, e confere se a sua região está aberta.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-[1.6] text-body">
              A região de atuação é combinada com ele, conforme a cobertura que a fábrica já tem em {site.legal.uf} e
              nos outros estados.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
