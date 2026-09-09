import Link from "next/link";
import { site } from "@/lib/site";
import { politicas } from "@/lib/content/politicas";

const lojistas = [
  { href: "/catalogo", label: "Receber catálogo" },
  { href: "/fabrica-de-pijamas", label: "Fábrica de pijamas" },
  { href: "/programa-cashback", label: "Programa Cashback" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  const social = [
    site.contact.instagram && { href: `https://instagram.com/${site.contact.instagram}`, label: "Instagram" },
    site.contact.whatsappUrl && { href: site.contact.whatsappUrl, label: "WhatsApp" },
    site.contact.email && { href: `mailto:${site.contact.email}`, label: "E-mail" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-serif text-2xl">{site.name}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Pijamas, camisolas e moda íntima confeccionados em Muriaé, MG, há mais de 25 anos. Venda no atacado
            para lojistas de todo o Brasil.
          </p>
        </div>
        <Column title="Navegação" links={[...site.nav]} />
        <Column title="Lojistas" links={lojistas} />
        <Column
          title="Institucional"
          links={[...politicas.map((p) => ({ href: `/politicas/${p.slug}`, label: p.shortTitle })), ...social]}
        />
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-1.5 px-5 py-5 text-[11px] text-ink-soft md:flex-row md:justify-between md:px-8">
          <p>
            {site.legal.razaoSocial} · CNPJ {site.legal.cnpj} · {site.legal.endereco}, {site.legal.cidade}, CEP {site.legal.cep}
          </p>
          <p>© {year} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="label">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm transition-opacity hover:opacity-60"
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
