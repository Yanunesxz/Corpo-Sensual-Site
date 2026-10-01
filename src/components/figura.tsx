import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  /** Largura ocupada na tela, para o navegador escolher o arquivo. */
  sizes: string;
  /** Proporção do quadro, em classe do Tailwind: "aspect-[4/5]". */
  proporcao?: string;
  /** Ponto de interesse da foto: "object-[center_30%]". */
  foco?: string;
  /** Legenda pequena abaixo da foto, como numa revista. */
  legenda?: ReactNode;
  /** A foto inteira vira link (coleção, linha), com zoom lento no hover. */
  href?: string;
  priority?: boolean;
  className?: string;
  /** Texto branco por cima da foto (nome da coleção). Liga o degradê .shade. */
  sobre?: ReactNode;
};

/** Foto editorial: bloco cheio, sem canto, com legenda embaixo. */
export function Figura({ src, alt, sizes, proporcao = "aspect-[4/5]", foco = "object-center", legenda, href, priority, className = "", sobre }: Props) {
  const quadro = (
    <span className={`zoom-img relative block overflow-hidden bg-areia ${proporcao} ${sobre ? "shade" : ""}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${foco}`} />
      {sobre && <span className="on-photo absolute inset-x-0 bottom-0 z-10 block p-5 text-white md:p-7">{sobre}</span>}
    </span>
  );

  return (
    <figure className={className}>
      {href ? (
        <Link href={href} className="group block">
          {quadro}
        </Link>
      ) : (
        quadro
      )}
      {legenda && <figcaption className="legenda mt-3">{legenda}</figcaption>}
    </figure>
  );
}
