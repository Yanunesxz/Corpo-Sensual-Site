import { TOTAL_REFERENCIAS } from "@/lib/site";

/**
 * Os números que mostram o tamanho da fábrica sem expor valores (nada de faturamento,
 * clientes ou cidades). NUNCA na página de representante: o dono pediu zero números
 * lá. Nunca "15 dias" aqui: prazo não é prova de tamanho.
 * Só os dois números grandes: "2 coleções" e "3 linhas" saíram porque número pequeno
 * faz a fábrica parecer menor. As coleções aparecem no rótulo, como catálogos.
 */
const NUMEROS = [
  { valor: "25+", rotulo: "anos de fábrica própria em Muriaé, MG" },
  { valor: String(TOTAL_REFERENCIAS), rotulo: "referências nos catálogos de verão e inverno" },
];

export function NumerosFabrica({ escuro = false, className = "" }: { escuro?: boolean; className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-x-6 gap-y-8 ${className}`}>
      {NUMEROS.map((n, i) => (
        <li key={n.rotulo} data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
          <span className={`t-numeral block ${escuro ? "text-white" : "text-ink"}`}>{n.valor}</span>
          <span className={`mt-2 block max-w-[15rem] text-[13px] leading-snug md:mt-3 md:text-[14px] ${escuro ? "text-noite-texto" : "text-muted"}`}>
            {n.rotulo}
          </span>
        </li>
      ))}
    </ul>
  );
}
