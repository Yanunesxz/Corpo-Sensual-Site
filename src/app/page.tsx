import type { Metadata } from "next";
import { getCategories, getCollections, getProducts } from "@/lib/data";
import { site, TOTAL_REFERENCIAS } from "@/lib/site";
import { pecasDaVitrine } from "@/lib/vitrine";
import { Condicoes } from "@/components/condicoes";
import { ProductGrid } from "@/components/product-grid";
import { SeoPagina } from "@/components/seo-pagina";
import { SectionHeading } from "@/components/section-heading";
import { ColecoesVitrine } from "@/components/colecoes-vitrine";
import { Linhas } from "@/components/linhas";
import { ProducaoSection } from "@/components/producao-section";
import { CapaHome } from "@/components/home/capa";
import { FechoHome } from "@/components/home/fecho";

// Revalida o catálogo a cada hora sem precisar de novo deploy.
export const revalidate = 3600;

// Título e description vêm do layout (title.default).
/** Título e descrição da home: os mesmos no <title>, no Open Graph e nos dados estruturados. */
const TITULO = `${site.name}: fábrica de pijamas no atacado em Muriaé, MG`;
const DESCRICAO =
  "Fábrica própria de pijamas, camisolas, robes, short dolls e moda íntima há mais de 25 anos, nas linhas infantil, juvenil, feminina, masculina, senhora e gestante. Atacado para lojas de todo o Brasil, direto da fábrica.";

export const metadata: Metadata = {
  title: { absolute: TITULO },
  description: DESCRICAO,
  alternates: { canonical: "/" },
};

/**
 * Home: o lookbook de atacado em seis blocos, um único próximo passo (receber o
 * catálogo com a tabela de preços).
 * 1. Capa  2. Condições  3. Mais vendidas  4. Coleções e linhas  5. Dentro da fábrica
 * 6. Fecho com o formulário. Sem FAQ: as objeções já estão na faixa de condições,
 * no microtexto da capa e no formulário.
 */
export default async function HomePage() {
  const [collections, categories, products] = await Promise.all([getCollections(), getCategories(), getProducts({})]);
  const atual = collections[0] ?? null;
  const hrefAtual = atual ? `/colecoes/${atual.slug}` : "/colecoes";

  return (
    <>
      <SeoPagina caminho="/" titulo={TITULO} descricao={DESCRICAO} />

      {/* 1. Capa: proposta, botão e a foto da linha família (LCP). Gatilho da barra fixa. */}
      <CapaHome atual={atual} />

      {/* 2. As quatro perguntas da lojista, logo abaixo da dobra. */}
      <section aria-label="Condições para lojistas" className="border-b border-line">
        <div className="wrap py-8 lg:py-11">
          <Condicoes variante="faixa" />
        </div>
      </section>

      {/* 3. Vitrine: poucas mais vendidas (3/3/1/1), três espiadas "só no catálogo" e o cartão "210". */}
      {/* cv-auto: estilo, layout e pintura só quando a seção chega perto da tela. A altura
          reservada (a do conteúdo, sem o padding do .sec; ver .cv-auto no globals.css) fica
          perto da real em cada largura, medida em 390, 768, 1024, 1280, 1440 e 1680 px: com a
          reserva errada, o Voltar do navegador devolvia a página fora do lugar. */}
      <section id="pecas" className="cv-auto sec bg-areia [contain-intrinsic-size:auto_623px] md:[contain-intrinsic-size:auto_636px] lg:[contain-intrinsic-size:auto_679px] xl:[contain-intrinsic-size:auto_690px] min-[90rem]:[contain-intrinsic-size:auto_784px]">
        <div className="wrap">
          <ProductGrid
            variant="vitrine"
            products={pecasDaVitrine(products)}
            categories={categories}
            eyebrow="Mais vendidas"
            title="As mais pedidas pelos lojistas"
            description={`Uma amostra das ${TOTAL_REFERENCIAS} referências do ano. O catálogo digital traz todas, com a tabela de preços.`}
          />
        </div>
      </section>

      {/* 4. As duas coleções do ano (spread de revista) e o atalho por linha. */}
      {collections.length > 0 && (
        <section id="colecoes" className="cv-auto sec [contain-intrinsic-size:auto_922px] md:[contain-intrinsic-size:auto_1185px] lg:[contain-intrinsic-size:auto_1465px] xl:[contain-intrinsic-size:auto_1805px] min-[90rem]:[contain-intrinsic-size:auto_1895px]">
          <div className="wrap">
            <SectionHeading eyebrow="Coleções" title="Catálogos de verão e inverno, para a família inteira" />
            <div className="mt-8 lg:mt-14">
              <ColecoesVitrine collections={collections.slice(0, 2)} variante="spread" />
            </div>
            {categories.length > 0 && (
              <div className="mt-14 lg:mt-24">
                <h3 className="t-sub" data-reveal>
                  Compre por linha
                </h3>
                <div className="mt-4 lg:mt-8">
                  <Linhas categories={categories} hrefBase={hrefAtual} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Prova de estrutura: vídeo real, as etapas, os números e o botão. */}
      <ProducaoSection escuro numeros cta={{ href: "/catalogo", label: "Quero receber o catálogo" }} id="fabrica" />

      {/* 6. Fecho: o cadastro na própria home. */}
      <FechoHome />
    </>
  );
}
