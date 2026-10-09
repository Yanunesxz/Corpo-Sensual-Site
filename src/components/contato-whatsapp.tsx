"use client";

import { useSyncExternalStore } from "react";
import { linkWhatsApp } from "@/lib/site";
import { apresentacao, interpretarLead, lerLeadBruto, type TipoEmpresa } from "@/lib/lead-local";
import { WhatsApp } from "./icons";

/** rotulo: como o botão chama o contato quando não é um nome ("o gestor comercial"). */
type Contato = { readonly nome: string; readonly numero: string; readonly rotulo?: string };

type Props = {
  /** Com quem a pessoa pode falar, já na ordem de exibição. */
  contatos: readonly Contato[];
  /** Texto acima dos botões. */
  chamada: string;
  /** Primeira frase da mensagem, depois do "Olá, Fulano!". */
  abertura: string;
  /** Fecho da mensagem, conforme a página do cadastro. Pode ser vazio. */
  pedido?: string;
  /** Como chamar o campo de empresa na mensagem: loja ou representação. */
  empresa?: TipoEmpresa;
};

// O dado não muda enquanto a página está aberta: não há o que assinar.
const semAssinatura = () => () => {};
const nadaNoServidor = () => "";

/**
 * Botões de WhatsApp da página de obrigado: as vendedoras, para quem veio
 * comprar, ou o gestor comercial, para quem se cadastrou como representante.
 *
 * O cadastro já foi para o CRM antes desta tela aparecer: aqui é só o atalho. A
 * mensagem sai com o nome, a empresa e a cidade que a pessoa acabou de digitar,
 * para quem atende achar o cadastro no CRM sem perguntar de novo.
 */
export function ContatoWhatsApp({ contatos, chamada, abertura, pedido = "", empresa = "loja" }: Props) {
  // No servidor não existe sessionStorage: a página sai com a mensagem genérica e,
  // já no navegador, passa a usar o que a pessoa digitou.
  const bruto = useSyncExternalStore(semAssinatura, lerLeadBruto, nadaNoServidor);
  const quemSou = apresentacao(interpretarLead(bruto), empresa);

  // Container query e não media query: o mesmo bloco mora num painel estreito (coluna
  // da direita no desktop) ou largo (tablet). Os botões só ficam lado a lado com folga.
  return (
    <div className="@container">
      <p className="max-w-md text-[1.0625rem] leading-[1.5] text-ink text-pretty">{chamada}</p>
      <ul className={`mt-5 grid gap-3 ${contatos.length > 1 ? "@lg:grid-cols-2" : "@lg:max-w-sm"}`}>
        {contatos.map((c) => {
          const mensagem = [`${c.rotulo ? "Olá!" : `Olá, ${c.nome}!`} ${abertura}`, quemSou, pedido].filter(Boolean).join(" ");
          return (
            <li key={c.numero}>
              <a href={linkWhatsApp(c.numero, mensagem)} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg w-full">
                <WhatsApp width={22} height={22} />
                Falar com {c.rotulo ?? c.nome}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
