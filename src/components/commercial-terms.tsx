import { site } from "@/lib/site";

/** Condições comerciais para lojistas. Empilha até o tablet; fica em linha só em telas largas. */
export function CommercialTerms({ className = "" }: { className?: string }) {
  const { commercial } = site;
  const items = [commercial.minOrder, commercial.installments, commercial.freeShipping];
  return (
    <div className={`border-y border-line py-6 ${className}`}>
      <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
        <p className="label">{commercial.exclusive}</p>
        <ul className="flex flex-col gap-2 text-sm md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-2 lg:justify-end">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="mt-3 text-xs text-ink-soft">*{commercial.freeShippingNote}</p>
    </div>
  );
}
