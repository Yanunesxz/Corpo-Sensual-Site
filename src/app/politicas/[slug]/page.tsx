import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolitica, politicas } from "@/lib/content/politicas";

type Props = PageProps<"/politicas/[slug]">;

export function generateStaticParams() {
  return politicas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const politica = getPolitica(slug);
  return { title: politica?.title ?? "Política", description: politica?.intro };
}

export default async function PoliticaPage({ params }: Props) {
  const { slug } = await params;
  const politica = getPolitica(slug);
  if (!politica) notFound();

  const updated = new Date(`${politica.updatedAt}T12:00:00`).toLocaleDateString("pt-BR");

  return (
    <article className="mx-auto max-w-2xl px-5 py-10 md:px-8 md:py-16">
      <p className="label">Institucional</p>
      <h1 className="h-display mt-3 text-4xl md:text-6xl">{politica.title}</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Última atualização: <time dateTime={politica.updatedAt}>{updated}</time>
      </p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Outras políticas">
        {politicas.map((p) => (
          <Link key={p.slug} href={`/politicas/${p.slug}`} className={`chip ${p.slug === politica.slug ? "chip-active" : ""}`} aria-current={p.slug === politica.slug ? "page" : undefined}>
            {p.shortTitle}
          </Link>
        ))}
      </nav>

      <p className="mt-8 text-[15px] leading-relaxed md:text-base">{politica.intro}</p>

      {politica.sections.map((s) => (
        <section key={s.heading} className="mt-10 border-t border-line pt-6">
          <h2 className="h-display text-xl md:text-2xl">{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="mt-3 text-[15px] leading-relaxed text-ink-soft md:text-base">
              {p}
            </p>
          ))}
        </section>
      ))}

      <p className="mt-10 border-t border-line pt-6 text-sm text-ink-soft">
        Dúvidas sobre esta política?{" "}
        <Link href="/contato" className="underline">
          Fale com a gente
        </Link>
        .
      </p>
    </article>
  );
}
