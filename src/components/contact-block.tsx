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

const linkClass = "inline-flex min-h-11 items-center self-start underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-55";

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
    <div className={`grid gap-8 ${compact || hideAddress ? "" : "md:grid-cols-2"}`}>
      {!hideAddress && (
        <address className="text-[15px] not-italic leading-relaxed">
          <p className="label text-ink-soft">Fábrica e atendimento</p>
          <p className="mt-2">
            {site.legal.razaoSocial}
            <br />
            {site.legal.endereco}
            <br />
            {site.legal.cidade}, {site.legal.uf}, CEP <span className="whitespace-nowrap">{site.legal.cep}</span>
          </p>
          <a href={site.address.mapsUrl} target="_blank" rel="noreferrer" className={`${linkClass} text-[13px]`}>
            Abrir no Google Maps
          </a>
          {c.hours && (
            <p className="mt-3">
              <span className="label text-ink-soft">Horário</span>
              <br />
              {c.hours}
            </p>
          )}
        </address>
      )}

      <div className="text-[15px] leading-relaxed">
        <p className="label text-ink-soft">Canais</p>
        {channels.length > 0 ? (
          <ul className="mt-1 flex flex-col">
            {channels.map((ch) => (
              <li key={ch.href} className="flex">
                <a href={ch.href} className={linkClass} {...(ch.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {ch.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-ink-soft">
            Use o{" "}
            <a href={formHref} className="underline">
              {onContactPage ? "formulário abaixo" : "formulário da página de contato"}
            </a>{" "}
            e retornamos em horário comercial.
          </p>
        )}
        {hideAddress ? (
          <Link href="/contato" className={`${linkClass} mt-2 text-[13px]`}>
            Endereço, mapa e CNPJ
          </Link>
        ) : (
          <p className="mt-4 text-sm text-ink-soft">
            CNPJ <span className="whitespace-nowrap">{site.legal.cnpj}</span>
          </p>
        )}
      </div>
    </div>
  );
}
