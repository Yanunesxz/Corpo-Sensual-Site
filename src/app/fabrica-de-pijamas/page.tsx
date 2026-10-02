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
import { equipe, site, TOTAL_REFERENCIAS } from "@/lib/site";
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
/** Fecho, só no desktop: a modelo à beira da piscina, como a capa (no celular a foto não existe nem é baixada). */
const FOTO_FECHO = "/images/home/fechamento.jpg";

const [nicoli, simone] = equipe.vendedoras;

/** Do cadastro ao primeiro pedido. Fica só aqui: a home e o /sobre mandam o lojista para esta página. */
const PASSOS = [
  { titulo: "Cadastro", texto: "Você informa os dados da sua loja. O CNPJ não é obrigatório." },
  {
    titulo: "Catálogo e atendimento",
    // O nome das vendedoras fica aqui (saiu do cartão do formulário, que começa direto pelos campos).
    texto: `Você fala com a ${nicoli.nome} ou a ${simone.nome}, nossas vendedoras, pelo WhatsApp e recebe o catálogo digital com grade e tabela de preços.`,
  },
  { titulo: "Primeiro pedido", texto: "Você monta a grade, sem pedido mínimo. O pedido sai da fábrica em até 15 dias úteis." },
];

/*
 * Na tela larga, a grade de 12 colunas ocupa a largura toda (a foto da capa sangra até
 * a borda esquerda e o azul do formulário até a direita). O texto das colunas acompanha
 * a margem do .wrap: o padding em % de um item de grade é medido sobre a largura da
 * área dele (7/12 ou 5/12 da tela), então 85,7143% = 12/7 da área e 120% = 12/5.
 * Até 1440 px fica 3rem; acima disso, cresce junto com a margem do .wrap.
 *
 * De 1024 a 1279 px a divisão é 7/5. A partir de 1280 px é meio a meio (a área de cada
 * lado é metade da tela, então 100% da área = 50vw): com 7/5 o cartão do formulário
 * ENCOLHIA conforme a tela crescia (a margem direita cresce junto com o .wrap), perdia
 * as duas colunas e o botão de envio caía 360 px abaixo da primeira tela a 1680 px.
 */
