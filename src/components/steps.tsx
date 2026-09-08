import { Reveal } from "./reveal";

export type Step = { title: string; description: string };

/** Lista numerada de passos (ex.: como receber o catálogo). */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-6 md:grid-cols-3">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 120} className="rounded-card border border-line bg-white p-6">
          <span className="display text-4xl text-gold">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
        </Reveal>
      ))}
    </ol>
  );
}
