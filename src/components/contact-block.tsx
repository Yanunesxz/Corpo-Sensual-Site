import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Endereço, canais e horário. Usado na página de contato, no Sobre e no fim das coleções.
 * Só mostra os canais configurados nas variáveis de ambiente; sempre mostra endereço e mapa.
 */
export function ContactBlock({ compact = false }: { compact?: boolean }) {
  const c = site.contact;
  const channels = [
    c.whatsappUrl && { href: c.whatsappUrl, label: `WhatsApp ${c.whatsappLabel}`, external: true },
    c.phoneUrl && { href: c.phoneUrl, label: `Telefone ${c.phoneLabel}`, external: false },
    c.email && { href: `mailto:${c.email}`, label: c.email, external: false },
    c.instagram && { href: `https://instagram.com/${c.instagram}`, label: `Instagram @${c.instagram}`, external: true },
  ].filter(Boolean) as { href: string; label: string; external: boolean }[];

  return (
    <div className={`grid gap-8 ${compact ? "" : "md:grid-cols-2"}`}>
      <address className="text-[15px] not-italic leading-relaxed">
        <p className="label text-ink-soft">Fábrica e atendimento</p>
        <p className="mt-2">
          {site.legal.razaoSocial}
          <br />
          {site.legal.endereco}
          <br />
          {site.legal.cidade}, {site.legal.uf}, CEP {site.legal.cep}
        </p>
        <a href={site.address.mapsUrl} target="_blank" rel="noreferrer" className="link mt-3 text-[13px]">
          Abrir no Google Maps
        </a>
        {c.hours && (
          <p className="mt-4">
            <span className="label text-ink-soft">Horário</span>
            <br />
            {c.hours}
          </p>
        )}
      </address>

      <div className="text-[15px] leading-relaxed">
        <p className="label text-ink-soft">Canais</p>
        {channels.length > 0 ? (
          <ul className="mt-2 flex flex-col">
            {channels.map((ch) => (
              <li key={ch.href}>
                <a href={ch.href} className="link self-start py-1" {...(ch.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {ch.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-ink-soft">
            Use o formulário da{" "}
            <Link href="/contato" className="underline">
              página de contato
            </Link>{" "}
            e retornamos em horário comercial.
          </p>
        )}
        <p className="mt-4 text-sm text-ink-soft">CNPJ {site.legal.cnpj}</p>
      </div>
    </div>
  );
}
