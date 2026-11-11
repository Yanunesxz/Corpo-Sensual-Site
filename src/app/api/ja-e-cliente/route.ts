import { consultarClienteNoCrm } from "@/lib/crm";
import { documentoValido, somenteDigitos } from "@/lib/documento";

/**
 * POST /api/ja-e-cliente  { documento: "07564390000171", tipo: "cnpj" | "cpf" } -> { cliente: true | false }
 *
 * O cadastro passo a passo chama aqui quando o CNPJ ou o CPF fica completo e válido.
 * Cliente da Corpo Sensual no CRM: o cadastro para e a pessoa vai para /ja-e-cliente
 * (pedido do Yan, 11/11/2026: "travar os clientes que já são nossos clientes").
 *
 * POST e não GET: o CPF é dado pessoal e não vai no endereço (nem em log de acesso).
 * Rota e não server action pelo mesmo motivo da /api/cnpj: o Next despacha as actions
 * uma por vez, e a consulta ficaria na fila do envio do formulário.
 *
 * A resposta é só sim ou não: o CRM nunca devolve nome, código ou outro dado. Mesmo
 * assim ela diz se um CNPJ/CPF é cliente, então a rota só atende o próprio site e
 * poucas consultas por endereço de IP. Na dúvida (CRM fora, tempo esgotado, limite)
 * a resposta é "não é": o cadastro segue e o lead nunca se perde.
 */

/** Consultas por IP numa janela. Quem se cadastra usa uma ou duas; o resto é abuso. */
const LIMITE = 12;
const JANELA_MS = 10 * 60 * 1000;
/** Por instância do servidor: não é um cofre, só tira a graça de varrer documentos. */
const consultas = new Map<string, { n: number; desde: number }>();

function dentroDoLimite(ip: string): boolean {
  const agora = Date.now();
  if (consultas.size > 5000) {
    for (const [k, v] of consultas) if (agora - v.desde > JANELA_MS) consultas.delete(k);
  }
  const atual = consultas.get(ip);
  if (!atual || agora - atual.desde > JANELA_MS) {
    consultas.set(ip, { n: 1, desde: agora });
    return true;
  }
  atual.n += 1;
  return atual.n <= LIMITE;
}

const naoE = (status = 200) => Response.json({ cliente: false }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  // Só o próprio site: o navegador manda Sec-Fetch-Site em todo fetch.
  const origem = req.headers.get("sec-fetch-site");
  if (origem && origem !== "same-origin") return naoE(403);

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "sem-ip";
  if (!dentroDoLimite(ip)) return naoE(429);

  let corpo: { documento?: unknown; tipo?: unknown } = {};
  try {
    corpo = (await req.json()) as typeof corpo;
  } catch {
    return naoE(400);
  }
  const tipo = corpo.tipo === "cpf" ? "cpf" : "cnpj";
  const documento = somenteDigitos(String(corpo.documento ?? ""));
  if (documento.length !== (tipo === "cnpj" ? 14 : 11) || !documentoValido(documento, tipo)) return naoE(400);

  const cliente = await consultarClienteNoCrm(documento);
  return Response.json({ cliente: cliente === true }, { headers: { "Cache-Control": "no-store" } });
}