const MARGEM_ESQ = "lg:pl-[max(3rem,calc(85.7143%-720px+3rem))] xl:pl-[max(3rem,calc(100%-720px+3rem))]";
const MARGEM_DIR = "lg:pr-[max(3rem,calc(120%-720px+3rem))] xl:pr-[max(3rem,calc(100%-720px+3rem))]";

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
          className="on-photo shade-capa relative h-[78svh] max-h-[760px] min-h-[520px] overflow-hidden bg-noite lg:col-span-7 lg:row-start-1 lg:h-[calc(100svh-7rem)] lg:max-h-none lg:min-h-[640px] xl:col-span-6"
        >
          {/* A mesma foto em todas as larguras (sem direção de arte), direto pelo next/image.
              Única imagem com preload na página. Sem fetchPriority="high": no Lighthouse móvel
              (três rodadas, 01/10/2026) o LCP simulado ficou melhor sem ele (3,0 s contra 3,2 s). */}
          <Image
            src={FOTO_CAPA}
            alt={altFoto(FOTO_CAPA, "Modelo de short doll rosa à beira da piscina, coleção Delícias de Verão")}
            fill
            preload
            quality={75}
            sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 58vw, 100vw"
            className="object-cover object-[center_30%]"
          />
          <div className={`absolute inset-x-0 bottom-0 z-10 px-5 pb-7 md:px-8 md:pb-12 lg:pb-14 lg:pr-12 ${MARGEM_ESQ}`}>
            <p className="tag">
              <span className="h-1.5 w-1.5 rounded-full bg-noite" aria-hidden />
              Atacado para lojistas · {site.legal.cidade}, {site.legal.uf}
            </p>
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
          className={`scroll-mt-0 bg-sky px-5 py-6 md:px-8 md:py-12 lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:scroll-mt-48 lg:py-6 lg:pl-6 xl:col-span-6 xl:col-start-7 xl:pl-8 ${MARGEM_DIR}`}
        >
          {/* A partir de 1280 px o cartão vai até a linha do .wrap (alinhado ao botão do cabeçalho):
              560 px a 1280 e 640 px de 1440 em diante, sempre com os campos em duas colunas. */}
          <FormularioPreso className="md:mx-auto md:max-w-[36rem] lg:mx-0 lg:max-w-[34rem] xl:max-w-none">
            {/* O cartão começa pelo título e pelos campos. As condições (lista ✓ e a nota do
                asterisco) vêm depois do botão e só no desktop: no celular e no tablet a ficha
                "As condições, por escrito" está logo abaixo do cartão, e a lista em cima dos
                campos era a mesma informação três vezes seguidas. Quem atende (as duas
                vendedoras) está no passo 2 de "Como funciona". */}
            <BlocoCadastro
              id="cadastro"
              className="lg:p-6 xl:p-8"
              titulo="Receba o catálogo com a tabela de preços"
              condicoes="depois"
              classeCondicoes="max-lg:hidden"
              source="fabrica-de-pijamas"
              submitLabel="Quero receber a tabela de preços"
              nota={"*Nas demais regiões, o frete grátis vale a partir de R$ 2.000."}
            />
          </FormularioPreso>
        </aside>

        {/* C. Condições por escrito, em ficha. */}
        <section className={`wrap py-12 md:py-20 lg:col-span-7 lg:row-start-2 lg:max-w-none lg:pb-20 lg:pr-12 lg:pt-24 xl:col-span-6 ${MARGEM_ESQ}`}>
          <SectionHeading eyebrow="Condições" title="As condições, por escrito" />
          {/* Duas colunas já no celular; três só na largura toda (container query). */}
          <Condicoes variante="ficha" fundo="branco" className="mt-7 md:mt-10" />
        </section>

        {/* D. Como funciona. */}
        <section className={`wrap lg:col-span-7 lg:row-start-3 lg:max-w-none lg:pr-12 xl:col-span-6 ${MARGEM_ESQ}`}>
          <div className="border-t border-line py-12 md:py-20 lg:pb-24">
            <SectionHeading eyebrow="Como funciona" title="Do cadastro ao primeiro pedido" />
            <Passos itens={PASSOS} className="mt-8 md:mt-10" />
            <p className="mt-8 max-w-xl border-l border-line-strong pl-4 text-[15px] leading-[1.6] text-body md:mt-10" data-reveal>
              Depois da compra, o atendimento continua pelo WhatsApp: o SAC cuida de pedido, entrega e troca; o financeiro, de
              boleto e nota fiscal.
            </p>
          </div>
        </section>
      </div>

      {/* E. Vitrine: as mais vendidas, 6/6/3/3, com filtro. O cartão final volta ao formulário. */}
      {/* Reserva: a altura do conteúdo, sem o padding do .sec (ver .cv-auto no globals.css). */}
      <section id="pecas" className="cv-auto sec bg-areia [contain-intrinsic-size:auto_592px] md:[contain-intrinsic-size:auto_605px] lg:[contain-intrinsic-size:auto_648px] xl:[contain-intrinsic-size:auto_705px] min-[90rem]:[contain-intrinsic-size:auto_751px]">
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
      <section id="perguntas" className="sec bg-sky-soft">
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
            <Faq items={faqLojista} />
          </div>
        </div>
      </section>

      {/* H. Fecho: a última chamada volta ao formulário do topo. Em areia (não em azul-noite):
          o rodapé logo abaixo já é azul-noite, e os dois viravam um bloco escuro só.
          No desktop, a foto da campanha ao lado do texto, como uma página dupla. */}
      <section className="cv-auto bg-areia [contain-intrinsic-size:auto_440px] md:[contain-intrinsic-size:auto_460px] lg:[contain-intrinsic-size:auto_650px] xl:[contain-intrinsic-size:auto_800px] min-[90rem]:[contain-intrinsic-size:auto_863px]" data-sem-barra>
        <div className="wrap sec lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:py-24">
          <div className="relative hidden aspect-[4/5] overflow-hidden bg-sky-deep lg:col-span-5 lg:block" data-reveal>
            <Image
              src={FOTO_FECHO}
              alt={altFoto(FOTO_FECHO, "Modelo de regata e short brancos à beira da piscina, coleção Delícias de Verão")}
              fill
              sizes="(min-width: 1440px) 540px, (min-width: 1024px) 38vw, 1px"
              className="object-cover object-[center_35%]"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading
            eyebrow="Catálogo com tabela de preços"
            title="Compre da fábrica, no valor que a sua loja precisa"
            description={`${commercial.noMinOrder}. Cadastre a sua loja e receba o catálogo com grade e tabela de preços.`}
          />
          <div className="mt-8 md:mt-10" data-reveal>
            <a href="#formulario" className="btn btn-primary btn-lg w-full sm:w-auto">
              Quero a tabela de preços
              <ArrowRight width={18} height={18} className="seta" />
            </a>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
