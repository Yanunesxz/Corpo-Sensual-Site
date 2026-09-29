import type { Metadata } from "next";
import Link from "next/link";
import { WhatsApp } from "@/components/icons";
import { celularParaExibir, equipe, linkWhatsApp, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Preciso de ajuda",
  description:
    "Atendimento da Corpo Sensual pelo WhatsApp: SAC para pedido, entrega e troca, e financeiro para boleto, pagamento e nota fiscal.",
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

export default function AjudaPage() {
  const horario = site.contact.hours ? site.contact.hours.toLowerCase() : "em horário comercial";

  return (
    <>
      <section className="bg-sky">
        <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
          <p className="label">Atendimento</p>
          <h1 className="h-hero mt-3 text-[2rem] md:text-[2.375rem]">Preciso de ajuda</h1>
          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.6] text-body">
            Escolha o assunto e fale direto com quem resolve, pelo WhatsApp. Atendimento {horario}.
          </p>

          <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-6">
            {atendimentos.map((a) => (
              <li key={a.titulo} className="flex flex-col rounded-media bg-paper p-6 md:p-8">
                <p className="label">{a.titulo}</p>
                <h2 className="h-display mt-2 text-2xl md:text-[1.75rem]">{a.assunto}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-body">{a.texto}</p>
                <a
                  href={linkWhatsApp(a.numero, a.mensagem)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark mt-6 w-full sm:w-auto sm:self-start"
                >
                  <WhatsApp width={20} height={20} />
                  {a.botao}
                </a>
                <p className="mt-3 text-sm text-body">
                  {celularParaExibir(a.numero)}
                  {a.extra && (
                    <>
                      {" · "}
                      <Link href={a.extra.href} className="underline">
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

      {/* Quem não é cliente ainda passa pelo cadastro, que é o que alimenta o CRM. */}
      <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
        <h2 className="h-display text-3xl md:text-[2.5rem]">Ainda não é cliente?</h2>
        <ul className="mt-8 grid gap-x-8 gap-y-6 md:grid-cols-2">
          <li className="border-t border-line pt-4">
            <h3 className="h-display text-xl md:text-[1.375rem]">Quero comprar</h3>
            <p className="mt-1.5 text-[15px] leading-[1.6] text-body">
              Faça o cadastro da sua loja e escolha uma das nossas vendedoras para conversar no WhatsApp.
            </p>
            <Link href="/catalogo" className="link mt-3 inline-block text-[15px]">
              Fazer o cadastro
            </Link>
          </li>
          <li className="border-t border-line pt-4">
            <h3 className="h-display text-xl md:text-[1.375rem]">Quero ser representante</h3>
            <p className="mt-1.5 text-[15px] leading-[1.6] text-body">
              Conte a sua região e experiência. Depois do cadastro você fala direto com o Fabian, nosso gerente comercial.
            </p>
            <Link href="/seja-representante" className="link mt-3 inline-block text-[15px]">
              Quero ser representante
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}
