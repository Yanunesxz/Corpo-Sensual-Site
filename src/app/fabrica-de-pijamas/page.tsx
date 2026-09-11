import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { CommercialTerms } from "@/components/commercial-terms";
import { Faq } from "@/components/faq";
import { HeroImage } from "@/components/hero-image";
import { faqLojista } from "@/lib/content/faq";
import { site, TOTAL_REFERENCIAS } from "@/lib/site";
import { ProducaoSection } from "@/components/producao-section";

export const metadata: Metadata = {
  title: "Fábrica de pijamas para lojistas",
  description:
    "Pijamas, camisolas e robes direto da fábrica em Muriaé, MG, para lojistas. Sem pedido mínimo e 5% de desconto no Pix.",
};

/** Como a compra funciona. Fica só aqui: /sobre manda o lojista para esta página. */
const passos = [
  { title: "Cadastro", description: "Você informa os dados da sua loja no formulário." },
  { title: "Representante", description: "Quem atende a sua região apresenta o catálogo, os preços e as condições." },
  { title: "Primeiro pedido", description: "Você monta a grade e acompanha a produção e o envio." },
];

const benefits = [
  "Sem pedido mínimo: compre o valor que quiser",
  "5% no Pix e parcelamento sem juros no cartão",
  "Frete grátis: R$ 1.200 no Sudeste, R$ 2.000 nas demais",
  "Sai em até 15 dias úteis; há peças a pronta entrega",
  "Troca em até 15 dias por defeito de fabricação",
  "Grade completa: feminino, masculino e infantil",
];

export default function FabricaPage() {
  return (
    <>
      <section className="shade shade-hero relative h-[60svh] min-h-[420px] max-h-[720px] bg-sky-soft">
        <HeroImage
          desktop="/images/colecoes/fabrica-campanha.jpg"
          mobile="/images/colecoes/fabrica-campanha-celular.jpg"
          priority
          desktopPosition="center 35%"
          mobilePosition="center 30%"
          switchAt="lg"
        />
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-8 text-white md:px-8 md:pb-14">
          {/* .h-hero e .link definem a cor escura do design system: sobre a foto forçamos o branco */}
          {/* 28px no celular: o título é longo e o espaçamento entre letras do .h-hero alarga a linha */}
          <h1 className="h-hero max-w-3xl text-[1.75rem] text-white md:text-[2.375rem]">Pijamas direto da fábrica, sem pedido mínimo</h1>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <a href="#formulario" className="btn btn-light w-full sm:w-auto">
              Quero ser lojista
            </a>
            <a href="#perguntas" className="link self-start text-sm text-white sm:self-auto">
              Perguntas frequentes
            </a>
          </div>
          <p className="mt-4 text-sm text-white/85">*{site.commercial.wholesaleNote} {site.commercial.noCnpjNote}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="max-w-xl text-[1.0625rem] leading-[1.6] text-body">
            Fábrica própria em Muriaé, MG, há mais de 25 anos. Produção verticalizada, do fio ao produto final: corte,
            costura e embalagem aqui dentro. São {TOTAL_REFERENCIAS} referências nas duas coleções do ano e o site
            publica só uma parte:{" "}
            <Link href="/colecoes" className="underline">
              veja as coleções
            </Link>
            .
          </p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {benefits.map((b) => (
              <li key={b} className="py-3.5 text-[15px]">
                {b}
              </li>
            ))}
          </ul>

          {/* Único lugar do site que explica o processo de compra. /sobre aponta para cá. */}
          <h2 className="h-display mt-10 text-2xl">Como funciona</h2>
          <ol className="mt-4 space-y-3">
            {passos.map((p, i) => (
              <li key={p.title} className="flex gap-3 text-[15px] leading-[1.6]">
                <span className="label shrink-0 tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <strong className="font-medium text-ink">{p.title}.</strong> {p.description}
                </span>
              </li>
            ))}
          </ol>
        </div>
        {/* Formulário dentro do bloco azul-claro: título, condições em linha e botão escuro no fim */}
        <div id="formulario" className="scroll-mt-20 rounded-media bg-sky p-6 md:p-8">
          <h2 className="h-display text-3xl md:text-[2.5rem]">Quero as peças que mais vendem</h2>
          <p className="mt-3 text-[1.0625rem] leading-[1.6] text-body">Cadastre a sua loja. O representante da sua região manda a tabela de preços e a grade para você montar o primeiro pedido.</p>
          <CommercialTerms className="mt-6" />
          <div className="mt-7">
            <LeadForm source="fabrica-de-pijamas" submitLabel="Quero ser lojista" withMessage />
          </div>
        </div>
      </section>

      {/* Vídeo real da produção, logo depois do formulário */}
      <ProducaoSection fundo="bg-sky" comLink={false} />

      <section id="perguntas" className="scroll-mt-20 bg-sky-soft">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div>
              <h2 className="h-display text-3xl md:text-[2.5rem]">Perguntas frequentes</h2>
              <p className="mt-4 text-[1.0625rem] leading-[1.6] text-body">
                O que os lojistas mais perguntam antes do primeiro pedido. Não achou a sua dúvida?{" "}
                <Link href="/contato" className="underline">
                  Fale com a gente
                </Link>
                .
              </p>
            </div>
            <Faq items={faqLojista} />
          </div>
        </div>
      </section>
    </>
  );
}
