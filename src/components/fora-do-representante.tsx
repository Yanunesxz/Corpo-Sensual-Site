"use client";

import { useRota } from "@/lib/rota";
import type { ReactNode } from "react";

/**
 * Some na página de representante. Serve para o que tem número fora do <main> (WhatsApp,
 * telefone e horário no rodapé): o dono pediu zero números naquela página, e os únicos
 * dígitos tolerados são os da linha legal (pendência P3). Sem as variáveis de contato
 * não muda nada; com elas, o rodapé do representante continua sem telefone.
 */
export function ForaDoRepresentante({ children }: { children: ReactNode }) {
  return useRota().startsWith("/seja-representante") ? null : children;
}

/**
 * Endereço do rodapé. Em /contato, abaixo de 1024 px, some: a seção "Onde estamos",
 * logo acima, já traz o mesmo endereço, o mesmo link do mapa e os mesmos canais, e no
 * celular lia-se tudo em dobro numa tela só. A linha legal (razão social e CNPJ) continua.
 */
export function EnderecoDoRodape({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <address className={`${className} ${useRota() === "/contato" ? "max-lg:hidden" : ""}`}>{children}</address>;
}
