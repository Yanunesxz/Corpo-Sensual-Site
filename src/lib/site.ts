/**
 * Dados institucionais e de contato usados em todo o site.
 * Os contatos vêm de variáveis de ambiente para poderem mudar sem commit.
 */

/** Lê uma variável de ambiente tratando vazio como ausente (o Vercel importa o .env.example com valores vazios). */
const env = (name: string): string => (process.env[name] ?? "").trim();

const whatsappDigits = env("NEXT_PUBLIC_WHATSAPP").replace(/\D/g, "");
const phoneDigits = env("NEXT_PUBLIC_TELEFONE").replace(/\D/g, "");

/** (32) 3721-0000 ou (32) 99999-9999 a partir só dos dígitos. */
export function formatPhone(digits: string): string {
  const d = digits.replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}

/**
 * Endereço oficial da marca. Canonical, sitemap, robots.txt e dados estruturados
 * usam SEMPRE este endereço, em qualquer deploy: o site pode estar sendo servido por
 * sitecs.vercel.app, mas quem aparece no Google é o domínio oficial.
 * É fixo de propósito. Quando o domínio for ligado à Vercel, a variável de produção
 * dela pode virar "corposensual.com.br" (sem www), que redireciona.
 */
export const SITE_ORIGIN = "https://www.corposensual.com.br";

/** Endereço absoluto e oficial de uma página: urlOficial("/sobre"). */
export function urlOficial(caminho: string): string {
  return new URL(caminho, SITE_ORIGIN).href;
}

/**
 * Origem das imagens de pré-visualização (og:image) e do logo do schema. Enquanto o
 * domínio oficial ainda abre o Wix, os arquivos só existem no endereço da Vercel.
 * Quando o domínio for adicionado ao projeto, o deploy seguinte passa a usar o
 * oficial sozinho. Não muda nada na indexação.
 */
const ORIGEM_DAS_IMAGENS = (() => {
  const prod = env("VERCEL_PROJECT_PRODUCTION_URL");
  return !prod || /(^|\.)corposensual\.com\.br$/.test(prod) ? SITE_ORIGIN : `https://${prod}`;
})();

/** Endereço absoluto de um arquivo de public/: urlImagem("/images/logo-cs.png"). */
export function urlImagem(caminho: string): string {
  return new URL(caminho, ORIGEM_DAS_IMAGENS).href;
}

const legal = {
  razaoSocial: "Confecções Corpo Sensual Ltda",
  cnpj: "07.564.390/0001-71",
  endereco: "Rua São Geraldo, 190, Dornelas",
  cidade: "Muriaé",
  uf: "MG",
  cep: "36884-210",
};

export const site = {
  name: "Corpo Sensual",
  tagline: "Fábrica de pijamas e moda íntima em Muriaé, MG. Venda no atacado para lojas de todo o Brasil.",
  description:
    "Fábrica própria de pijamas, camisolas, robes e moda íntima em Muriaé, MG, há mais de 25 anos. Atacado para lojistas de todo o Brasil, sem pedido mínimo.",
  url: SITE_ORIGIN,
  legal,
  /** Endereço em uma linha e link para o mapa. */
  address: {
    line: `${legal.endereco}, ${legal.cidade} - ${legal.uf}, CEP ${legal.cep}`,
    /** Abre o Perfil da Empresa no Google (nota e avaliações), não só o ponto no mapa. */
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Corpo Sensual, ${legal.endereco}, ${legal.cidade} - ${legal.uf}`)}&query_place_id=ChIJTysc9h7GvAARF9yfn08Zr4M`,
  },
  contact: {
    whatsapp: whatsappDigits,
    whatsappUrl: whatsappDigits ? `https://wa.me/${whatsappDigits}` : "",
    whatsappLabel: whatsappDigits ? formatPhone(whatsappDigits) : "",
    phone: phoneDigits,
    phoneUrl: phoneDigits ? `tel:+${phoneDigits.startsWith("55") ? phoneDigits : `55${phoneDigits}`}` : "",
    phoneLabel: phoneDigits ? formatPhone(phoneDigits) : "",
    /** Perfil oficial (23 mil seguidores). A variável só serve para trocar sem commit. */
    instagram: (env("NEXT_PUBLIC_INSTAGRAM") || "pijamascorposensual").replace(/^@/, ""),
    email: env("NEXT_PUBLIC_EMAIL"),
    /** Ex.: "Segunda a sexta, das 8h às 17h" */
    hours: env("NEXT_PUBLIC_HORARIO"),
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/sobre", label: "Sobre" },
    { href: "/colecoes", label: "Coleções" },
    { href: "/fabrica-de-pijamas", label: "Para lojistas" },
    { href: "/ajuda", label: "Ajuda" },
    { href: "/contato", label: "Contato" },
  ],
  /** Condições comerciais exibidas para lojistas. Atualize aqui quando mudarem. */
  commercial: {
    /** Regra da fábrica: como vendemos. Não é um portão de CNPJ. */
    salesNote: "Venda no atacado, por grade, sem pedido mínimo.",
    /** Para onde o título ao lado já diz que não há mínimo, e repetir soaria estranho. */
    wholesaleNote: "Venda no atacado, por grade.",
    /** Convite para quem ainda não tem CNPJ: o caso é avaliado, não recusado. */
    noCnpjNote: "Ainda não tem CNPJ? Fale com a gente.",
    /** Não há valor mínimo de pedido. É argumento de venda, não ressalva. */
    noMinOrder: "Sem pedido mínimo",
    installments: "Parcelamento sem juros no cartão",
    pixDiscount: "5% de desconto no Pix",
    freeShipping: "Frete grátis a partir de R$ 1.200,00 no Sudeste",
    /** O piso do frete grátis muda por região. Complementa `freeShipping`. */
    freeShippingNote: "Nas demais regiões, o frete grátis vale a partir de R$ 2.000,00.",
    paymentMethods: "Aceitamos Pix, boleto e cartão.",
    leadTime: "O pedido sai da fábrica em até 15 dias úteis. Temos referências a pronta entrega e, conforme o pedido, o envio pode sair no mesmo dia.",
    /** Prazo para pedir troca de peça com defeito, em dias corridos após o recebimento. */
    exchangeDays: 15,
  },
} as const;

