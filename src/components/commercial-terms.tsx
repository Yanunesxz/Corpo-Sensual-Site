import { site } from "@/lib/site";

/**
 * Condições comerciais para lojistas, no desenho do site atual: colunas
 * centralizadas divididas por linha, com a nota de asterisco abaixo. No celular
 * empilha; no tablet vai a duas colunas para o texto não ficar espremido.
 */
export function CommercialTerms({ className = "" }: { className?: string }) {
  const { commercial } = site;
  const items = [commercial.noMinOrder, commercial.pixDiscount, commercial.installments, commercial.freeShipping];
  return (
    <div className={`border-y border-line py-10 text-center md:py-12 ${className}`}>
      <ul className="grid gap-7 sm:grid-cols-2 sm:gap-y-8 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
        {items.map((item) => (
          <li key={item} className="h-display text-xl leading-snug lg:px-6 lg:text-[1.375rem]">
            {item}
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-body">
        *{commercial.wholesaleNote} {commercial.freeShippingNote} {commercial.paymentMethods} {commercial.noCnpjNote}
      </p>
    </div>
  );
}
