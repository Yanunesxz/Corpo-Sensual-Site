/**
 * As páginas fixas do site, num lugar só: sitemap, dados estruturados (WebPage e trilha
 * de navegação) e o llms.txt leem daqui.
 *
 * atualizada = data da última mudança de CONTEÚDO da página (AAAA-MM-DD): texto, fotos,
 * produtos, perguntas do FAQ, campos do formulário. Layout, cor e desempenho não contam.
 * Quem mudar o conteúdo de uma página troca a data dela aqui, no mesmo commit.
 * Não use new Date(): o Google aprende a ignorar data que muda a cada build.
 *
 * resumo = uma linha para os assistentes de IA (llms.txt): o que a página é e para quem.
 * As landing pages de coleção (/colecao-*) e o /obrigado ficam de fora: são noindex.
 */
export type PaginaFixa = {
  /** Nome curto, como aparece na trilha de navegação ("Início > Sobre a fábrica"). */
  nome: string;
  resumo: string;
  atualizada: string;
  /** Imagem principal (public/), para o sitemap e o WebPage. */
  imagem?: string;
  prioridade: number;
  frequencia: "weekly" | "monthly" | "yearly";
};

export const PAGINAS: Record<string, PaginaFixa> = {
  "/": {
    nome: "Início",
    resumo: "Apresentação da fábrica, condições para lojistas, as peças mais pedidas e as coleções do ano.",
    atualizada: "2026-10-14",
    imagem: "/images/og-corpo-sensual.jpg",
    prioridade: 1,
    frequencia: "weekly",
  },
  "/fabrica-de-pijamas": {
    nome: "Para lojistas",
    resumo: "Como comprar da fábrica: condições por escrito, passo a passo do cadastro ao pedido, peças e perguntas frequentes.",
    atualizada: "2026-10-14",
    imagem: "/images/lojista/capa.jpg",
    prioridade: 0.9,
    frequencia: "weekly",
  },
  "/catalogo": {
    nome: "Receber catálogo",
    resumo: "Cadastro da loja para receber o catálogo digital com a tabela de preços de atacado.",
    atualizada: "2026-10-09",
    imagem: "/images/colecoes/delicias-3.jpg",
    prioridade: 0.9,
    frequencia: "monthly",
  },
  "/colecoes": {
    nome: "Coleções",
    resumo: "Os catálogos de verão e inverno, com as referências de cada coleção e as linhas de produto.",
    atualizada: "2026-10-14",
    imagem: "/images/og/delicias-de-verao.jpg",
    prioridade: 0.8,
    frequencia: "monthly",
  },
  "/sobre": {
    nome: "Sobre a fábrica",
    resumo: "História, estrutura e produção da fábrica em Muriaé, MG: linhas, equipe, sede e campanha.",
    atualizada: "2026-10-14",
    imagem: "/images/sobre/predio-frente.jpg",
    prioridade: 0.7,
    frequencia: "monthly",
  },
  "/seja-representante": {
    nome: "Seja representante",
    resumo: "Captação de representantes comerciais: motivos, estrutura de apoio da fábrica, passos e cadastro.",
    atualizada: "2026-10-09",
    imagem: "/images/colecoes/delicias-1.jpg",
    prioridade: 0.7,
    frequencia: "monthly",
  },
  "/onde-comprar": {
    nome: "Onde comprar",
    resumo: "Para o consumidor final: cadastro curto para a fábrica indicar a loja mais perto que vende Corpo Sensual.",
    atualizada: "2026-10-09",
    prioridade: 0.5,
    frequencia: "yearly",
  },
  "/contato": {
    nome: "Contato",
    resumo: "Endereço da fábrica, canais de atendimento e formulário de contato para lojistas, consumidores e representantes.",
    atualizada: "2026-10-09",
    prioridade: 0.6,
    frequencia: "yearly",
  },
  "/ajuda": {
    nome: "Já sou cliente",
    resumo: "Atendimento para quem já é cliente: SAC (pedido, entrega, troca) e financeiro (boleto, pagamento, nota fiscal) pelo WhatsApp.",
    atualizada: "2026-10-09",
    prioridade: 0.5,
    frequencia: "yearly",
  },
};

/**
 * Última mudança de conteúdo das páginas /colecoes/[slug] (página, src/data/catalogo.json
 * ou fotos). Quando o catálogo vier do Supabase, use uma data que considere também os
 * produtos da coleção.
 */
export const COLECOES_ATUALIZADAS = "2026-10-09";

/** A data de uma página fixa, ou a das coleções para o que não estiver na lista. */
export function atualizadaEm(caminho: string): string {
  return Object.hasOwn(PAGINAS, caminho) ? PAGINAS[caminho].atualizada : COLECOES_ATUALIZADAS;
}
