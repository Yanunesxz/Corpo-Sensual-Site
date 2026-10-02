"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

/** Fora do componente: a troca de página não pode cancelar a volta da rolagem suave. */
let relogioVoltar = 0;
let caminhoAtual = "";

/**
 * Revela os blocos marcados com `data-reveal` quando entram na tela: sobem 18 px e
 * aparecem em 700 ms. Um observador só para a página. Nunca em elemento da primeira
 * tela (H1, botão, foto do LCP).
 *
 * - O que já está na tela ao carregar aparece na hora (nada pisca).
 * - Sem JavaScript, ou com "reduzir movimento" no sistema, tudo aparece parado:
 *   o CSS só esconde depois que este componente marca o <html>.
 * - `style={{ "--atraso": "80ms" }}` no elemento escalona a entrada de vizinhos.
 *
 * Também cuida do Voltar do navegador: a restauração da rolagem sai instantânea, sem o
 * scroll-behavior: smooth do <html> animando a página inteira até a posição antiga.
 */
export function Revelar() {
  const pathname = usePathname();

  useEffect(() => {
    caminhoAtual = pathname;
  }, [pathname]);

  // Registrado uma vez só, antes do ouvinte do roteador: roda com a página antiga ainda na tela.
  useEffect(() => {
    const html = document.documentElement;
    const aoVoltar = () => {
      // Só o # mudou (clique numa âncora também dispara popstate): a rolagem suave fica.
      if (window.location.pathname === caminhoAtual) return;
      html.style.scrollBehavior = "auto";
      window.clearTimeout(relogioVoltar);
      relogioVoltar = window.setTimeout(() => {
        html.style.scrollBehavior = "";
      }, 1000);
    };
    window.addEventListener("popstate", aoVoltar);
    return () => window.removeEventListener("popstate", aoVoltar);
  }, []);

  // Layout effect: na troca de página, marca o que já está na tela antes da pintura,
  // para não piscar.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const html = document.documentElement;
    const elementos = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.revelado)"));
    // Troca de página (o <html> já está pronto): mede antes da pintura. Na primeira carga
    // não mede nada aqui: medir uns 40 blocos força um layout síncrono da página inteira
    // (e desfaz o content-visibility das seções de baixo). Quem diz o que está na tela é a
    // primeira resposta do observador; só então o CSS passa a esconder o resto.
    if (html.classList.contains("revelar-pronto")) {
      const limite = window.innerHeight * 0.95;
      for (const el of elementos) if (el.getBoundingClientRect().top < limite) el.classList.add("revelado");
    }
    let primeira = !html.classList.contains("revelar-pronto");

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("revelado");
          io.unobserve(e.target);
        }
        if (primeira) {
          primeira = false;
          html.classList.add("revelar-pronto");
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    for (const el of elementos) if (!el.classList.contains("revelado")) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
