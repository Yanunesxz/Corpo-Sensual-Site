import Link from "next/link";
import type { Collection } from "@/lib/types";
import { collectionShortName } from "@/lib/site";
import { altFoto } from "@/lib/content/alt-fotos";
import { HeroImage } from "@/components/hero-image";
import { ArrowRight } from "@/components/icons";

/**
 * Desktop: a família de corpo inteiro (foto em pé, 4:5), na metade direita da tela. A
 * foto anterior (recorte 6:5 da mesma cena) cortava as três pessoas no joelho: para quem
 * vende pijama, o conjunto tem de aparecer dos pés à cabeça.
 */
const FOTO = "/images/colecoes/delicias-1.jpg";
/** Celular e tablet: recorte 3:2 da mesma cena, para a faixa larga e baixa do topo. */
const FOTO_CELULAR = "/images/home/hero-familia-celular.jpg";

type Props = {
  /** Coleção atual (a primeira do ano): a etiqueta da foto leva a ela. */
  atual: Collection | null;
};

/** Etiqueta sobre a foto: no celular e no tablet, no canto de cima à direita (céu), longe das cabeças. */
const ETIQUETA = "tag absolute right-4 top-4 md:right-6 md:top-6 lg:left-6 lg:right-auto";

/**
 * Capa da home. É o gatilho da barra fixa do celular (data-barra-depois).
 *
 * Celular: faixa de foto em cima e o texto no painel azul embaixo; título e botão
 * cabem na primeira tela até em 375x667. No tablet a faixa é mais alta, para as três
 * cabeças caberem. Desktop: meio a meio (como /sobre e /seja-representante), texto
 * centralizado na altura e a foto sangrando até a borda direita da tela. A sangria usa
 * a largura da própria seção (cqw), e não 100vw, para não contar a barra de rolagem e
 * não gerar rolagem lateral.
 *
 * Uma etiqueta só por cima da foto, e ela é o link para a coleção nova.
 *
 * Nada aqui revela ao rolar: é a primeira tela, e a foto é o LCP.
 */
