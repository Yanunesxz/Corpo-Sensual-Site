"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Distância do topo da tela quando o cartão cabe inteiro (6rem: abaixo da barra presa do cabeçalho). */
const TOPO = 96;
/** Respiro entre o fim do cartão e a base da tela quando ele não cabe. */
const BASE = 24;

/**
 * Cartão do formulário preso na coluna da direita do desktop (a partir de 1024 px).
 *
 * O cartão de cadastro costuma ser mais alto que a tela de um notebook (uns 1.000 px
 * contra 800 de área útil). Preso pelo topo, o botão de envio ficaria abaixo da tela
 * enquanto a pessoa lê a coluna da esquerda. Aqui o "top" do sticky é calculado:
 * - se o cartão cabe, ele para a 96 px do topo, como um sticky comum;
 * - se não cabe, ele rola junto com a página até o botão aparecer e então para com a
 *   base a 24 px da borda de baixo (top negativo). O botão fica sempre à vista.
 * O ResizeObserver remede quando o cartão cresce (mensagem de erro, aviso do CPF).
 * Sem JavaScript, vale o top-24 (6rem) do CSS. Abaixo de 1024 px não há sticky.
 */
export function FormularioPreso({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ajustar = () => {
      const topo = Math.min(TOPO, window.innerHeight - el.offsetHeight - BASE);
      // "top" direto no elemento (e não numa variável CSS herdada): invalida só ele, não o
      // formulário inteiro. Abaixo de 1024 px o cartão não é sticky e o top não tem efeito.
      el.style.top = `${Math.round(topo)}px`;
    };
    // O ResizeObserver já mede na primeira observação.
    const ro = new ResizeObserver(ajustar);
    ro.observe(el);
    window.addEventListener("resize", ajustar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", ajustar);
    };
  }, []);

  return (
    <div ref={ref} className={`lg:sticky lg:top-24 ${className}`}>
      {children}
    </div>
  );
}
