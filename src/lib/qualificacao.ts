/**
 * Perguntas de qualificação do cadastro de lojista (o "esquema de vendas"): como a
 * pessoa vende hoje, se já vende pijamas, quando pretende fazer o primeiro pedido e a
 * faixa de preço das peças que ela vende. Ajudam a vendedora a saber com quem fala antes
 * da primeira mensagem.
 *
 * O formulário (components/lead-form.tsx) e o servidor (app/actions/leads.ts) leem as
 * mesmas listas: o valor enviado é o próprio texto da opção, e o servidor só aceita um
 * texto desta lista. As respostas vão para o CRM no campo da mensagem.
 */

export type Pergunta = {
  /** Nome do campo no formulário. */
  campo: "canal" | "vende_pijamas" | "primeiro_pedido" | "faixa_preco";
  /** Como a resposta aparece na mensagem do CRM. */
  rotulo: string;
  titulo: string;
  ajuda?: string;
  /** Selo acima das opções, como "Atacado para revenda". */
  selo?: string;
  opcoes: readonly string[];
};

export const CANAL: Pergunta = {
  campo: "canal",
  rotulo: "Como vende hoje",
  titulo: "Como você vende hoje?",
  selo: "Atacado para revenda",
  opcoes: ["Loja física", "Loja online / redes sociais", "Loja física e online", "Revenda autônoma", "Vou começar a revender", "Quero comprar para uso próprio"],
};

/** A opção de quem é consumidor final: o passo mostra o caminho para /onde-comprar. */
export const USO_PROPRIO = "Quero comprar para uso próprio";

export const VENDE_PIJAMAS: Pergunta = {
  campo: "vende_pijamas",
  rotulo: "Já vende pijamas",
  titulo: "Você já vende pijamas?",
  opcoes: ["Sim, já vendo pijamas", "Vendo outros produtos e quero incluir pijamas", "Vou começar minha primeira revenda"],
};

export const PRIMEIRO_PEDIDO: Pergunta = {
  campo: "primeiro_pedido",
  rotulo: "Primeiro pedido",
  titulo: "Quando pretende fazer seu primeiro pedido?",
  opcoes: ["Nos próximos 7 dias", "Entre 8 e 30 dias", "Depois de 30 dias", "Ainda não tenho previsão"],
};

export const FAIXA_PRECO: Pergunta = {
  campo: "faixa_preco",
  rotulo: "Faixa de preço na loja",
  titulo: "Qual é a faixa de preço das peças que você vende?",
  ajuda: "Preço de venda ao consumidor, por peça.",
  opcoes: ["Até R$ 39,99", "De R$ 40 a R$ 69,99", "De R$ 70 a R$ 99,99", "De R$ 100 a R$ 149,99", "R$ 150 ou mais", "Ainda não vendo"],
};

export const PERGUNTAS = [CANAL, VENDE_PIJAMAS, PRIMEIRO_PEDIDO, FAIXA_PRECO] as const;

/** As respostas em texto, para a mensagem do lead no CRM: uma por linha. */
export function resumoDaQualificacao(respostas: Partial<Record<Pergunta["campo"] | "instagram", string>>): string {
  const linhas = PERGUNTAS.filter((p) => respostas[p.campo]).map((p) => `${p.rotulo}: ${respostas[p.campo]}`);
  if (respostas.instagram) linhas.push(`Instagram ou site: ${respostas.instagram}`);
  return linhas.join("\n");
}
