import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, WhatsApp } from "@/components/icons";
import { celularParaExibir, equipe, linkWhatsApp, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ajuda: SAC e financeiro pelo WhatsApp",
  description:
    "Atendimento da Corpo Sensual pelo WhatsApp: SAC para pedido, entrega e troca, e financeiro para boleto, pagamento e nota fiscal.",
  alternates: { canonical: "/ajuda" },
};

/**
 * Para quem já é cliente e precisa resolver algo. Cada assunto vai direto para
 * quem resolve, pelo WhatsApp, com a mensagem já escrita.
 *
 * Quem ainda quer comprar não recebe o número da vendedora aqui: passa antes pelo
 * cadastro, que cria o lead no CRM, e escolhe a vendedora na página de obrigado.
 */
const atendimentos = [
  {
    titulo: "SAC",
    assunto: "Pedido, entrega e troca",
    texto: "Acompanhar um pedido, prazo de entrega, troca ou peça com defeito de fabricação.",
    botao: "Falar com o SAC",
    numero: equipe.sac.numero,
    mensagem: "Olá! Vim pelo site da Corpo Sensual e preciso de ajuda com um pedido.",
    extra: { href: "/politicas/trocas-e-devolucoes", label: "Política de trocas" },
  },
  {
    titulo: "Financeiro",
    assunto: "Boleto, pagamento e nota fiscal",
    texto: "Segunda via de boleto, confirmação de pagamento, nota fiscal e formas de pagamento.",
    botao: "Falar com o financeiro",
    numero: equipe.financeiro.numero,
    mensagem: "Olá! Vim pelo site da Corpo Sensual e preciso falar com o financeiro.",
    extra: null,
  },
] as const;

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
    texto: "Conte a sua região e experiência. Depois do cadastro você fala direto com o Fabian, nosso gerente comercial.",
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

          <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6 lg:mt-16 lg:gap-10">
            {atendimentos.map((a) => (
              <li key={a.titulo} className="flex flex-col bg-paper px-5 py-7 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
                <p className="eyebrow">{a.titulo}</p>
                <h2 className="t-sub mt-3 text-[1.5rem] md:text-[1.75rem]">{a.assunto}</h2>
                <p className="mt-3 max-w-md flex-1 text-[15px] leading-[1.6] text-body">{a.texto}</p>
                <a
                  href={linkWhatsApp(a.numero, a.mensagem)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-lg mt-7 w-full sm:w-auto sm:self-start"
                >
                  <WhatsApp width={22} height={22} />
                  {a.botao}
                </a>
                {/* O número tem largura fixa na linha do desktop: com a Inter os algarismos
                    tabulares são mais largos que os da fonte provisória, e o link ao lado
                    andava quando a fonte carregava (deslocamento de layout). Abaixo de 1024 px
                    número e link ficam um embaixo do outro, sem risco de quebra. */}
                <p className="mt-5 flex flex-col items-start gap-y-1 text-[15px] text-body lg:flex-row lg:items-center lg:gap-x-3">
                  <span className="tabular-nums lg:w-[8.5rem] lg:flex-none">{celularParaExibir(a.numero)}</span>
                  {a.extra && (
                    <>
                      <span aria-hidden className="hidden text-line-strong lg:inline">
                        ·
                      </span>
                      <Link href={a.extra.href} className="link">
                        {a.extra.label}
                      </Link>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
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
