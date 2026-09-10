import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0];
  return (
    <article>
      <div className="zoom-img relative aspect-[4/5] overflow-hidden rounded-media bg-sky-soft">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-body">Sem foto</div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-base leading-snug text-ink">{product.name}</h3>
        {/* Referência e linha ficam discretas, um degrau abaixo do nome */}
        <p className="mt-1 flex flex-wrap items-baseline gap-x-3 text-sm text-body">
          {product.ref && <span>Ref. {product.ref}</span>}
          {product.category && <span>{product.category.name}</span>}
        </p>
      </div>
    </article>
  );
}
