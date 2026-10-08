"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase/client";
import { enviarLeadParaCrm } from "@/lib/crm";
import type { LeadInsert, LeadRow } from "@/lib/types";

/**
 * Formulário das landing pages de coleção (/colecao-verao e /colecao-inverno), cópias
 * das páginas do Wix: só nome, e-mail e WhatsApp, os três obrigatórios como lá.
 *
 * Vai para o mesmo destino dos outros formulários do site: CRM primeiro, depois a cópia
 * na tabela `leads` do Supabase, com origem "colecao". A mensagem diz de qual landing
 * page veio, para a vendedora saber qual catálogo a pessoa pediu.
 */

const opcional = (max: number) => z.string().trim().max(max).optional().default("");

const schema = z.object({
  colecao: z.enum(["verao", "inverno"]),
  name: z.string().trim().min(2, "Informe seu nome.").max(120, "Nome muito longo."),
  email: z.email("Informe um e-mail válido.").max(160),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 13, "Informe o WhatsApp com DDD."),
  page_url: opcional(600),
  referrer: opcional(600),
  utm_source: opcional(200),
  utm_medium: opcional(200),
  utm_campaign: opcional(200),
  utm_term: opcional(200),
  utm_content: opcional(200),
});

export type EstadoLanding = {
  erro?: string;
  erros?: Partial<Record<"name" | "email" | "whatsapp", string>>;
  valores?: Partial<Record<"name" | "email" | "whatsapp", string>>;
};

const MENSAGEM: Record<"verao" | "inverno", string> = {
  verao: "Landing page Coleção de Verão (pediu o catálogo Primavera/Verão 2027)",
  inverno: "Landing page Coleção Outono/Inverno (pediu o catálogo Outono/Inverno 2026)",
};

const vazioVira = (v: string) => (v ? v : null);

export async function enviarLeadLanding(_prev: EstadoLanding, formData: FormData): Promise<EstadoLanding> {
  const colecao = formData.get("colecao") === "inverno" ? "inverno" : "verao";
  const obrigado = `/colecao-${colecao}-obrigado`;
  // Campo-isca: robô preenche. Finge sucesso e descarta.
  if (formData.get("website")) redirect(obrigado);

  const valores = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
  };

  const lido = schema.safeParse(Object.fromEntries(formData));
  if (!lido.success) {
    const erros: EstadoLanding["erros"] = {};
    for (const issue of lido.error.issues) {
      const campo = issue.path[0];
      if ((campo === "name" || campo === "email" || campo === "whatsapp") && !erros[campo]) erros[campo] = issue.message;
    }
    return { erros, valores };
  }

  const d = lido.data;
  const row: LeadInsert = {
    name: d.name,
    email: d.email.toLowerCase(),
    whatsapp: d.whatsapp,
    has_cnpj: false,
    document: null,
    company: null,
    city: null,
    state: null,
    message: MENSAGEM[d.colecao],
    source: "colecao",
    page_url: vazioVira(d.page_url),
    referrer: vazioVira(d.referrer),
    utm_source: vazioVira(d.utm_source),
    utm_medium: vazioVira(d.utm_medium),
    utm_campaign: vazioVira(d.utm_campaign),
    utm_term: vazioVira(d.utm_term),
    utm_content: vazioVira(d.utm_content),
  };

  const crm = await enviarLeadParaCrm(row);
  if (crm.status === "pendente") console.warn("[leads-landing] CRM pendente:", crm.erro);

  const supabase = getSupabase();
  if (!supabase) {
    if (crm.status === "enviado") redirect(obrigado);
    console.error("[leads-landing] Supabase do site não configurado e CRM não respondeu; lead não foi gravado.");
    return { erro: "Nosso cadastro está temporariamente indisponível. Tente de novo em instantes.", valores };
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
    console.error("[leads-landing] erro ao gravar lead:", error.message);
    return { erro: "Não conseguimos enviar seu cadastro. Tente novamente.", valores };
  }

  redirect(obrigado);
}
