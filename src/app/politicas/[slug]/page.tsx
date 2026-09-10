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
    <>
      {/* Abertura em azul-claro; o texto da política vem no branco logo abaixo */}
      <section className="bg-sky">
        <div className="mx-auto max-w-2xl px-5 py-14 md:px-8 md:py-20">
          <p className="label">Institucional</p>
          <h1 className="h-hero mt-3 text-[2rem] md:text-[2.375rem]">{politica.title}</h1>
          <p className="mt-4 text-sm text-body">
            Última atualização: <time dateTime={politica.updatedAt}>{updated}</time>
          </p>

          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Outras políticas">
            {politicas.map((p) => (
              <Link key={p.slug} href={`/politicas/${p.slug}`} className={`chip ${p.slug === politica.slug ? "chip-active" : ""}`} aria-current={p.slug === politica.slug ? "page" : undefined}>
                {p.shortTitle}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <article className="mx-auto max-w-2xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-[1.125rem] leading-[1.6]">{politica.intro}</p>

        {politica.sections.map((s) => (
          <section key={s.heading} className="mt-10 border-t border-line pt-8">
            <h2 className="h-display text-2xl md:text-3xl">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 text-[1.125rem] leading-[1.6] text-body">
                {p}
              </p>
            ))}
          </section>
        ))}

        <p className="mt-10 border-t border-line pt-8 text-sm text-body">
          Dúvidas sobre esta política?{" "}
          <Link href="/contato" className="link text-sm">
            Fale com a gente
          </Link>
          .
        </p>
      </article>
    </>
  );
}
