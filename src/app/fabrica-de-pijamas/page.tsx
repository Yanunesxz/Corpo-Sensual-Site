import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlocoCadastro } from "@/components/bloco-cadastro";
import { Condicoes } from "@/components/condicoes";
import { Faq } from "@/components/faq";
import { Passos } from "@/components/passos";
import { ProducaoSection } from "@/components/producao-section";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRight } from "@/components/icons";
import { FormularioPreso } from "@/components/lojista/formulario-preso";
import { altFoto } from "@/lib/content/alt-fotos";
import { faqLojista } from "@/lib/content/faq";
import { getCategories, getProducts } from "@/lib/data";
import { site, TOTAL_REFERENCIAS } from "@/lib/site";
import { pecasDaVitrine } from "@/lib/vitrine";

// A vitrine usa as mais vendidas do catálogo: renova a cada hora, como a home.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fábrica de pijamas no atacado para lojistas",
  description:
    "Fornecedor de pijamas e camisolas para lojas, direto da fábrica em Muriaé, MG. Sem pedido mínimo, 5% no Pix e frete grátis desde R$ 1.200 no Sudeste.",
  alternates: { canonical: "/fabrica-de-pijamas" },
};

const FOTO_CAPA = "/images/lojista/capa.jpg";

/** Do cadastro ao primeiro pedido. Fica só aqui: a home e o /sobre mandam o lojista para esta página. */
const PASSOS = [
  { titulo: "Cadastro", texto: "Você informa os dados da sua loja. O CNPJ não é obrigatório." },
  {
    titulo: "Catálogo e atendimento",
    texto: "Você escolhe com quem falar no WhatsApp e recebe o catálogo digital com grade e tabela de preços.",
  },
  { titulo: "Primeiro pedido", texto: "Você monta a grade, sem pedido mínimo. O pedido sai da fábrica em até 15 dias úteis." },
];

/*
 * Na tela larga, a grade de 12 colunas ocupa a largura toda (a foto da capa sangra até
 * a borda esquerda e o azul do formulário até a direita). O texto das colunas acompanha
 * a margem do .wrap: o padding em % de um item de grade é medido sobre a largura da
 * área dele (7/12 ou 5/12 da tela), então 85,7143% = 12/7 da área e 120% = 12/5.
 * Até 1440 px fica 3rem; acima disso, cresce junto com a margem do .wrap.
 */
const MARGEM_ESQ = "lg:pl-[max(3rem,calc(85.7143%-720px+3rem))]";
const MARGEM_DIR = "lg:pr-[max(3rem,calc(120%-720px+3rem))]";

/*
 * Landing dos anúncios. Quem chega já veio decidido a ver preço, então toda chamada da
 * página leva ao formulário (#formulario) e nenhum link do corpo sai dela.
 * Celular: capa, formulário, condições, como funciona, vitrine, fábrica, perguntas, fecho.
 * Desktop: o cartão do formulário fica preso à direita da capa, das condições e do
 * "como funciona"; depois a página segue em largura total.
 */
