import Image from "next/image";
import type { Product } from "@/lib/types";

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
};

/**
 * Foto de estúdio num quadro branco, sem canto, com nome e referência embaixo. Nada por
 * cima da foto e sem preço: preço é do catálogo.
 *
 * As fotos vêm todas no mesmo quadro (scripts/foto-produto.mjs): fundo branco, topo do
 * cabelo na mesma linha, figura centrada. Por isso a foto entra sem mistura de cor
 * (nada de mix-blend): a lojista compra pela cor. A moldura é sempre branco contra
 * areia, em qualquer seção: cartão branco na seção areia, passe-partout areia na branca.
 */
export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1440px) 253px, (min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw",
  sobre = "papel",
}: Props) {
  const image = product.images[0];
  return (
    <article className="group">
      <div className={sobre === "papel" ? "bg-areia p-1.5 md:p-2" : undefined}>
        <div className="zoom-img relative aspect-[4/5] overflow-hidden bg-paper">
          {image ? (
            <Image src={image.url} alt={image.alt ?? product.name} fill sizes={sizes} className="object-cover" priority={priority} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">Sem foto</div>
          )}
        </div>
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
