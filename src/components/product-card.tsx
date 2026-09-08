import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0];
  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-cream-dark">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-soft">Sem imagem</div>
        )}
        {(product.is_new || product.is_featured) && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink backdrop-blur">
            {product.is_new ? "Novo" : "Mais vendido"}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium">{product.name}</h3>
          {product.category && <p className="mt-0.5 text-sm text-ink-soft">{product.category.name}</p>}
        </div>
        {product.ref && <span className="shrink-0 text-xs text-ink-soft">Ref. {product.ref}</span>}
      </div>
    </article>
  );
}
