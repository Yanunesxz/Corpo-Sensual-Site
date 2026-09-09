import { site } from "@/lib/site";

/** Condições comerciais para lojistas, em linha, sem card. */
export function CommercialTerms({ className = "" }: { className?: string }) {
  const { commercial } = site;
  const items = [commercial.minOrder, commercial.installments, commercial.freeShipping];
  return (
    <div className={`border-y border-line py-6 ${className}`}>
      <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
        <p className="label">{commercial.exclusive}</p>
        <ul className="flex flex-col gap-2 text-sm md:flex-row md:justify-end md:gap-8">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="mt-3 text-[11px] text-ink-soft">*{commercial.freeShippingNote}</p>
    </div>
  );
}
