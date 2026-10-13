import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Lock } from "./icons";

type Props = {
  product: Product;
  /** Para onde o cartão leva: o cadastro ("/catalogo") ou o formulário da página ("#formulario"). */
  destino: { href: string; rotulo: string };
  /** Mesmo papel do `sobre` do ProductCard: sobre "papel" a foto ganha o passe-partout areia. */
  sobre?: "papel" | "areia";
};

/**
 * Peça "espiada": a foto de uma das próximas peças, embaçada, com o selo "Só no catálogo".
 * Vem depois das peças da vitrine para deixar à vista que há muito mais no catálogo e dar
 * vontade de pedir. Sem nome nem referência: a peça só se revela no catálogo.
 *
 * A imagem entra pequena (o desfoque esconde o detalhe), então pesa pouco. Fora do Tab
 * como as fotos do ProductCard: o cartão "210" já é a parada do teclado para o catálogo.
 */
export function PecaEspiada({ product, destino, sobre = "papel" }: Props) {
  const image = product.images[0];
  const quadro = (
    <span className="relative block aspect-[4/5] overflow-hidden bg-paper">
      {image && <Image src={image.url} alt="" fill sizes="160px" quality={40} className="scale-110 object-cover blur-[10px]" />}
      <span aria-hidden className="absolute inset-0 bg-paper/35 transition-colors duration-300 group-hover:bg-paper/20" />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-4 text-center">
        <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-noite text-white">
          <Lock width={18} height={18} />
        </span>
        <span className="tag tag-sky">Só no catálogo</span>
      </span>
    </span>
  );
  const classe = "group block";
  const rotulo = `Mais peças no catálogo: ${destino.rotulo.toLowerCase()}`;

  return (
    <article>
      {destino.href.startsWith("#") ? (
        <a href={destino.href} tabIndex={-1} aria-label={rotulo} data-ga-local="vitrine-espiada" className={classe}>
          <span className={sobre === "papel" ? "block bg-areia p-1.5 md:p-2" : "block"}>{quadro}</span>
        </a>
      ) : (
        <Link href={destino.href} tabIndex={-1} aria-label={rotulo} data-ga-local="vitrine-espiada" className={classe}>
          <span className={sobre === "papel" ? "block bg-areia p-1.5 md:p-2" : "block"}>{quadro}</span>
        </Link>
      )}
      <h3 className="mt-3 text-[15px] leading-snug text-ink">Mais peças no catálogo</h3>
      <p className="mt-1 text-[13px] text-muted">{product.category?.name ?? "Nova coleção"}</p>
    </article>
  );
}
