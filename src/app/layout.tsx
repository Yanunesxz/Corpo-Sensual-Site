import type { Metadata, Viewport } from "next";
import { Fahkwang, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { site } from "@/lib/site";

// Fontes do site atual: Fahkwang nos títulos, Montserrat nos botões e uma
// grotesca leve no texto corrido (o Wix usa Helvetica Light; aqui Inter 300).
const fahkwang = Fahkwang({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-fahkwang",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Pijamas e moda íntima para lojistas`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: `${site.name} | Pijamas e moda íntima para lojistas`,
    description: site.description,
    images: [{ url: "/images/colecoes/delicias-campanha.jpg", width: 3840, height: 2160, alt: site.name }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e6f5fe",
  width: "device-width",
  initialScale: 1,
};

// Dados estruturados da empresa (Google: painel com endereço, telefone e redes).
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legal.razaoSocial,
  url: site.url,
  logo: `${site.url}/images/logo-cs.png`,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.legal.endereco,
    addressLocality: site.legal.cidade,
    addressRegion: site.legal.uf,
    postalCode: site.legal.cep,
    addressCountry: "BR",
  },
  ...(site.contact.phone || site.contact.whatsapp
    ? { telephone: `+${site.contact.phone || site.contact.whatsapp}` }
    : {}),
  ...(site.contact.email ? { email: site.contact.email } : {}),
  ...(site.contact.instagram ? { sameAs: [`https://instagram.com/${site.contact.instagram}`] } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fahkwang.variable} ${inter.variable} ${montserrat.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
      </body>
    </html>
  );
}
