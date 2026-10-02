"use client";

import { usePathname } from "next/navigation";

/**
 * A rota atual, igual no servidor e no navegador.
 *
 * Quando a Vercel refaz a home (revalidate), o servidor monta a página como "/index":
 * usePathname() devolve "/index" lá e "/" no navegador. Os componentes que mudam com a
 * rota (barra fixa, chamada do rodapé, botão do cabeçalho) saíam diferentes dos dois
 * lados e o React descartava a página inteira na hidratação (erro 418), uma hora depois
 * de cada publicação. Use sempre este gancho no lugar de usePathname() em tudo que
 * desenha algo conforme a rota.
 */
export function useRota(): string {
  const p = usePathname();
  return p === "/index" ? "/" : p;
}
