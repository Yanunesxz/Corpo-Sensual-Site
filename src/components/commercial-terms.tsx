import { site } from "@/lib/site";
import { Check } from "./icons";
import { Reveal } from "./reveal";

/** Faixa com as condições comerciais para lojistas (investimento mínimo, parcelamento, frete). */
export function CommercialTerms({ className = "" }: { className?: string }) {
  const { commercial } = site;
  const items = [commercial.minOrder, commercial.installments, commercial.freeShipping];
  return (
    <Reveal className={`rounded-card border border-line bg-white p-6 md:p-8 ${className}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">Condições para lojistas</p>
          <p className="mt-2 text-sm font-medium">{commercial.exclusive}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3 md:gap-6">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Check width={13} height={13} strokeWidth={2.6} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs text-ink-soft">*{commercial.freeShippingNote}</p>
    </Reveal>
  );
}
