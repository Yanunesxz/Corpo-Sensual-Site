import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { Faq } from "@/components/faq";
import { Beneficios } from "@/components/beneficios";
import { NumerosFabrica } from "@/components/numeros-fabrica";
import { ProductGrid } from "@/components/product-grid";
import { ProducaoSection } from "@/components/producao-section";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRight } from "@/components/icons";
import { faqLojista } from "@/lib/content/faq";
import { altFoto } from "@/lib/content/alt-fotos";
import { getCategories, getProducts } from "@/lib/data";
import { pecasDaVitrine } from "@/lib/vitrine";
import { site, TOTAL_REFERENCIAS } from "@/lib/site";

// A vitrine usa as mais vendidas do catálogo: renova a cada hora, como a home.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fábrica de pijamas no atacado para lojistas",
  description:
    "Fornecedor de pijamas e camisolas para lojas, direto da fábrica em Muriaé, MG. Sem pedido mínimo, 5% no Pix e frete grátis desde R$ 1.200 no Sudeste.",
  alternates: { canonical: "/fabrica-de-pijamas" },
};

/** As três linhas, em fotos de campanha: o que vai para a arara da loja. */
const LINHAS = [
  { src: "/images/categorias/feminino.jpg", nome: "Feminino" },
  { src: "/images/categorias/masculino.jpg", nome: "Masculino" },
  { src: "/images/categorias/infantil.jpg", nome: "Infantil" },
];

/** Como a compra funciona. Fica só aqui: /sobre e a home mandam o lojista para esta página. */
const PASSOS = [
  { titulo: "Cadastro", texto: "Você informa os dados da sua loja no formulário. Leva um minuto e o CNPJ não é obrigatório." },
  {
    titulo: "Catálogo e atendimento",
    texto: "Nossa equipe comercial envia o catálogo digital com a grade e a tabela de preços e apresenta o representante da sua região.",
  },
  {
    titulo: "Primeiro pedido",
    texto: "Você monta a grade, sem valor mínimo. O pedido sai da fábrica em até 15 dias úteis, e há referências a pronta entrega.",
  },
];

const FOTO_PASSOS = "/images/lojista/hero-casal.jpg";
const ALT_PASSOS = "Casal sorrindo num balanço à beira do lago, ele de pijama azul-marinho com gola V e ela de camisola azul com renda";

