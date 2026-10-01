import { TOTAL_REFERENCIAS } from "@/lib/site";

/**
 * Os números que mostram o tamanho da fábrica sem expor valores (nada de faturamento,
 * clientes ou cidades). NUNCA na página de representante: o dono pediu zero números
 * lá. Nunca "15 dias" aqui: prazo não é prova de tamanho.
 */
const NUMEROS = [
  { valor: "25+", rotulo: "anos de fábrica própria em Muriaé, MG" },
  { valor: String(TOTAL_REFERENCIAS), rotulo: "referências nas duas coleções do ano" },
  { valor: "2", rotulo: "coleções por ano: verão e inverno" },
  { valor: "3", rotulo: "linhas: feminina, masculina e infantil" },
];

export function NumerosFabrica({ escuro = false, className = "" }: { escuro?: boolean; className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 ${className}`}>
      {NUMEROS.map((n, i) => (
        <li key={n.rotulo} data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
          <span className={`t-numeral block ${escuro ? "text-white" : "text-ink"}`}>{n.valor}</span>
          <span className={`mt-3 block max-w-[13rem] text-[13px] leading-snug md:text-[14px] ${escuro ? "text-noite-texto" : "text-muted"}`}>{n.rotulo}</span>
        </li>
      ))}
    </ul>
  );
}
