/**
 * Dados institucionais e de contato usados em todo o site.
 * Os contatos vêm de variáveis de ambiente para poderem mudar sem commit.
 */

/** Lê uma variável de ambiente tratando vazio como ausente (o Vercel importa o .env.example com valores vazios). */
const env = (name: string): string => (process.env[name] ?? "").trim();

const whatsappDigits = env("NEXT_PUBLIC_WHATSAPP").replace(/\D/g, "");
const phoneDigits = env("NEXT_PUBLIC_TELEFONE").replace(/\D/g, "");

/** (32) 3721-0000 ou (32) 99999-9999 a partir só dos dígitos. */
function formatPhone(digits: string): string {
  const d = digits.replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}

/**
 * URL pública do site, nesta ordem: NEXT_PUBLIC_SITE_URL definida, domínio de
 * produção do Vercel, URL do deploy atual do Vercel, domínio oficial.
 */
function resolveSiteUrl(): string {
  const explicit = env("NEXT_PUBLIC_SITE_URL");
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = env("VERCEL_PROJECT_PRODUCTION_URL") || env("VERCEL_URL");
  if (vercel) return `https://${vercel}`;
  return "https://www.corposensual.com.br";
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
    "Confecção de pijamas, camisolas, robes e moda íntima para lojistas de todo o Brasil. Fábrica própria em Muriaé, MG, há mais de 25 anos.",
  url: resolveSiteUrl(),
  legal,
  /** Endereço em uma linha e link para o mapa. */
  address: {
    line: `${legal.endereco}, ${legal.cidade} - ${legal.uf}, CEP ${legal.cep}`,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${legal.endereco}, ${legal.cidade} - ${legal.uf}, ${legal.cep}`)}`,
  },
  contact: {
    whatsapp: whatsappDigits,
    whatsappUrl: whatsappDigits ? `https://wa.me/${whatsappDigits}` : "",
    whatsappLabel: whatsappDigits ? formatPhone(whatsappDigits) : "",
    phone: phoneDigits,
    phoneUrl: phoneDigits ? `tel:+${phoneDigits.startsWith("55") ? phoneDigits : `55${phoneDigits}`}` : "",
    phoneLabel: phoneDigits ? formatPhone(phoneDigits) : "",
    instagram: env("NEXT_PUBLIC_INSTAGRAM").replace(/^@/, ""),
    email: env("NEXT_PUBLIC_EMAIL"),
    /** Ex.: "Segunda a sexta, das 8h às 17h" */
    hours: env("NEXT_PUBLIC_HORARIO"),
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/sobre", label: "Sobre" },
    { href: "/colecoes", label: "Coleções" },
    { href: "/fabrica-de-pijamas", label: "Para lojistas" },
    { href: "/contato", label: "Contato" },
  ],
  /** Condições comerciais exibidas para lojistas. Atualize aqui quando mudarem. */
  commercial: {
    exclusive: "Venda exclusiva para lojas físicas com CNPJ ativo.",
    minOrder: "Investimento mínimo de R$ 1.200,00",
    installments: "Parcelamento em até 6x sem juros no cartão",
    freeShipping: "Frete grátis a partir de R$ 1.200,00",
    freeShippingNote: "Consulte as condições de frete grátis para a sua região.",
  },
} as const;

/** Há pelo menos um canal direto de contato configurado? */
export function hasDirectContact(): boolean {
  const c = site.contact;
  return Boolean(c.whatsappUrl || c.phoneUrl || c.email);
}

export function whatsappLink(message: string): string {
  if (!site.contact.whatsappUrl) return "";
  return `${site.contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
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
