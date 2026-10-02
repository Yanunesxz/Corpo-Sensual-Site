"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead, type LeadFormState } from "@/app/actions/leads";
import { readTracking, UTM_KEYS } from "@/lib/utm";
import { documentoValido, formatarDocumento, somenteDigitos } from "@/lib/documento";
import { guardarLeadLocal } from "@/lib/lead-local";
import { enviarEvento, marcarLeadEnviado } from "@/lib/analytics";
import type { LeadSource } from "@/lib/types";
import { site } from "@/lib/site";
import { ArrowRight, Lock } from "./icons";

const initialLeadState: LeadFormState = { ok: false };

/** Ordem dos campos na tela: depois de um erro, o foco vai ao primeiro que falhou. */
const ORDEM_DOS_CAMPOS = ["name", "whatsapp", "email", "has_cnpj", "document", "company", "city", "state", "message"] as const;

/**
 * "(32) 99999-8888" enquanto a pessoa digita (o servidor guarda só os dígitos). Quem cola
 * o número com o código do país (+55) fica com DDD e número. O parêntese só fecha quando
 * chega o terceiro dígito, senão o Backspace travava em "(32) ".
 */
function formatarWhatsApp(valor: string): string {
  let d = somenteDigitos(valor);
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  d = d.slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const numero = d.slice(2);
  if (numero.length <= 4) return `(${ddd}) ${numero}`;
  const corte = numero.length - 4;
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`;
}

/**
 * Aplica a máscara num campo controlado sem jogar o cursor para o fim quando a pessoa
 * corrige um dígito no meio: o cursor volta para depois do mesmo número de dígitos.
 */
function aplicarMascara(el: HTMLInputElement, formatar: (v: string) => string, guardar: (v: string) => void) {
  const bruto = el.value;
  const cursor = el.selectionStart ?? bruto.length;
  const novo = formatar(bruto);
  guardar(novo);
  if (cursor >= bruto.length) return;
  const digitosAntes = somenteDigitos(bruto.slice(0, cursor)).length;
  requestAnimationFrame(() => {
    let i = 0;
    for (let n = 0; i < novo.length && n < digitosAntes; i++) if (/\d/.test(novo[i])) n++;
    try {
      el.setSelectionRange(i, i);
    } catch {
      // Campo sem seleção de texto: fica como está.
    }
  });
}

const EMAIL_SIMPLES = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Props = {
  source: LeadSource;
  submitLabel?: string;
  /** Mostra o campo de mensagem livre. */
  withMessage?: boolean;
};

/**
 * Formulário de captação usado nas páginas de catálogo, fábrica, coleção, contato
 * e representação comercial.
 * Captura UTMs, URL e referrer da página automaticamente e mantém o que a pessoa
 * digitou quando a validação falha.
 *
 * Desenho pensado para o celular: um campo por linha, rótulo sempre visível,
 * WhatsApp antes do e-mail (é por ele que a vendedora fala), a pergunta do CNPJ
 * em dois botões grandes em vez de uma lista, e o botão de envio na largura toda.
 * Em contêiner de 384 px ou mais, WhatsApp + e-mail e CNPJ + loja ficam lado a lado.
 *
 * Ajuda antes do envio: WhatsApp e CNPJ/CPF ganham máscara enquanto a pessoa digita, e ao
 * sair do campo um documento completo e inválido ou um e-mail pela metade já mostram o
 * mesmo aviso que o servidor daria. Os avisos somem quando a pessoa volta a digitar e
 * não bloqueiam o envio: quem decide continua sendo o servidor.
 *
 * Botão da página que aponta para #formulario: ao fim da rolagem o cartão ganha um anel
 * que aparece e some ([data-chamado], globals.css) e, no desktop, o primeiro campo
 * recebe o foco. Mostra onde é para agir, mesmo quando o formulário já estava na tela.
 *
 * Um único LeadForm por página: os id dos campos são fixos.
 */
export function LeadForm({ source, submitLabel = "Continuar", withMessage = false }: Props) {
  const [state, action, pending] = useActionState(
    async (prev: LeadFormState, formData: FormData) => {
      const t = readTracking();
      for (const key of UTM_KEYS) formData.set(key, t[key]);
      formData.set("page_url", t.page_url);
      formData.set("referrer", t.referrer);
      // Para a mensagem do WhatsApp na página de obrigado já dizer quem é a pessoa.
      const campo = (k: string) => String(formData.get(k) ?? "").trim();
      guardarLeadLocal({ nome: campo("name"), loja: campo("company"), cidade: campo("city"), uf: campo("state").toUpperCase() });
      // O GA conta o lead uma vez só, no obrigado que vem logo depois. Vai só a origem,
      // nenhum dado digitado. Campo-isca preenchido é robô e não marca.
      if (!formData.get("website")) marcarLeadEnviado(source);
      return submitLead(prev, formData);
    },
    initialLeadState,
  );
  const [hasCnpj, setHasCnpj] = useState<string>(state.values?.has_cnpj ?? "");
  // Documento e WhatsApp são controlados para receber a máscara enquanto a pessoa digita.
  const [documento, setDocumento] = useState<string>(state.values?.document ?? "");
  const [whats, setWhats] = useState<string>(formatarWhatsApp(state.values?.whatsapp ?? ""));
  // Avisos na saída do campo, antes do envio (os do servidor chegam em state.errors).
  const [avisos, setAvisos] = useState<{ document?: string; email?: string }>({});
  // Sem escolha ainda, o campo já nasce como CNPJ: quem se cadastra costuma ser lojista.
  const ehLojista = (hasCnpj || state.values?.has_cnpj || "sim") !== "nao";

  const err: NonNullable<LeadFormState["errors"]> = { ...avisos, ...(state.errors ?? {}) };
  const v = state.values ?? {};
  const isContact = source === "contato";
  // Representante não tem loja: os rótulos de empresa e mensagem mudam de sentido.
  const ehRepresentante = source === "representante";
  const c = site.contact;
  const escolhaCnpj = hasCnpj || v.has_cnpj || "";

  // form_inicio: a pessoa começou a preencher (primeiro foco num campo), uma vez por
  // montagem. Só a origem, nada digitado; sem consentimento enviarEvento não faz nada.
  const comecou = useRef(false);
  const form = useRef<HTMLFormElement>(null);

  // Voltou com erro de validação: leva o foco (e a tela) ao primeiro campo que falhou.
  // No celular o teclado já abre nele, e o leitor de tela lê o erro pelo aria-describedby.
  useEffect(() => {
    const erros = state.errors;
    if (!erros) return;
    const primeiro = ORDEM_DOS_CAMPOS.find((k) => erros[k]);
    if (!primeiro) return;
    const alvo =
      primeiro === "has_cnpj"
        ? form.current?.querySelector<HTMLInputElement>('input[name="has_cnpj"]')
        : form.current?.querySelector<HTMLElement>(`#${primeiro}`);
    alvo?.focus();
  }, [state]);
  const aoComecar = () => {
    if (comecou.current) return;
    comecou.current = true;
    enviarEvento("form_inicio", { lead_source: source });
  };
  // Foco posto pelo site (e não pela pessoa) não conta como começo de preenchimento.
  const focoDoSite = useRef(false);

  // Um botão da página chamou o formulário (#formulario): mostra onde é para agir.
  useEffect(() => {
    const f = form.current;
    if (!f) return;
    const cartao = f.parentElement?.closest<HTMLElement>("[data-sem-barra]") ?? f;
    let espera = 0;
    let reserva = 0;
    let apagar = 0;
    let pendente = false;
    const chamar = () => {
      if (!pendente) return;
      pendente = false;
      window.clearTimeout(espera);
      window.clearTimeout(reserva);
      window.removeEventListener("scrollend", chamar);
      cartao.dataset.chamado = "";
      window.clearTimeout(apagar);
      apagar = window.setTimeout(() => delete cartao.dataset.chamado, 1500);
      // Só no desktop: no celular o foco abriria o teclado em cima do título.
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      const nome = f.querySelector<HTMLInputElement>("#name");
      if (!nome || f.contains(document.activeElement)) return;
      focoDoSite.current = true;
      nome.focus({ preventScroll: true });
      focoDoSite.current = false;
    };
    const aoClicar = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement) || a.hash !== "#formulario" || a.pathname !== window.location.pathname) return;
      const y = window.scrollY;
      pendente = true;
      window.clearTimeout(espera);
      window.clearTimeout(reserva);
      window.addEventListener("scrollend", chamar, { once: true });
      // Nada rolou (o formulário já estava no lugar): responde logo. Senão, ao fim da rolagem;
      // a reserva cobre o navegador que não avisa o fim (Safari).
      espera = window.setTimeout(() => {
        if (Math.abs(window.scrollY - y) < 2) chamar();
      }, 160);
      reserva = window.setTimeout(chamar, 1300);
    };
    document.addEventListener("click", aoClicar);
    return () => {
      document.removeEventListener("click", aoClicar);
      window.removeEventListener("scrollend", chamar);
      window.clearTimeout(espera);
      window.clearTimeout(reserva);
      window.clearTimeout(apagar);
    };
  }, []);

  return (
    <form
      ref={form}
      action={action}
      onFocusCapture={() => {
        if (!focoDoSite.current) aoComecar();
      }}
      onInputCapture={aoComecar}
      // Enviando: um segundo toque (ou Enter) não manda de novo. O botão não fica
      // "disabled" para o foco do teclado não se perder no meio do envio.
      onSubmit={(e) => {
        if (pending) e.preventDefault();
      }}
      className="@container space-y-4"
      noValidate
      data-sem-barra
    >
      <input type="hidden" name="source" value={source} />
      {/* Honeypot: fica invisível para pessoas e é preenchido por bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label="Seu nome" name="name" error={err.name}>
        <input id="name" className="field" name="name" autoComplete="name" required aria-invalid={Boolean(err.name)} aria-describedby={err.name ? "name-error" : undefined} defaultValue={v.name} placeholder="Nome e sobrenome" />
      </Field>

      <div className="grid gap-4 @[24rem]:grid-cols-2">
        <Field label="WhatsApp com DDD" name="whatsapp" error={err.whatsapp}>
          <input
            id="whatsapp"
            className="field tabular-nums"
            type="tel"
            name="whatsapp"
            autoComplete="tel"
            inputMode="tel"
            required
            aria-invalid={Boolean(err.whatsapp)}
            aria-describedby={err.whatsapp ? "whatsapp-error" : undefined}
            value={whats}
            onChange={(e) => aplicarMascara(e.target, formatarWhatsApp, setWhats)}
            placeholder="(32) 90000-9999"
          />
        </Field>
        <Field label="E-mail" name="email" error={err.email}>
          <input
            id="email"
            className="field"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={Boolean(err.email)}
            aria-describedby={err.email ? "email-error" : undefined}
            defaultValue={v.email}
            placeholder="compras@sualoja.com"
            onChange={() => {
              if (avisos.email) setAvisos((a) => ({ ...a, email: undefined }));
            }}
            onBlur={(e) => {
              const valor = e.target.value.trim();
              if (valor && !EMAIL_SIMPLES.test(valor)) setAvisos((a) => ({ ...a, email: "Informe um e-mail válido." }));
            }}
          />
        </Field>
      </div>

      {/* CNPJ sim/não em dois botões: um toque, sem abrir lista no celular. */}
      <fieldset key={v.has_cnpj ?? ""} aria-describedby={err.has_cnpj ? "has_cnpj-error" : undefined}>
        <legend className="mb-1.5 block text-sm font-medium text-ink">{ehRepresentante || isContact ? "Tem CNPJ?" : "A sua loja tem CNPJ?"}</legend>
        <div className="seg" data-invalido={err.has_cnpj ? "" : undefined}>
          {[
            { valor: "sim", rotulo: "Sim, tenho CNPJ" },
            { valor: "nao", rotulo: "Ainda não" },
          ].map((o) => (
            <label key={o.valor}>
              <input
                type="radio"
                name="has_cnpj"
                value={o.valor}
                defaultChecked={v.has_cnpj === o.valor}
                required
                onChange={(e) => {
                  setHasCnpj(e.target.value);
                  // Trocou de CNPJ para CPF (ou o contrário): o que estava digitado não serve mais.
                  setDocumento("");
                  setAvisos((a) => ({ ...a, document: undefined }));
                }}
              />
              <span>{o.rotulo}</span>
            </label>
          ))}
        </div>
        {err.has_cnpj && (
          <p id="has_cnpj-error" className="mt-1.5 text-[13px] text-erro">
            {err.has_cnpj}
          </p>
        )}
      </fieldset>

      {escolhaCnpj === "nao" && !isContact && !ehRepresentante && (
        <p className="rounded-field bg-areia px-4 py-3 text-sm leading-relaxed text-ink">
          O CNPJ não é obrigatório. Informe o seu CPF: vendemos no atacado, por grade e sem pedido mínimo, e avaliamos o
          seu caso. Se você é consumidor, diga a sua cidade e indicamos a loja mais perto de você.
        </p>
      )}

      <div className="grid gap-4 @[24rem]:grid-cols-2">
        {/* Lojista informa o CNPJ; quem não tem loja informa o CPF. */}
        <Field label={ehLojista ? "CNPJ" : "CPF"} name="document" error={err.document}>
          <input
            id="document"
            className="field tabular-nums"
            name="document"
            inputMode="numeric"
            autoComplete="off"
            required
            aria-invalid={Boolean(err.document)}
            aria-describedby={err.document ? "document-error" : undefined}
            value={documento}
            onChange={(e) => {
              aplicarMascara(e.target, (valor) => formatarDocumento(valor, ehLojista ? "cnpj" : "cpf"), setDocumento);
              if (avisos.document) setAvisos((a) => ({ ...a, document: undefined }));
            }}
            // Completo e com dígito verificador errado: avisa na saída do campo, com a frase do servidor.
            onBlur={() => {
              const tipo = ehLojista ? "cnpj" : "cpf";
              const completo = somenteDigitos(documento).length === (ehLojista ? 14 : 11);
              if (completo && !documentoValido(documento, tipo)) {
                setAvisos((a) => ({ ...a, document: ehLojista ? "CNPJ inválido. Confira os números." : "CPF inválido. Confira os números." }));
              }
            }}
            placeholder={ehLojista ? "00.000.000/0000-00" : "000.000.000-00"}
            maxLength={ehLojista ? 18 : 14}
          />
        </Field>
        <Field label={ehRepresentante ? "Empresa de representação (opcional)" : "Nome da loja (opcional)"} name="company" error={err.company}>
          <input
            id="company"
            className="field"
            name="company"
            autoComplete="organization"
            defaultValue={v.company}
            placeholder={ehRepresentante ? "Ex: Silva Representações" : "Ex: Loja Bem Dormir"}
          />
        </Field>
      </div>

      <div className="grid grid-cols-[1fr_5.5rem] gap-4">
        <Field label="Cidade" name="city" error={err.city}>
          <input
            id="city"
            className="field"
            name="city"
            autoComplete="address-level2"
            required
            aria-invalid={Boolean(err.city)}
            aria-describedby={err.city ? "city-error" : undefined}
            defaultValue={v.city}
            placeholder="Ex: Muriaé"
          />
        </Field>
        <Field label="UF" name="state" error={err.state}>
          <input
            id="state"
            className="field uppercase"
            name="state"
            autoComplete="address-level1"
            maxLength={2}
            autoCapitalize="characters"
            required
            aria-invalid={Boolean(err.state)}
            aria-describedby={err.state ? "state-error" : undefined}
            defaultValue={v.state}
            placeholder="MG"
          />
        </Field>
      </div>

      {withMessage && (
        <Field
          label={ehRepresentante ? "Região e experiência" : isContact ? "Mensagem" : "Mensagem (opcional)"}
          name="message"
          error={err.message}
        >
          <textarea
            id="message"
            className="field min-h-28 resize-y"
            name="message"
            required={isContact || ehRepresentante}
            aria-invalid={Boolean(err.message)}
            aria-describedby={err.message ? "message-error" : undefined}
            defaultValue={v.message}
            placeholder={
              ehRepresentante
                ? "As cidades que você atende, há quanto tempo representa e quais marcas leva hoje."
                : isContact
                  ? "Como podemos ajudar?"
                  : "Conte um pouco sobre a sua loja ou o que você procura."
            }
          />
        </Field>
      )}

      {state.message && !state.ok && (
        <p role="alert" className="rounded-field border border-erro/40 bg-erro/5 px-4 py-3 text-sm leading-relaxed text-erro">
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

      <div className="pt-1">
        {/* Rótulos longos ("Quero receber a tabela de preços") cabem numa linha a 360 px e
            na coluna estreita da landing entre 1024 e 1279 px: letra de 15 px e sem seta
            quando o formulário é estreito (pela largura do formulário, não da tela). */}
        <button type="submit" className="btn btn-primary btn-lg w-full px-2.5 text-[15px] @[21rem]:px-6 @[21rem]:text-base" aria-disabled={pending || undefined}>
          {pending ? "Enviando..." : submitLabel}
          {!pending && <ArrowRight width={18} height={18} className="seta hidden @[23.5rem]:block" />}
        </button>
      </div>

      <p className="flex gap-2 text-[13px] leading-relaxed text-muted">
        <Lock width={16} height={16} className="mt-0.5 flex-none" />
        <span>
          Ao continuar, você concorda com a nossa{" "}
          <Link href="/politicas/privacidade" className="text-ink underline underline-offset-2">
            política de privacidade
          </Link>
          . Usamos seus dados apenas para responder ao seu contato.
        </span>
      </p>
      {/* Fora do contato (que já é o canal) e do representante: lá o caminho é o cadastro
          e o Fabian, e o telefone poria dígitos numa página que não pode ter número. */}
      {/* Sem WhatsApp nem e-mail configurados a linha some: mandar para /contato, que
          também é um formulário, era um laço sem saída. */}
      {!isContact && !ehRepresentante && (c.whatsappUrl || c.email) && (
        <p className="text-[13px] text-muted">
          Prefere falar direto?{" "}
          {c.whatsappUrl ? (
            <a className="text-ink underline underline-offset-2" href={c.whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp {c.whatsappLabel}
            </a>
          ) : (
            <a className="text-ink underline underline-offset-2" href={`mailto:${c.email}`}>
              {c.email}
            </a>
          )}
        </p>
      )}
    </form>
  );
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {/* Sem role="alert": eram oito avisos de uma vez. O erro é lido pelo aria-describedby
          quando o foco chega ao campo; o aviso geral, no fim do formulário, é o alerta. */}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[13px] text-erro">
          {error}
        </p>
      )}
    </div>
  );
}
