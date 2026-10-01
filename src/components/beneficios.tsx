import { Condicoes } from "./condicoes";

/**
 * APELIDO TEMPORÁRIO de <Condicoes> (removido na Fase 3 do redesenho). Mantido só para
 * as páginas antigas compilarem. Use `Condicoes` em código novo.
 * faixa -> faixa, lista -> lista, cartoes -> ficha.
 */
export function Beneficios({ variante = "faixa", className = "" }: { variante?: "faixa" | "lista" | "cartoes"; className?: string }) {
  return <Condicoes variante={variante === "cartoes" ? "ficha" : variante} fundo="azul" className={className} />;
}
