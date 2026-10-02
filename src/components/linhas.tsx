import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { altFoto } from "@/lib/content/alt-fotos";
import { DESCRICAO_LINHA } from "@/lib/content/linhas";
import { ArrowRight } from "./icons";

type Props = {
  categories: Category[];
  /** Página da coleção onde está a grade: o link vira `${hrefBase}?categoria=feminino#pecas`. */
  hrefBase: string;
};

/**
 * "Compre por linha". Uma marcação só, que muda por CSS: no celular, uma lista de
 * linhas de 80 px com miniatura 4:5 (sem ocupar uma tela por linha); a partir de
 * 1024 px, três colunas com a foto inteira.
 */
export function Linhas({ categories, hrefBase }: Props) {
  return (
    <ul className="grid border-t border-line lg:grid-cols-3 lg:gap-x-10 lg:border-t-0">
      {categories.map((c, i) => (
        <li key={c.id} className="border-b border-line lg:border-b-0" data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
          <Link href={`${hrefBase}?categoria=${c.slug}#pecas`} className="group flex items-center gap-4 py-3 lg:flex-col lg:items-stretch lg:gap-0 lg:py-0">
            <span className="zoom-img relative block h-20 w-16 flex-none overflow-hidden bg-areia lg:aspect-[4/5] lg:h-auto lg:w-full">
              {c.image_url && (
                <Image src={c.image_url} alt={altFoto(c.image_url, `Linha ${c.name.toLowerCase()} da Corpo Sensual`)} fill sizes="(min-width: 1024px) 30vw, 64px" className="object-cover" />
              )}
            </span>
            <span className="flex min-w-0 flex-1 items-center justify-between gap-4 lg:mt-5 lg:items-start">
              <span className="block min-w-0">
                <span className="t-sub block">{c.name}</span>
                {DESCRICAO_LINHA[c.slug] && <span className="mt-1 block text-[14px] leading-snug text-muted">{DESCRICAO_LINHA[c.slug]}</span>}
              </span>
              <ArrowRight width={20} height={20} className="flex-none text-ink transition-transform duration-300 group-hover:translate-x-[3px] lg:mt-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
