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
  a: "Não. O CNPJ não é obrigatório. A venda é no atacado, por grade e sem pedido mínimo. Se você ainda não tem CNPJ, faça o cadastro com o CPF: no formulário, marque “Ainda não”.",
};
const minimo: FaqItem = { q: "Tem pedido mínimo?", a: "Não. Você compra o valor que quiser, por grade." };
const pagamento: FaqItem = {
  q: "Quais são as formas de pagamento?",
  a: "Pix, com 5% de desconto, boleto e cartão com parcelamento sem juros.",
};

/**
 * Landing /fabrica-de-pijamas, nesta ordem. Pedido mínimo, pagamento, frete e prazo
 * ficam de fora: a ficha de condições, logo acima na mesma página, já responde.
 */
export const faqLojista: FaqItem[] = [
  cnpj,
  {
    q: "Quais linhas vocês fabricam?",
    a: "Pijamas, camisolas, robes, short dolls e moda íntima nas linhas feminina, masculina e infantil, de menino e de menina, com peças que combinam para a família. São duas coleções por ano: Delícias de Verão (Primavera/Verão 2027) e Entrelaços (Outono/Inverno 2026).",
  },
  {
    q: "Como recebo o catálogo com os preços?",
    a: "Faça o cadastro da sua loja. Depois do envio você escolhe com quem falar no WhatsApp, e a nossa equipe envia o catálogo digital completo, com grade e tabela de preços.",
  },
  {
    q: "Vocês atendem a minha região?",
    a: "Vendemos no atacado para lojas de todo o Brasil. Depois do cadastro, você escolhe com quem falar no WhatsApp e a nossa equipe comercial atende você.",
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
        <Link href="/contato" className={link}>
          Fale com a gente pela página de contato
        </Link>{" "}
        que indicamos um ponto de venda na sua cidade.
      </>
    ),
  },
];

/** As três dúvidas que mais seguram o cadastro (CNPJ, mínimo, pagamento), para /catalogo. */
export const faqCurto: FaqItem[] = [cnpj, minimo, pagamento];
