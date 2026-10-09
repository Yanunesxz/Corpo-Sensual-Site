import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { Check } from "./icons";

const { commercial } = site;

/* CNPJ: o próprio formulário resolve ("Ainda não" + CPF). Antes havia um "Fale com a gente"
   que mandava a lojista sem CNPJ para o formulário de contato, fora da landing. */
const cnpj = "No cadastro, marque “Ainda não” e informe o CPF.";

/** Faixa logo abaixo da capa: as quatro perguntas da lojista, na ordem em que ela pergunta. */
const FAIXA = [
  { rotulo: "Venda", valor: commercial.wholesale },
  { rotulo: "Pagamento", valor: commercial.payment },
  { rotulo: "Frete", valor: "Grátis sob consulta" },
  { rotulo: "Envio", valor: "Sai da fábrica em até 15 dias úteis" },
];

/** Fios da faixa: cruz no 2x2 do celular; divisórias verticais na linha do desktop. */
const CELULA_FAIXA = [
  "border-b pb-4 pr-4 lg:pb-1 lg:pr-6",
  "border-b border-l pb-4 pl-4 lg:pb-1 lg:px-6",
  "pt-4 pr-4 lg:border-l lg:pt-1 lg:px-6",
  "border-l pt-4 pl-4 lg:pt-1 lg:pl-6 lg:pr-0",
];

/** Ficha das condições por escrito: seis células, sem ícone. */
const FICHA: { rotulo: string; valor: string; detalhe: ReactNode }[] = [
  { rotulo: "Venda", valor: commercial.wholesale, detalhe: "Você monta o pedido com a sua vendedora, pelo WhatsApp." },
  { rotulo: "Pagamento", valor: commercial.payment, detalhe: commercial.paymentNote },
  { rotulo: "Frete grátis", valor: "Sob consulta", detalhe: commercial.freeShippingNote },
  {
    rotulo: "Prazo",
    valor: "Sai da fábrica em até 15 dias úteis",
    detalhe: "Referências a pronta entrega podem sair no mesmo dia, conforme o pedido.",
  },
  { rotulo: "Troca", valor: `Em até ${commercial.exchangeDays} dias`, detalhe: "Para peça com defeito de fabricação." },
  { rotulo: "CNPJ", valor: "Não é obrigatório", detalhe: cnpj },
];

/** Lista do topo do formulário. */
const LISTA = [`${commercial.wholesale}, direto da fábrica`, `${commercial.payment} (a consultar)`, commercial.freeShipping, "Sai da fábrica em até 15 dias úteis"];

type Props = {
  /**
   * faixa: quatro células com fio, logo abaixo da capa (2x2 no celular).
   * ficha: seis células (venda, pagamento, frete, prazo, troca, CNPJ), para a landing.
   * lista: marcadores com ✓ no topo do formulário.
   */
  variante: "faixa" | "ficha" | "lista";
  /** Fundo da seção em volta (só na ficha): sobre branco as células ficam azuladas; sobre azul, brancas. */
  fundo?: "branco" | "azul";
  /** Esconde a nota de rodapé da faixa (pagamento e frete a consultar, CNPJ). */
  semNota?: boolean;
  className?: string;
};

/**
 * Condições comerciais, em três desenhos. Fonte única dos textos: site.commercial.
 * NUNCA na página de representante: tem números, e lá o dono pediu nenhum.
 */
export function Condicoes({ variante, fundo, semNota = false, className = "" }: Props) {
  if (variante === "lista") {
    return (
      // Duas colunas pela largura do cartão (container query), não da tela: na coluna
      // estreita da landing entre 1024 e 1279 px elas ficariam com 130 px cada.
      <div className={`@container ${className}`}>
        <ul className="grid gap-x-6 gap-y-2.5 @[26rem]:grid-cols-2">
          {LISTA.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[15px] leading-snug text-ink">
              <span aria-hidden className="mt-px flex h-5 w-5 flex-none items-center justify-center rounded-full bg-noite text-white">
                <Check width={12} height={12} strokeWidth={2.4} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variante === "ficha") {
    const celula = fundo === "branco" ? "bg-sky-soft" : "bg-paper";
    return (
      // Duas colunas já no celular (em uma eram seis cartões altos, ~730 px), com letra
      // menor dentro do contêiner estreito; três colunas na largura toda (container query).
      <div className={`@container ${className}`}>
        <ul className="grid grid-cols-2 gap-px border border-line bg-line @4xl:grid-cols-3">
          {FICHA.map((f) => (
            <li key={f.rotulo} className={`${celula} flex flex-col p-4 @md:p-5 lg:p-8`}>
              <p className="text-[13px] leading-snug text-muted">{f.rotulo}</p>
              <p className="t-sub mt-1 text-[1.0625rem] @md:mt-1.5 @md:text-[1.25rem] lg:mt-2 lg:text-[1.375rem]">{f.valor}</p>
              <p className="mt-1.5 text-[13px] leading-[1.45] text-body @md:mt-2 @md:text-[14px] @md:leading-[1.5]">{f.detalhe}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={className}>
      <ul className="grid grid-cols-2 lg:grid-cols-4">
        {FAIXA.map((f, i) => (
          <li key={f.rotulo} className={`flex flex-col gap-2 border-line lg:border-b-0 lg:py-1 ${CELULA_FAIXA[i]}`}>
            <span className="eyebrow">{f.rotulo}</span>
            <span className="t-sub text-[1.125rem] min-[400px]:text-[1.25rem] lg:text-[clamp(1.25rem,0.2rem+1.2vw,1.5rem)]">{f.valor}</span>
          </li>
        ))}
      </ul>
      {!semNota && (
        <p className="legenda mt-5 max-w-4xl lg:mt-7">
          Pagamento e frete a consultar com a sua vendedora. {commercial.noCnpjNote}
        </p>
      )}
    </div>
  );
}
