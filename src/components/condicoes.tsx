import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { Check } from "./icons";

const { commercial } = site;

/** "R$ 1.200" de "Frete grátis a partir de R$ 1.200 no Sudeste": um número digitado num lugar só. */
const freteGratis = commercial.freeShippingSudeste.replace(/^Frete grátis /, "");

const cnpj = (
  <>
    Ainda não tem CNPJ?{" "}
    <Link href="/contato" className="text-ink underline underline-offset-4 hover:decoration-2">
      Fale com a gente
    </Link>
    .
  </>
);

/** Faixa logo abaixo da capa: as quatro perguntas da lojista, na ordem em que ela pergunta. */
const FAIXA = [
  { rotulo: "Pedido", valor: commercial.noMinOrder },
  { rotulo: "Pagamento", valor: commercial.pixDiscount },
  { rotulo: "Frete", valor: `Grátis ${freteGratis}*` },
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
  { rotulo: "Pedido mínimo", valor: "Não há", detalhe: "Você compra o valor que quiser, por grade." },
  { rotulo: "Pagamento", valor: commercial.pixDiscount, detalhe: "Também boleto e cartão com parcelamento sem juros." },
  { rotulo: "Frete grátis", valor: `A partir de ${freteGratis.replace(/^a partir de /, "")}`, detalhe: `${commercial.freeShippingOutras}.` },
  {
    rotulo: "Prazo",
    valor: "Sai da fábrica em até 15 dias úteis",
    detalhe: "Referências a pronta entrega podem sair no mesmo dia, conforme o pedido.",
  },
  { rotulo: "Troca", valor: `Em até ${commercial.exchangeDays} dias`, detalhe: "Para peça com defeito de fabricação." },
  { rotulo: "CNPJ", valor: "Não é obrigatório", detalhe: cnpj },
];

/** Lista do topo do formulário. O asterisco do frete é explicado na nota do cartão. */
const LISTA = [commercial.noMinOrder, commercial.pixDiscount, `${commercial.freeShippingSudeste}*`, "Sai da fábrica em até 15 dias úteis"];

type Props = {
  /**
   * faixa: quatro células com fio, logo abaixo da capa (2x2 no celular).
   * ficha: seis células (pedido, pagamento, frete, prazo, troca, CNPJ), para a landing.
   * lista: marcadores com ✓ no topo do formulário.
   */
  variante: "faixa" | "ficha" | "lista";
  /** Fundo da seção em volta (só na ficha): sobre branco as células ficam azuladas; sobre azul, brancas. */
  fundo?: "branco" | "azul";
  /** Esconde a nota de rodapé da faixa (frete nas demais regiões, pagamento, pronta entrega, CNPJ). */
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
      <ul className={`grid gap-x-6 gap-y-2.5 sm:grid-cols-2 ${className}`}>
        {LISTA.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[15px] leading-snug text-ink">
            <span aria-hidden className="mt-px flex h-5 w-5 flex-none items-center justify-center rounded-full bg-noite text-white">
              <Check width={12} height={12} strokeWidth={2.4} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (variante === "ficha") {
    const celula = fundo === "branco" ? "bg-sky-soft" : "bg-paper";
    return (
      // Uma coluna no celular: em duas, as células ficavam com 130 px de texto.
      <ul className={`grid gap-px border border-line bg-line min-[520px]:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {FICHA.map((f) => (
          <li key={f.rotulo} className={`${celula} flex flex-col px-5 py-4 min-[520px]:p-5 lg:p-8`}>
            <p className="text-[13px] leading-snug text-muted">{f.rotulo}</p>
            <p className="t-sub mt-1.5 text-[1.25rem] lg:mt-2 lg:text-[1.375rem]">{f.valor}</p>
            <p className="mt-2 text-[14px] leading-[1.5] text-body">{f.detalhe}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={className}>
      <ul className="grid grid-cols-2 lg:grid-cols-4">
        {FAIXA.map((f, i) => (
          <li key={f.rotulo} className={`flex flex-col gap-2 border-line lg:border-b-0 lg:py-1 ${CELULA_FAIXA[i]}`}>
            <span className="eyebrow">{f.rotulo}</span>
            <span className="t-sub text-[1.125rem] min-[400px]:text-[1.25rem] lg:text-[clamp(1.25rem,0.6rem+1vw,1.5rem)]">{f.valor}</span>
          </li>
        ))}
      </ul>
      {!semNota && (
        <p className="legenda mt-5 max-w-4xl lg:mt-7">
          *{commercial.freeShippingOutras}. Pix, boleto ou cartão com parcelamento sem juros. {commercial.prontaEntrega} {cnpj}
        </p>
      )}
    </div>
  );
}
