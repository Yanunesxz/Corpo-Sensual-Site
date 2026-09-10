export type FaqItem = { q: string; a: string };

/** Perguntas frequentes com <details> nativo: funciona sem JavaScript e é acessível. */
export function Faq({ items, id }: { items: FaqItem[]; id?: string }) {
  return (
    <div id={id} className="faq divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          {/* Largura limitada para a linha de leitura não ficar longa demais no desktop */}
          <p className="max-w-2xl pb-5 pr-1 text-[1.0625rem] leading-[1.6] text-body">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
