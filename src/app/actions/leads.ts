"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase/client";
import type { LeadInsert, LeadSource } from "@/lib/types";

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120, "Nome muito longo."),
  email: z.email("Informe um e-mail válido.").max(160),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 13, "Informe o WhatsApp com DDD."),
  has_cnpj: z.enum(["sim", "nao"], { message: "Escolha uma opção." }),
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
});

// Arquivos "use server" só podem exportar funções assíncronas (e tipos).
export type LeadFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
  /** O que a pessoa digitou, devolvido para o formulário não apagar após um erro. */
  values?: Partial<Record<"name" | "email" | "whatsapp" | "has_cnpj" | "company" | "city" | "state" | "message", string>>;
};

const nullIfEmpty = (v: string) => (v ? v : null);

function echo(formData: FormData): LeadFormState["values"] {
  const pick = (k: string) => String(formData.get(k) ?? "");
  return {
    name: pick("name"),
    email: pick("email"),
    whatsapp: pick("whatsapp"),
    has_cnpj: pick("has_cnpj"),
    company: pick("company"),
    city: pick("city"),
    state: pick("state"),
    message: pick("message"),
  };
}

/**
 * Recebe o formulário de lead, valida e grava no Supabase.
 * Em caso de sucesso redireciona para a página de obrigado.
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

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[leads] Supabase não configurado; lead não foi gravado.");
    return {
      ok: false,
      message: "Nosso cadastro está temporariamente indisponível. Tente de novo em instantes ou use outro canal.",
      values: echo(formData),
    };
  }

  const row: LeadInsert = {
    name: d.name,
    email: d.email.toLowerCase(),
    whatsapp: d.whatsapp,
    has_cnpj: d.has_cnpj === "sim",
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

  const { error } = await supabase.from("leads").insert(row);
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
