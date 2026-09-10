"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase/client";
import { enviarLeadParaCrm } from "@/lib/crm";
import { documentoValido, somenteDigitos } from "@/lib/documento";
import type { LeadInsert, LeadRow, LeadSource } from "@/lib/types";

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120, "Nome muito longo."),
  email: z.email("Informe um e-mail válido.").max(160),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 13, "Informe o WhatsApp com DDD."),
  has_cnpj: z.enum(["sim", "nao"], { message: "Escolha uma opção." }),
  document: optionalText(20),
  company: optionalText(120),
  city: optionalText(120),
  state: optionalText(2),
  message: optionalText(1000),
  source: z.enum(["catalogo", "fabrica-de-pijamas", "programa-cashback", "colecao", "contato"]),
  page_url: optionalText(600),
  referrer: optionalText(600),
  utm_source: optionalText(200),
  utm_medium: optionalText(200),
  utm_campaign: optionalText(200),
  utm_term: optionalText(200),
  utm_content: optionalText(200),
}).superRefine((d, ctx) => {
  // Lojista informa CNPJ; consumidor informa CPF. Na página de contato o
  // documento é opcional: quem só quer saber onde comprar não precisa dele.
  const tipo = d.has_cnpj === "sim" ? "cnpj" : "cpf";
  const preenchido = somenteDigitos(d.document).length > 0;
  const obrigatorio = d.source !== "contato";
  if (!preenchido) {
    if (obrigatorio) {
      ctx.addIssue({ code: "custom", path: ["document"], message: tipo === "cnpj" ? "Informe o CNPJ da loja." : "Informe o seu CPF." });
    }
    return;
  }
  if (!documentoValido(d.document, tipo)) {
    ctx.addIssue({ code: "custom", path: ["document"], message: tipo === "cnpj" ? "CNPJ inválido. Confira os números." : "CPF inválido. Confira os números." });
  }
});

// Arquivos "use server" só podem exportar funções assíncronas (e tipos).
export type LeadFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
  /** O que a pessoa digitou, devolvido para o formulário não apagar após um erro. */
  values?: Partial<Record<"name" | "email" | "whatsapp" | "has_cnpj" | "document" | "company" | "city" | "state" | "message", string>>;
};

const nullIfEmpty = (v: string) => (v ? v : null);

function echo(formData: FormData): LeadFormState["values"] {
  const pick = (k: string) => String(formData.get(k) ?? "");
  return {
    name: pick("name"),
    email: pick("email"),
    whatsapp: pick("whatsapp"),
    has_cnpj: pick("has_cnpj"),
    document: pick("document"),
    company: pick("company"),
    city: pick("city"),
    state: pick("state"),
    message: pick("message"),
  };
}

/**
 * Recebe o formulário de lead, valida, avisa o CRM e grava no Supabase.
 * Em caso de sucesso redireciona para a página de obrigado.
 *
 * Ordem: primeiro o CRM (cria o prospecto e o negócio no funil de leads), depois
 * a gravação aqui com o resultado. Se o CRM não responder, o lead é gravado
 * como `pendente` e pode ser reenviado depois — nunca se perde.
 */
export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // Honeypot: bots preenchem o campo escondido. Fingimos sucesso e descartamos.
  if (formData.get("website")) {
    redirect("/obrigado?origem=catalogo");
  }

  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, message: "Confira os campos destacados.", errors, values: echo(formData) };
  }

  const d = parsed.data;
  const source = d.source as LeadSource;

  const row: LeadInsert = {
    name: d.name,
    email: d.email.toLowerCase(),
    whatsapp: d.whatsapp,
    has_cnpj: d.has_cnpj === "sim",
    document: nullIfEmpty(somenteDigitos(d.document)),
    company: nullIfEmpty(d.company),
    city: nullIfEmpty(d.city),
    state: nullIfEmpty(d.state.toUpperCase()),
    message: nullIfEmpty(d.message),
    source,
    page_url: nullIfEmpty(d.page_url),
    referrer: nullIfEmpty(d.referrer),
    utm_source: nullIfEmpty(d.utm_source),
    utm_medium: nullIfEmpty(d.utm_medium),
    utm_campaign: nullIfEmpty(d.utm_campaign),
    utm_term: nullIfEmpty(d.utm_term),
    utm_content: nullIfEmpty(d.utm_content),
  };

  // CRM (CSP 360): é o destino principal do lead. Falha vira `pendente` na cópia local.
  const crm = await enviarLeadParaCrm(row);
  if (crm.status === "pendente") console.warn("[leads] CRM pendente:", crm.erro);

  // Cópia local em `leads` (auditoria e fila de reenvio). Sem Supabase do site
  // configurado, o lead segue só pelo CRM — o formulário não pode travar por isso.
  const supabase = getSupabase();
  if (!supabase) {
    if (crm.status === "enviado") redirect(`/obrigado?origem=${source}`);
    console.error("[leads] Supabase do site não configurado e CRM não respondeu; lead não foi gravado.");
    return {
      ok: false,
      message: "Nosso cadastro está temporariamente indisponível. Tente de novo em instantes ou use outro canal.",
      values: echo(formData),
    };
  }

  const linha: LeadRow = {
    ...row,
    crm_status: crm.status,
    crm_cliente: crm.status === "enviado" ? crm.cliente : null,
    crm_negocio: crm.status === "enviado" ? crm.negocio : null,
    crm_erro: crm.status === "pendente" ? crm.erro : null,
    crm_enviado_em: crm.status === "enviado" ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from("leads").insert(linha);
  if (error) {
    console.error("[leads] erro ao gravar lead:", error.message);
    return {
      ok: false,
      message: "Não conseguimos enviar seu cadastro. Tente novamente ou use outro canal.",
      values: echo(formData),
    };
  }

  redirect(`/obrigado?origem=${source}`);
}
