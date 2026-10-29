import { isValidElement, type ReactElement, type ReactNode } from "react";
import type { FaqItem } from "@/components/faq";
import type { Collection } from "@/lib/types";
import { atualizadaEm, PAGINAS } from "@/lib/content/paginas";
import { REFERENCIAS_POR_COLECAO, SITE_ORIGIN, celularParaExibir, collectionShortName, equipe, seasonLabel, site, urlImagem, urlOficial } from "@/lib/site";

/**
 * Dados estruturados do site (schema.org), num lugar só.
 *
 * A identidade da marca (@id e url) fica presa ao domínio oficial e não muda com a
 * hospedagem. Logo e imagens usam urlImagem(), que aponta para onde o arquivo existe
 * de fato: enquanto o domínio abre o Wix, é o endereço da Vercel.
 *
 * O que entra e por quê:
 * - Organization e WebSite em todas as páginas (layout): a empresa, o endereço, os canais,
 *   as linhas de produto e os perfis oficiais. É o que o Google usa no painel da marca e o
 *   que os assistentes de IA citam quando alguém pergunta pela fábrica.
 * - WebPage (ou AboutPage, ContactPage, CollectionPage) em cada página, com trilha de
 *   navegação, data de atualização e imagem principal.
 * - FAQPage onde há perguntas e respostas: o Google já não destaca FAQ de loja no
 *   resultado, mas os assistentes de IA leem as respostas prontas daqui.
 * - ItemList nas coleções: o que cada uma tem.
 *
 * Fica de fora de propósito: Product e Offer (o site não mostra preço, e o Google avisa
 * de "oferta ausente"), JobPosting (representante é contrato comercial, não vaga) e
 * SearchAction (o site não tem busca).
 */
export const ORG_ID = `${SITE_ORIGIN}/#organizacao`;
export const SITE_ID = `${SITE_ORIGIN}/#site`;

/** O Perfil da Empresa no Google (o mesmo que o botão "Ver no mapa" abre). */
const PERFIL_GOOGLE = "https://www.google.com/maps/place/?q=place_id:ChIJTysc9h7GvAARF9yfn08Zr4M";

/** As seis linhas, como o site as apresenta. */
const LINHAS = ["Infantil", "Juvenil", "Feminina", "Masculina", "Senhora", "Gestante"];

/** "553299430394" vira "+55 32 99943-0394": o mesmo número, com o 9, que /ajuda mostra. */
const telefoneBR = (numero: string) => `+55 ${celularParaExibir(numero).replace(/[()]/g, "")}`;

const atende = { areaServed: "BR", availableLanguage: "pt-BR" } as const;

/**
 * O texto de uma resposta do FAQ, sem as tags: "A troca pode ser pedida em até 15 dias.
 * Veja a política de trocas." Um link vira só o texto dele.
 */
export function textoDe(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textoDe).join("");
  if (isValidElement(node)) return textoDe((node as ReactElement<{ children?: ReactNode }>).props.children);
  return "";
}

const limpo = (texto: string) => texto.replace(/\s+/g, " ").trim();

const endereco = () => ({
  "@type": "PostalAddress",
  streetAddress: site.legal.endereco,
  addressLocality: site.legal.cidade,
  addressRegion: site.legal.uf,
  postalCode: site.legal.cep,
  addressCountry: "BR",
});

/** A empresa. Entra em todas as páginas, pelo layout. */
export function organizacaoJsonLd() {
  const { contact, legal } = site;
  const sameAs = [PERFIL_GOOGLE, ...(contact.instagram ? [`https://www.instagram.com/${contact.instagram}/`] : [])];
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    // Nome da marca no Instagram e na fachada.
    alternateName: ["Pijamas Corpo Sensual", legal.razaoSocial],
    legalName: legal.razaoSocial,
    taxID: legal.cnpj,
    url: `${SITE_ORIGIN}/`,
    logo: { "@type": "ImageObject", url: urlImagem("/images/logo-cs.png") },
    image: urlImagem("/images/og-corpo-sensual.jpg"),
    description: site.description,
    slogan: "Direto da fábrica para a sua loja",
    address: endereco(),
    location: {
      "@type": "Place",
      name: `Fábrica ${site.name}`,
      address: endereco(),
      hasMap: PERFIL_GOOGLE,
    },
    foundingLocation: { "@type": "Place", name: "Muriaé, MG, Brasil" },
    areaServed: { "@type": "Country", name: "Brasil" },
    brand: { "@type": "Brand", name: site.name },
    // O que a fábrica faz e vende: é por estes termos que os assistentes de IA a encontram.
    knowsAbout: [
      "fábrica de pijamas",
      "pijamas no atacado",
      "pijamas para lojistas",
      "camisolas",
      "robes",
      "short dolls",
      "moda íntima",
      "pijamas infantis e juvenis",
      "pijamas femininos e masculinos",
      "pijamas para senhoras e gestantes",
      "polo de moda íntima de Muriaé, MG",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Linhas de pijamas e moda íntima",
      itemListElement: LINHAS.map((linha) => ({ "@type": "OfferCatalog", name: `Linha ${linha.toLowerCase()}` })),
    },
    // Os mesmos canais de /ajuda. O número das vendedoras fica de fora de propósito:
    // ele só aparece depois do cadastro, que cria o lead no CRM.
    contactPoint: [
      {
        "@type": "ContactPoint",
        name: "SAC",
        contactType: "customer service",
        telephone: telefoneBR(equipe.sac.numero),
        url: `https://wa.me/${equipe.sac.numero}`,
        ...atende,
      },
      {
        "@type": "ContactPoint",
        name: "Financeiro",
        contactType: "billing support",
        telephone: telefoneBR(equipe.financeiro.numero),
        url: `https://wa.me/${equipe.financeiro.numero}`,
        ...atende,
      },
      {
        "@type": "ContactPoint",
        name: "Comercial (lojistas e representantes)",
        contactType: "sales",
        url: urlOficial("/catalogo"),
        ...atende,
      },
    ],
    ...(contact.phone ? { telephone: `+${contact.phone.startsWith("55") ? contact.phone : `55${contact.phone}`}` } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    sameAs,
  };
}

