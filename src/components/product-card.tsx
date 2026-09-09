import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0];
  return (
    <article>
      <div className="zoom-img relative aspect-[4/5] overflow-hidden bg-stone">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-soft">Sem foto</div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] leading-snug">{product.name}</h3>
        {product.ref && <span className="label shrink-0 text-ink-soft">{product.ref}</span>}
      </div>
      {product.category && <p className="mt-0.5 text-[12px] text-ink-soft">{product.category.name}</p>}
    </article>
  );
}
