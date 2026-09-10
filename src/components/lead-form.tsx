"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitLead, type LeadFormState } from "@/app/actions/leads";
import { readTracking, UTM_KEYS } from "@/lib/utm";
import { formatarDocumento } from "@/lib/documento";
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
  // Documento é controlado para receber a máscara enquanto a pessoa digita.
  const [documento, setDocumento] = useState<string>(state.values?.document ?? "");
  // Sem escolha ainda, o campo já nasce como CNPJ: é o caso da maioria (lojista).
  const ehLojista = (hasCnpj || state.values?.has_cnpj || "sim") !== "nao";

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

      {/* Rótulos e exemplos iguais aos do site oficial da empresa. */}
      <Field label="Nome Completo" name="name" error={err.name}>
        <input id="name" className="field" name="name" autoComplete="name" required aria-invalid={Boolean(err.name)} aria-describedby={err.name ? "name-error" : undefined} defaultValue={v.name} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seu E-mail*" name="email" error={err.email}>
          <input id="email" className="field" type="email" name="email" autoComplete="email" inputMode="email" required aria-invalid={Boolean(err.email)} aria-describedby={err.email ? "email-error" : undefined} defaultValue={v.email} placeholder="Ex: compras@empresa.com" />
        </Field>
        <Field label="WhatsApp" name="whatsapp" error={err.whatsapp}>
          <input id="whatsapp" className="field" type="tel" name="whatsapp" autoComplete="tel" inputMode="tel" required aria-invalid={Boolean(err.whatsapp)} aria-describedby={err.whatsapp ? "whatsapp-error" : undefined} defaultValue={v.whatsapp} placeholder="Ex: 32 90000-9999" />
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
            onChange={(e) => {
              setHasCnpj(e.target.value);
              // Trocou de CNPJ para CPF (ou o contrário): o que estava digitado não serve mais.
              setDocumento("");
            }}
          >
            <option value="" disabled>
              Selecionar
            </option>
            <option value="sim">{isContact ? "Lojista, tenho CNPJ" : "Sim"}</option>
            <option value="nao">{isContact ? "Consumidor ou outro contato" : "Não"}</option>
          </select>
        </Field>
        {/* Lojista informa o CNPJ; quem não tem loja informa o CPF. */}
        <Field label={ehLojista ? "CNPJ" : "CPF"} name="document" error={err.document}>
          <input
            id="document"
            className="field"
            name="document"
            inputMode="numeric"
            autoComplete="off"
            required={!isContact}
            aria-invalid={Boolean(err.document)}
            aria-describedby={err.document ? "document-error" : undefined}
            value={documento}
            onChange={(e) => setDocumento(formatarDocumento(e.target.value, ehLojista ? "cnpj" : "cpf"))}
            placeholder={ehLojista ? "00.000.000/0000-00" : "000.000.000-00"}
            maxLength={ehLojista ? 18 : 14}
          />
        </Field>
      </div>

      <Field label="Nome da loja (opcional)" name="company" error={err.company}>
        <input id="company" className="field" name="company" autoComplete="organization" defaultValue={v.company} placeholder="Ex: Loja Bem Dormir" />
      </Field>
      {(hasCnpj || v.has_cnpj) === "nao" && !isContact && (
        /* Fundo branco para o aviso ler bem também quando o formulário está no bloco azul. */
        <p className="rounded-field border border-line bg-white px-4 py-3 text-sm leading-relaxed text-body">
          Sem CNPJ dá para conversar também. Vendemos no atacado, por grade e com pedido mínimo: envie os seus dados que
          avaliamos o seu caso. Se você é consumidor, diga a sua cidade e indicamos a loja mais perto de você.
        </p>
      )}

      <div className="grid grid-cols-[1fr_5.5rem] gap-4">
        <Field label="Cidade" name="city" error={err.city}>
          <input id="city" className="field" name="city" autoComplete="address-level2" defaultValue={v.city} placeholder="Ex: Muriaé" />
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
        <p role="alert" className="rounded-field border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800">
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

      <p className="text-sm leading-relaxed text-body">
        Ao continuar você concorda com a nossa{" "}
        <Link href="/politicas/privacidade" className="underline">
          política de privacidade
        </Link>
        . Usamos seus dados apenas para responder ao seu contato.
      </p>
      {!isContact && (
        <p className="text-sm text-body">
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
      {/* Rótulo acima do campo, em texto normal pequeno (o site atual não usa caixa alta) */}
      <label htmlFor={name} className="mb-1.5 block text-sm font-normal text-body">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[13px] text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
