import type { ReactNode } from "react";
import type { LeadSource } from "@/lib/types";
import { Condicoes } from "./condicoes";
import { LeadForm } from "./lead-form";

type Props = {
  /** Âncora do cartão (padrão "formulario"). Se a <section> em volta já tem id="formulario", passe outro. */
  id?: string;
  eyebrow?: string;
  titulo?: string;
  texto?: ReactNode;
  /** Mostra a lista ✓ das condições no topo (sem pedido mínimo, Pix, frete*, prazo). */
  condicoes?: boolean;
  source: LeadSource;
  submitLabel: string;
  withMessage?: boolean;
  /** Microtexto no fim do cartão, ex.: o asterisco do frete. */
  nota?: ReactNode;
  className?: string;
};

/**
 * Cartão do formulário de cadastro: branco, fio de 1 px, sem sombra e sem canto.
 * data-sem-barra: a barra fixa do celular some quando o cartão está na tela.
 */
export function BlocoCadastro({ id = "formulario", eyebrow, titulo, texto, condicoes = false, source, submitLabel, withMessage = false, nota, className = "" }: Props) {
  const temTopo = Boolean(eyebrow || titulo || texto || condicoes);
  return (
    // Sem scroll-mt: o scroll-padding-top do <html> já desconta a barra presa do cabeçalho.
    <div id={id} className={`bg-paper p-5 shadow-[var(--shadow-card)] md:p-8 ${className}`} data-sem-barra>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {titulo && <h2 className={`t-sub text-[1.5rem] md:text-[1.75rem] ${eyebrow ? "mt-3" : ""}`}>{titulo}</h2>}
      {texto && <p className={`text-[15px] leading-[1.6] text-body ${eyebrow || titulo ? "mt-2" : ""}`}>{texto}</p>}
      {condicoes && <Condicoes variante="lista" className={eyebrow || titulo || texto ? "mt-5" : ""} />}
      <div className={temTopo ? "mt-6 border-t border-line pt-6" : ""}>
        <LeadForm source={source} submitLabel={submitLabel} withMessage={withMessage} />
      </div>
      {nota && <p className="legenda mt-4">{nota}</p>}
    </div>
  );
}
