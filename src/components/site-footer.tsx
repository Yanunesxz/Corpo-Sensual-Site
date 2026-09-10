import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { politicas } from "@/lib/content/politicas";

const lojistas = [
  { href: "/catalogo", label: "Receber catálogo" },
  { href: "/fabrica-de-pijamas", label: "Como comprar da fábrica" },
  { href: "/fabrica-de-pijamas#perguntas", label: "Perguntas frequentes" },
  { href: "/programa-cashback", label: "Programa Cashback" },
];

const linkClass = "inline-flex min-h-11 items-center self-start underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-55";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const c = site.contact;

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 md:gap-x-8 md:px-8 md:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          {/* Mesma assinatura do cabeçalho: monograma + nome */}
          <div className="flex items-center gap-2.5 text-ink">
            <Image src="/images/logo-cs.png" alt="" width={160} height={160} className="h-7 w-7" />
            <span className="whitespace-nowrap text-[1.25rem] font-light leading-none">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-[15px] leading-[1.6] text-body">{site.tagline}</p>

          <address className="mt-6 text-[15px] not-italic leading-[1.6]">
            <p className="label text-ink">Fábrica e atendimento</p>
            <p className="mt-2">
              {site.legal.endereco}
              <br />
              {site.legal.cidade}, {site.legal.uf}, CEP <span className="whitespace-nowrap">{site.legal.cep}</span>
            </p>
            <div className="mt-1 flex flex-col">
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
                  {c.phoneLabel}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className={linkClass}>
                  {c.email}
                </a>
              )}
              {c.instagram && (
                <a href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noreferrer" className={linkClass}>
                  Instagram @{c.instagram}
                </a>
              )}
              <Link href="/contato" className={linkClass}>
                Fale conosco
              </Link>
            </div>
            {c.hours && <p className="mt-2 text-body">{c.hours}</p>}
          </address>
        </div>

        <Column title="Navegação" links={[...site.nav]} />
        <Column title="Lojistas" links={lojistas} />
        <Column title="Institucional" links={politicas.map((p) => ({ href: `/politicas/${p.slug}`, label: p.shortTitle }))} />
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-1.5 px-5 py-6 text-sm leading-[1.6] text-body md:flex-row md:items-start md:justify-between md:gap-8 md:px-8">
          <p>
            {site.legal.razaoSocial} · <span className="whitespace-nowrap">CNPJ {site.legal.cnpj}</span>
          </p>
          <p className="whitespace-nowrap">© {year} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="label text-ink">{title}</p>
      <ul className="mt-3 flex flex-col">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-11 items-center text-[15px] transition-opacity hover:opacity-60">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
