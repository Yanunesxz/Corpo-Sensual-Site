import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { politicas } from "@/lib/content/politicas";
import { GA_ID } from "@/lib/analytics";
import { PreferenciasCookies } from "./preferencias-cookies";
import { CtaRodape } from "./cta-rodape";
import { EnderecoDoRodape, ForaDoRepresentante } from "./fora-do-representante";

type Item = { href: string; label: string };

const lojistas: Item[] = [
  { href: "/catalogo", label: "Receber catálogo" },
  { href: "/fabrica-de-pijamas", label: "Como comprar da fábrica" },
  { href: "/fabrica-de-pijamas#perguntas", label: "Perguntas frequentes" },
  { href: "/colecoes", label: "Coleções" },
];

/** A página inicial fica no nome da marca, logo acima; "Contato" já cobre o antigo "Fale conosco". */
const empresa: Item[] = [
  { href: "/sobre", label: "Sobre a fábrica" },
  { href: "/contato", label: "Contato" },
  { href: "/ajuda", label: "Já sou cliente" },
  { href: "/seja-representante", label: "Seja representante" },
];

const grupos: { titulo: string; links: Item[] }[] = [
  { titulo: "Lojistas", links: lojistas },
  { titulo: "A empresa", links: empresa },
  { titulo: "Políticas", links: politicas.map((p) => ({ href: `/politicas/${p.slug}`, label: p.shortTitle })) },
];

const linkClass =
  "inline-flex min-h-11 min-w-11 items-center self-start text-white/90 underline-offset-[6px] transition-colors hover:text-white hover:underline";

/**
 * Rodapé em azul-noite, como o colofão de uma revista: a marca e o endereço à esquerda,
 * três colunas de links e o nome da marca em letra grande no fim.
 *
 * No celular ele é curto (era uma tela e meia): sem a frase da marca, sem a assinatura
 * grande e com as três listas de links em <details> fechados, que abrem num toque.
 * A partir de 768 px as listas ficam abertas, em colunas.
 * data-sem-barra: a barra fixa do celular some quando o rodapé aparece.
 * cv-auto: o navegador só monta o rodapé quando ele chega perto da tela.
 */
