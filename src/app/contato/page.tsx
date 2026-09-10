import type { Metadata } from "next";
import Link from "next/link";
import { ContactBlock } from "@/components/contact-block";
import { LeadForm } from "@/components/lead-form";
import { Faq } from "@/components/faq";
import { faqLojista } from "@/lib/content/faq";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a Corpo Sensual: endereço da fábrica em Muriaé, MG, canais de atendimento e formulário de contato para lojistas, consumidores e representantes.`,
};

export default function ContatoPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-12 md:px-8 md:pt-16">
        <h1 className="h-hero text-[2rem] md:text-[2.375rem]">Fale com a Corpo Sensual</h1>
        <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.6] text-body">
          Fábrica de pijamas e moda íntima em {site.legal.cidade}, {site.legal.uf}. Atendemos lojistas de todo o Brasil,
          consumidores que procuram um ponto de venda e profissionais interessados em representar a marca.
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
        <ContactBlock formHref="#formulario" />
      </section>

      {/* Formulário dentro do bloco azul-claro */}
      <section className="bg-sky">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="h-display text-3xl md:text-[2.5rem]">Envie uma mensagem</h2>
            <ul className="mt-6 space-y-3 text-[1.0625rem] leading-[1.6] text-body">
              <li>
                <strong className="font-medium text-ink">Lojista:</strong> informe o CNPJ e a cidade da loja. Encaminhamos ao
                representante da sua região.
              </li>
              <li>
                <strong className="font-medium text-ink">Consumidor:</strong> vendemos apenas para lojas. Diga a sua cidade e
                indicamos onde encontrar as peças.
              </li>
              <li>
                <strong className="font-medium text-ink">Representante comercial:</strong> conte a sua região e experiência no
                campo de mensagem.
              </li>
            </ul>
            <p className="mt-5 text-sm text-body">
              Respondemos em horário comercial{site.contact.hours ? `, ${site.contact.hours.toLowerCase()}` : ""}.
            </p>
          </div>
          <div id="formulario" className="scroll-mt-20">
            <LeadForm source="contato" submitLabel="Enviar mensagem" withMessage />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
        <h2 className="h-display text-3xl md:text-[2.5rem]">Perguntas frequentes</h2>
        <div className="mt-6 max-w-3xl">
          <Faq items={faqLojista.slice(0, 5)} />
        </div>
        <Link href="/fabrica-de-pijamas#perguntas" className="link mt-6 inline-block text-sm">
          Todas as perguntas de lojistas
        </Link>
      </section>
    </>
  );
}
