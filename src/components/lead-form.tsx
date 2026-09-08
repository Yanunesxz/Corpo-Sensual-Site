"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitLead, type LeadFormState } from "@/app/actions/leads";
import { readTracking, UTM_KEYS } from "@/lib/utm";
import type { LeadSource } from "@/lib/types";
import { site } from "@/lib/site";

const initialLeadState: LeadFormState = { ok: false };

type Props = {
  source: LeadSource;
  submitLabel?: string;
  /** Mostra o campo de mensagem livre. */
  withMessage?: boolean;
  /** Fundo escuro: ajusta cores dos rótulos. */
  dark?: boolean;
};

/**
 * Formulário de captação usado nas páginas de catálogo, fábrica e cashback.
 * Captura UTMs, URL e referrer da página automaticamente (campos ocultos).
 */
export function LeadForm({ source, submitLabel = "Continuar", withMessage = false, dark = false }: Props) {
  // Antes de enviar, anexa UTMs, URL e referrer lidos da página atual.
  const [state, action, pending] = useActionState(
    async (prev: LeadFormState, formData: FormData) => {
      const t = readTracking();
      for (const key of UTM_KEYS) formData.set(key, t[key]);
      formData.set("page_url", t.page_url);
      formData.set("referrer", t.referrer);
      return submitLead(prev, formData);
    },
    initialLeadState,
  );

  const err = state.errors ?? {};
  const label = dark ? "text-white/80" : "text-ink-soft";

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="source" value={source} />
      {/* Honeypot: fica invisível para pessoas e é preenchido por bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field label="Nome" name="name" error={err.name} labelClass={label}>
        <input className="field" name="name" autoComplete="name" required aria-invalid={Boolean(err.name)} placeholder="Como podemos te chamar?" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="E-mail" name="email" error={err.email} labelClass={label}>
          <input className="field" type="email" name="email" autoComplete="email" inputMode="email" required aria-invalid={Boolean(err.email)} placeholder="voce@empresa.com.br" />
        </Field>
        <Field label="WhatsApp" name="whatsapp" error={err.whatsapp} labelClass={label}>
          <input className="field" type="tel" name="whatsapp" autoComplete="tel" inputMode="tel" required aria-invalid={Boolean(err.whatsapp)} placeholder="(32) 99999-9999" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Possui CNPJ?" name="has_cnpj" error={err.has_cnpj} labelClass={label}>
          <select className="field" name="has_cnpj" defaultValue="" required aria-invalid={Boolean(err.has_cnpj)}>
            <option value="" disabled>
              Selecionar
            </option>
            <option value="sim">Sim, tenho loja</option>
            <option value="nao">Ainda não</option>
          </select>
        </Field>
        <Field label="Nome da loja (opcional)" name="company" error={err.company} labelClass={label}>
          <input className="field" name="company" autoComplete="organization" placeholder="Loja ou marca" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_6rem]">
        <Field label="Cidade (opcional)" name="city" error={err.city} labelClass={label}>
          <input className="field" name="city" autoComplete="address-level2" placeholder="Cidade" />
        </Field>
        <Field label="UF" name="state" error={err.state} labelClass={label}>
          <input className="field uppercase" name="state" autoComplete="address-level1" maxLength={2} placeholder="MG" />
        </Field>
      </div>

      {withMessage && (
        <Field label="Mensagem (opcional)" name="message" error={err.message} labelClass={label}>
          <textarea className="field min-h-28 resize-y" name="message" placeholder="Conte um pouco sobre a sua loja ou o que você procura." />
        </Field>
      )}

      {state.message && !state.ok && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}{" "}
          {site.contact.whatsappUrl && (
            <a className="underline" href={site.contact.whatsappUrl} target="_blank" rel="noreferrer">
              Abrir WhatsApp
            </a>
          )}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Enviando..." : submitLabel}
      </button>

      <p className={`text-xs leading-relaxed ${label}`}>
        Ao continuar você concorda com a nossa{" "}
        <Link href="/politicas/privacidade" className="underline">
          política de privacidade
        </Link>
        . Usamos seus dados apenas para o contato comercial.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  labelClass,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  labelClass: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className={`mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] ${labelClass}`}>
        {label}
      </label>
      <div className="[&>*]:w-full" data-field={name}>
        {children}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
