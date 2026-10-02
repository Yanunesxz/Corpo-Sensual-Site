import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getCollections, getProducts } from "@/lib/data";
import { TOTAL_REFERENCIAS } from "@/lib/site";
import { ColecoesVitrine } from "@/components/colecoes-vitrine";
import { Condicoes } from "@/components/condicoes";
import { Linhas } from "@/components/linhas";
import { ArrowRight } from "@/components/icons";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Coleções de pijamas de verão e inverno",
  description: "Conheça as coleções de pijamas, camisolas, robes e moda íntima da Corpo Sensual. Duas coleções por ano, venda no atacado para lojistas.",
  alternates: { canonical: "/colecoes" },
};

/* Os cartões logo abaixo já dizem o nome, a estação e as referências de cada coleção. */
const LEAD_CAPA = `Verão e inverno: ${TOTAL_REFERENCIAS} referências feitas na nossa fábrica, em Muriaé, MG. Aqui você vê uma seleção; o catálogo digital traz todas, com grade e tabela de preços.`;

export default async function ColecoesPage() {
  const [collections, categories] = await Promise.all([getCollections(), getCategories()]);

  // Quais linhas cada coleção tem, para o cartão dizer algo concreto:
  // "145 referências · feminino, masculino, infantil". Na ordem das categorias.
  const linhasPorColecao: Record<string, string[]> = Object.fromEntries(
    await Promise.all(
      collections.map((c) =>
        getProducts({ collectionId: c.id }).then((pecas) => {
          const temLinha = new Set(pecas.map((p) => p.category?.slug).filter(Boolean));
          return [c.slug, categories.filter((cat) => temLinha.has(cat.slug)).map((cat) => cat.name.toLowerCase())] as const;
        }),
      ),
    ),
  );

  // "Compre por linha" leva à grade filtrada da coleção atual (a primeira da lista).
  const atual = collections[0];

  return (
    <>
      {/* Capa: título à esquerda, apoio e chamada à direita no desktop. É o gatilho da barra fixa. */}
      <section className="bg-sky" data-barra-depois>
        {/* Capa baixa: quem chega quer ver roupa. No celular o primeiro cartão de coleção já
            aparece na primeira tela; no desktop, os dois rostos. */}
        <div className="wrap pb-8 pt-8 md:pb-20 md:pt-16 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10 lg:py-16">
          <div className="lg:col-span-6">
            <p className="eyebrow eyebrow-fio">Coleções</p>
            <h1 className="t-hero mt-3 max-w-[12ch]">Duas coleções por ano</h1>
          </div>
          <div className="mt-6 max-w-2xl lg:col-span-6 lg:col-start-7 lg:mt-0 xl:col-span-5 xl:col-start-8">
            {/* Um só nó de texto: com os números interpolados o React parte o parágrafo em
                vários nós, e quando a Inter troca a fonte de reserva cada pedaço "pula" de linha
                (CLS 0,22 medido). Inteiro, o parágrafo só se reacomoda por dentro.
                Medida de 22,5rem no celular (~48 caracteres): entre 400 e 640 px a Inter e a
                fonte de reserva quebram no mesmo número de linhas, e nada abaixo se mexe. */}
            <p className="lead max-w-[22.5rem] sm:max-w-none">{LEAD_CAPA}</p>
            <div className="mt-5 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
              <Link href="/catalogo" className="btn btn-primary btn-lg w-full whitespace-nowrap sm:w-auto" data-ga-local="hero">
                Quero receber o catálogo
                <ArrowRight width={18} height={18} className="seta" />
              </Link>
              {/* No celular sai: o mesmo destino está no menu ("Para lojistas") e as condições, na faixa abaixo. */}
              <Link href="/fabrica-de-pijamas" className="link-seta whitespace-nowrap max-sm:hidden">
                Como comprar
                <ArrowRight width={18} height={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* As coleções: um cartão por linha no celular, lado a lado a partir de 768 px. */}
      <section aria-label="As coleções" className="pb-16 pt-5 md:pb-24 md:pt-8 lg:pb-32 lg:pt-10">
        <div className="wrap">
          {collections.length === 0 ? (
            <p className="text-base text-body">Nenhuma coleção publicada no momento.</p>
          ) : (
            <ColecoesVitrine collections={collections} variante="grande" prioridade linhasPorColecao={linhasPorColecao} />
          )}
        </div>
      </section>

      {/* Compre por linha: cada linha abre a grade da coleção atual já filtrada. */}
      {atual && categories.length > 0 && (
        <section className="sec bg-areia">
          <div className="wrap">
            <h2 className="t-titulo" data-reveal>
              Compre por linha
            </h2>
            <div className="mt-8 lg:mt-12">
              <Linhas categories={categories} hrefBase={`/colecoes/${atual.slug}`} />
            </div>
          </div>
        </section>
      )}

      {/* Condições: as quatro perguntas da lojista antes do fecho. */}
      <section aria-label="Condições para lojistas" className="border-b border-line">
        <div className="wrap py-8 lg:py-11" data-reveal>
          <Condicoes variante="faixa" />
        </div>
      </section>

      {/* Fecho: a barra fixa some aqui, o botão já está na tela. */}
      <section className="sec bg-sky" data-sem-barra>
        <div className="wrap lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <h2 className="t-titulo max-w-[16ch] lg:col-span-6" data-reveal>
            Quer essas peças na sua loja?
          </h2>
          <div className="mt-4 max-w-xl lg:col-span-6 lg:col-start-7 lg:mt-0 xl:col-span-5 xl:col-start-8" data-reveal style={{ ["--atraso" as string]: "80ms" }}>
            <p className="lead">Cadastre a sua loja e receba o catálogo completo com a tabela de preços.</p>
            <Link href="/catalogo" className="btn btn-primary btn-lg mt-7 w-full sm:w-auto">
              Quero receber o catálogo
              <ArrowRight width={18} height={18} className="seta" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
