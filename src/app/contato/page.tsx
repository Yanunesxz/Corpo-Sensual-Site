import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlocoCadastro } from "@/components/bloco-cadastro";
import { ContactBlock } from "@/components/contact-block";
import { ArrowRight } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";
import { altFoto } from "@/lib/content/alt-fotos";

export const metadata: Metadata = {
  title: "Contato e endereço da fábrica em Muriaé, MG",
  description: `Fale com a Corpo Sensual: endereço da fábrica em Muriaé, MG, canais de atendimento e formulário de contato para lojistas, consumidores e representantes.`,
  alternates: { canonical: "/contato" },
};

/** Ao lado do formulário, só no desktop: conversa à mesa. */
const FOTO_CONVERSA = "/images/colecoes/delicias-3.jpg";

/** Cada assunto leva a quem resolve: cadastro, SAC/financeiro, gestor comercial ou o formulário. */
const ASSUNTOS = [
  { titulo: "Quero comprar", texto: "Cadastre a sua loja e receba o catálogo com a tabela de preços.", href: "/catalogo" },
  { titulo: "Já sou cliente", texto: "Pedido, entrega, troca, boleto e nota fiscal com o SAC e o financeiro.", href: "/ajuda" },
  { titulo: "Quero representar", texto: "Cadastre a sua região e fale com o nosso gestor comercial.", href: "/seja-representante" },
  { titulo: "Outro assunto", texto: "Escreva a sua mensagem no formulário abaixo.", href: "#formulario" },
];

export default function ContatoPage() {
  const horario = site.contact.hours ? `, ${site.contact.hours.toLowerCase()}` : "";

  return (
    <>
      {/* 1. Capa: título e os quatro assuntos. O cartão inteiro é o link. */}
      <section className="bg-sky">
        <div className="wrap pb-14 pt-10 md:pb-20 md:pt-14 lg:pb-24 lg:pt-20">
          <SectionHeading
            level="h1"
            revelar={false}
            eyebrow="Contato"
            title="Fale com a Corpo Sensual"
            description="Escolha o assunto para falar com quem resolve."
          />
          <ul className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-5">
            {ASSUNTOS.map((a) => (
              <li key={a.titulo} className="flex">
                <Link
                  href={a.href}
                  className="group flex w-full flex-col bg-paper p-4 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_var(--color-ink)] md:p-6 lg:p-7"
                >
                  <span className="t-sub block text-[1.1875rem] md:text-[1.375rem]">{a.titulo}</span>
                  <span className="mt-2 block flex-1 text-[14px] leading-[1.5] text-body">{a.texto}</span>
                  <ArrowRight width={20} height={20} className="mt-5 text-ink transition-transform duration-300 group-hover:translate-x-[3px]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Mensagem. O id="formulario" fica na seção (o cartão usa outro id). */}
      <section id="formulario" className="sec">
        <div className="wrap grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          {/* Desktop: texto no alto e a foto alinhada com a base do formulário. No celular a
              foto não existe (display: none, e o carregamento preguiçoso nem a baixa). */}
          <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:gap-10">
            <div>
              <h2 className="t-titulo">Mande a sua mensagem</h2>
              <p className="lead mt-4 max-w-md">Consumidor? Diga a sua cidade e indicamos a loja mais perto de você.</p>
              <p className="mt-4 text-[15px] leading-[1.6] text-body">Respondemos em horário comercial{horario}.</p>
            </div>
            <div className="relative hidden overflow-hidden bg-areia lg:block lg:aspect-[4/5] xl:aspect-square">
              <Image
                src={FOTO_CONVERSA}
                alt={altFoto(FOTO_CONVERSA, "Mãe e filha conversando à mesa, coleção Delícias de Verão")}
                fill
                sizes="(min-width: 1024px) 38vw, 1px"
                className="object-cover object-[center_58%]"
              />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <BlocoCadastro id="cadastro-contato" source="contato" withMessage submitLabel="Enviar mensagem" />
          </div>
        </div>
      </section>

      {/* 3. Onde estamos: endereço, mapa e só os canais configurados. */}
      <section className="sec bg-sky-soft">
        <div className="wrap grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <h2 className="t-titulo lg:col-span-4" data-reveal>
            Onde estamos
          </h2>
          <div className="lg:col-span-8" data-reveal style={{ ["--atraso" as string]: "80ms" }}>
            <ContactBlock formHref="#formulario" />
          </div>
        </div>
      </section>
    </>
  );
}
