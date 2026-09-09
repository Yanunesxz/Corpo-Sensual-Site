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
};

/**
 * Formulário de captação usado nas páginas de catálogo, fábrica e cashback.
 * Anexa UTMs, URL e referrer da página antes de enviar.
 */
export function LeadForm({ source, submitLabel = "Continuar", withMessage = false }: Props) {
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

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="source" value={source} />
      {/* Honeypot: invisível para pessoas, preenchido por bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label="Nome" name="name" error={err.name}>
        <input className="field" name="name" autoComplete="name" required aria-invalid={Boolean(err.name)} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail" name="email" error={err.email}>
          <input className="field" type="email" name="email" autoComplete="email" inputMode="email" required aria-invalid={Boolean(err.email)} />
        </Field>
        <Field label="WhatsApp" name="whatsapp" error={err.whatsapp}>
          <input className="field" type="tel" name="whatsapp" autoComplete="tel" inputMode="tel" required aria-invalid={Boolean(err.whatsapp)} placeholder="(DDD) número" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Possui CNPJ?" name="has_cnpj" error={err.has_cnpj}>
          <select className="field" name="has_cnpj" defaultValue="" required aria-invalid={Boolean(err.has_cnpj)}>
            <option value="" disabled>
              Selecionar
            </option>
            <option value="sim">Sim, tenho loja</option>
            <option value="nao">Ainda não</option>
          </select>
        </Field>
        <Field label="Nome da loja" name="company" error={err.company} optional>
          <input className="field" name="company" autoComplete="organization" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_6rem]">
        <Field label="Cidade" name="city" error={err.city} optional>
          <input className="field" name="city" autoComplete="address-level2" />
        </Field>
        <Field label="UF" name="state" error={err.state} optional>
          <input className="field uppercase" name="state" autoComplete="address-level1" maxLength={2} />
        </Field>
      </div>

      {withMessage && (
        <Field label="Mensagem" name="message" error={err.message} optional>
          <textarea className="field min-h-28 resize-y" name="message" />
        </Field>
      )}

      {state.message && !state.ok && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}{" "}
          {site.contact.whatsappUrl && (
            <a className="underline" href={site.contact.whatsappUrl} target="_blank" rel="noreferrer">
              Abrir WhatsApp
            </a>
          )}
        </p>
      )}

      <button type="submit" className="btn btn-dark w-full" disabled={pending}>
        {pending ? "Enviando..." : submitLabel}
      </button>

      <p className="text-[11px] leading-relaxed text-ink-soft">
        Ao continuar você concorda com a{" "}
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
  optional = false,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="label mb-2 block">
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal text-ink-soft">(opcional)</span>}
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
