"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Some na página de representante. Serve para o que tem número fora do <main> (WhatsApp,
 * telefone e horário no rodapé): o dono pediu zero números naquela página, e os únicos
 * dígitos tolerados são os da linha legal (pendência P3). Sem as variáveis de contato
 * não muda nada; com elas, o rodapé do representante continua sem telefone.
 */
export function ForaDoRepresentante({ children }: { children: ReactNode }) {
  return usePathname().startsWith("/seja-representante") ? null : children;
}
