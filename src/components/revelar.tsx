"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Revela os blocos marcados com `data-reveal` quando entram na tela: sobem 18 px e
 * aparecem em 700 ms. Um observador só para a página. Nunca em elemento da primeira
 * tela (H1, botão, foto do LCP).
 *
 * - O que já está na tela ao carregar aparece na hora (nada pisca).
 * - Sem JavaScript, ou com "reduzir movimento" no sistema, tudo aparece parado:
 *   o CSS só esconde depois que este componente marca o <html>.
 * - `style={{ "--atraso": "80ms" }}` no elemento escalona a entrada de vizinhos.
 */
export function Revelar() {
  const pathname = usePathname();

  // Layout effect: marca o que já está na tela antes da pintura, para não piscar
  // quando a navegação troca de página.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const elementos = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.revelado)"));
    const limite = window.innerHeight * 0.95;
    for (const el of elementos) if (el.getBoundingClientRect().top < limite) el.classList.add("revelado");
    document.documentElement.classList.add("revelar-pronto");

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("revelado");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    for (const el of elementos) if (!el.classList.contains("revelado")) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
