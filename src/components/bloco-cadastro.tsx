import type { ReactNode } from "react";
import type { LeadSource } from "@/lib/types";
import { site } from "@/lib/site";
import { Condicoes } from "./condicoes";
import { LeadForm } from "./lead-form";

type Props = {
  /** Âncora do cartão (padrão "formulario"). Se a <section> em volta já tem id="formulario", passe outro. */
  id?: string;
  eyebrow?: string;
  titulo?: string;
  texto?: ReactNode;
  /**
   * Lista ✓ das condições (atacado por grade, Pix, frete*, prazo). "topo": antes dos
   * campos; "depois": abaixo do botão, para o primeiro campo subir na tela (/catalogo).
   */
  condicoes?: boolean | "topo" | "depois";
  /** Classe da lista ✓ e da nota, ex.: "max-lg:hidden" quando a página já mostra as condições logo abaixo. */
  classeCondicoes?: string;
  source: LeadSource;
  submitLabel: string;
  withMessage?: boolean;
  /** Microtexto no fim do cartão, ex.: o asterisco do frete. */
  nota?: ReactNode;
  className?: string;
};

/** Cadastros de quem vem comprar: levam a razão social e o CNPJ da fábrica sob o envio. */
const ORIGENS_DE_COMPRA = new Set<LeadSource>(["catalogo", "colecao", "fabrica-de-pijamas"]);

/**
 * Cartão do formulário de cadastro: branco, fio de 1 px, sem sombra e sem canto.
 * data-sem-barra: a barra fixa do celular some quando o cartão está na tela.
 * Nos cadastros de compra, a última linha diz quem é a empresa (razão social, CNPJ e
 * cidade): a lojista que informa o CNPJ dela vê, ali mesmo, o da fábrica.
 * Nunca no representante: lá o conteúdo não tem número.
 */
export function BlocoCadastro({
  id = "formulario",
  eyebrow,
  titulo,
  texto,
  condicoes = false,
  classeCondicoes = "",
  source,
  submitLabel,
  withMessage = false,
  nota,
  className = "",
}: Props) {
  const listaNoTopo = condicoes === true || condicoes === "topo";
  const listaDepois = condicoes === "depois";
  const temTopo = Boolean(eyebrow || titulo || texto || listaNoTopo);
  const empresa = ORIGENS_DE_COMPRA.has(source);
  return (
    // Sem scroll-mt: o scroll-padding-top do <html> já desconta a barra presa do cabeçalho.
    <div id={id} className={`bg-paper p-5 shadow-[var(--shadow-card)] md:p-8 ${className}`} data-sem-barra>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {titulo && <h2 className={`t-sub text-[1.5rem] md:text-[1.75rem] ${eyebrow ? "mt-3" : ""}`}>{titulo}</h2>}
      {texto && <p className={`text-[15px] leading-[1.6] text-body ${eyebrow || titulo ? "mt-2" : ""}`}>{texto}</p>}
      {listaNoTopo && <Condicoes variante="lista" className={`${eyebrow || titulo || texto ? "mt-5" : ""} ${classeCondicoes}`} />}
      <div className={temTopo ? "mt-6 border-t border-line pt-6" : ""}>
        <LeadForm source={source} submitLabel={submitLabel} withMessage={withMessage} />
      </div>
      {listaDepois && <Condicoes variante="lista" className={`mt-6 border-t border-line pt-6 ${classeCondicoes}`} />}
      {(nota || empresa) && (
        <div className="mt-4 space-y-1">
          {nota && <p className={`legenda ${classeCondicoes}`}>{nota}</p>}
          {empresa && (
            <p className="legenda">
              {site.legal.razaoSocial} · <span className="whitespace-nowrap">CNPJ {site.legal.cnpj}</span> · {site.legal.cidade}, {site.legal.uf}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
