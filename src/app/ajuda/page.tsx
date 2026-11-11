import type { Metadata } from "next";
import Link from "next/link";
import { CartoesAtendimento } from "@/components/cartoes-atendimento";
import { ArrowRight } from "@/components/icons";
import { SeoPagina } from "@/components/seo-pagina";
import { site } from "@/lib/site";

const TITULO = "Ajuda: SAC e financeiro pelo WhatsApp";
const DESCRICAO = "Atendimento da Corpo Sensual pelo WhatsApp: SAC para pedido, entrega e troca, e financeiro para boleto, pagamento e nota fiscal.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/ajuda" },
};

/*
 * Para quem já é cliente e precisa resolver algo. Cada assunto vai direto para
 * quem resolve, pelo WhatsApp, com a mensagem já escrita (CartoesAtendimento, o
 * mesmo de /ja-e-cliente).
 */

/** Quem ainda não é cliente: o caminho é sempre um cadastro (é ele que alimenta o CRM). */
const caminhos = [
  {
    titulo: "Quero comprar",
    texto: "Faça o cadastro da sua loja e escolha uma das nossas vendedoras para conversar no WhatsApp.",
    href: "/catalogo",
    rotulo: "Fazer o cadastro",
  },
  {
    titulo: "Quero ser representante",
    texto: "Conte a sua região e experiência. Depois do cadastro você fala direto com o nosso gestor comercial.",
    href: "/seja-representante",
    rotulo: "Seja representante",
  },
] as const;

const atalhos = [
  { href: "/politicas/trocas-e-devolucoes", label: "Política de trocas e devoluções" },
  { href: "/politicas/envio", label: "Política de envio" },
  { href: "/fabrica-de-pijamas#perguntas", label: "Perguntas frequentes" },
] as const;

export default function AjudaPage() {
  const horario = site.contact.hours ? site.contact.hours.toLowerCase() : "em horário comercial";

  return (
    <>
      <SeoPagina caminho="/ajuda" tipo="ContactPage" titulo={TITULO} descricao={DESCRICAO} />

      {/* 1. Capa + atendimento: o assunto e o botão do WhatsApp já na primeira tela. */}
      <section className="bg-sky">
        <div className="wrap pb-16 pt-10 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
          <div className="grid gap-y-5 lg:grid-cols-12 lg:items-end lg:gap-x-10">
            <div className="lg:col-span-7">
              <p className="eyebrow eyebrow-fio">Atendimento</p>
              <h1 className="t-hero mt-3">Preciso de ajuda</h1>
            </div>
            <p className="lead max-w-xl lg:col-span-5 lg:pb-1.5">
              Escolha o assunto e fale direto com quem resolve, pelo WhatsApp. Atendimento {horario}.
            </p>
          </div>

          <CartoesAtendimento />
        </div>
      </section>

      {/* 2. Quem não é cliente ainda passa pelo cadastro, que é o que alimenta o CRM. */}
      <section className="sec">
        <div className="wrap">
          <div className="grid gap-y-8 md:gap-y-10 xl:grid-cols-12 xl:gap-x-10">
            <h2 className="t-titulo max-w-[12ch] xl:col-span-4" data-reveal>
              Ainda não é cliente?
            </h2>
            <ul className="grid gap-4 md:grid-cols-2 md:gap-6 xl:col-span-8">
              {caminhos.map((p, i) => (
                <li
                  key={p.href}
                  className="flex flex-col bg-areia px-5 py-7 sm:p-8"
                  data-reveal
                  style={{ ["--atraso" as string]: `${i * 80}ms` }}
                >
                  <h3 className="t-sub">{p.titulo}</h3>
                  <p className="mt-2 max-w-sm flex-1 text-[15px] leading-[1.6] text-body">{p.texto}</p>
                  <Link href={p.href} className="link-seta mt-5 self-start">
                    {p.rotulo}
                    <ArrowRight width={18} height={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <ul className="mt-12 flex flex-col items-start gap-y-1 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:gap-x-10 md:mt-16 lg:mt-20">
            {atalhos.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="link-seta">
                  {a.label}
                  <ArrowRight width={18} height={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
