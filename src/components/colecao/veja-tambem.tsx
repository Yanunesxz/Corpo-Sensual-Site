import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/types";
import { collectionShortName } from "@/lib/site";
import { ArrowRight } from "@/components/icons";

/**
 * "Veja também: Entrelaços · Todas as coleções", como um cartão pequeno com a
 * miniatura da outra coleção. A miniatura repete o link do nome: fica fora do Tab
 * e do leitor de tela.
 */
export function VejaTambem({ outras, className = "" }: { outras: Collection[]; className?: string }) {
  if (outras.length === 0) return null;
  const primeira = outras[0];
  const foto = primeira.hero_mobile_url || primeira.hero_image_url;
  return (
    <div className={`flex items-center gap-5 border-t border-line-strong/40 pt-6 ${className}`}>
      {foto && (
        <Link href={`/colecoes/${primeira.slug}`} tabIndex={-1} aria-hidden className="zoom-img relative block h-[7.5rem] w-24 flex-none overflow-hidden bg-areia">
          <Image src={foto} alt="" fill sizes="96px" className="object-cover object-[center_25%]" />
        </Link>
      )}
      <div className="min-w-0">
        <p className="legenda">Veja também:</p>
        <p className="mt-1 flex flex-wrap gap-x-3">
          {outras.map((c) => (
            <Link key={c.id} href={`/colecoes/${c.slug}`} className="link t-sub">
              {collectionShortName(c.name)}
            </Link>
          ))}
        </p>
        <Link href="/colecoes" className="link-seta mt-2">
          Todas as coleções
          <ArrowRight width={18} height={18} />
        </Link>
      </div>
    </div>
  );
}
