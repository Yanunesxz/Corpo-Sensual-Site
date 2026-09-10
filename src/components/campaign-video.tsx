"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Nome do arquivo em public/videos, sem extensão. Ex.: "campanha/piquenique". */
  src: string;
  /** Texto alternativo, lido por leitores de tela. */
  legenda: string;
  /** Este vídeo tem trilha de áudio? Sem áudio, o botão de som não aparece. */
  comAudio?: boolean;
  className?: string;
  /** Proporção do quadro. Os vídeos da campanha são verticais (9/16). */
  proporcao?: string;
};

/** Só um vídeo por vez fica com som: os outros se calam ao ouvir este evento. */
const EVENTO_SOM = "cs:video-com-som";

/**
 * Vídeo de campanha: toca sozinho, em laço, só enquanto está na tela, e começa
 * mudo — navegador nenhum deixa tocar sozinho com som. O botão no canto liga o
 * som do vídeo escolhido e cala os demais.
 * Quem pediu menos animação no sistema (prefers-reduced-motion) recebe o pôster
 * com os controles do vídeo, sem reprodução automática.
 */
export function CampaignVideo({ src, legenda, comAudio = true, className = "", proporcao = "9/16" }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [comSom, setComSom] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.controls = true;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void v.play().catch(() => {});
          else {
            v.pause();
            // Saiu da tela: volta a ficar mudo, para não tocar som escondido.
            if (!v.muted) {
              v.muted = true;
              setComSom(false);
            }
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(v);

    const aoOutroLigar = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== src && !v.muted) {
        v.muted = true;
        setComSom(false);
      }
    };
    window.addEventListener(EVENTO_SOM, aoOutroLigar);
    return () => {
      io.disconnect();
      window.removeEventListener(EVENTO_SOM, aoOutroLigar);
    };
  }, [src]);

  function alternarSom() {
    const v = ref.current;
    if (!v) return;
    const ligar = v.muted;
    v.muted = !ligar;
    setComSom(ligar);
    if (ligar) {
      window.dispatchEvent(new CustomEvent(EVENTO_SOM, { detail: src }));
      void v.play().catch(() => {});
    }
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={ref}
        className={`h-full w-full object-cover ${className}`}
        style={{ aspectRatio: proporcao }}
        poster={`/videos/${src}.jpg`}
        preload="metadata"
        muted
        loop
        playsInline
        aria-label={legenda}
      >
        <source src={`/videos/${src}.mp4`} type="video/mp4" />
      </video>

      {comAudio && (
        <button
          type="button"
          onClick={alternarSom}
          aria-pressed={comSom}
          aria-label={comSom ? "Desligar o som do vídeo" : "Ligar o som do vídeo"}
          className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur-sm transition hover:bg-ink/80 md:bottom-3 md:right-3"
        >
          {comSom ? <IconeSomLigado /> : <IconeSomDesligado />}
        </button>
      )}
    </div>
  );
}

function IconeSomLigado() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
      <path d="M19 6.5a8 8 0 0 1 0 11" />
    </svg>
  );
}

function IconeSomDesligado() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="m17 9 4 6" />
      <path d="m21 9-4 6" />
    </svg>
  );
}
