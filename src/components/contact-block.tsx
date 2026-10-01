import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowRight } from "./icons";

type Props = {
  /** Uma coluna só (usado em blocos de fechamento). */
  compact?: boolean;
  /** Omite o endereço (quando o rodapé logo abaixo já o mostra). */
  hideAddress?: boolean;
  /** Para onde apontar quando não há canais configurados. Na própria página de contato use "#formulario". */
  formHref?: string;
};

/*
 * .link do design system (fio que encolhe no hover) numa caixa de 44 px de altura:
 * os utilitários zeram o padding/margem negativos do .link e a altura vem do min-h-11.
 */
const linkClass = "link my-0 inline-flex min-h-11 items-center py-0 [background-position:0_calc(100%-0.4rem)]";

/**
 * Endereço, canais e horário. Usado na página de contato.
 * Só mostra os canais configurados nas variáveis de ambiente; sempre mostra endereço e mapa.
 */
export function ContactBlock({ compact = false, hideAddress = false, formHref = "/contato#formulario" }: Props) {
  const c = site.contact;
  const onContactPage = formHref.startsWith("#");
  const channels = [
    c.whatsappUrl && { href: c.whatsappUrl, rotulo: "WhatsApp", label: c.whatsappLabel, external: true },
    c.phoneUrl && { href: c.phoneUrl, rotulo: "Telefone", label: c.phoneLabel, external: false },
    c.email && { href: `mailto:${c.email}`, rotulo: "E-mail", label: c.email, external: false },
    c.instagram && { href: `https://www.instagram.com/${c.instagram}/`, rotulo: "Instagram", label: `@${c.instagram}`, external: true },
  ].filter(Boolean) as { href: string; rotulo: string; label: string; external: boolean }[];

  return (
    <div className={`grid gap-10 ${compact || hideAddress ? "" : "md:grid-cols-2 md:gap-12"}`}>
      {!hideAddress && (
        <address className="not-italic">
          <p className="eyebrow">Fábrica e atendimento</p>
          <p className="mt-4 text-[1.0625rem] leading-[1.65] text-ink">
            {site.legal.razaoSocial}
            <br />
            {site.legal.endereco}
            <br />
            {site.legal.cidade}, {site.legal.uf}, CEP <span className="whitespace-nowrap">{site.legal.cep}</span>
          </p>
          <a href={site.address.mapsUrl} target="_blank" rel="noreferrer" className="link-seta mt-3">
            Abrir no Google Maps
            <span className="sr-only"> (abre em outra aba)</span>
            <ArrowRight width={18} height={18} />
          </a>
          {c.hours && (
            <div className="mt-8">
              <p className="eyebrow">Horário</p>
              <p className="mt-3 text-[1.0625rem] leading-[1.6] text-ink">{c.hours}</p>
            </div>
          )}
        </address>
      )}

      <div>
        {/* Na própria página de contato, sem canais configurados, o formulário já é o canal. */}
        {(channels.length > 0 || !onContactPage) && <p className="eyebrow">Canais</p>}
        {channels.length > 0 ? (
          <ul className="mt-3 border-t border-line">
            {channels.map((ch) => (
              <li key={ch.href} className="flex flex-wrap items-center justify-between gap-x-4 border-b border-line py-1.5">
                <span className="text-[13px] text-muted">{ch.rotulo}</span>
                <a
                  href={ch.href}
                  className={`${linkClass} text-[1.0625rem]`}
                  {...(ch.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {ch.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          !onContactPage && (
            <p className="mt-3 text-[1.0625rem] leading-[1.6] text-body">
              Use o{" "}
              <a href={formHref} className="link">
                formulário da página de contato
              </a>{" "}
              e retornamos em horário comercial.
            </p>
          )
        )}
        {hideAddress ? (
          <Link href="/contato" className="link-seta mt-4">
            Endereço, mapa e CNPJ
            <ArrowRight width={18} height={18} />
          </Link>
        ) : (
          <p className="legenda mt-6">
            CNPJ <span className="whitespace-nowrap">{site.legal.cnpj}</span>
          </p>
        )}
      </div>
    </div>
  );
}
