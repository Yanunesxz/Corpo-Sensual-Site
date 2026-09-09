import Image from "next/image";

type Props = {
  /** Foto para telas médias e grandes (normalmente horizontal). */
  desktop: string;
  /** Foto vertical para o celular. Se não houver, usa a mesma foto. */
  mobile?: string | null;
  alt?: string;
  priority?: boolean;
  /** Ponto de interesse da foto de desktop, ex.: "center 35%". */
  desktopPosition?: string;
  mobilePosition?: string;
};

/**
 * Foto de fundo com direção de arte: no celular entra a versão vertical,
 * no desktop a horizontal. Só uma das duas é baixada, por causa do
 * `sizes` combinado com display:none (o navegador não carrega imagem oculta
 * quando o <img> não é renderizado... então usamos <picture> por mídia).
 */
export function HeroImage({ desktop, mobile, alt = "", priority = false, desktopPosition = "center 35%", mobilePosition = "center 30%" }: Props) {
  const mob = mobile ?? desktop;
  if (mob === desktop) {
    return <Image src={desktop} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" style={{ objectPosition: desktopPosition }} />;
  }
  return (
    <>
      <Image
        src={mob}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 767px) 100vw, 1px"
        className="object-cover md:hidden"
        style={{ objectPosition: mobilePosition }}
      />
      <Image
        src={desktop}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 768px) 100vw, 1px"
        className="hidden object-cover md:block"
        style={{ objectPosition: desktopPosition }}
      />
    </>
  );
}