export function SiteFooter() {
  // Componente de servidor: o ano sai no build, sem diferença de hidratação.
  const year = new Date().getFullYear();
  const c = site.contact;

  return (
    <footer
      className="cv-auto on-dark overflow-hidden bg-noite text-white [contain-intrinsic-size:auto_600px] md:[contain-intrinsic-size:auto_850px] lg:[contain-intrinsic-size:auto_680px]"
      data-sem-barra
    >
      <div className="wrap grid gap-y-8 pb-8 pt-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12 md:pb-12 md:pt-16 lg:grid-cols-12 lg:pb-16 lg:pt-24">
        <div className="md:col-span-2 lg:col-span-4 xl:col-span-5">
          {/* O nome da marca leva à página inicial (sem prefetch: o da home traria a foto da capa dela). */}
          <Link href="/" prefetch={false} className="inline-flex min-h-11 items-center gap-3">
            <Image src="/images/logo-cs-claro.png" alt="" width={64} height={64} className="h-8 w-8" />
            <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] uppercase leading-none tracking-[0.2em]">
              {site.name}
            </span>
            <span className="sr-only">, página inicial</span>
          </Link>
          <p className="mt-4 max-w-sm text-[15px] leading-[1.6] text-noite-texto max-md:hidden">{site.tagline}</p>
          <CtaRodape />

          <EnderecoDoRodape className="mt-6 text-[15px] not-italic leading-[1.6] md:mt-8 lg:mt-10">
            <p className="eyebrow">Fábrica e atendimento</p>
            <p className="mt-3 text-white">
              {site.legal.endereco}
              <br />
              {site.legal.cidade}, {site.legal.uf}, CEP <span className="whitespace-nowrap">{site.legal.cep}</span>
            </p>
            {/* Canais lado a lado, quebrando linha: em coluna eram 44 px por canal. */}
            <div className="mt-1 flex flex-wrap gap-x-6">
              <a href={site.address.mapsUrl} target="_blank" rel="noreferrer" className={linkClass}>
                Ver a fábrica no Google Maps
              </a>
              {/* Telefones têm dígitos: fora da página de representante (ver ForaDoRepresentante). */}
              <ForaDoRepresentante>
                {c.whatsappUrl && (
                  <a href={c.whatsappUrl} target="_blank" rel="noreferrer" className={linkClass}>
                    WhatsApp {c.whatsappLabel}
                  </a>
                )}
                {c.phoneUrl && (
                  <a href={c.phoneUrl} className={linkClass}>
                    Telefone {c.phoneLabel}
                  </a>
                )}
              </ForaDoRepresentante>
              {c.email && (
                <a href={`mailto:${c.email}`} className={linkClass}>
                  {c.email}
                </a>
              )}
              {c.instagram && (
                <a href={`https://www.instagram.com/${c.instagram}/`} target="_blank" rel="noreferrer" className={linkClass}>
                  Instagram @{c.instagram}
                </a>
              )}
            </div>
            {c.hours && (
              <ForaDoRepresentante>
                <p className="mt-2 text-noite-texto">{c.hours}</p>
              </ForaDoRepresentante>
            )}
          </EnderecoDoRodape>
        </div>

        {/* Celular: as três listas fechadas; um toque abre cada uma. */}
        <div className="border-t border-white/15 md:hidden">
          {grupos.map((g) => (
            <details key={g.titulo} className="group border-b border-white/15">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
                <span className="eyebrow">{g.titulo}</span>
                {/* "+" fino que gira e vira "×", como nas perguntas frequentes. */}
                <span aria-hidden className="relative h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none">
                  <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-white/80" />
                  <span className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-white/80" />
                </span>
              </summary>
              <ul className="flex flex-wrap gap-x-6 pb-3">
                {g.links.map((l) => (
                  <li key={l.href} className="flex">
                    <Link href={l.href} className={`${linkClass} text-[15px]`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {/* A partir de 768 px: as três colunas abertas, numa grade própria (entre 1024 e
            1279 px, duas colunas das 12 quebravam "Como comprar da fábrica"). */}
        <div className="hidden md:col-span-2 md:grid md:grid-cols-3 md:gap-x-10 lg:col-span-8 lg:col-start-5 lg:gap-x-8 xl:col-span-6 xl:col-start-7 xl:gap-x-10">
          {grupos.map((g) => (
            <div key={g.titulo}>
              <p className="eyebrow">{g.titulo}</p>
              <ul className="mt-3 flex flex-col">
                {g.links.map((l) => (
                  <li key={l.href} className="flex">
                    <Link href={l.href} className={`${linkClass} text-[15px]`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Assinatura em letra grande: só desenho, discreta, e só a partir de 768 px.
          A 40% o azul-claro fica a 3,3:1 sobre o azul-noite (mínimo de texto grande); a 25%
          ficava a 2,1:1 e o Lighthouse do desktop acusava contraste, mesmo sendo enfeite. */}
      <div className="wrap pb-4 max-md:hidden" aria-hidden>
        <p className="select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[10.4vw] leading-[0.9] tracking-[-0.01em] text-sky/40 lg:text-[min(10.4vw,10.75rem)]">
          {site.name}
        </p>
      </div>

      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-1 py-4 text-[13px] leading-[1.6] text-noite-texto md:flex-row md:items-center md:justify-between md:gap-8 md:py-6">
          <p>
            {site.legal.razaoSocial}
            <span className="max-md:hidden"> · </span>
            <span className="block whitespace-nowrap md:inline">CNPJ {site.legal.cnpj}</span>
          </p>
          {/* Sem GA não há aviso de cookies, então não há o que mudar. */}
          {GA_ID ? <PreferenciasCookies /> : null}
          <p className="whitespace-nowrap">
            © {year} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
