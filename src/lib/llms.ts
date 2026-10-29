import type { FaqItem } from "@/components/faq";
import { faqCurto, faqLojista, faqRepresentante } from "@/lib/content/faq";
import { PAGINAS } from "@/lib/content/paginas";
import { politicas } from "@/lib/content/politicas";
import { getCollections } from "@/lib/data";
import { textoDe } from "@/lib/schema";
import { celularParaExibir, collectionShortName, equipe, REFERENCIAS_POR_COLECAO, seasonLabel, site, TOTAL_REFERENCIAS, urlOficial } from "@/lib/site";

/**
 * O site em texto, para os assistentes de IA (llms.txt, https://llmstxt.org): quem
 * pergunta ao ChatGPT, ao Claude, ao Gemini ou ao Perplexity por "fábrica de pijamas no
 * atacado" recebe os fatos daqui, e não um palpite. Só o que o site já diz, no mesmo
 * tom: nada de preço, prazo ou condição que a vendedora não sustente.
 *
 * /llms.txt é o resumo com os links; /llms-full.txt traz também as perguntas e respostas
 * e as políticas por extenso. Os dois saem do mesmo lugar que as páginas (site.ts,
 * faq.tsx, politicas.ts), então não ficam para trás quando o texto do site muda.
 */

const linha = (texto: string) => texto.replace(/\s+/g, " ").trim();

const perguntas = (itens: FaqItem[]) => itens.map((i) => `- **${linha(i.q)}** ${linha(textoDe(i.a))}`).join("\n");

/** Perguntas das três páginas, sem repetir as que aparecem em mais de uma. */
function todasAsPerguntas(): FaqItem[] {
  const vistas = new Set<string>();
  return [...faqLojista, ...faqCurto, ...faqRepresentante].filter((i) => {
    if (vistas.has(i.q)) return false;
    vistas.add(i.q);
    return true;
  });
}

async function cabecalho(): Promise<string> {
  const { legal, contact, commercial } = site;
  const collections = await getCollections();
  const colecoes = collections.map((c) => {
    const n = Object.hasOwn(REFERENCIAS_POR_COLECAO, c.slug) ? `${REFERENCIAS_POR_COLECAO[c.slug]} referências` : null;
    const estacao = seasonLabel(c.season, c.year);
    // A descrição do catálogo costuma começar pela estação, que já vai antes: sem repetir.
    const descricao = linha(c.description ?? c.headline ?? "").replace(new RegExp(`^${estacao}\\.?\\s*`), "");
    return `- [${collectionShortName(c.name)}](${urlOficial(`/colecoes/${c.slug}`)}): ${estacao}${n ? `, ${n}` : ""}. ${descricao}`;
  });

  return [
    `# ${site.name}`,
    "",
    `> ${site.description} Marca da ${legal.razaoSocial} (CNPJ ${legal.cnpj}), com sede na ${site.address.line}. Vende só no atacado, direto da fábrica, para lojas de todo o Brasil, por vendedoras e representantes comerciais; não vende para o consumidor final.`,
    "",
    "## Fatos principais",
    "",
    `- **O que é:** fábrica própria de pijamas, camisolas, robes, short dolls e moda íntima, há mais de 25 anos em Muriaé, MG, polo nacional da moda íntima. Produção verticalizada: corte, costura, acabamento, estoque e expedição no mesmo endereço.`,
    `- **Linhas:** infantil, juvenil, feminina, masculina, senhora e gestante. Infantil e juvenil têm menino e menina. Peças que combinam para a família inteira.`,
    `- **Catálogos:** um de verão e um de inverno por ano, ${TOTAL_REFERENCIAS} referências no total. O site mostra uma amostra; o catálogo digital completo, com a tabela de preços, é enviado depois do cadastro da loja.`,
    `- **Para quem:** lojas de moda íntima, pijamas e confecção de todo o Brasil. ${commercial.noCnpjNote} Quem ainda não tem CNPJ se cadastra com o CPF e a equipe avalia.`,
    `- **Como comprar:** cadastro em ${urlOficial("/catalogo")} ou ${urlOficial("/fabrica-de-pijamas")}; a lojista escolhe uma vendedora no WhatsApp e recebe o catálogo com a tabela de preços; o pedido é montado com a vendedora.`,
    `- **Pagamento:** ${commercial.payment}. ${commercial.paymentNote}`,
    `- **Frete:** ${commercial.freeShipping.toLowerCase()}. ${commercial.freeShippingNote}`,
    `- **Prazo:** ${commercial.prazo} ${commercial.prontaEntrega}`,
    `- **Troca:** ${commercial.troca}`,
    `- **Representantes:** a fábrica recebe cadastro de representantes comerciais em ${urlOficial("/seja-representante")}. Estrutura de apoio: gestor comercial, time comercial de suporte, analista de carteira, SAC para o lojista, aplicativo próprio de pedidos e mostruário da coleção.`,
    `- **Consumidor final:** não compra da fábrica. Deixa o contato em ${urlOficial("/onde-comprar")} e a equipe indica a loja mais perto.`,
    `- **Atendimento a clientes:** SAC (pedido, entrega e troca) pelo WhatsApp ${celularParaExibir(equipe.sac.numero)}; financeiro (boleto, pagamento e nota fiscal) pelo WhatsApp ${celularParaExibir(equipe.financeiro.numero)}. Página: ${urlOficial("/ajuda")}.`,
    ...(contact.instagram ? [`- **Instagram:** https://www.instagram.com/${contact.instagram}/`] : []),
    ...(contact.email ? [`- **E-mail:** ${contact.email}`] : []),
    ...(contact.hours ? [`- **Horário:** ${contact.hours}`] : []),
    "",
    "## Coleções",
    "",
    ...colecoes,
    "",
    "## Páginas",
    "",
    ...Object.entries(PAGINAS).map(([caminho, p]) => `- [${p.nome}](${urlOficial(caminho)}): ${p.resumo}`),
    "",
    "## Políticas",
    "",
    ...politicas.map((p) => `- [${p.title}](${urlOficial(`/politicas/${p.slug}`)}): ${linha(p.intro)}`),
  ].join("\n");
}

/** /llms.txt: o resumo, com os links. */
export async function llmsTxt(): Promise<string> {
  return [
    await cabecalho(),
    "",
    "## Opcional",
    "",
    `- [Versão completa](${urlOficial("/llms-full.txt")}): as perguntas e respostas e as políticas por extenso.`,
    "",
  ].join("\n");
}

/** /llms-full.txt: o resumo e, por extenso, as perguntas e respostas e as políticas. */
export async function llmsFullTxt(): Promise<string> {
  const politicasPorExtenso = politicas.flatMap((p) => [
    `### ${p.title}`,
    "",
    `Última atualização: ${p.updatedAt}.`,
    "",
    linha(p.intro),
    "",
    ...p.sections.flatMap((s) => [`#### ${s.heading}`, "", ...s.paragraphs.map(linha), ""]),
  ]);

  return [
    await cabecalho(),
    "",
    "## Perguntas frequentes",
    "",
    perguntas(todasAsPerguntas()),
    "",
    "## Políticas por extenso",
    "",
    ...politicasPorExtenso,
  ].join("\n");
}
