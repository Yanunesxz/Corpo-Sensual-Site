"use client";

import { useSyncExternalStore } from "react";
import { linkWhatsApp } from "@/lib/site";
import { apresentacao, interpretarLead, lerLeadBruto, type TipoEmpresa } from "@/lib/lead-local";
import { WhatsApp } from "./icons";

type Contato = { readonly nome: string; readonly numero: string };

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
 * comprar, ou o Fabian, para quem se cadastrou como representante.
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

  return (
    <div>
      <p className="text-[1.0625rem] font-normal text-ink">{chamada}</p>
      <ul className={`mt-4 grid gap-3 ${contatos.length > 1 ? "sm:grid-cols-2" : "sm:max-w-sm"}`}>
        {contatos.map((c) => {
          const mensagem = [`Olá, ${c.nome}! ${abertura}`, quemSou, pedido].filter(Boolean).join(" ");
          return (
            <li key={c.numero}>
              <a href={linkWhatsApp(c.numero, mensagem)} target="_blank" rel="noreferrer" className="btn btn-dark w-full">
                <WhatsApp width={20} height={20} />
                Falar com {c.nome}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
