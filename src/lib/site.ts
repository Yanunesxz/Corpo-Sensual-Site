/**
 * Dados institucionais e de contato usados em todo o site.
 * Os contatos vêm de variáveis de ambiente para poderem mudar sem commit.
 */
/** Lê uma variável de ambiente tratando vazio como ausente (o Vercel importa o .env.example com valores vazios). */
const env = (name: string): string => (process.env[name] ?? "").trim();

const whatsappDigits = env("NEXT_PUBLIC_WHATSAPP").replace(/\D/g, "");

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

export const site = {
  name: "Corpo Sensual",
  tagline: "Moda íntima com conforto, estilo e mais de 25 anos de expertise.",
  description:
    "Confecção de pijamas, camisolas, robes e moda íntima para lojistas de todo o Brasil. Conforto, estilo e qualidade em cada peça.",
  url: resolveSiteUrl(),
  legal: {
    razaoSocial: "Confecções Corpo Sensual Ltda",
    cnpj: "07.564.390/0001-71",
    endereco: "R. São Geraldo, 190, Dornelas",
    cidade: "Muriaé, MG",
    cep: "36884-210",
  },
  contact: {
    whatsapp: whatsappDigits,
    whatsappUrl: whatsappDigits ? `https://wa.me/${whatsappDigits}` : "",
    instagram: env("NEXT_PUBLIC_INSTAGRAM").replace(/^@/, ""),
    email: env("NEXT_PUBLIC_EMAIL"),
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/sobre", label: "Sobre" },
    { href: "/colecoes", label: "Coleções" },
    { href: "/fabrica-de-pijamas", label: "Para lojistas" },
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

/** "Coleção Frescor" -> "Frescor", para títulos grandes. */
export function collectionShortName(name: string): string {
  return name.replace(/^cole[cç][aã]o\s+/i, "");
}

/** Rótulo de temporada usado em títulos e etiquetas. */
export function seasonLabel(season: "verao" | "inverno" | "atemporal", year?: number | null): string {
  const base = season === "verao" ? "Primavera / Verão" : season === "inverno" ? "Outono / Inverno" : "Atemporal";
  return year ? `${base} ${year}` : base;
}

export function whatsappLink(message: string): string {
  if (!site.contact.whatsappUrl) return "";
  return `${site.contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
