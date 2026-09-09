import Link from "next/link";
import { site } from "@/lib/site";
import { politicas } from "@/lib/content/politicas";

const lojistas = [
  { href: "/catalogo", label: "Receber catálogo" },
  { href: "/fabrica-de-pijamas", label: "Fábrica de pijamas" },
  { href: "/fabrica-de-pijamas#perguntas", label: "Perguntas frequentes" },
  { href: "/programa-cashback", label: "Programa Cashback" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  const c = site.contact;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:grid-cols-2 md:gap-x-8 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl">{site.name}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">{site.tagline}</p>

          <address className="mt-6 text-sm not-italic leading-relaxed">
            <p className="label text-ink-soft">Fábrica e atendimento</p>
            <p className="mt-2">
              {site.legal.endereco}
              <br />
              {site.legal.cidade}, {site.legal.uf}, CEP {site.legal.cep}
            </p>
            <a href={site.address.mapsUrl} target="_blank" rel="noreferrer" className="link mt-2 text-[13px]">
              Ver no mapa
            </a>
            <div className="mt-4 flex flex-col">
              {c.whatsappUrl && (
                <a href={c.whatsappUrl} target="_blank" rel="noreferrer" className="link self-start py-1">
                  WhatsApp {c.whatsappLabel}
                </a>
              )}
              {c.phoneUrl && (
                <a href={c.phoneUrl} className="link self-start py-1">
                  {c.phoneLabel}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="link self-start py-1">
                  {c.email}
                </a>
              )}
              {c.instagram && (
                <a href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noreferrer" className="link self-start py-1">
                  Instagram @{c.instagram}
                </a>
              )}
              <Link href="/contato" className="link self-start py-1">
                Fale conosco
              </Link>
            </div>
            {c.hours && <p className="mt-3 text-ink-soft">{c.hours}</p>}
          </address>
        </div>

        <Column title="Navegação" links={[...site.nav]} />
        <Column title="Lojistas" links={lojistas} />
        <Column title="Institucional" links={politicas.map((p) => ({ href: `/politicas/${p.slug}`, label: p.shortTitle }))} />
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-1.5 px-5 py-5 text-xs leading-relaxed text-ink-soft md:flex-row md:items-start md:justify-between md:gap-8 md:px-8">
          <p>
            {site.legal.razaoSocial} · CNPJ {site.legal.cnpj}
            <br className="md:hidden" />
            <span className="hidden md:inline"> · </span>
            {site.address.line}
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
      <p className="label text-ink-soft">{title}</p>
      <ul className="mt-3 flex flex-col">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-11 items-center text-sm transition-opacity hover:opacity-60">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