/**
 * Quantas referências cada coleção tem no catálogo fechado. O site publica só
 * uma parte delas: 145 vêm do PDF Verão 2027 e 65 do catálogo Entrelaços.
 * Fica aqui para o número não ser digitado de novo em cada página.
 */
export const REFERENCIAS_POR_COLECAO: Record<string, number> = {
  "delicias-de-verao": 145,
  entrelacos: 65,
};

/** Soma das referências das coleções do ano. */
export const TOTAL_REFERENCIAS = Object.values(REFERENCIAS_POR_COLECAO).reduce((soma, n) => soma + n, 0);

/** Há pelo menos um canal direto de contato configurado? */
export function hasDirectContact(): boolean {
  const c = site.contact;
  return Boolean(c.whatsappUrl || c.phoneUrl || c.email);
}

export function whatsappLink(message: string): string {
  if (!site.contact.whatsappUrl) return "";
  return `${site.contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * WhatsApp da equipe, cada número para um tipo de conversa.
 *
 * Os números estão exatamente como o Yan passou em 29/09/2026, que é como o
 * próprio WhatsApp mostra os contatos de MG: DDD 32 e oito dígitos, sem o 9 na
 * frente. O CRM segue a mesma regra e não põe nem tira o 9. Se algum link abrir a
 * pessoa errada, o ajuste é aqui: acrescentar o 9 logo depois do 32.
 *
 * São números públicos, feitos para aparecer no site. Não são segredo.
 */
export const equipe = {
  /** Fabian, gerente comercial. Só para quem vai começar como representante: aparece depois desse cadastro. */
  gerenteComercial: { nome: "Fabian", numero: "553285119260" },
  /** Pedido, entrega, troca e peça com defeito. */
  sac: { nome: "SAC", numero: "553299430394" },
  /** Boleto, pagamento e nota fiscal. */
  financeiro: { nome: "Financeiro", numero: "553288397936" },
  /** Quem vende: aparecem para escolher depois do cadastro de compra, que já foi ao CRM. */
  vendedoras: [
    { nome: "Nicoli", numero: "553298541737" },
    { nome: "Simone", numero: "553288546656" },
  ],
} as const;

export type Vendedora = (typeof equipe.vendedoras)[number];

/**
 * Número de celular para mostrar na tela, com o 9 que o discador precisa:
 * "553299430394" vira "(32) 99943-0394". O link do WhatsApp não usa isto.
 */
export function celularParaExibir(numero: string): string {
  const d = numero.replace(/\D/g, "").replace(/^55/, "");
  // DDD + 8 dígitos começando em 6 a 9 é celular no formato antigo, sem o 9.
  if (d.length === 10 && /^[6-9]$/.test(d[2])) return formatPhone(`${d.slice(0, 2)}9${d.slice(2)}`);
  return formatPhone(d);
}

/** Link de WhatsApp com a mensagem já escrita. */
export function linkWhatsApp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

/** "Coleção Frescor" -> "Frescor", para títulos grandes. */
export function collectionShortName(name: string): string {
  return name.replace(/^cole[cç][aã]o\s+/i, "");
}

/** Rótulo de temporada usado em títulos e etiquetas. */
export function seasonLabel(season: "verao" | "inverno" | "atemporal", year?: number | null): string {
  const base = season === "verao" ? "Primavera / Verão" : season === "inverno" ? "Outono / Inverno" : "Atemporal";
  return year ? `${base} ${year}` : base;
}
