import { site } from "@/lib/site";
import type { FaqItem } from "@/components/faq";

/**
 * Perguntas frequentes de lojistas. Só afirma o que a empresa já divulga;
 * o que depende de negociação remete ao representante.
 */
export const faqLojista: FaqItem[] = [
  {
    q: "Preciso ter CNPJ para comprar?",
    a: "A maior parte dos nossos clientes são lojas com CNPJ, mas não é um pré-requisito fechado. A venda é no atacado, por grade e com pedido mínimo. Se você ainda não tem CNPJ, fale com a gente pela página de contato: avaliamos o seu caso com o representante da sua região.",
  },
  {
    q: "Quais são as formas de pagamento?",
    a: `${site.commercial.paymentMethods} No Pix há 5% de desconto sobre o valor do pedido. No cartão, o parcelamento é sem juros. Outras condições podem ser combinadas com o representante da sua região.`,
  },
  {
    q: "Como funciona o frete?",
    a: `${site.commercial.freeShipping}. ${site.commercial.freeShippingNote} Abaixo desses valores, o frete é calculado por pedido, conforme peso e destino.`,
  },
  {
    q: "Qual é o prazo de entrega?",
    a: `${site.commercial.leadTime} Depois do despacho, o prazo depende da transportadora e da região, e enviamos o código de rastreamento.`,
  },
  {
    q: "Quais linhas vocês fabricam?",
    a: "Pijamas, short dolls, camisolas e robes nas linhas feminina, masculina e infantil. As coleções são renovadas a cada temporada: uma de primavera/verão e uma de outono/inverno.",
  },
  {
    q: "Vocês têm representante na minha região?",
    a: "Atendemos lojas em todo o Brasil por meio de representantes comerciais. Ao se cadastrar, encaminhamos o seu contato ao representante da sua região.",
  },
  {
    q: "E se a peça vier com defeito?",
    a: `Peças com defeito de fabricação podem ser trocadas em até ${site.commercial.exchangeDays} dias após o recebimento, com foto do defeito e número do pedido. Veja a política de trocas e devoluções no rodapé.`,
  },
  {
    q: "Sou consumidor final. Onde compro as peças?",
    a: "Nossas peças são vendidas em lojas de moda íntima e pijamas em todo o país. Fale com a gente pela página de contato que indicamos um ponto de venda na sua cidade.",
  },
];
