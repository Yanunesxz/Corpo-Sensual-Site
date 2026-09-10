import type { Metadata } from "next";
import { ContactBlock } from "@/components/contact-block";
import { LeadForm } from "@/components/lead-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a Corpo Sensual: endereço da fábrica em Muriaé, MG, canais de atendimento e formulário de contato para lojistas, consumidores e representantes.`,
};

export default function ContatoPage() {
  return (
    <>
      <section className="bg-sky">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="h-hero text-[2rem] md:text-[2.375rem]">Fale com a Corpo Sensual</h1>
            <ul className="mt-6 space-y-3 text-[1.0625rem] leading-[1.6] text-body">
              <li>
                <strong className="font-medium text-ink">Lojista:</strong> diga a cidade da loja e, se tiver, o CNPJ.
                Encaminhamos ao representante da sua região.
              </li>
              <li>
                <strong className="font-medium text-ink">Ainda sem CNPJ:</strong> fale com a gente do mesmo jeito. Vendemos no
                atacado, por grade e com pedido mínimo, e avaliamos o seu caso.
              </li>
              <li>
                <strong className="font-medium text-ink">Consumidor:</strong> diga a sua cidade e indicamos a loja mais
                perto de você.
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
        <ContactBlock formHref="#formulario" />
      </section>
    </>
  );
}
