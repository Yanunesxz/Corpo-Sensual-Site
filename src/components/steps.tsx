export type Step = { title: string; description: string };

/** Lista numerada, sem cards. Número ao lado do texto em qualquer largura. */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {steps.map((step, i) => (
        <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 py-4 md:grid-cols-[4rem_1fr] md:gap-6 md:py-5">
          <span className="h-display text-2xl text-ink-soft">0{i + 1}</span>
          <div>
            <h3 className="text-[15px] font-medium">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
