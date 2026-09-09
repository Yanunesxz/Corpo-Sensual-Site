"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
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
 * Formulário de captação usado nas páginas de catálogo, fábrica, cashback e contato.
 * Captura UTMs, URL e referrer da página automaticamente e mantém o que a pessoa
 * digitou quando a validação falha.
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
  const [hasCnpj, setHasCnpj] = useState<string>(state.values?.has_cnpj ?? "");

  const err = state.errors ?? {};
  const v = state.values ?? {};
  const isContact = source === "contato";
  const c = site.contact;

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

      <Field label="Nome" name="name" error={err.name}>
        <input id="name" className="field" name="name" autoComplete="name" required aria-invalid={Boolean(err.name)} aria-describedby={err.name ? "name-error" : undefined} defaultValue={v.name} placeholder="Como podemos te chamar?" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="E-mail" name="email" error={err.email}>
          <input id="email" className="field" type="email" name="email" autoComplete="email" inputMode="email" required aria-invalid={Boolean(err.email)} aria-describedby={err.email ? "email-error" : undefined} defaultValue={v.email} placeholder="voce@empresa.com.br" />
        </Field>
        <Field label="WhatsApp" name="whatsapp" error={err.whatsapp}>
          <input id="whatsapp" className="field" type="tel" name="whatsapp" autoComplete="tel" inputMode="tel" required aria-invalid={Boolean(err.whatsapp)} aria-describedby={err.whatsapp ? "whatsapp-error" : undefined} defaultValue={v.whatsapp} placeholder="(DDD) número" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={isContact ? "Você é" : "Possui CNPJ?"} name="has_cnpj" error={err.has_cnpj}>
          <select
            id="has_cnpj"
            key={v.has_cnpj ?? ""}
            className="field"
            name="has_cnpj"
            defaultValue={v.has_cnpj ?? ""}
            required
            aria-invalid={Boolean(err.has_cnpj)}
            aria-describedby={err.has_cnpj ? "has_cnpj-error" : undefined}
            onChange={(e) => setHasCnpj(e.target.value)}
          >
            <option value="" disabled>
              Selecionar
            </option>
            <option value="sim">{isContact ? "Lojista, tenho CNPJ" : "Sim, tenho loja com CNPJ"}</option>
            <option value="nao">{isContact ? "Consumidor ou outro contato" : "Ainda não"}</option>
          </select>
        </Field>
        <Field label="Nome da loja (opcional)" name="company" error={err.company}>
          <input id="company" className="field" name="company" autoComplete="organization" defaultValue={v.company} placeholder="Loja ou marca" />
        </Field>
      </div>
      {(hasCnpj || v.has_cnpj) === "nao" && !isContact && (
        <p className="border-l-2 border-line pl-3 text-sm leading-relaxed text-ink-soft">
          Vendemos apenas para lojas com CNPJ ativo. Se você é consumidor, envie mesmo assim com a sua cidade: indicamos
          onde encontrar as peças.
        </p>
      )}

      <div className="grid grid-cols-[1fr_5.5rem] gap-4">
        <Field label="Cidade" name="city" error={err.city}>
          <input id="city" className="field" name="city" autoComplete="address-level2" defaultValue={v.city} placeholder="Cidade" />
        </Field>
        <Field label="UF" name="state" error={err.state}>
          <input id="state" className="field uppercase" name="state" autoComplete="address-level1" maxLength={2} autoCapitalize="characters" defaultValue={v.state} placeholder="MG" />
        </Field>
      </div>

      {withMessage && (
        <Field label={isContact ? "Mensagem" : "Mensagem (opcional)"} name="message" error={err.message}>
          <textarea id="message" className="field min-h-28 resize-y" name="message" defaultValue={v.message} placeholder={isContact ? "Como podemos ajudar?" : "Conte um pouco sobre a sua loja ou o que você procura."} />
        </Field>
      )}

      {state.message && !state.ok && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800">
          {state.message}{" "}
          {c.whatsappUrl ? (
            <a className="underline" href={c.whatsappUrl} target="_blank" rel="noreferrer">
              Abrir WhatsApp
            </a>
          ) : c.email ? (
            <a className="underline" href={`mailto:${c.email}`}>
              Enviar e-mail
            </a>
          ) : (
            <Link className="underline" href="/contato">
              Ver outros contatos
            </Link>
          )}
        </p>
      )}

      <button type="submit" className="btn btn-dark w-full sm:w-auto" disabled={pending}>
        {pending ? "Enviando..." : submitLabel}
      </button>

      <p className="text-xs leading-relaxed text-ink-soft">
        Ao continuar você concorda com a nossa{" "}
        <Link href="/politicas/privacidade" className="underline">
          política de privacidade
        </Link>
        . Usamos seus dados apenas para responder ao seu contato.
      </p>
      {!isContact && (
        <p className="text-sm text-ink-soft">
          Prefere falar direto?{" "}
          {c.whatsappUrl ? (
            <a className="underline" href={c.whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp {c.whatsappLabel}
            </a>
          ) : c.email ? (
            <a className="underline" href={`mailto:${c.email}`}>
              {c.email}
            </a>
          ) : (
            <Link className="underline" href="/contato">
              Veja os canais de contato
            </Link>
          )}
        </p>
      )}
    </form>
  );
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="label mb-1.5 block text-ink-soft">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
