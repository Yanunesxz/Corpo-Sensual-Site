import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

type Props = {
  title: ReactNode;
  /** Rótulo curto em caixa alta acima do título, com o fio do fólio. */
  eyebrow?: string;
  description?: ReactNode;
  /** Chamada "Ver todas →": à direita do título no desktop, depois do texto no celular. */
  link?: { href: string; label: string };
  level?: "h1" | "h2";
  /** Centraliza (blocos de fechamento). */
  center?: boolean;
  /** Para fundo azul-noite: título branco, rótulo e texto em noite-texto. */
  dark?: boolean;
  /** Sobe ao entrar na tela (padrão). Passe false na capa: nada da primeira tela se esconde. */
  revelar?: boolean;
  className?: string;
};

/**
 * Cabeçalho de seção: fólio (fio + rótulo), título em Fahkwang, texto de apoio e um
 * link opcional. Sem número de seção. Ritmo: rótulo → título 12 px; título → texto 16 px.
 */
export function SectionHeading({ title, eyebrow, description, link, level = "h2", center = false, dark = false, revelar = true, className = "" }: Props) {
  const Tag = level;
  return (
    <div
      className={`grid gap-y-4 ${center ? "mx-auto max-w-3xl justify-items-center text-center" : link ? "md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-x-10" : ""} ${className}`}
      data-reveal={revelar ? "" : undefined}
    >
      <div className="max-w-3xl">
        {eyebrow && <p className={`eyebrow eyebrow-fio ${dark ? "text-noite-texto" : ""}`}>{eyebrow}</p>}
        <Tag className={`${level === "h1" ? "t-hero" : "t-titulo"} ${eyebrow ? "mt-3" : ""} ${dark ? "text-white" : ""}`}>{title}</Tag>
      </div>
      {description && <p className={`lead max-w-2xl md:col-start-1 ${dark ? "text-noite-texto" : ""}`}>{description}</p>}
      {link && (
        <Link
          href={link.href}
          className={`link-seta ${center ? "justify-self-center" : "justify-self-start md:col-start-2 md:row-start-1 md:mb-1"} ${dark ? "text-white" : ""}`}
        >
          {link.label}
          <ArrowRight width={18} height={18} />
        </Link>
      )}
    </div>
  );
}
