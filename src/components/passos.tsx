import type { ReactNode } from "react";

type Passo = { titulo: string; texto: ReactNode };

type Props = {
  itens: Passo[];
  /** Troca o numeral por um ponto. Obrigatório na página de representante (nenhum número). */
  semNumeros?: boolean;
  /** coluna: pilha (padrão). linha: uma coluna por passo (duas ou três) a partir de 1024 px, com fio ligando os marcadores. */
  layout?: "coluna" | "linha";
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
  const linha = layout === "linha";
  const fio = escuro ? "bg-white/20" : "bg-line";

  return (
    <ol className={`${linha ? `grid gap-y-8 lg:gap-x-10 ${itens.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"}` : "grid gap-y-8"} ${className}`}>
      {itens.map((p, i) => {
        const ultimo = i === itens.length - 1;
        return (
          <li key={p.titulo} className={`relative flex gap-4 ${linha ? "lg:flex-col lg:gap-5" : ""}`}>
            {/* Fio que liga um marcador ao próximo: vertical na pilha, horizontal na linha do desktop. */}
            {!ultimo && (
              <span
                aria-hidden
                className={`absolute w-px ${fio} ${semNumeros ? "left-[3.5px] top-[1.4rem] -bottom-[1.6rem]" : "left-[21.5px] top-[3.25rem] -bottom-6"} ${
                  linha ? (semNumeros ? "lg:-right-7 lg:bottom-auto lg:left-5 lg:top-[3.5px] lg:h-px lg:w-auto" : "lg:-right-6 lg:bottom-auto lg:left-[3.75rem] lg:top-[21.5px] lg:h-px lg:w-auto") : ""
                }`}
              />
            )}
            {semNumeros ? (
              <span aria-hidden className={`mt-[0.6rem] block h-2 w-2 flex-none rounded-full ${escuro ? "bg-white" : "bg-noite"} ${linha ? "lg:mt-0" : ""}`} />
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
