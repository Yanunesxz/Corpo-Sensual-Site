import type { Metadata } from "next";
import Link from "next/link";
import { Steps } from "@/components/steps";
import { LeadForm } from "@/components/lead-form";
import { CommercialTerms } from "@/components/commercial-terms";
import { Faq } from "@/components/faq";
import { HeroImage } from "@/components/hero-image";
import { faqLojista } from "@/lib/content/faq";
import { passosLojista } from "@/lib/content/lojistas";
import { site } from "@/lib/site";
import { ProducaoSection } from "@/components/producao-section";

export const metadata: Metadata = {
  title: "Fábrica de pijamas para lojistas",
  description:
    "Compre pijamas, camisolas e robes direto da fábrica. Grade completa, reposição rápida e atendimento por representante em todo o Brasil. Perguntas frequentes de lojistas.",
};

const benefits = [
  "Preço de fábrica, sem intermediários",
  "Grade completa: feminino, masculino, infantil e gestante",
  "Coleções novas a cada temporada",
  "Reposição rápida das referências que mais vendem",
  "Pedidos online pela plataforma B2B, com acompanhamento",
  "Representante dedicado na sua região",
];

const steps = passosLojista;

export default function FabricaPage() {
  return (
    <>
      <section className="shade relative h-[60svh] min-h-[420px] max-h-[720px] bg-sky-soft">
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
          <h1 className="h-hero max-w-3xl text-[1.75rem] text-white md:text-[2.375rem]">Pijamas direto da fábrica para a sua loja</h1>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <a href="#formulario" className="btn btn-light w-full sm:w-auto">
              Quero ser lojista
            </a>
            <a href="#perguntas" className="link self-start text-sm text-white sm:self-auto">
              Perguntas frequentes
            </a>
          </div>
          <p className="mt-4 text-sm text-white/85">*{site.commercial.salesNote} {site.commercial.noCnpjNote}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="max-w-xl text-[1.0625rem] leading-[1.6] text-body">
            Mais de 25 anos confeccionando moda íntima em Muriaé, MG. Uma marca conhecida nacionalmente, com estrutura
            para atender a sua loja com qualidade e agilidade.
          </p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {benefits.map((b) => (
              <li key={b} className="py-3.5 text-[15px]">
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <h2 className="h-display text-2xl md:text-3xl">Como funciona</h2>
            <div className="mt-6">
              <Steps steps={steps} />
            </div>
          </div>
        </div>
        {/* Formulário dentro do bloco azul-claro: título, condições em linha e botão escuro no fim */}
        <div id="formulario" className="scroll-mt-20 rounded-media bg-sky p-6 md:p-8">
          <h2 className="h-display text-3xl md:text-[2.5rem]">Quero comprar da fábrica</h2>
          <p className="mt-3 text-[1.0625rem] leading-[1.6] text-body">Cadastre-se e receba o contato do representante da sua região.</p>
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
