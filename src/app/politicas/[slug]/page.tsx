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
    <article className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="label">Institucional</p>
      <h1 className="h-display mt-3 text-4xl md:text-6xl">{politica.title}</h1>
      <p className="mt-3 text-xs text-ink-soft">Última atualização: {updated}</p>
      <p className="mt-8 text-[15px] leading-relaxed">{politica.intro}</p>

      {politica.sections.map((s) => (
        <section key={s.heading} className="mt-10 border-t border-line pt-6">
          <h2 className="text-base font-medium">{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
