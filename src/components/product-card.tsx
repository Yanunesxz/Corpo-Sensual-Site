import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { ArrowRight } from "./icons";

type Props = {
  product: Product;
  priority?: boolean;
  /** Largura ocupada na tela. O padrão é o da grade de 2, 3, 4 e 5 colunas. */
  sizes?: string;
  /**
   * Fundo da seção em que o cartão está. Sobre "areia" o branco da foto já é a moldura.
   * Sobre "papel" (seção branca) a foto ganha um passe-partout areia em volta.
   */
  sobre?: "papel" | "areia";
  /**
   * Para onde a foto leva: o cadastro ("/catalogo") ou o formulário da própria página
   * ("#formulario", na landing). O rótulo aparece na base da foto no hover, só com mouse.
   */
  chamada?: { href: string; rotulo: string };
};

/**
 * Foto de estúdio num quadro branco, sem canto, com nome e referência embaixo. Sem preço:
 * preço é do catálogo.
 *
 * As fotos vêm todas no mesmo quadro (scripts/foto-produto.mjs): fundo branco, topo do
 * cabelo na mesma linha, figura centrada. Por isso a foto entra sem mistura de cor
 * (nada de mix-blend): a lojista compra pela cor. A moldura é sempre branco contra
 * areia, em qualquer seção: cartão branco na seção areia, passe-partout areia na branca.
 *
 * Com `chamada`, a foto é um link para o cadastro: quem se interessa por uma peça clica
 * nela, e o clique tem de levar a algum lugar. Fica fora do Tab (o cartão "210" e os
 * botões da página já são as paradas do teclado) e o nome do link diz a peça e o destino.
 */
export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1440px) 253px, (min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw",
  sobre = "papel",
  chamada,
}: Props) {
  const image = product.images[0];
  const quadro = (
    <div className="zoom-img relative aspect-[4/5] overflow-hidden bg-paper">
      {image ? (
        <Image src={image.url} alt={image.alt ?? product.name} fill sizes={sizes} className="object-cover" priority={priority} />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted">Sem foto</div>
      )}
    </div>
  );
  const etiqueta = chamada && (
    <span aria-hidden className="peca-chamada tag tag-sky pointer-events-none absolute bottom-2 left-2 max-w-[calc(100%-1rem)] whitespace-nowrap">
      {chamada.rotulo}
      <ArrowRight width={14} height={14} />
    </span>
  );
  const nomeDoLink = chamada ? `${product.name}: ${chamada.rotulo.toLowerCase()}` : undefined;

  return (
    <article className="group">
      <div className={sobre === "papel" ? "bg-areia p-1.5 md:p-2" : undefined}>
        {chamada ? (
          chamada.href.startsWith("#") ? (
            <a href={chamada.href} tabIndex={-1} aria-label={nomeDoLink} data-ga-local="vitrine" className="relative block">
              {quadro}
              {etiqueta}
            </a>
          ) : (
            <Link href={chamada.href} tabIndex={-1} aria-label={nomeDoLink} data-ga-local="vitrine" className="relative block">
              {quadro}
              {etiqueta}
            </Link>
          )
        ) : (
          quadro
        )}
      </div>
      <h3 className="mt-3 line-clamp-2 text-[15px] leading-snug text-ink">{product.name}</h3>
      {/* Referência e linha um degrau abaixo do nome: é como a lojista pede no catálogo. */}
      <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[13px] text-muted">
        {product.ref && <span className="tabular-nums">Ref. {product.ref}</span>}
        {product.ref && product.category && <span aria-hidden>·</span>}
        {product.category && <span>{product.category.name}</span>}
      </p>
    </article>
  );
}
