/** A estrutura da empresa em quatro linhas, logo abaixo da capa. Sem número nenhum. */
const PILARES = [
  { titulo: "Fábrica própria", texto: "Corte, costura e embalagem em Muriaé, MG." },
  { titulo: "Coleção nova a cada estação", texto: "Primavera/verão e outono/inverno." },
  { titulo: "Linha para a família", texto: "Feminino, masculino e infantil." },
  { titulo: "Lojistas em todo o Brasil", texto: "Venda no atacado para o país inteiro." },
];

/** Fios da faixa: cruz no 2x2 do celular e do tablet; divisórias verticais na linha do desktop. */
const CELULA = [
  "border-b pb-5 pr-4 lg:pb-1 lg:pr-8",
  "border-b border-l pb-5 pl-4 lg:pb-1 lg:px-8",
  "pt-5 pr-4 lg:border-l lg:pt-1 lg:px-8",
  "border-l pt-5 pl-4 lg:pt-1 lg:pl-8 lg:pr-0",
];

/**
 * Faixa com fio, como a de condições das outras páginas, mas falando da estrutura:
 * na página de representante o dono pediu nenhum número. Os títulos não são <h3>
 * porque vêm logo depois do H1 (a ordem dos títulos não pode pular o h2).
 * Cada célula é uma subgrade de duas linhas, com o título encostado embaixo: quando
 * um título quebra em duas linhas, os textos continuam alinhados na mesma altura.
 */
export function RepEstrutura() {
  return (
    <section aria-label="A estrutura da Corpo Sensual" className="border-b border-line bg-paper">
      <ul className="wrap grid grid-cols-2 py-8 lg:grid-cols-4 lg:py-11">
        {PILARES.map((p, i) => (
          <li key={p.titulo} className={`row-span-2 grid grid-rows-subgrid border-line lg:border-b-0 ${CELULA[i]}`}>
            <p className="t-sub self-end text-[1.125rem] min-[400px]:text-[1.1875rem] lg:text-[clamp(1.25rem,0.6rem+1vw,1.5rem)]">{p.titulo}</p>
            <p className="mt-2 text-[14px] leading-[1.5] text-body md:text-[15px]">{p.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
