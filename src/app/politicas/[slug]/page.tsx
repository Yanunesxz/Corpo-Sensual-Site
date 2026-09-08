import type { Metadata } from "next";
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
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-32 md:px-8 md:pt-44">
      <p className="eyebrow">Institucional</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">{politica.title}</h1>
      <p className="mt-3 text-sm text-ink-soft">Última atualização: {updated}</p>
      <p className="mt-8 text-lg leading-relaxed text-ink-soft">{politica.intro}</p>

      {politica.sections.map((s) => (
        <section key={s.heading} className="mt-10">
          <h2 className="text-xl font-medium">{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="mt-3 leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
