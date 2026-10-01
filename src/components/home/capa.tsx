import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/types";
import { collectionShortName, REFERENCIAS_POR_COLECAO, seasonLabel } from "@/lib/site";
import { altFoto } from "@/lib/content/alt-fotos";
import { HeroImage } from "@/components/hero-image";
import { ArrowRight } from "@/components/icons";

const FOTO = "/images/home/hero-familia.jpg";

type Props = {
  /** Coleção atual (a primeira do ano): etiqueta da foto e cartão do desktop. */
  atual: Collection | null;
};

/**
 * Capa da home. É o gatilho da barra fixa do celular (data-barra-depois).
 *
 * Celular: faixa de foto em cima e o texto no painel azul embaixo; título e botão
 * cabem na primeira tela até em 375x667. Desktop: grade de 12 colunas, texto em 5
 * colunas centralizado na altura e a foto em 7 colunas sangrando até a borda direita
 * da tela. A sangria usa a largura da própria seção (cqw), e não 100vw, para não
 * contar a barra de rolagem e não gerar rolagem lateral.
 *
 * Nada aqui revela ao rolar: é a primeira tela, e a foto é o LCP.
 */
export function CapaHome({ atual }: Props) {
  const etiqueta = atual ? `Nova coleção · ${seasonLabel(atual.season, atual.year)}` : "Nova coleção";
  const refs = atual ? REFERENCIAS_POR_COLECAO[atual.slug] : undefined;

  return (
    <section id="capa" data-barra-depois className="@container overflow-x-clip bg-sky">
      <div className="flex flex-col lg:mx-auto lg:grid lg:min-h-[max(36rem,min(calc(100svh-7rem),46rem))] lg:max-w-[1440px] lg:grid-cols-12 lg:gap-x-10 lg:px-12">
        {/* Texto. No DOM vem antes da foto: o leitor de tela começa pelo título. Em celular
            baixo (375x667) o respiro aperta um pouco para o botão caber sem rolar. */}
        <div className="px-5 pb-10 pt-6 min-[400px]:pt-7 [@media(max-width:767px)_and_(max-height:700px)]:pt-5 md:px-8 md:pb-14 md:pt-10 lg:col-span-5 lg:self-center lg:px-0 lg:py-16">
          <h1>
            <span className="eyebrow">Fábrica de pijamas e moda íntima · Muriaé, MG</span>{" "}
            <span className="t-hero mt-3 block max-w-[13ch] md:mt-4 lg:mt-6">Direto da fábrica para a sua loja</span>
          </h1>
          <p className="lead mt-3.5 max-w-[34rem] [@media(max-width:767px)_and_(max-height:700px)]:mt-3 md:mt-5 lg:mt-6">
            Pijamas, camisolas, robes e short dolls nas linhas feminina, masculina e infantil. Atacado por grade, sem pedido mínimo.
          </p>
          {/* Lado a lado enquanto o texto ocupa a largura toda; nas 5 colunas do desktop os
              dois não cabem numa linha, então empilham com a mesma largura. */}
          <div className="mt-5 flex flex-col gap-3 [@media(max-width:767px)_and_(max-height:700px)]:mt-4 sm:flex-row sm:items-center md:mt-7 lg:mt-9 lg:w-max lg:flex-col lg:items-stretch">
            <Link href="/catalogo" className="btn btn-primary btn-lg w-full sm:w-auto" data-ga-local="hero">
              Quero receber o catálogo
              <ArrowRight width={18} height={18} className="seta" />
            </Link>
            <a href="#pecas" className="btn btn-outline btn-lg hidden sm:inline-flex">
              Ver as mais vendidas
            </a>
          </div>
          <p className="legenda mt-3 max-w-[30rem] text-balance lg:mt-5">
            Catálogo digital com grade e tabela de preços. Ainda não tem CNPJ? Fale com a gente.
          </p>
        </div>

        {/* Foto: faixa no topo do celular; no desktop, 7 colunas até a borda da tela. */}
        <div className="relative order-first h-[36svh] max-h-[380px] min-h-[240px] lg:order-none lg:col-span-7 lg:h-auto lg:max-h-none lg:min-h-0">
          <div className="absolute inset-0 overflow-hidden bg-sky-deep lg:right-[calc(-3rem_-_max(0px,(100cqw_-_1440px)/2))]">
            <HeroImage
              desktop={FOTO}
              alt={altFoto(FOTO, "Família com pijamas da coleção Delícias de Verão")}
              priority
              quality={85}
              sizes="(min-width: 1024px) 58vw, 100vw"
              desktopPosition="center 45%"
              mobilePosition="center 38%"
              // A foto vira coluna só a partir de 1024 px; abaixo é a faixa do celular (q80).
              switchAt="lg"
            />
            <p className="tag absolute left-4 top-4 md:left-6 md:top-6">
              <span className="h-1.5 w-1.5 rounded-full bg-noite" aria-hidden />
              {etiqueta}
            </p>
            {atual && (
              <Link
                href={`/colecoes/${atual.slug}`}
                className="group absolute bottom-6 left-6 hidden items-center gap-4 border border-line bg-paper py-3 pl-3 pr-5 transition-colors hover:border-ink lg:flex"
              >
                <span className="relative h-[70px] w-14 flex-none overflow-hidden bg-areia">
                  <Image src="/images/colecoes/delicias-4.jpg" alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block font-[family-name:var(--font-display)] text-[18px] leading-tight text-ink">{collectionShortName(atual.name)}</span>
                  <span className="mt-1 block whitespace-nowrap text-[13px] text-muted">
                    {refs ? `${refs} referências · ` : ""}Ver a coleção
                  </span>
                </span>
                <ArrowRight width={18} height={18} className="ml-1 flex-none text-ink transition-transform duration-300 group-hover:translate-x-[3px]" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
