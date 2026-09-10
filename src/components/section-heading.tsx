import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  /** Link à direita, no estilo "Ver todas". */
  link?: { href: string; label: string };
  description?: ReactNode;
  className?: string;
  level?: "h1" | "h2";
  size?: "sm" | "md" | "lg";
};

/* Escala do site atual: seção 40px, destaque 50px. A Fahkwang é larga, então
   nada passa de 50px no desktop. */
const sizes = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-[2.5rem]",
  lg: "text-4xl md:text-[3.125rem]",
};

export function SectionHeading({ title, link, description, className = "", level = "h2", size = "md" }: Props) {
  const Tag = level;
  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <Tag className={`h-display ${sizes[size]}`}>{title}</Tag>
        {link && (
          <Link href={link.href} className="link text-[15px]">
            {link.label}
          </Link>
        )}
      </div>
      {description && <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.6] text-body">{description}</p>}
    </div>
  );
}
