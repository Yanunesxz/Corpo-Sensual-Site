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
  if (!politica) return { title: "Política" };
  return {
    title: politica.title,
    description: politica.intro,
    alternates: { canonical: `/politicas/${politica.slug}` },
  };
}

/** Âncora de cada seção: "Quais dados coletamos" vira "quais-dados-coletamos". */
function ancora(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function PoliticaPage({ params }: Props) {
  const { slug } = await params;
  const politica = getPolitica(slug);
  if (!politica) notFound();

  const updated = new Date(`${politica.updatedAt}T12:00:00`).toLocaleDateString("pt-BR");
  const secoes = politica.sections.map((s) => ({ ...s, id: ancora(s.heading) }));

  const sumario = (
    <ol className="space-y-1">
      {secoes.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex min-h-11 items-center py-1.5 text-[15px] leading-[1.4] text-body underline-offset-[5px] transition-colors hover:text-ink hover:underline"
          >
            {s.heading}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Topo: título, data e as cinco políticas (a aberta marcada com aria-current). */}
      <section className="bg-sky">
        <div className="wrap pb-10 pt-10 md:pb-14 md:pt-14 lg:pb-16 lg:pt-20">
          <p className="eyebrow eyebrow-fio">Institucional</p>
          <h1 className="t-hero mt-3 max-w-[16ch]">{politica.title}</h1>
          <p className="mt-5 text-[15px] text-body">
            Última atualização: <time dateTime={politica.updatedAt}>{updated}</time>
          </p>

          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Outras políticas">
            {politicas.map((p) => (
              <Link
                key={p.slug}
                href={`/politicas/${p.slug}`}
                className={`chip ${p.slug === politica.slug ? "chip-active" : ""}`}
                aria-current={p.slug === politica.slug ? "page" : undefined}
              >
                {p.shortTitle}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="wrap pb-16 pt-8 md:pb-20 md:pt-12 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:pb-28 lg:pt-20">
        {/* Sumário: recolhido no celular, preso à esquerda no desktop. */}
        <aside className="lg:col-span-3">
          <div className="faq border-t border-line lg:hidden">
            <details>
              <summary>Nesta página</summary>
              <nav aria-label="Nesta página" className="pb-4">
                {sumario}
              </nav>
            </details>
          </div>
          <nav aria-label="Nesta página" className="hidden lg:sticky lg:top-28 lg:block">
            <p className="eyebrow eyebrow-fio">Nesta página</p>
            <div className="mt-4 border-l border-line pl-5">{sumario}</div>
          </nav>
        </aside>

        {/* Texto: 17 px, coluna de leitura de até 68 caracteres por linha. */}
        <article className="mt-10 max-w-[33.5rem] lg:col-span-7 lg:col-start-5 lg:mt-0">
          <p className="lead text-ink">{politica.intro}</p>

          {secoes.map((s) => (
            <section key={s.id} id={s.id} className="mt-10 scroll-mt-6 border-t border-line pt-8 md:mt-12 md:pt-10">
              <h2 className="t-sub">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 text-[1.0625rem] leading-[1.7] text-body">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <p className="mt-12 border-t border-line pt-8 text-[15px] text-body">
            Dúvidas sobre esta política?{" "}
            <Link href="/contato" className="link">
              Fale com a gente
            </Link>
            .
          </p>
        </article>
      </div>
    </>
  );
}
