import Link from "next/link";
import { site } from "@/lib/site";
import { politicas } from "@/lib/content/politicas";
import { Instagram, WhatsApp } from "./icons";

const lojistas = [
  { href: "/catalogo", label: "Receber catálogo" },
  { href: "/fabrica-de-pijamas", label: "Fábrica de pijamas" },
  { href: "/programa-cashback", label: "Programa Cashback" },
  { href: "/colecoes", label: "Coleções" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-cream-dark/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <p className="display text-3xl">{site.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">{site.tagline}</p>
          <div className="mt-6 flex gap-3">
            {site.contact.instagram && (
              <a
                href={`https://instagram.com/${site.contact.instagram}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-line bg-white p-2.5 text-ink transition hover:border-ink"
              >
                <Instagram width={20} height={20} />
              </a>
            )}
            {site.contact.whatsappUrl && (
              <a
                href={site.contact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="rounded-full border border-line bg-white p-2.5 text-ink transition hover:border-ink"
              >
                <WhatsApp width={20} height={20} />
              </a>
            )}
          </div>
        </div>

        <FooterColumn title="Navegação" links={[...site.nav]} />
        <FooterColumn title="Para lojistas" links={lojistas} />
        <FooterColumn
          title="Institucional"
          links={politicas.map((p) => ({ href: `/politicas/${p.slug}`, label: p.shortTitle }))}
        />
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-ink-soft md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            {site.legal.razaoSocial} · CNPJ {site.legal.cnpj}
          </p>
          <p>
            {site.legal.endereco} · {site.legal.cidade} · CEP {site.legal.cep}
          </p>
          <p>© {year} {site.name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink transition hover:text-brand">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
