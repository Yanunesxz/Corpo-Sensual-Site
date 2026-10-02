import type { Metadata, Viewport } from "next";
import { Fahkwang, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BarraCta } from "@/components/barra-cta";
import { Revelar } from "@/components/revelar";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { GA_ID } from "@/lib/analytics";
import { organizacaoJsonLd, siteJsonLd } from "@/lib/schema";
import { SITE_ORIGIN, site, urlImagem } from "@/lib/site";

// Fontes da marca: Fahkwang nos títulos, Montserrat nos botões e rótulos e Inter
// no texto corrido (400 no corpo e 500 nos rótulos: legível no celular, no sol).
const fahkwang = Fahkwang({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fahkwang",
  display: "swap",
});

// Inter e Montserrat sem preload: o texto já aparece na fonte de reserva ajustada pelo
// next/font, e as duas não disputam banda com a foto da capa (LCP). Só a Fahkwang, que
// é a fonte do H1, continua com preload.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: false,
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-montserrat",
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  // Canonical e demais endereços relativos saem sempre no domínio oficial.
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${site.name} | Pijamas e moda íntima no atacado`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    // Sem title/description aqui: o Next copia o título e a description de cada página
    // para og:title, og:description e as tags do Twitter. Link mandado no WhatsApp
    // mostra a página certa, não a home.
    // Cartão de 1200x630 e 84 KB, recortado da foto de campanha. O arquivo original
    // tem 1,7 MB e o robô de pré-visualização do WhatsApp descarta imagem desse peso.
    images: [{ url: urlImagem("/images/og-corpo-sensual.jpg"), width: 1200, height: 630, alt: site.name }],
  },
  // Search Console. O primeiro token é o que o site do Wix publica hoje em todas as páginas:
  // mantido aqui, a propriedade atual continua verificada quando o domínio vier para a Vercel.
  verification: {
    google: ["WxjBulcUXD4Rnp4dMh1ZxJWenkFR2cxfTpJvsyAHVlI", (process.env.GOOGLE_SITE_VERIFICATION ?? "").trim()].filter(Boolean),
  },
};

export const viewport: Viewport = {
  // Mesma cor da faixa de condições do topo: a barra do navegador emenda com ela.
  themeColor: "#0e2f44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: o roteador desliga a rolagem suave na troca de página (a página
    // nova abre no topo, sem deslizar); as âncoras (#formulario, #pecas) continuam suaves.
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${fahkwang.variable} ${inter.variable} ${montserrat.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* Empresa e site para o Google e os assistentes de IA (src/lib/schema.ts). */}
        <JsonLd data={[organizacaoJsonLd(), siteJsonLd()]} />
        {/* Primeiro Tab da página: pula a faixa, a navegação e o cabeçalho. */}
        <a
          href="#conteudo"
          className="btn btn-primary btn-sm sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        {/* Base da tela: barra do polegar (só abaixo de 1024), WhatsApp flutuante e,
            com GA, o aviso de cookies. Uma coisa por vez (ver globals.css). */}
        <BarraCta />
        <WhatsAppButton />
        <Revelar />
        {/* Sem ID do GA o componente nem entra na página: nenhum script do Google. */}
        {GA_ID ? <Analytics /> : null}
      </body>
    </html>
  );
}
