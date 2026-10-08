"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ROTAS_LANDING } from "@/lib/content/landing-colecoes";

/**
 * Esconde o que é do site (cabeçalho, rodapé, barra fixa, WhatsApp flutuante) nas
 * landing pages de coleção, que são cópias das páginas do Wix e têm o próprio visual.
 */
export function SemLanding({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return ROTAS_LANDING.includes(pathname) ? null : children;
}
