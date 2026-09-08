import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Nível do título. Use h1 apenas uma vez por página. */
  level?: "h1" | "h2";
  /** "light" para fundos escuros. */
  tone?: "dark" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
  level = "h2",
  tone = "dark",
}: Props) {
  const Tag = level;
  const descColor = tone === "light" ? "text-white/75" : "text-ink-soft";
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className={`display mt-3 ${level === "h1" ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl"}`}>
        {title}
      </Tag>
      {description && <p className={`mt-5 text-base leading-relaxed md:text-lg ${descColor}`}>{description}</p>}
    </div>
  );
}
