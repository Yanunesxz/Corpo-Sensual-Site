import Link from "next/link";
import { site } from "@/lib/site";

type Props = {
  /** Uma coluna só (usado em blocos de fechamento). */
  compact?: boolean;
  /** Omite o endereço (quando o rodapé logo abaixo já o mostra). */
  hideAddress?: boolean;
  /** Para onde apontar quando não há canais configurados. Na própria página de contato use "#formulario". */
  formHref?: string;
};

/* Mesmo desenho do .link do design system, com 44px de altura de toque. */
const linkClass =
  "inline-flex min-h-11 items-center self-start underline decoration-1 underline-offset-[5px] transition-opacity hover:opacity-60";

/**
 * Endereço, canais e horário. Usado na página de contato, no Sobre e no fim das coleções.
 * Só mostra os canais configurados nas variáveis de ambiente; sempre mostra endereço e mapa.
 */
export function ContactBlock({ compact = false, hideAddress = false, formHref = "/contato#formulario" }: Props) {
  const c = site.contact;
  const onContactPage = formHref.startsWith("#");
  const channels = [
    c.whatsappUrl && { href: c.whatsappUrl, label: `WhatsApp ${c.whatsappLabel}`, external: true },
    c.phoneUrl && { href: c.phoneUrl, label: `Telefone ${c.phoneLabel}`, external: false },
    c.email && { href: `mailto:${c.email}`, label: c.email, external: false },
    c.instagram && { href: `https://instagram.com/${c.instagram}`, label: `Instagram @${c.instagram}`, external: true },
  ].filter(Boolean) as { href: string; label: string; external: boolean }[];

  return (
    <div className={`grid gap-10 ${compact || hideAddress ? "" : "md:grid-cols-2 md:gap-12"}`}>
      {!hideAddress && (
        <address className="text-[1.0625rem] not-italic leading-[1.6]">
          <p className="label">Fábrica e atendimento</p>
          <p className="mt-2 text-ink">
            {site.legal.razaoSocial}
            <br />
            {site.legal.endereco}
            <br />
            {site.legal.cidade}, {site.legal.uf}, CEP <span className="whitespace-nowrap">{site.legal.cep}</span>
          </p>
          <a href={site.address.mapsUrl} target="_blank" rel="noreferrer" className={`${linkClass} text-[15px]`}>
            Abrir no Google Maps
          </a>
          {c.hours && (
            <p className="mt-3">
              <span className="label">Horário</span>
              <br />
              <span className="text-ink">{c.hours}</span>
            </p>
          )}
        </address>
      )}

      <div className="text-[1.0625rem] leading-[1.6]">
        {/* Na própria página de contato, sem canais configurados, o formulário já é o canal. */}
        {(channels.length > 0 || !onContactPage) && <p className="label">Canais</p>}
        {channels.length > 0 ? (
          <ul className="mt-1 flex flex-col">
            {channels.map((ch) => (
              <li key={ch.href} className="flex">
                <a
                  href={ch.href}
                  className={`${linkClass} text-ink`}
                  {...(ch.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {ch.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          !onContactPage && (
            <p className="mt-2 text-body">
              Use o{" "}
              <a href={formHref} className="underline underline-offset-[5px]">
                formulário da página de contato
              </a>{" "}
              e retornamos em horário comercial.
            </p>
          )
        )}
        {hideAddress ? (
          <Link href="/contato" className={`${linkClass} mt-2 text-[15px]`}>
            Endereço, mapa e CNPJ
          </Link>
        ) : (
          <p className="mt-5 text-sm text-body">
            CNPJ <span className="whitespace-nowrap">{site.legal.cnpj}</span>
          </p>
        )}
      </div>
    </div>
  );
}
