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
 * "Compre por linha": três fotos lado a lado em todas as larguras, cada uma com o nome
 * da linha embaixo. No celular são três quadros 3:4 só com o nome (era uma lista de
 * texto com miniaturas de 64 px, o bloco mais "lista" do site, e 140 px mais alta); a
 * frase de apoio entra a partir de 768 px e a seta a partir de 640 px.
 */
export function Linhas({ categories, hrefBase }: Props) {
  return (
    <ul className="grid grid-cols-3 gap-x-2.5 md:gap-x-5 lg:gap-x-10">
      {categories.map((c, i) => (
        <li key={c.id} className="min-w-0" data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
          <Link href={`${hrefBase}?categoria=${c.slug}#pecas`} className="group flex flex-col">
            <span className="zoom-img relative block aspect-[3/4] w-full overflow-hidden bg-areia md:aspect-[4/5]">
              {c.image_url && (
                <Image
                  src={c.image_url}
                  alt={altFoto(c.image_url, `Linha ${c.name.toLowerCase()} da Corpo Sensual`)}
                  fill
                  sizes="(min-width: 1440px) 421px, (min-width: 1024px) 30vw, 31vw"
                  className="object-cover"
                />
              )}
            </span>
            <span className="mt-2.5 flex min-w-0 items-start justify-between gap-3 md:mt-4 lg:mt-5">
              <span className="block min-w-0">
                <span className="t-sub block max-sm:text-[1rem] max-sm:tracking-normal">{c.name}</span>
                {DESCRICAO_LINHA[c.slug] && <span className="mt-1 block text-[14px] leading-snug text-muted max-md:hidden">{DESCRICAO_LINHA[c.slug]}</span>}
              </span>
              <ArrowRight width={20} height={20} className="mt-0.5 flex-none text-ink transition-transform duration-300 group-hover:translate-x-[3px] max-sm:hidden lg:mt-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
