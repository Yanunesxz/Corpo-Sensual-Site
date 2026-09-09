export type FaqItem = { q: string; a: string };

/** Perguntas frequentes com <details> nativo: funciona sem JavaScript e é acessível. */
export function Faq({ items, id }: { items: FaqItem[]; id?: string }) {
  return (
    <div id={id} className="faq divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p className="pb-5 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
