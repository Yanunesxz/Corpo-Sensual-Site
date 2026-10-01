import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { politicas } from "@/lib/content/politicas";
import { GA_ID } from "@/lib/analytics";
import { PreferenciasCookies } from "./preferencias-cookies";
import { CtaRodape } from "./cta-rodape";

const lojistas = [
  { href: "/catalogo", label: "Receber catálogo" },
  { href: "/fabrica-de-pijamas", label: "Como comprar da fábrica" },
  { href: "/fabrica-de-pijamas#perguntas", label: "Perguntas frequentes" },
  { href: "/colecoes", label: "Coleções" },
];

/** Cobre todos os itens de site.nav (Início, Sobre, Coleções, Lojistas, Ajuda, Contato) e o representante. */
const empresa = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre a fábrica" },
  { href: "/contato", label: "Contato" },
  { href: "/ajuda", label: "Já sou cliente" },
  { href: "/seja-representante", label: "Seja representante" },
];

const linkClass =
  "inline-flex min-h-11 items-center self-start text-white/90 underline-offset-[6px] transition-colors hover:text-white hover:underline";

/**
 * Rodapé em azul-noite, como o colofão de uma revista: a marca e a chamada da página
 * à esquerda, três colunas de links e o nome da marca em letra grande no fim.
 * data-sem-barra: a barra fixa do celular some quando o rodapé aparece.
 */
export function SiteFooter() {
  // Componente de servidor: o ano sai no build, sem diferença de hidratação.
  const year = new Date().getFullYear();
  const c = site.contact;

  return (
    <footer className="on-dark overflow-hidden bg-noite text-white" data-sem-barra>
      <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 pb-10 pt-12 md:gap-x-10 md:gap-y-12 md:pb-12 md:pt-16 lg:grid-cols-12 lg:pb-16 lg:pt-24">
        <div className="col-span-2 lg:col-span-4 xl:col-span-5">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-cs-claro.png" alt="" width={64} height={64} className="h-8 w-8" />
            <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] uppercase leading-none tracking-[0.2em]">
              {site.name}
            </span>
          </div>
          <p className="mt-5 max-w-sm text-[15px] leading-[1.6] text-noite-texto">{site.tagline}</p>
          <CtaRodape />

          <address className="mt-8 text-[15px] not-italic leading-[1.6] lg:mt-10">
            <p className="eyebrow">Fábrica e atendimento</p>
            <p className="mt-3 text-white">
              {site.legal.endereco}
              <br />
              {site.legal.cidade}, {site.legal.uf}, CEP <span className="whitespace-nowrap">{site.legal.cep}</span>
            </p>
            {/* Canais lado a lado, quebrando linha: em coluna eram 44 px por canal. */}
            <div className="mt-1 flex flex-wrap gap-x-6">
              <a href={site.address.mapsUrl} target="_blank" rel="noreferrer" className={linkClass}>
                Ver no mapa
              </a>
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
              <Link href="/contato" className={linkClass}>
                Fale conosco
              </Link>
            </div>
            {c.hours && <p className="mt-2 text-noite-texto">{c.hours}</p>}
          </address>
        </div>

        {/* As três colunas de links numa grade própria: entre 1024 e 1279 px, duas colunas
            das 12 (121 px) quebravam "Receber catálogo" e "Como comprar da fábrica". */}
        <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-10 lg:col-span-8 lg:col-start-5 lg:gap-x-8 xl:col-span-6 xl:col-start-7 xl:gap-x-10">
          <Column title="Lojistas" links={lojistas} />
          <Column title="A empresa" links={empresa} />
          <Column
            title="Políticas"
            links={politicas.map((p) => ({ href: `/politicas/${p.slug}`, label: p.shortTitle }))}
            className="col-span-2 md:col-span-1"
            // Lado a lado no celular (cabem em duas linhas); em coluna a partir de 768 px.
            listaClassName="flex flex-wrap gap-x-6 md:flex-col md:gap-x-0"
          />
        </div>
      </div>

      {/* Assinatura em letra grande: só desenho. */}
      <div className="wrap pb-4" aria-hidden>
        <p className="select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[8.6vw] uppercase leading-[0.85] tracking-[0.06em] text-sky/90 lg:text-[min(7.4vw,8.5rem)]">
          {site.name}
        </p>
      </div>

      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-1 py-6 text-[13px] leading-[1.6] text-noite-texto md:flex-row md:items-center md:justify-between md:gap-8">
          <p>
            {site.legal.razaoSocial} · <span className="whitespace-nowrap">CNPJ {site.legal.cnpj}</span>
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

function Column({
  title,
  links,
  className = "",
  listaClassName = "flex flex-col",
}: {
  title: string;
  links: { href: string; label: string }[];
  className?: string;
  listaClassName?: string;
}) {
  return (
    <div className={className}>
      <p className="eyebrow">{title}</p>
      <ul className={`mt-3 ${listaClassName}`}>
        {links.map((l) => (
          <li key={l.href} className="flex">
            {/* "Início" sem prefetch: o da home traria a foto da capa dela (ver site-header). */}
            <Link href={l.href} prefetch={l.href === "/" ? false : undefined} className={`${linkClass} text-[15px]`}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