export default async function FabricaPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts({})]);
  const { commercial } = site;

  return (
    <>
      <div className="lg:grid lg:grid-cols-12">
        {/* A. Capa: foto da campanha com o H1 por cima. É o LCP. */}
        <section
          data-barra-depois
          className="on-photo shade-capa relative h-[78svh] max-h-[760px] min-h-[520px] overflow-hidden bg-noite lg:col-span-7 lg:row-start-1 lg:h-[calc(100svh-7rem)] lg:max-h-none lg:min-h-[640px]"
        >
          {/* A mesma foto em todas as larguras (sem direção de arte), então vai direto pelo
              next/image: o HeroImage não repassa fetchPriority, e no Next 16 o preload sozinho
              deixa o LCP com prioridade baixa. Única imagem com preload na página. */}
          <Image
            src={FOTO_CAPA}
            alt={altFoto(FOTO_CAPA, "Modelo de short doll rosa à beira da piscina, coleção Delícias de Verão")}
            fill
            preload
            fetchPriority="high"
            quality={80}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover object-[center_30%]"
          />
          <div className={`absolute inset-x-0 bottom-0 z-10 px-5 pb-7 md:px-8 md:pb-12 lg:pb-14 lg:pr-12 ${MARGEM_ESQ}`}>
            <p className="tag bg-noite/90 text-white">Atacado para lojistas · {site.legal.cidade}, {site.legal.uf}</p>
            <h1 className="t-hero mt-4 max-w-[13ch] text-white lg:mt-5">
              Pijamas direto da fábrica, sem pedido mínimo
            </h1>
            <p className="lead mt-4 max-w-[34rem] text-white lg:mt-5">
              Fábrica própria há mais de 25 anos. Cadastre a sua loja e receba o catálogo com grade e tabela de preços.
            </p>
            <a href="#formulario" className="btn btn-light btn-lg mt-6 w-full md:w-auto lg:hidden" data-ga-local="hero">
              Quero a tabela de preços
              <ArrowRight width={18} height={18} className="seta" />
            </a>
          </div>
        </section>

        {/* B. Formulário. No celular vem logo depois da capa; no desktop é a coluna da direita.
            A âncora #formulario (barra fixa, vitrine, fábrica, fecho, rodapé) fica no bloco e
            não no cartão: o cartão é preso e, no desktop, a âncora nele cairia no meio dele.
            Assim o salto mostra o cartão desde o título: no desktop volta ao topo da página
            (o scroll-mt grande faz o salto parar em 0); no celular, logo abaixo da barra. */}
        <aside
          id="formulario"
          aria-label="Cadastro de lojista"
          className={`scroll-mt-0 bg-sky px-5 py-6 md:px-8 md:py-12 lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:scroll-mt-48 lg:py-10 lg:pl-6 xl:pl-8 ${MARGEM_DIR}`}
        >
          <FormularioPreso className="md:mx-auto md:max-w-[36rem] lg:mx-0 lg:max-w-[34rem]">
            <BlocoCadastro
              id="cadastro"
              className="lg:p-6 xl:p-8"
              eyebrow="Cadastro de lojista"
              titulo="Receba o catálogo com a tabela de preços"
              texto="Preencha os dados da sua loja. Em seguida você escolhe com quem falar no WhatsApp."
              condicoes
              source="fabrica-de-pijamas"
              submitLabel="Quero receber a tabela de preços"
              nota="*Nas demais regiões, o frete grátis vale a partir de R$ 2.000."
            />
          </FormularioPreso>
        </aside>

        {/* C. Condições por escrito, em ficha. */}
        <section className={`wrap py-14 md:py-20 lg:col-span-7 lg:row-start-2 lg:max-w-none lg:pb-20 lg:pr-12 lg:pt-24 ${MARGEM_ESQ}`}>
          <SectionHeading
            eyebrow="Condições"
            title="Por que comprar direto da fábrica"
            description="As condições por escrito, antes do primeiro pedido."
          />
          {/* Na coluna da esquerda do desktop, três colunas deixariam 100 a 180 px de texto
              por célula: fica em duas até 1536 px. */}
          <Condicoes variante="ficha" fundo="branco" className="mt-8 md:mt-10 lg:grid-cols-2! 2xl:grid-cols-3!" />
        </section>

        {/* D. Como funciona. */}
        <section className={`wrap lg:col-span-7 lg:row-start-3 lg:max-w-none lg:pr-12 ${MARGEM_ESQ}`}>
          <div className="border-t border-line py-14 md:py-20 lg:pb-24">
            <SectionHeading eyebrow="Como funciona" title="Do cadastro ao primeiro pedido" />
            <Passos itens={PASSOS} className="mt-8 md:mt-10" />
            <p className="mt-10 max-w-xl bg-sky-soft p-5 text-[15px] leading-[1.6] text-ink md:p-6" data-reveal>
              Depois da compra você continua atendido: o SAC cuida de pedido, entrega e troca, e o financeiro, de boleto e nota
              fiscal, pelo WhatsApp.
            </p>
          </div>
        </section>
      </div>

      {/* E. Vitrine: as mais vendidas, 6/6/3/3, com filtro. O cartão final volta ao formulário. */}
      <section id="pecas" className="sec scroll-mt-24 bg-areia">
        <div className="wrap">
          <ProductGrid
            variant="vitrine"
            products={pecasDaVitrine(products)}
            categories={categories}
            eyebrow="O que vai para a sua arara"
            title="As mais pedidas pelos lojistas"
            description={`Uma amostra das ${TOTAL_REFERENCIAS} referências do ano. O catálogo completo chega depois do cadastro, com grade e preços.`}
            fim={{ href: "#formulario", rotulo: "Quero a tabela de preços" }}
          />
        </div>
      </section>

      {/* F. Dentro da fábrica: o vídeo real da produção, as etapas e os números. */}
      <ProducaoSection escuro numeros comLink={false} cta={{ href: "#formulario", label: "Quero a tabela de preços" }} />

      {/* G. Perguntas (o rodapé e outras páginas apontam para cá). */}
      <section id="perguntas" className="sec scroll-mt-24 bg-sky-soft">
        <div className="wrap lg:grid lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
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
          <div className="mt-8 md:mt-10 lg:col-span-7 lg:mt-0" data-reveal>
            <Faq items={faqLojista} abrirPrimeira />
          </div>
        </div>
      </section>

      {/* H. Fecho: a última chamada volta ao formulário do topo. */}
      <section className="on-dark border-b border-white/10 bg-noite" data-sem-barra>
        <div className="wrap sec">
          <SectionHeading
            center
            dark
            eyebrow="Catálogo com tabela de preços"
            title="Compre direto de quem fabrica, no valor que a sua loja precisa"
            description={`${commercial.noMinOrder}, 5% de desconto no Pix e frete grátis a partir de R$ 1.200 no Sudeste. ${commercial.noCnpjNote}`}
          />
          <div className="mt-8 flex justify-center md:mt-10" data-reveal>
            <a href="#formulario" className="btn btn-light btn-lg w-full sm:w-auto">
              Quero a tabela de preços
              <ArrowRight width={18} height={18} className="seta" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
