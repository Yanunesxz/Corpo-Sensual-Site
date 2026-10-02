import type { ReactNode } from "react";

/** A resposta pode ter link (política de trocas, página de contato). */
export type FaqItem = { q: string; a: ReactNode };

/**
 * Perguntas frequentes com <details> nativo: funciona sem JavaScript e é acessível.
 * A primeira pode nascer aberta, para a pessoa ver que há resposta ali dentro.
 * Desenho em globals.css (.faq): pergunta em Inter 500, "+" fino que gira 45°.
 */
export function Faq({ items, id, abrirPrimeira = false }: { items: FaqItem[]; id?: string; abrirPrimeira?: boolean }) {
  return (
    <div id={id} className="faq border-t border-line">
      {items.map((item, i) => (
        <details key={item.q} open={abrirPrimeira && i === 0}>
          <summary>{item.q}</summary>
          {/* Largura limitada: a linha de leitura não fica longa demais no desktop. */}
          <p className="max-w-2xl pb-6 pr-10 text-[15px] leading-[1.65] text-body md:text-base">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
