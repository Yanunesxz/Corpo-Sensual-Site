"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "./icons";

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
 * Quantos vídeos tocam ao mesmo tempo. No celular, decodificar dois vídeos
 * verticais enquanto a pessoa rola é o que dá a sensação de site travado; um por
 * vez resolve. No computador a grade de quatro da campanha toca junta.
 */
function limite(): number {
  return window.matchMedia("(min-width: 1024px)").matches ? 4 : 1;
}

/** Vídeos com pelo menos metade na tela agora. */
const visiveis = new Set<HTMLVideoElement>();
/** O vídeo em que a pessoa ligou o som tem prioridade sobre os outros. */
let preferido: HTMLVideoElement | null = null;
/** Vídeos que a pessoa pausou no botão: nada os faz tocar de novo, até ela pedir (WCAG 2.2.2). */
const pausadosPeloUsuario = new WeakSet<HTMLVideoElement>();

/**
 * Decide quem toca: entre os visíveis, primeiro o que está com som e depois a
 * ordem da página, até o limite. Assim, no celular, toca o primeiro vídeo que a
 * pessoa vê, e o próximo assume quando ela rola e ele sai da tela.
 */
function reorganizar() {
  const lista = [...visiveis].sort((a, b) => {
    if (a === preferido) return -1;
    if (b === preferido) return 1;
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
  const n = limite();
  let tocando = 0;
  for (const v of lista) {
    if (!pausadosPeloUsuario.has(v) && tocando < n) {
      tocando++;
      void v.play().catch(() => {});
    } else v.pause();
  }
}

function mostrar(v: HTMLVideoElement) {
  visiveis.add(v);
  reorganizar();
}

function esconder(v: HTMLVideoElement) {
  visiveis.delete(v);
  if (preferido === v) preferido = null;
  v.pause();
  reorganizar();
}

/**
 * Vídeo de campanha: começa mudo e toca sozinho, em laço, só enquanto está na tela.
 *
 * Nada é baixado antes da hora. O arquivo só recebe endereço quando o vídeo chega
 * perto da tela, e `preload="none"` impede o navegador de adiantar o download.
 * Antes disso o vídeo da produção baixava 1 MB em páginas onde ninguém rolou até
 * ele, disputando banda com a foto do topo.
 *
 * O botão no canto liga o som do vídeo escolhido e cala os demais. Quem pediu
 * menos animação no sistema (prefers-reduced-motion) recebe o pôster com os
 * controles do vídeo, sem reprodução automática.
 */
export function CampaignVideo({ src, legenda, comAudio = true, className = "", proporcao = "9/16" }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [perto, setPerto] = useState(false);
  const [comSom, setComSom] = useState(false);
  const [pausado, setPausado] = useState(false);

  // 1) Só dá o endereço do arquivo quando o vídeo chega a uma tela de distância.
  useEffect(() => {
    const v = ref.current;
    if (!v || perto) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPerto(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [perto]);

  // 2) Toca quando metade dele está na tela, pausa quando sai.
  useEffect(() => {
    const v = ref.current;
    if (!v || !perto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.controls = true;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) mostrar(v);
          else {
            esconder(v);
            // Saiu da tela: volta a ficar mudo, para não tocar som escondido.
            if (!v.muted) {
              v.muted = true;
              setComSom(false);
            }
          }
        }
      },
      { threshold: 0.5 },
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
      esconder(v);
      window.removeEventListener(EVENTO_SOM, aoOutroLigar);
    };
  }, [perto, src]);

  function alternarSom() {
    const v = ref.current;
    if (!v) return;
    const ligar = v.muted;
    v.muted = !ligar;
    setComSom(ligar);
    if (ligar) {
      window.dispatchEvent(new CustomEvent(EVENTO_SOM, { detail: src }));
      preferido = v;
      mostrar(v);
    }
  }

  function alternarPausa() {
    const v = ref.current;
    if (!v) return;
    if (pausadosPeloUsuario.has(v)) {
      pausadosPeloUsuario.delete(v);
      setPausado(false);
      mostrar(v);
    } else {
      pausadosPeloUsuario.add(v);
      setPausado(true);
      v.pause();
      reorganizar();
    }
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={ref}
        className={`h-full w-full object-cover ${className}`}
        style={{ aspectRatio: proporcao }}
        // O pôster também espera o vídeo chegar perto: pedido no início, ele disputava
        // banda com a foto do topo (LCP) em toda página com a seção da fábrica.
        poster={perto ? `/videos/${src}.jpg` : undefined}
        src={perto ? `/videos/${src}.mp4` : undefined}
        preload="none"
        muted
        loop
        playsInline
        aria-label={legenda}
      />

      {/* Pausa: todo vídeo em laço precisa de uma (WCAG 2.2.2). Com "reduzir movimento"
          o vídeo não toca sozinho e mostra os controles do navegador. */}
      <button
        type="button"
        onClick={alternarPausa}
        aria-pressed={pausado}
        aria-label={pausado ? "Reproduzir vídeo" : "Pausar vídeo"}
        className="absolute bottom-2 left-2 flex h-11 w-11 items-center justify-center rounded-full bg-ink/70 text-white transition hover:bg-ink/85 motion-reduce:hidden md:bottom-3 md:left-3"
      >
        {pausado ? <Play width={18} height={18} /> : <Pause width={18} height={18} />}
      </button>

      {comAudio && (
        <button
          type="button"
          onClick={alternarSom}
          aria-pressed={comSom}
          aria-label={comSom ? "Desligar o som do vídeo" : "Ligar o som do vídeo"}
          // Fundo sólido em vez de desfoque: desfocar por cima de um vídeo tocando
          // obriga o celular a recompor a imagem a cada quadro.
          className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-ink/70 text-white transition hover:bg-ink/85 md:bottom-3 md:right-3"
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
