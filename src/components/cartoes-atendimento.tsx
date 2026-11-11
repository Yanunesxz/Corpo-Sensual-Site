import Link from "next/link";
import { WhatsApp } from "@/components/icons";
import { celularParaExibir, equipe, linkWhatsApp } from "@/lib/site";

/**
 * Os dois cartões de atendimento de quem já é cliente: SAC e financeiro, cada um com
 * o botão do WhatsApp (mensagem já escrita) e o número. Usados em /ajuda e em
 * /ja-e-cliente, a tela de quem tentou se cadastrar e já é cliente.
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

export function CartoesAtendimento() {
  return (
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
            // Tablet (dois cartões de 276 px): o botão ocupa a largura do cartão e não quebra em duas linhas.
            className="btn btn-primary btn-lg mt-7 w-full whitespace-nowrap sm:w-auto sm:self-start md:max-lg:w-full md:max-lg:self-stretch md:max-lg:px-4"
          >
            <WhatsApp width={22} height={22} />
            {a.botao}
          </a>
          {/* O número tem largura fixa na linha do desktop: com a Inter os algarismos
              tabulares são mais largos que os da fonte provisória, e o link ao lado
              andava quando a fonte carregava (deslocamento de layout). Abaixo de 1024 px
              número e link ficam um embaixo do outro, sem risco de quebra. No tablet a linha
              reserva a altura das duas (número + link), para os dois botões ficarem na mesma altura. */}
          <p className="mt-5 flex flex-col items-start gap-y-1 text-[15px] text-body md:max-lg:min-h-[3.75rem] lg:flex-row lg:items-center lg:gap-x-3">
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
  );
}
