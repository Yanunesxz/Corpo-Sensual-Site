import { getImageProps } from "next/image";

type Props = {
  /** Foto para telas largas (normalmente horizontal). */
  desktop: string;
  /** Foto vertical para telas estreitas. Se não houver, usa a mesma foto. */
  mobile?: string | null;
  alt?: string;
  priority?: boolean;
  /** Ponto de interesse da foto larga, ex.: "center 35%". */
  desktopPosition?: string;
  mobilePosition?: string;
  /** Largura a partir da qual entra a foto larga: "md" (768px) ou "lg" (1024px, inclui o tablet na vertical). */
  switchAt?: "md" | "lg";
  /** Qualidade da foto larga. A do celular nunca passa de 80. */
  quality?: number;
  /** Largura ocupada na tela, para o navegador escolher o arquivo. Padrão: a tela toda. */
  sizes?: string;
};

// Foto de campanha ocupa a tela inteira: em 75 (padrão do Next) ela fica mole
// em tela grande. 92 precisa estar liberado em images.qualities no next.config.
const QUALIDADE = 92;
// No celular a diferença entre 80 e 92 não aparece, e o arquivo cai quase à metade.
const QUALIDADE_CELULAR = 80;

/**
 * Foto de fundo com direção de arte: telas estreitas recebem a versão vertical,
 * telas largas a horizontal.
 *
 * Usa <picture> com getImageProps porque duas <Image> empilhadas, uma escondida
 * por CSS, fazem o navegador baixar as DUAS. Com <picture> ele escolhe pela
 * media query e baixa só uma. O ponto de interesse de cada foto vai em variável
 * CSS, trocada no mesmo ponto de corte pela classe .hero-foto (ver globals.css).
 */
export function HeroImage({
  desktop,
  mobile,
  alt = "",
  priority = false,
  desktopPosition = "center 35%",
  mobilePosition = "center 30%",
  switchAt = "md",
  quality = QUALIDADE,
  sizes = "100vw",
}: Props) {
  const mob = mobile ?? desktop;
  const corte = switchAt === "lg" ? 1024 : 768;
  const comum = { alt, sizes, priority, fill: true as const };

  const {
    props: { srcSet: srcSetDesktop },
  } = getImageProps({ ...comum, quality, src: desktop });

  const {
    props: { srcSet: srcSetMobile, style: estilo, ...resto },
  } = getImageProps({ ...comum, quality: Math.min(quality, QUALIDADE_CELULAR), src: mob });

  const posicao = {
    ...estilo,
    ["--pos-celular" as string]: mobilePosition,
    ["--pos-tela" as string]: desktopPosition,
  } as React.CSSProperties;

  if (mob === desktop) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...resto} srcSet={srcSetDesktop} className="hero-foto object-cover" style={{ ...estilo, objectPosition: desktopPosition }} alt={alt} />
    );
  }

  return (
    <picture>
      <source media={`(min-width: ${corte}px)`} srcSet={srcSetDesktop} sizes={sizes} />
      <source media={`(max-width: ${corte - 1}px)`} srcSet={srcSetMobile} sizes={sizes} />
      <img {...resto} className={`hero-foto object-cover ${switchAt === "lg" ? "hero-foto-lg" : "hero-foto-md"}`} style={posicao} alt={alt} />
    </picture>
  );
}
