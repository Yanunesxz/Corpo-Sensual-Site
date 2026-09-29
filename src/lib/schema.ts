import { SITE_ORIGIN, celularParaExibir, equipe, site, urlImagem, urlOficial } from "@/lib/site";

/**
 * Dados estruturados do site (schema.org), num lugar só.
 *
 * A identidade da marca (@id e url) fica presa ao domínio oficial e não muda com a
 * hospedagem. Logo e imagens usam urlImagem(), que aponta para onde o arquivo existe
 * de fato: enquanto o domínio abre o Wix, é o endereço da Vercel.
 *
 * Tipos que parecem caber mas ficam de fora de propósito: Product e Offer (o site não
 * mostra preço), JobPosting (representante é contrato comercial, não vaga), SearchAction
 * (o site não tem busca) e FAQPage (o Google não mostra mais esse resultado para lojas).
 */
export const ORG_ID = `${SITE_ORIGIN}/#organizacao`;
export const SITE_ID = `${SITE_ORIGIN}/#site`;

/** "553299430394" vira "+55 32 99943-0394": o mesmo número, com o 9, que /ajuda mostra. */
const telefoneBR = (numero: string) => `+55 ${celularParaExibir(numero).replace(/[()]/g, "")}`;

const atende = { areaServed: "BR", availableLanguage: "pt-BR" } as const;

/** A empresa. Entra em todas as páginas, pelo layout. */
export function organizacaoJsonLd() {
  const { contact, legal } = site;
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    // Nome da marca no Instagram e na fachada.
    alternateName: "Pijamas Corpo Sensual",
    legalName: legal.razaoSocial,
    taxID: legal.cnpj,
    url: `${SITE_ORIGIN}/`,
    logo: urlImagem("/images/logo-cs.png"),
    image: urlImagem("/images/og-corpo-sensual.jpg"),
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: legal.endereco,
      addressLocality: legal.cidade,
      addressRegion: legal.uf,
      postalCode: legal.cep,
      addressCountry: "BR",
    },
    areaServed: { "@type": "Country", name: "Brasil" },
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
    ],
    ...(contact.phone ? { telephone: `+${contact.phone.startsWith("55") ? contact.phone : `55${contact.phone}`}` } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.instagram ? { sameAs: [`https://www.instagram.com/${contact.instagram}/`] } : {}),
  };
}

/** O site: é daqui que o Google tira o nome mostrado acima do resultado. */
export function siteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    name: site.name,
    url: `${SITE_ORIGIN}/`,
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
  };
}

/** Trilha de navegação: [["Coleções", "/colecoes"], ["Delícias de Verão", "/colecoes/delicias-de-verao"]]. */
export function trilhaJsonLd(itens: [nome: string, caminho: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Início", "/"] as const, ...itens].map(([name, caminho], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: urlOficial(caminho),
    })),
  };
}
