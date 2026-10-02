import { TOTAL_REFERENCIAS } from "@/lib/site";

/**
 * Os números que mostram o tamanho da fábrica sem expor valores (nada de faturamento,
 * clientes ou cidades). NUNCA na página de representante: o dono pediu zero números
 * lá. Nunca "15 dias" aqui: prazo não é prova de tamanho.
 * No celular ficam numa faixa só, de quatro colunas, com o rótulo curto.
 */
const NUMEROS = [
  { valor: "25+", curto: "anos de fábrica própria", rotulo: "anos de fábrica própria em Muriaé, MG" },
  { valor: String(TOTAL_REFERENCIAS), curto: "referências no ano", rotulo: "referências nas duas coleções do ano" },
  { valor: "2", curto: "coleções por ano", rotulo: "coleções por ano: verão e inverno" },
  { valor: "3", curto: "linhas para a família", rotulo: "linhas: feminina, masculina e infantil" },
];

export function NumerosFabrica({ escuro = false, className = "" }: { escuro?: boolean; className?: string }) {
  return (
    <ul className={`grid grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 ${className}`}>
      {NUMEROS.map((n, i) => (
        <li key={n.rotulo} data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
          <span className={`t-numeral block max-md:text-[1.75rem] ${escuro ? "text-white" : "text-ink"}`}>{n.valor}</span>
          <span className={`mt-2 block max-w-[13rem] text-[12px] leading-snug md:mt-3 md:text-[14px] ${escuro ? "text-noite-texto" : "text-muted"}`}>
            <span className="md:hidden">{n.curto}</span>
            <span className="max-md:hidden">{n.rotulo}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
