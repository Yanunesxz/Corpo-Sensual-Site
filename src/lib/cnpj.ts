// Só o servidor importa este módulo (a rota /api/cnpj). As fontes são públicas e sem
// chave, mas a consulta fica no servidor para o navegador falar só com o site.
import { cnpjValido, somenteDigitos } from "./documento";
import MUNICIPIOS from "./municipios.json";

/**
 * Consulta pública de CNPJ: o cadastro passo a passo (components/lead-form.tsx)
 * preenche o nome da loja, a cidade e a UF assim que a lojista digita o CNPJ.
 *
 * Fonte principal: BrasilAPI (dados abertos da Receita Federal). Reserva: minhareceita,
 * que serve a mesma base. As duas devolvem o município em caixa alta e sem acento
 * ("MURIAE"); o nome certo ("Muriaé") sai de municipios.json pelo código do IBGE, que
 * as duas também trazem. Qualquer falha devolve null e o formulário pergunta à pessoa.
 *
 * A tabela de municípios fica no repositório de propósito: a função da Vercel roda nos
 * EUA e de lá a API do IBGE não respondia a tempo (a cidade chegava sem acento e ainda
 * ficava um dia no cache do CDN). Para refazê-la, baixe
 * https://servicodados.ibge.gov.br/api/v1/localidades/municipios e grave
 * { "<id>": "<nome>" } ordenado pelo id. Os dois limites de tempo (4 s cada fonte da
 * Receita) cabem nos 10 s da função.
 */
export type Empresa = {
  razaoSocial: string;
  nomeFantasia: string;
  cidade: string;
  uf: string;
  /** Situação cadastral "ATIVA" na Receita. */
  ativa: boolean;
};

const TEMPO_LIMITE_MS = 4000;

export type ConsultaCnpj = {
  empresa: Empresa;
  /** O município estava na tabela: a cidade saiu com acento. Sem isso, a resposta não deve ficar em cache. */
  cidadeOficial: boolean;
};

type RespostaReceita = {
  razao_social?: string | null;
  nome_fantasia?: string | null;
  municipio?: string | null;
  uf?: string | null;
  descricao_situacao_cadastral?: string | null;
  situacao_cadastral?: number | string | null;
  codigo_municipio_ibge?: number | string | null;
};

async function buscarJson<T>(url: string, limiteMs: number): Promise<T | null> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), limiteMs);
  try {
    const r = await fetch(url, { signal: controle.signal, cache: "no-store", headers: { Accept: "application/json" } });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Palavras que ficam minúsculas no meio do nome e siglas que ficam em caixa alta. */
const MINUSCULAS = new Set(["de", "da", "do", "das", "dos", "e", "em", "a", "o", "para", "com"]);
const SIGLAS = new Set(["LTDA", "LTDA.", "ME", "EPP", "EIRELI", "S/A", "SA", "S.A.", "MEI", "CIA", "CIA.", "SS"]);

/** "LOJA BEM DORMIR LTDA" vira "Loja Bem Dormir LTDA". */
export function nomeProprio(texto: string): string {
  return texto
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((palavra, i) => {
      const alta = palavra.toUpperCase();
      if (SIGLAS.has(alta)) return alta;
      if (i > 0 && MINUSCULAS.has(palavra)) return palavra;
      return palavra
        .split("-")
        .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
        .join("-");
    })
    .join(" ");
}

/**
 * A razão social do MEI termina com o CPF da pessoa ("ANA SILVA 12345678901"). O CPF
 * não vai para a tela nem para o CRM: sai daqui.
 */
function semCpf(razao: string): string {
  return razao.replace(/\s*\d{11}\s*$/, "").trim();
}

function interpretar(d: RespostaReceita): Omit<Empresa, "cidade"> & { municipio: string; codigoIbge: string } {
  const razaoSocial = nomeProprio(semCpf(String(d.razao_social ?? "")));
  const nomeFantasia = nomeProprio(String(d.nome_fantasia ?? "").trim());
  const situacao = String(d.descricao_situacao_cadastral ?? "").toUpperCase();
  return {
    razaoSocial,
    // Fantasia igual à razão social não acrescenta nada: fica só a razão.
    nomeFantasia: nomeFantasia.toLowerCase() === razaoSocial.toLowerCase() ? "" : nomeFantasia,
    uf: String(d.uf ?? "").trim().toUpperCase().slice(0, 2),
    ativa: situacao === "ATIVA" || String(d.situacao_cadastral) === "2",
    municipio: nomeProprio(String(d.municipio ?? "").trim()),
    codigoIbge: somenteDigitos(String(d.codigo_municipio_ibge ?? "")),
  };
}

/** Nome oficial do município, com acento, pelo código do IBGE (tabela local). */
function nomeDoMunicipio(codigoIbge: string): string {
  return (MUNICIPIOS as Record<string, string | undefined>)[codigoIbge] ?? "";
}

/** Nunca lança: sem resposta (ou CNPJ inválido) devolve null. */
export async function consultarCnpj(cnpj: string): Promise<ConsultaCnpj | null> {
  const d = somenteDigitos(cnpj);
  if (!cnpjValido(d)) return null;

  const bruto =
    (await buscarJson<RespostaReceita>(`https://brasilapi.com.br/api/cnpj/v1/${d}`, TEMPO_LIMITE_MS)) ??
    (await buscarJson<RespostaReceita>(`https://minhareceita.org/${d}`, TEMPO_LIMITE_MS));
  if (!bruto || !bruto.razao_social) return null;

  const e = interpretar(bruto);
  const oficial = nomeDoMunicipio(e.codigoIbge);
  return {
    empresa: { razaoSocial: e.razaoSocial, nomeFantasia: e.nomeFantasia, cidade: oficial || e.municipio, uf: e.uf, ativa: e.ativa },
    cidadeOficial: oficial !== "",
  };
}
