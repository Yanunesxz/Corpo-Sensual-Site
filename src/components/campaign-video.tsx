"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Nome do arquivo em public/videos, sem extensão. Ex.: "campanha/piquenique". */
  src: string;
  /** Texto alternativo, lido por leitores de tela. */
  legenda: string;
  className?: string;
  /** Proporção do quadro. Os vídeos da campanha são verticais (9/16). */
  proporcao?: string;
};

/**
 * Vídeo de campanha: toca sozinho, sem som e em laço, só enquanto está na tela.
 * Fora da tela ele pausa, para não gastar bateria e dados do visitante.
 * Quem pediu menos animação no sistema (prefers-reduced-motion) recebe só o
 * pôster, com o controle do vídeo disponível.
 */
export function CampaignVideo({ src, legenda, className = "", proporcao = "9/16" }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (semAnimacao) {
      v.controls = true;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
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
  );
}
