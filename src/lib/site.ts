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
} as const;

export function whatsappLink(message: string): string {
  if (!site.contact.whatsappUrl) return "";
  return `${site.contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
