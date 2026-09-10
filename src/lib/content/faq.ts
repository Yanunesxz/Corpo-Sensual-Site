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
    q: "Qual é o pedido mínimo?",
    a: `${site.commercial.minOrder} por pedido. A grade de tamanhos e as quantidades por referência são definidas com o representante.`,
  },
  {
    q: "Quais são as formas de pagamento?",
    a: `${site.commercial.installments}. Outras condições podem ser combinadas com o representante da sua região.`,
  },
  {
    q: "Como funciona o frete?",
    a: `${site.commercial.freeShipping}. ${site.commercial.freeShippingNote} Abaixo desse valor, o frete é calculado por pedido, conforme peso e destino.`,
  },
  {
    q: "Qual é o prazo de entrega?",
    a: "O prazo de produção e envio é informado no fechamento do pedido e varia conforme a coleção e a quantidade. Depois do despacho, enviamos o código de rastreamento.",
  },
  {
    q: "Quais linhas vocês fabricam?",
    a: "Pijamas, short dolls, camisolas e robes nas linhas feminina, masculina, infantil e gestante. As coleções são renovadas a cada temporada: uma de primavera/verão e uma de outono/inverno.",
  },
  {
    q: "Como recebo o catálogo e a tabela de preços?",
    a: "Preencha o formulário de catálogo. Nossa equipe confirma os dados da loja e libera o catálogo digital com as referências, a grade e a tabela de atacado.",
  },
  {
    q: "Vocês têm representante na minha região?",
    a: "Atendemos lojas em todo o Brasil por meio de representantes comerciais. Ao se cadastrar, encaminhamos o seu contato ao representante da sua região.",
  },
  {
    q: "E se a peça vier com defeito?",
    a: "Peças com defeito de fabricação podem ser trocadas em até 30 dias após o recebimento, com foto do defeito e número do pedido. Veja a política de trocas e devoluções no rodapé.",
  },
  {
    q: "Sou consumidor final. Onde compro as peças?",
    a: "Nossas peças são vendidas em lojas de moda íntima e pijamas em todo o país. Fale com a gente pela página de contato que indicamos um ponto de venda na sua cidade.",
  },
];
