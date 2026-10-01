import { Condicoes } from "./condicoes";

/**
 * APELIDO TEMPORÁRIO de <Condicoes variante="ficha"> (removido na Fase 3 do redesenho).
 * Use `Condicoes` em código novo.
 */
export function CommercialTerms({ className = "", fundo = "branco" }: { className?: string; fundo?: "branco" | "azul" }) {
  return <Condicoes variante="ficha" fundo={fundo} className={className} />;
}