export default async function FabricaPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts({})]);
  const { commercial } = site;

  return (
    <>
      {/* 1. Abertura com o formulário à vista. Quem chega do anúncio já veio decidido
          a ver preço: o cadastro está na primeira tela do desktop e logo abaixo das
          condições no celular. */}
      <section className="bg-sky" data-barra-depois>
        <div className="wrap grid gap-8 pb-12 pt-0 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-14 lg:pb-20 lg:pt-14">
          <div className="flex flex-col">
            {/* As três linhas. No celular viram a faixa de fotos do topo. */}
            <ul className="order-first -mx-5 grid grid-cols-3 gap-0.5 md:mx-0 md:gap-3 lg:order-none lg:mt-10">
              {LINHAS.map((l, i) => (
                <li key={l.nome} className="relative aspect-[4/5] overflow-hidden bg-sky-deep md:rounded-media">
                  <Image
                    src={l.src}
                    alt={altFoto(l.src, l.nome)}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 240px, 34vw"
                    className="object-cover object-[center_30%]"
                  />
                  <span className="tag absolute bottom-2 left-2 md:bottom-3 md:left-3">{l.nome}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 md:mt-0 lg:order-first">
              <h1>
                <span className="eyebrow">Atacado para lojistas</span>
                <span className="t-hero mt-3 block lg:mt-5">Pijamas direto da fábrica, sem pedido mínimo</span>
              </h1>
              <p className="lead mt-4 max-w-xl lg:mt-6">
                Cadastre a sua loja e receba o catálogo digital com grade e tabela de preços. Fábrica própria em Muriaé, MG,
                há mais de 25 anos.
              </p>
              <Beneficios variante="lista" className="mt-6 lg:mt-8" />
              <a href="#formulario" className="btn btn-primary btn-lg mt-7 w-full lg:hidden" data-ga-local="hero">
                Quero a tabela de preços
                <ArrowRight width={18} height={18} className="seta" />
              </a>
              <p className="mt-3 text-[13px] text-muted lg:mt-5">*{commercial.freeShippingNote}</p>
            </div>
          </div>

          <div id="formulario" className="scroll-mt-20 lg:self-start">
            <div className="rounded-card bg-paper p-5 shadow-[var(--shadow-card)] md:p-8">
              <p className="eyebrow">Cadastro de lojista</p>
              <h2 className="t-sub mt-2 text-[1.5rem] md:text-[1.75rem]">Receba a tabela de preços</h2>
              <p className="mt-2 text-[15px] text-body">
                Preencha os dados da sua loja. Em seguida você escolhe com quem falar no WhatsApp.
              </p>
              <div className="mt-6">
                <LeadForm source="fabrica-de-pijamas" submitLabel="Quero receber a tabela" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Prova de tamanho, em números permitidos (nada de valores). */}
      <section className="border-b border-line bg-paper" aria-label="A fábrica em números">
        <div className="wrap py-10 lg:py-14">
          <NumerosFabrica />
        </div>
      </section>

      {/* 3. O que vai para a arara: as mais vendidas, 6/6/3/3, com filtro. */}
      <section id="pecas" className="sec scroll-mt-20">
        <div className="wrap">
          <ProductGrid
            variant="vitrine"
            products={pecasDaVitrine(products)}
            categories={categories}
            eyebrow="O que você encontra no catálogo"
            title="As mais pedidas pelos lojistas"
            description={`Uma amostra das ${TOTAL_REFERENCIAS} referências do ano. O catálogo completo chega depois do cadastro, com grade e preços.`}
          />
        </div>
      </section>

      {/* 4. Como funciona: três passos, do cadastro ao primeiro pedido. */}
      <section className="bg-sky-soft">
        <div className="wrap sec grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Como funciona" title="Do cadastro ao primeiro pedido" />
            <ol className="mt-8 space-y-6">
              {PASSOS.map((p, i) => (
                <li key={p.titulo} className="flex gap-4" data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-noite font-[family-name:var(--font-button)] text-[15px] text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1">
                    <span className="t-sub block">{p.titulo}</span>
                    <span className="mt-1 block text-[15px] leading-[1.6] text-body md:text-base">{p.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
            <a href="#formulario" className="btn btn-primary btn-lg mt-9 w-full sm:w-auto">
              Quero receber a tabela
              <ArrowRight width={18} height={18} className="seta" />
            </a>
          </div>
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-card bg-sky lg:block" data-reveal>
            <Image src={FOTO_PASSOS} alt={ALT_PASSOS} fill sizes="(min-width: 1360px) 600px, 45vw" className="object-cover object-[center_30%]" />
            <span className="tag absolute bottom-4 left-4">Linhas que combinam: masculino e feminino</span>
          </div>
        </div>
      </section>

      {/* 5. Dentro da fábrica: o vídeo real da produção. */}
      <ProducaoSection escuro comLink={false} cta={{ href: "#formulario", label: "Quero receber a tabela" }} />

      {/* 6. Objeções, com a lista inteira (o rodapé aponta para cá). */}
      <section id="perguntas" className="scroll-mt-20 bg-areia">
        <div className="wrap sec grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Perguntas frequentes"
              title="Tudo o que você precisa saber antes de comprar"
              description={
                <>
                  Não achou a sua dúvida?{" "}
                  <Link href="/contato" className="link">
                    Fale com a gente
                  </Link>
                  .
                </>
              }
            />
          </div>
          <Faq items={faqLojista} abrirPrimeira />
        </div>
      </section>

      {/* 7. Fecho: a última chamada leva de volta ao formulário do topo. */}
      <section className="bg-sky" data-sem-barra>
        <div className="wrap sec text-center">
          <p className="eyebrow">Catálogo com tabela de preços</p>
          <h2 className="t-titulo mx-auto mt-3 max-w-3xl">Compre direto de quem fabrica, no valor que a sua loja precisa</h2>
          <p className="lead mx-auto mt-4 max-w-xl">
            {commercial.noMinOrder}, 5% de desconto no Pix e frete grátis a partir de R$ 1.200 no Sudeste. {commercial.noCnpjNote}
          </p>
          <a href="#formulario" className="btn btn-primary btn-lg mt-8 w-full sm:w-auto">
            Quero receber a tabela
            <ArrowRight width={18} height={18} className="seta" />
          </a>
        </div>
      </section>
    </>
  );
}
