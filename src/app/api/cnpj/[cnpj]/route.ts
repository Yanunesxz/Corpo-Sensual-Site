import type { NextRequest } from "next/server";
import { consultarCnpj } from "@/lib/cnpj";
import { cnpjValido, somenteDigitos } from "@/lib/documento";

/**
 * GET /api/cnpj/07564390000171 -> { encontrado: true, empresa: { razaoSocial, nomeFantasia, cidade, uf, ativa } }
 *
 * O cadastro passo a passo chama aqui assim que o CNPJ fica completo e válido, para
 * preencher a loja e a cidade. É uma leitura, não uma mutação: por isso é uma rota e não
 * uma server action (o Next despacha as actions uma por vez, e a consulta ficaria na
 * fila atrás do envio do formulário). Dado público; a resposta completa pode ficar em
 * cache por um dia.
 */

/**
 * A Receita, o IBGE e as lojistas estão no Brasil. Por padrão a Vercel roda a função em
 * Washington (iad1), e de lá o IBGE estourava o tempo limite: a cidade saía sem acento.
 */
export const preferredRegion = "gru1";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/cnpj/[cnpj]">) {
  const { cnpj } = await ctx.params;
  const d = somenteDigitos(cnpj);
  if (!cnpjValido(d)) {
    return Response.json({ encontrado: false }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const consulta = await consultarCnpj(d);
  if (!consulta) return Response.json({ encontrado: false }, { headers: { "Cache-Control": "no-store" } });
  // Sem o nome oficial da cidade a resposta é provisória: não entra no cache do CDN.
  const cache = consulta.cidadeOficial ? "public, max-age=86400, s-maxage=86400" : "no-store";
  return Response.json({ encontrado: true, empresa: consulta.empresa }, { headers: { "Cache-Control": cache } });
}
