"use client";

import { useActionState } from "react";
import { enviarLeadLanding, type EstadoLanding } from "@/app/actions/leads-landing";
import { marcarLeadEnviado } from "@/lib/analytics";
import { readTracking, UTM_KEYS } from "@/lib/utm";
import s from "./landing.module.css";

const inicial: EstadoLanding = {};

/**
 * Formulário das landing pages, igual ao do Wix: Nome Completo, Seu E-mail*, WhatsApp e
 * "Continuar". Os três campos são obrigatórios (como lá). Ao enviar vai para a página de
 * obrigado da coleção, que tem o botão do catálogo.
 */
export function FormularioLanding({ colecao }: { colecao: "verao" | "inverno" }) {
  const [estado, acao, enviando] = useActionState(async (prev: EstadoLanding, fd: FormData) => {
    const t = readTracking();
    for (const k of UTM_KEYS) fd.set(k, t[k]);
    fd.set("page_url", t.page_url);
    fd.set("referrer", t.referrer);
    // A conversão (GA e Google Ads) conta uma vez, no obrigado que vem logo depois.
    if (!fd.get("website")) marcarLeadEnviado("colecao");
    return enviarLeadLanding(prev, fd);
  }, inicial);

  const v = estado.valores ?? {};
  const e = estado.erros ?? {};

  return (
    <form action={acao} className={s.cartao}>
      <input type="hidden" name="colecao" value={colecao} />
      {/* Campo-isca para robôs: invisível para pessoas. */}
      <div className={s.isca} aria-hidden="true">
        <label>
          Site
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={s.grupo}>
        <label htmlFor="lp-nome" className={`${s.rotulo} ${s.mont}`}>
          Nome Completo
        </label>
        <input
          id="lp-nome"
          name="name"
          type="text"
          required
          autoComplete="name"
          defaultValue={v.name}
          className={s.campo}
          aria-invalid={e.name ? true : undefined}
          aria-describedby={e.name ? "lp-nome-erro" : undefined}
        />
        {e.name && (
          <p id="lp-nome-erro" className={s.erroCampo}>
            {e.name}
          </p>
        )}
      </div>

      <div className={s.grupo}>
        <label htmlFor="lp-email" className={`${s.rotulo} ${s.mont}`}>
          Seu E-mail*
        </label>
        <input
          id="lp-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="Ex: compras@empresa.com"
          defaultValue={v.email}
          className={s.campo}
          aria-invalid={e.email ? true : undefined}
          aria-describedby={e.email ? "lp-email-erro" : undefined}
        />
        {e.email && (
          <p id="lp-email-erro" className={s.erroCampo}>
            {e.email}
          </p>
        )}
      </div>

      <div className={s.grupo}>
        <label htmlFor="lp-whats" className={`${s.rotulo} ${s.mont}`}>
          WhatsApp
        </label>
        <input
          id="lp-whats"
          name="whatsapp"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="Ex: 32 90000-9999"
          defaultValue={v.whatsapp}
          className={s.campo}
          aria-invalid={e.whatsapp ? true : undefined}
          aria-describedby={e.whatsapp ? "lp-whats-erro" : undefined}
        />
        {e.whatsapp && (
          <p id="lp-whats-erro" className={s.erroCampo}>
            {e.whatsapp}
          </p>
        )}
      </div>

      <button type="submit" className={s.enviar} disabled={enviando}>
        {enviando ? "Enviando..." : "Continuar"}
      </button>
      {estado.erro && (
        <p className={s.erroGeral} role="alert">
          {estado.erro}
        </p>
      )}
    </form>
  );
}
