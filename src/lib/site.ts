/**
 * Dados institucionais e de contato usados em todo o site.
 * Os contatos vêm de variáveis de ambiente para poderem mudar sem commit.
 */
const whatsappDigits = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");

export const site = {
  name: "Corpo Sensual",
  tagline: "Moda íntima com conforto, estilo e mais de 25 anos de expertise.",
  description:
    "Confecção de pijamas, camisolas, robes e moda íntima para lojistas de todo o Brasil. Conforto, estilo e qualidade em cada peça.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.corposensual.com.br",
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
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
    email: process.env.NEXT_PUBLIC_EMAIL ?? "",
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

/** Rótulo de temporada usado em títulos e etiquetas. */
export function seasonLabel(season: "verao" | "inverno" | "atemporal", year?: number | null): string {
  const base = season === "verao" ? "Primavera / Verão" : season === "inverno" ? "Outono / Inverno" : "Atemporal";
  return year ? `${base} ${year}` : base;
}

export function whatsappLink(message: string): string {
  if (!site.contact.whatsappUrl) return "";
  return `${site.contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
