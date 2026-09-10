export type Step = { title: string; description: string };

/** Lista numerada, sem cards. Número grande em Fahkwang ao lado do texto, como no site atual. */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="grid grid-cols-[3rem_1fr] gap-4 py-5 md:grid-cols-[5rem_1fr] md:gap-7 md:py-6"
        >
          <span className="h-display text-[2rem] leading-none text-body md:text-[2.5rem]">0{i + 1}</span>
          <div>
            <h3 className="text-[1.0625rem] font-normal text-ink">{step.title}</h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-body md:text-base">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
