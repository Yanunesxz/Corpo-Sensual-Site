import Image from "next/image";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  priority?: boolean;
  /** Largura ocupada na tela. O padrão é o da grade de 2, 3 e 6 colunas. */
  sizes?: string;
};

/**
 * Foto de estúdio sobre areia (o mesmo tom do fundo do estúdio), sem canto, com nome
 * e referência embaixo. Nada por cima da foto e sem preço: preço é do catálogo.
 */
export function ProductCard({ product, priority = false, sizes = "(min-width: 1024px) 16vw, (min-width: 768px) 30vw, 46vw" }: Props) {
  const image = product.images[0];
  return (
    <article className="group">
      <div className="zoom-img relative aspect-[4/5] overflow-hidden bg-areia">
        {image ? (
          <Image src={image.url} alt={image.alt ?? product.name} fill sizes={sizes} className="object-cover" priority={priority} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">Sem foto</div>
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
