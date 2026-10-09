import Link from "next/link";
import { site } from "@/lib/site";
import type { FaqItem } from "@/components/faq";

const { commercial } = site;

const link = "text-ink underline underline-offset-4 hover:decoration-2";

/*
 * Perguntas frequentes. Só fatos que a empresa sustenta (ESPEC-FINAL, seção 0.1). Os
 * valores vêm de site.commercial: mudou uma condição, mude lá.
 */

const cnpj: FaqItem = {
  q: "Preciso ter CNPJ para comprar?",
  a: "Não. O CNPJ não é obrigatório. A venda é no atacado. Se você ainda não tem CNPJ, faça o cadastro com o CPF: no formulário, marque “Ainda não”.",
};
const pagamento: FaqItem = {
  q: "Quais são as formas de pagamento?",
  a: "Pix, boleto ou cartão. As condições de pagamento são a consultar com a sua vendedora.",
};

/**
 * Landing /fabrica-de-pijamas, nesta ordem. Pagamento, frete e prazo
 * ficam de fora: a ficha de condições, logo acima na mesma página, já responde.
 */
export const faqLojista: FaqItem[] = [
  cnpj,
  {
    q: "Quais linhas vocês fabricam?",
    a: "Pijamas, camisolas, robes, short dolls e moda íntima nas linhas infantil, juvenil, feminina, masculina, senhora e gestante. Infantil e juvenil de menino e de menina, com peças que combinam para a família. Os catálogos são de verão e de inverno: Delícias de Verão (Primavera/Verão 2027) e Entrelaços (Outono/Inverno 2026).",
  },
  {
    q: "Como recebo o catálogo com os preços?",
    a: "Faça o cadastro da sua loja. Depois do envio você escolhe com quem falar no WhatsApp, e a nossa equipe envia o catálogo digital completo, com a tabela de preços.",
  },
  {
    q: "Vocês atendem a minha região?",
    a: "Vendemos no atacado para lojas de todo o Brasil. Depois do cadastro, uma de nossas vendedoras atende você pelo WhatsApp, ou encaminhamos um representante para a sua região.",
  },
  {
    q: "E se a peça vier com defeito?",
    a: (
      <>
        A troca por defeito de fabricação pode ser pedida em até {commercial.exchangeDays} dias. Veja a{" "}
        <Link href="/politicas/trocas-e-devolucoes" className={link}>
          política de trocas e devoluções
        </Link>
        .
      </>
    ),
  },
  {
    q: "Sou consumidor final. Onde compro as peças?",
    a: (
      <>
        As nossas peças são vendidas em lojas de moda íntima e pijamas.{" "}
        <Link href="/onde-comprar" className={link}>
          Deixe o seu contato e a sua cidade
        </Link>{" "}
        que indicamos a loja mais perto de você.
      </>
    ),
  },
];

/**
 * As três dúvidas que mais seguram o cadastro (CNPJ, pagamento, frete), para /catalogo.
 * Pedido mínimo não entra: o site não fala disso, nem que tem nem que não tem.
 */
export const faqCurto: FaqItem[] = [
  cnpj,
  pagamento,
  { q: "Como funciona o frete?", a: `O frete grátis é sob consulta. ${commercial.freeShippingNote}` },
];
