import { paginaJsonLd, type DadosDaPagina } from "@/lib/schema";
import { JsonLd } from "./json-ld";

/**
 * Dados estruturados de uma página (WebPage, trilha de navegação, FAQ e lista), no HTML
 * que o servidor entrega. Uma linha no começo de cada página:
 *
 *   <SeoPagina caminho="/sobre" tipo="AboutPage" titulo={TITULO} descricao={DESCRICAO} />
 *
 * O título e a descrição são os mesmos do metadata da página (uma constante para os dois).
 * A empresa e o site já vão em todas as páginas pelo layout.
 */
export function SeoPagina(props: DadosDaPagina) {
  return <JsonLd data={paginaJsonLd(props)} />;
}
