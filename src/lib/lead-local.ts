/**
 * Guarda no navegador da própria pessoa o nome, a loja e a cidade que ela acabou
 * de digitar, para a mensagem do WhatsApp na página de obrigado já dizer quem é.
 * Assim a vendedora acha o lead no CRM sem perguntar de novo.
 *
 * Fica no sessionStorage, que some quando a aba fecha, e nunca vai para a URL.
 * Só o mínimo para a vendedora reconhecer o contato: nada de e-mail ou documento.
 */
const CHAVE = "cs:lead";

export type LeadLocal = { nome: string; loja: string; cidade: string; uf: string };

/** O campo de empresa é a loja, para quem compra, ou a representação, para quem representa. */
export type TipoEmpresa = "loja" | "representacao";

export function guardarLeadLocal(dados: LeadLocal): void {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    /* navegação privada ou armazenamento cheio: a mensagem sai sem o nome */
  }
}

/** O texto guardado, como está. String vazia quando não há nada. */
export function lerLeadBruto(): string {
  try {
    return sessionStorage.getItem(CHAVE) ?? "";
  } catch {
    return "";
  }
}

export function interpretarLead(bruto: string): LeadLocal | null {
  if (!bruto) return null;
  try {
    const d = JSON.parse(bruto) as Partial<LeadLocal>;
    return { nome: d.nome ?? "", loja: d.loja ?? "", cidade: d.cidade ?? "", uf: d.uf ?? "" };
  } catch {
    return null;
  }
}

/**
 * "Sou Ana, da loja Bem Dormir, de Muriaé/MG." Só com o que foi preenchido.
 * Representante: "Sou João, da Silva Representações, de Juiz de Fora/MG."
 */
export function apresentacao(d: LeadLocal | null, empresa: TipoEmpresa = "loja"): string {
  if (!d?.nome) return "";
  let s = `Sou ${d.nome}`;
  if (d.loja) {
    // Não repete a palavra quando o nome da loja já começa com ela.
    const semPrefixo = empresa === "representacao" || /^loja\b/i.test(d.loja);
    s += semPrefixo ? `, da ${d.loja}` : `, da loja ${d.loja}`;
  }
  if (d.cidade) s += `, de ${d.cidade}${d.uf ? `/${d.uf}` : ""}`;
  return `${s}.`;
}
