"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import s from "./landing.module.css";

type Props = { foto: string; alt: string; posicao: string; parallaxCelular: boolean };

/**
 * Faixa de foto com o parallax do Wix: a foto tem a altura da janela e o topo dela fica
 * em 0,2 x a distância da faixa ao topo da tela no desktop e 0,53 x no celular (medido
 * na página do Wix: anda mais devagar que a página, quase parada no desktop).
 * No celular, só onde o Wix também tem (verão). Sem movimento para quem pediu menos
 * animação no sistema: aí a foto só cobre a faixa.
 */
export function FaixaLanding({ foto, alt, posicao, parallaxCelular }: Props) {
  const faixa = useRef<HTMLElement>(null);
  const camada = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = faixa.current;
    const img = camada.current;
    if (!el || !img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    let quadro = 0;

    const mover = () => {
      quadro = 0;
      if (!desktop.matches && !parallaxCelular) {
        img.style.height = "";
        img.style.transform = "";
        return;
      }
      const r = el.getBoundingClientRect();
      img.style.height = `${Math.max(window.innerHeight, r.height)}px`;
      const velocidade = desktop.matches ? 0.2 : 0.53;
      img.style.transform = `translate3d(0, ${(-(1 - velocidade) * r.top).toFixed(1)}px, 0)`;
    };
    const pedir = () => {
      if (!quadro) quadro = requestAnimationFrame(mover);
    };

    mover();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    desktop.addEventListener("change", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      desktop.removeEventListener("change", pedir);
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [parallaxCelular]);

  return (
    <section ref={faixa} className={s.faixa}>
      <div ref={camada} className={s.faixaCamada}>
        <Image src={foto} alt={alt} fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: posicao }} />
      </div>
    </section>
  );
}
