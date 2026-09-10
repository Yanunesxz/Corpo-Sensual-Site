import { site } from "@/lib/site";

/**
 * Condições comerciais para lojistas, como no site atual: três colunas
 * centralizadas e a nota com asterisco logo abaixo. Empilha no celular.
 */
export function CommercialTerms({ className = "" }: { className?: string }) {
  const { commercial } = site;
  const items = [commercial.minOrder, commercial.installments, commercial.freeShipping];
  return (
    <div className={`border-y border-line py-10 text-center md:py-12 ${className}`}>
      <ul className="grid gap-7 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
        {items.map((item) => (
          <li key={item} className="h-display text-xl leading-snug md:px-8 md:text-[1.375rem]">
            {item}
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-body">
        *{commercial.salesNote} {commercial.freeShippingNote} {commercial.noCnpjNote}
      </p>
    </div>
  );
}
