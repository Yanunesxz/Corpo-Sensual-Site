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

const sizes = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-5xl",
  lg: "text-4xl md:text-6xl lg:text-7xl",
};

export function SectionHeading({ title, link, description, className = "", level = "h2", size = "md" }: Props) {
  const Tag = level;
  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <Tag className={`h-display ${sizes[size]}`}>{title}</Tag>
        {link && (
          <Link href={link.href} className="link text-[13px]">
            {link.label}
          </Link>
        )}
      </div>
      {description && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">{description}</p>}
    </div>
  );
}
