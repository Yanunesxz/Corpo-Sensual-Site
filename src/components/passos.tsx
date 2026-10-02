import type { ReactNode } from "react";

type Passo = { titulo: string; texto: ReactNode };

type Props = {
  itens: Passo[];
  /** Troca o numeral por um ponto. Obrigatório na página de representante (nenhum número). */
  semNumeros?: boolean;
  /**
   * coluna: pilha (padrão). linha: uma coluna por passo (duas ou três) a partir de 1024 px,
   * com fio ligando os marcadores. linha-xl: o mesmo, só a partir de 1280 px (para colunas
   * de meia tela, onde três passos lado a lado ficam espremidos a 1024 px).
   */
  layout?: "coluna" | "linha" | "linha-xl";
  /** Textos claros sobre azul-noite. */
  escuro?: boolean;
  /** Tag do título de cada passo. "p" quando não há um h2 logo acima (a ordem dos títulos não pode pular). */
  tituloTag?: "h3" | "p";
  className?: string;
};

/**
 * Passos de um processo ("Cadastre a sua loja → Receba o catálogo → Monte o pedido").
 * Lista ordenada de verdade (<ol>); o numeral é desenho (aria-hidden), o leitor de tela
 * já anuncia a posição. Marcador em tinta, com contraste total.
 */
export function Passos({ itens, semNumeros = false, layout = "coluna", escuro = false, tituloTag = "h3", className = "" }: Props) {
  const Titulo = tituloTag;
  // Classes por extenso, para o Tailwind encontrar: as da linha a partir de 1024 px e as de 1280 px.
  const linha =
    layout === "linha"
      ? {
          lista: `lg:gap-x-10 ${itens.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`,
          item: "lg:flex-col lg:gap-5",
          fio: "lg:-right-6 lg:bottom-auto lg:left-[3.75rem] lg:top-[21.5px] lg:h-px lg:w-auto",
          fioPonto: "lg:-right-7 lg:bottom-auto lg:left-5 lg:top-[3.5px] lg:h-px lg:w-auto",
          ponto: "lg:mt-0",
        }
      : layout === "linha-xl"
        ? {
            lista: `xl:gap-x-8 ${itens.length === 2 ? "xl:grid-cols-2" : "xl:grid-cols-3"}`,
            item: "xl:flex-col xl:gap-5",
            fio: "xl:-right-5 xl:bottom-auto xl:left-[3.75rem] xl:top-[21.5px] xl:h-px xl:w-auto",
            fioPonto: "xl:-right-5 xl:bottom-auto xl:left-5 xl:top-[3.5px] xl:h-px xl:w-auto",
            ponto: "xl:mt-0",
          }
        : null;
  const fio = escuro ? "bg-white/20" : "bg-line";

  return (
    <ol className={`grid gap-y-8 ${linha?.lista ?? ""} ${className}`}>
      {itens.map((p, i) => {
        const ultimo = i === itens.length - 1;
        return (
          <li key={p.titulo} className={`relative flex gap-4 ${linha?.item ?? ""}`}>
            {/* Fio que liga um marcador ao próximo: vertical na pilha, horizontal na linha do desktop. */}
            {!ultimo && (
              <span
                aria-hidden
                className={`absolute w-px ${fio} ${semNumeros ? "left-[3.5px] top-[1.4rem] -bottom-[1.6rem]" : "left-[21.5px] top-[3.25rem] -bottom-6"} ${
                  linha ? (semNumeros ? linha.fioPonto : linha.fio) : ""
                }`}
              />
            )}
            {semNumeros ? (
              <span aria-hidden className={`mt-[0.6rem] block h-2 w-2 flex-none rounded-full ${escuro ? "bg-white" : "bg-noite"} ${linha?.ponto ?? ""}`} />
            ) : (
              <span
                aria-hidden
                className={`flex h-11 w-11 flex-none items-center justify-center rounded-full border font-[family-name:var(--font-display)] text-[1.5rem] leading-none tabular-nums ${
                  escuro ? "border-white/50 text-white" : "border-line-strong bg-paper text-ink"
                }`}
              >
                {i + 1}
              </span>
            )}
            <div className={semNumeros ? "" : "pt-1.5"}>
              <Titulo className={`t-sub ${escuro ? "text-white" : ""}`}>{p.titulo}</Titulo>
              <p className={`mt-1.5 max-w-md text-[15px] leading-[1.6] ${escuro ? "text-noite-texto" : "text-body"}`}>{p.texto}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