/** O site: é daqui que o Google tira o nome mostrado acima do resultado. */
export function siteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    name: site.name,
    alternateName: "Pijamas Corpo Sensual",
    url: `${SITE_ORIGIN}/`,
    inLanguage: "pt-BR",
    description: site.description,
    publisher: { "@id": ORG_ID },
  };
}

/** Trilha de navegação: [["Coleções", "/colecoes"], ["Delícias de Verão", "/colecoes/delicias-de-verao"]]. */
export function trilhaJsonLd(itens: [nome: string, caminho: string][], id?: string) {
  return {
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: [["Início", "/"] as const, ...itens].map(([name, caminho], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: urlOficial(caminho),
    })),
  };
}

/** Perguntas e respostas de uma página, no formato que o Google e os assistentes leem. */
export function faqJsonLd(itens: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: itens.map((item) => ({
      "@type": "Question",
      name: limpo(item.q),
      acceptedAnswer: { "@type": "Answer", text: limpo(textoDe(item.a)) },
    })),
  };
}

export type TipoDePagina = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

export type DadosDaPagina = {
  /** Caminho da página: "/sobre", "/colecoes/entrelacos". */
  caminho: string;
  /** O mesmo título e descrição do metadata da página. */
  titulo: string;
  descricao: string;
  tipo?: TipoDePagina;
  /** Imagem principal (caminho em public/ ou URL). Padrão: a da lista de páginas. */
  imagem?: string | null;
  /** Data da última mudança de conteúdo (AAAA-MM-DD). Padrão: a da lista de páginas. */
  atualizada?: string;
  /** Trilha abaixo de "Início". Padrão: o nome da página na lista; vazia na home. */
  trilha?: [nome: string, caminho: string][];
  /** Perguntas e respostas da página: a página vira também FAQPage. */
  faq?: FaqItem[];
  /** Lista de itens da página (coleções, peças), já no formato de ItemList. */
  lista?: ReturnType<typeof listaJsonLd>;
};

/**
 * A página em si: tipo, título, descrição, data, imagem e trilha de navegação, ligada ao
 * site e à empresa. Com `faq`, a mesma página é também FAQPage (é assim que o Google pede:
 * o tipo na página, não num nó solto).
 */
export function paginaJsonLd(p: DadosDaPagina) {
  const url = urlOficial(p.caminho);
  const fixa = Object.hasOwn(PAGINAS, p.caminho) ? PAGINAS[p.caminho] : null;
  const imagem = p.imagem === undefined ? fixa?.imagem : p.imagem;
  const trilha = p.trilha ?? (p.caminho === "/" ? [] : fixa ? [[fixa.nome, p.caminho] as [string, string]] : []);
  const trilhaId = `${url}#trilha`;
  const comTrilha = trilha.length > 0;
  const tipo = p.tipo ?? "WebPage";

  const pagina = {
    "@type": p.faq ? [tipo, "FAQPage"] : tipo,
    "@id": `${url}#pagina`,
    url,
    name: p.titulo,
    description: p.descricao,
    inLanguage: "pt-BR",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    dateModified: p.atualizada ?? atualizadaEm(p.caminho),
    ...(imagem ? { primaryImageOfPage: { "@type": "ImageObject", url: urlImagem(imagem) }, image: urlImagem(imagem) } : {}),
    ...(comTrilha ? { breadcrumb: { "@id": trilhaId } } : {}),
    // O título e o parágrafo de abertura de cada página, para leitura em voz alta e resumo.
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".lead"] },
    // Com FAQ, o mainEntity é o das perguntas; a lista não entra junto.
    ...(p.faq ? { mainEntity: faqJsonLd(p.faq).mainEntity } : p.lista ? { mainEntity: p.lista } : {}),
  };

  return [pagina, ...(comTrilha ? [trilhaJsonLd(trilha, trilhaId)] : [])];
}

/** Uma lista de itens com nome, link (opcional) e imagem (opcional). */
export function listaJsonLd(nome: string, itens: { nome: string; caminho?: string; imagem?: string | null; descricao?: string }[]) {
  return {
    "@type": "ItemList",
    name: nome,
    numberOfItems: itens.length,
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      ...(item.caminho ? { url: urlOficial(item.caminho) } : {}),
      ...(item.imagem ? { image: urlImagem(item.imagem) } : {}),
      ...(item.descricao ? { description: item.descricao } : {}),
    })),
  };
}

/** As coleções do ano, para a página /colecoes. */
export function listaDeColecoesJsonLd(collections: Collection[]) {
  return listaJsonLd(
    "Catálogos de verão e inverno",
    collections.map((c) => {
      const referencias = Object.hasOwn(REFERENCIAS_POR_COLECAO, c.slug) ? REFERENCIAS_POR_COLECAO[c.slug] : null;
      const estacao = seasonLabel(c.season, c.year);
      return {
        nome: `${collectionShortName(c.name)} (${estacao})`,
        caminho: `/colecoes/${c.slug}`,
        imagem: c.hero_image_url,
        descricao: [referencias ? `${referencias} referências` : null, c.headline ?? c.description].filter(Boolean).join(". "),
      };
    }),
  );
}
