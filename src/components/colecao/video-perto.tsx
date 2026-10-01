"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { CampaignVideo } from "@/components/campaign-video";

/**
 * CampaignVideo que só entra na página quando chega a uma tela e meia de distância.
 *
 * O <video poster> baixa o pôster na hora, mesmo no fim da página: na coleção eram
 * quatro pôsteres (137 KB) disputando a banda com a foto da capa, que é o LCP. Até lá
 * fica um quadro vazio com a mesma proporção (sem deslocar nada). Sai quando a F1
 * passar a dar o pôster só perto da tela no próprio CampaignVideo (pedidos-f1.md, g3).
 */
export function VideoPerto(props: ComponentProps<typeof CampaignVideo>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [perto, setPerto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || perto) return;
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setPerto(true);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    // Dentro de um trilho, o vídeo fora da faixa visível fica recortado pelo próprio trilho:
    // observa a região inteira, para os quatro chegarem juntos.
    io.observe(el.closest("[role=region]") ?? el);
    return () => io.disconnect();
  }, [perto]);

  if (perto) return <CampaignVideo {...props} />;
  return <div ref={ref} className="w-full bg-noite/10" style={{ aspectRatio: props.proporcao ?? "9/16" }} />;
}
