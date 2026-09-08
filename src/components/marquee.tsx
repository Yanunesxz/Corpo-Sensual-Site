const items = [
  "Tecnologia anti-pilling",
  "Leve e flexível",
  "Modelagem alinhada",
  "Fábrica própria em Muriaé, MG",
  "Mais de 25 anos de expertise",
  "Atendimento a lojistas em todo o Brasil",
];

/** Faixa com os diferenciais rolando continuamente. Animação só em CSS. */
export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-b border-line bg-cream py-3" aria-label="Diferenciais">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-12 text-[11px] uppercase tracking-[0.2em] text-ink-soft/80" aria-hidden={i >= items.length}>
            {item}
            <span className="h-0.5 w-0.5 rounded-full bg-gold/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
