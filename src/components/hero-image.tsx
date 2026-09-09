import Image from "next/image";

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
};

/**
 * Foto de fundo com direção de arte: telas estreitas recebem a versão vertical,
 * telas largas a horizontal. Só uma das duas é baixada: o `sizes` de 1px para a
 * versão oculta faz o navegador pedir a menor variante possível.
 */
export function HeroImage({
  desktop,
  mobile,
  alt = "",
  priority = false,
  desktopPosition = "center 35%",
  mobilePosition = "center 30%",
  switchAt = "md",
}: Props) {
  const mob = mobile ?? desktop;
  if (mob === desktop) {
    return <Image src={desktop} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" style={{ objectPosition: desktopPosition }} />;
  }
  const bp = switchAt === "lg" ? 1024 : 768;
  const mobileClass = switchAt === "lg" ? "object-cover lg:hidden" : "object-cover md:hidden";
  const desktopClass = switchAt === "lg" ? "hidden object-cover lg:block" : "hidden object-cover md:block";
  return (
    <>
      <Image
        src={mob}
        alt={alt}
        fill
        priority={priority}
        sizes={`(max-width: ${bp - 1}px) 100vw, 1px`}
        className={mobileClass}
        style={{ objectPosition: mobilePosition }}
      />
      <Image
        src={desktop}
        alt={alt}
        fill
        priority={priority}
        sizes={`(min-width: ${bp}px) 100vw, 1px`}
        className={desktopClass}
        style={{ objectPosition: desktopPosition }}
      />
    </>
  );
}
