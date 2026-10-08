"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SetaGaleria } from "./icones";
import s from "./landing.module.css";

type Foto = { src: string; alt: string; foco: string };

/**
 * Galeria em trilho, como o slider do Wix: no desktop três fotos e as setas redondas
 * (a de voltar só aparece depois de avançar); no celular, arrastar com o dedo.
 */
export function GaleriaLanding({ fotos }: { fotos: Foto[] }) {
  const trilho = useRef<HTMLDivElement>(null);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(false);

  const medir = useCallback(() => {
    const t = trilho.current;
    if (!t) return;
    setInicio(t.scrollLeft < 4);
    setFim(t.scrollLeft + t.clientWidth >= t.scrollWidth - 4);
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [medir]);

  const andar = (sentido: 1 | -1) => {
    const t = trilho.current;
    if (!t) return;
    const item = t.firstElementChild as HTMLElement | null;
    const passo = item ? item.offsetWidth + 20 : t.clientWidth;
    t.scrollBy({ left: passo * sentido });
  };

  return (
    <>
      <div ref={trilho} className={s.trilho} onScroll={medir} role="region" aria-label="Fotos da coleção" tabIndex={0}>
        {fotos.map((f) => (
          <div key={f.src} className={s.item}>
            <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 353px, 72vw" quality={80} className="object-cover" style={{ objectPosition: f.foco }} />
          </div>
        ))}
      </div>
      <button type="button" className={`${s.seta} ${s.setaAnterior}`} onClick={() => andar(-1)} hidden={inicio} aria-label="Foto anterior">
        <SetaGaleria />
      </button>
      <button type="button" className={`${s.seta} ${s.setaProxima}`} onClick={() => andar(1)} hidden={fim} aria-label="Próxima foto">
        <SetaGaleria />
      </button>
    </>
  );
}
