import type { Metadata } from "next";
import Link from "next/link";
import { Steps } from "@/components/steps";
import { LeadForm } from "@/components/lead-form";
import { CommercialTerms } from "@/components/commercial-terms";
import { Faq } from "@/components/faq";
import { HeroImage } from "@/components/hero-image";
import { faqLojista } from "@/lib/content/faq";
import { passosLojista } from "@/lib/content/lojistas";

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
      <section className="shade relative h-[60svh] min-h-[420px] max-h-[720px] bg-stone">
        <HeroImage desktop="/images/colecoes/frescor-3.jpg" mobile="/images/colecoes/frescor-4.jpg" priority desktopPosition="center 30%" mobilePosition="center 20%" switchAt="lg" />
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-8 text-white md:px-8 md:pb-14">
          <p className="label text-[13px]">Fábrica de pijamas</p>
          <h1 className="h-display mt-2 max-w-3xl text-4xl md:text-5xl lg:text-7xl">Pijamas direto da fábrica para a sua loja</h1>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <a href="#formulario" className="btn btn-light w-full sm:w-auto">
              Quero ser lojista
            </a>
            <a href="#perguntas" className="link self-start text-[13px] sm:self-auto">
              Perguntas frequentes
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
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
            <h2 className="h-display text-2xl md:text-3xl">Como funciona</h2>
            <div className="mt-6">
              <Steps steps={steps} />
            </div>
          </div>
        </div>
        <div id="formulario" className="scroll-mt-20 border-y border-line py-8 md:border md:p-8">
          <h2 className="h-display text-2xl md:text-3xl">Quero comprar da fábrica</h2>
          <p className="mt-2 text-sm text-ink-soft">Cadastre-se e receba o contato do representante da sua região.</p>
          <div className="mt-6">
            <LeadForm source="fabrica-de-pijamas" submitLabel="Quero ser lojista" withMessage />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 md:px-8">
        <CommercialTerms />
      </section>

      <section id="perguntas" className="mx-auto max-w-[1600px] scroll-mt-20 px-5 py-12 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <h2 className="h-display text-3xl md:text-5xl">Perguntas frequentes</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              O que os lojistas mais perguntam antes do primeiro pedido. Não achou a sua dúvida?{" "}
              <Link href="/contato" className="underline">
                Fale com a gente
              </Link>
              .
            </p>
          </div>
          <Faq items={faqLojista} />
        </div>
      </section>
    </>
  );
}