export function CapaHome({ atual }: Props) {
  return (
    <section id="capa" data-barra-depois className="@container overflow-x-clip bg-sky">
      <div className="flex flex-col lg:mx-auto lg:grid lg:min-h-[max(36rem,min(calc(100svh-7rem),50rem))] lg:max-w-[1440px] lg:grid-cols-12 lg:gap-x-10 lg:px-12">
        {/* Texto. No DOM vem antes da foto: o leitor de tela começa pelo título. Em celular
            baixo (375x667) o respiro aperta um pouco para o botão caber sem rolar. */}
        <div className="px-5 pb-10 pt-6 min-[400px]:pt-7 [@media(max-width:767px)_and_(max-height:700px)]:pt-5 md:px-8 md:pb-14 md:pt-10 lg:col-span-6 lg:self-center lg:px-0 lg:py-16">
          <h1>
            {/* No celular, "Muriaé, MG" desce para a linha de baixo (o ponto ficava sozinho no fim da
                linha). Do tablet em diante é texto corrido (block): com o inline-flex do .eyebrow, as
                três partes viravam colunas na coluna estreita de 1024 px. */}
            <span className="eyebrow gap-0 max-sm:flex max-sm:flex-col max-sm:items-start max-sm:gap-1 sm:block">
              Fábrica de pijamas e moda íntima
              <span className="max-sm:hidden">&nbsp;·&nbsp;</span>
              <span className="whitespace-nowrap">Muriaé, MG</span>
            </span>{" "}
            <span className="t-hero mt-3 block max-w-[13ch] md:mt-4 lg:mt-6">Direto da fábrica para a sua loja</span>
          </h1>
          {/* No desktop a medida é 30rem: com 34rem a frase dava duas linhas na Inter e três na fonte
              de reserva, e o bloco (centralizado na altura) pulava quando a fonte chegava (CLS). */}
          <p className="lead mt-3.5 max-w-[34rem] [@media(max-width:767px)_and_(max-height:700px)]:mt-3 md:mt-5 lg:mt-6 lg:max-w-[30rem]">
            Pijamas, camisolas, robes e short dolls nas linhas feminina, masculina e infantil. Atacado por grade, sem pedido mínimo.
          </p>
          {/* Um botão cheio e, ao lado, um link com seta (como nas outras capas): o
              secundário não disputa com a ação principal. Entre 1024 e 1279 px a coluna do texto
              é estreita para os dois lado a lado: o link desce para baixo do botão (de 1280 em diante,
              ao lado, e quebra para baixo se não couber). */}
          <div className="mt-5 flex flex-col gap-3 [@media(max-width:767px)_and_(max-height:700px)]:mt-4 sm:flex-row sm:items-center sm:gap-8 md:mt-7 lg:mt-9 lg:flex-col lg:items-start lg:gap-4 xl:flex-row xl:flex-wrap xl:items-center xl:gap-x-8 xl:gap-y-4">
            <Link href="/catalogo" className="btn btn-primary btn-lg w-full whitespace-nowrap sm:w-auto" data-ga-local="hero">
              Quero receber o catálogo
              <ArrowRight width={18} height={18} className="seta" />
            </Link>
            <a href="#pecas" className="link-seta hidden whitespace-nowrap sm:inline-flex">
              Ver as mais vendidas
              <ArrowRight width={18} height={18} />
            </a>
          </div>
          <p className="legenda mt-3 max-w-[30rem] text-balance lg:mt-5">Catálogo digital com grade e tabela de preços.</p>
        </div>

        {/* Foto: faixa no topo do celular; no desktop, metade da grade até a borda da tela. */}
        {/* Celular baixo (360x640, 360x660): a faixa encolhe até 184 px para o botão caber na primeira tela.
            Tablet (768 a 1023 px): faixa mais alta, senão vira uma tira 2:1 que corta as cabeças. */}
        <div className="relative order-first h-[36svh] max-h-[380px] min-h-[240px] [@media(max-width:767px)_and_(max-height:700px)]:h-[28svh] [@media(max-width:767px)_and_(max-height:700px)]:min-h-[184px] md:h-[min(56vw,58svh)] md:max-h-none lg:order-none lg:col-span-6 lg:h-auto lg:max-h-none lg:min-h-0">
          <div className="absolute inset-0 overflow-hidden bg-sky-deep lg:right-[calc(-3rem_-_max(0px,(100cqw_-_1440px)/2))]">
            <HeroImage
              desktop={FOTO}
              mobile={FOTO_CELULAR}
              alt={altFoto(FOTO, "Família com pijamas da coleção Delícias de Verão")}
              priority
              quality={85}
              sizes="(min-width: 1024px) 50vw, 100vw"
              // Desktop: ancorada embaixo, para os pés ficarem no quadro (a folga sai do céu).
              desktopPosition="center 90%"
              // Celular: a foto 3:2 já aparece na altura toda. Tablet: a faixa é mais larga
              // que a foto, e o recorte sobe para as três cabeças ficarem inteiras.
              mobilePosition="center 12%"
              // A foto vira coluna só a partir de 1024 px; abaixo é a faixa do celular (q80).
              switchAt="lg"
            />
            {atual ? (
              // Sem prefetch: está na primeira tela, e o prefetch disputaria banda com a foto da capa (LCP).
              <Link href={`/colecoes/${atual.slug}`} prefetch={false} className={`${ETIQUETA} group min-h-11 px-3.5 transition-colors hover:bg-sky`}>
                <span className="h-1.5 w-1.5 rounded-full bg-noite" aria-hidden />
                {/* No celular só "Nova coleção": o nome não cabe ao lado das cabeças. O leitor de tela lê tudo. */}
                <span>
                  Nova coleção<span className="max-sm:sr-only"> · {collectionShortName(atual.name)}</span>
                </span>
                <ArrowRight width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-[3px] motion-reduce:transition-none" />
              </Link>
            ) : (
              <p className={ETIQUETA}>
                <span className="h-1.5 w-1.5 rounded-full bg-noite" aria-hidden />
                Nova coleção
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
