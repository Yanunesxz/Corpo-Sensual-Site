"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { submitLead, type LeadFormState } from "@/app/actions/leads";
import { readTracking, UTM_KEYS } from "@/lib/utm";
import { cnpjValido, documentoValido, formatarCnpj, formatarCpf, formatarDocumento, somenteDigitos } from "@/lib/documento";
import { aplicarMascara, EMAIL_SIMPLES, formatarWhatsApp } from "@/lib/mascaras";
import { guardarLeadLocal } from "@/lib/lead-local";
import { enviarEvento, marcarLeadEnviado } from "@/lib/analytics";
import type { LeadSource } from "@/lib/types";
import { site } from "@/lib/site";
import type { Empresa } from "@/lib/cnpj";
import { ArrowRight, Check, ChevronLeft, Lock } from "./icons";

const initialLeadState: LeadFormState = { ok: false };

type Campo = "name" | "whatsapp" | "email" | "has_cnpj" | "document" | "company" | "city" | "state" | "message";
type Valores = Record<Campo, string>;
type Erros = Partial<Record<Campo, string>>;

/** Um passo por pergunta. "loja" só aparece quando o CNPJ não trouxe a loja e a cidade. */
type Passo = "nome" | "whatsapp" | "documento" | "loja" | "email" | "mensagem";

/** Campo -> passo em que ele é perguntado: um erro do servidor leva a pessoa de volta a ele. */
const PASSO_DO_CAMPO: Record<Campo, Passo> = {
  name: "nome",
  whatsapp: "whatsapp",
  has_cnpj: "documento",
  document: "documento",
  company: "loja",
  city: "loja",
  state: "loja",
  email: "email",
  message: "mensagem",
};

/** Ordem em que os campos aparecem: depois de um erro, vale o primeiro que falhou. */
const ORDEM_DOS_CAMPOS: Campo[] = ["name", "whatsapp", "has_cnpj", "document", "company", "city", "state", "email", "message"];

/** As 27 UFs, para o seletor do passo da loja (a mesma lista do servidor). */
const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

type Props = {
  source: LeadSource;
  submitLabel?: string;
  /** Mostra o passo de mensagem livre (contato). */
  withMessage?: boolean;
};

/**
 * Cadastro passo a passo: uma pergunta por tela, como num atendimento.
 *
 * Ordem: nome -> WhatsApp -> CNPJ -> (loja e cidade) -> e-mail -> (mensagem). Ao
 * completar um CNPJ válido, o site consulta /api/cnpj e já traz o nome da loja, a cidade
 * e a UF; a pessoa confere ("Encontramos a sua loja") e o passo da loja é pulado. Sem
 * CNPJ ("Ainda não tenho CNPJ"), pede o CPF e depois a cidade. No último passo um resumo
 * mostra o que foi reunido, com "corrigir" em cada linha, e o botão de envio.
 *
 * Quem já é cliente para no passo do documento: com o CNPJ ou CPF completo, o site
 * pergunta ao CRM (/api/ja-e-cliente) e, se for de um cliente da Corpo Sensual, o
 * "Continuar" leva a /ja-e-cliente em vez do passo seguinte. Cliente não vira lead.
 * Na dúvida (CRM fora, demora), o cadastro segue normalmente.
 *
 * Representante e varejo (consumidor que procura uma loja) têm o cadastro curto, como o
 * das landing pages: nome -> WhatsApp -> cidade e UF -> e-mail. Sem CNPJ nem mensagem:
 * isso fica para a conversa depois (o servidor também não pede).
 *
 * Tudo vive num único <form>: os passos anteriores viram campos escondidos, então o
 * envio é o mesmo de sempre (server action submitLead, com UTM, URL e referrer). O Enter
 * avança o passo; só no último ele envia. Cada passo valida na hora (as mesmas regras e
 * frases do servidor); o servidor continua sendo quem decide, e um erro dele leva a
 * pessoa ao passo do campo que falhou.
 *
 * Botão da página que aponta para #formulario: ao fim da rolagem o cartão ganha um anel
 * que aparece e some ([data-chamado], globals.css) e, no desktop, o campo do nome
 * recebe o foco. Mostra onde é para agir, mesmo quando o formulário já estava na tela.
 *
 * Um único LeadForm por página: os id dos campos são fixos.
 */
export function LeadForm({ source, submitLabel = "Continuar", withMessage = false }: Props) {
  const ehContato = source === "contato";
  const ehRepresentante = source === "representante";
  const ehVarejo = source === "varejo";
  /** Representante e varejo: cadastro curto, sem CNPJ, loja nem mensagem. */
  const curto = ehRepresentante || ehVarejo;
  /** Quem vem comprar no atacado: catálogo, coleção e landing de lojistas. */
  const ehCompra = !ehContato && !curto;
  const c = site.contact;

  const [v, setV] = useState<Valores>({
    name: "",
    whatsapp: "",
    email: "",
    // Sem escolha ainda, o campo nasce como CNPJ: quem se cadastra costuma ser lojista.
    has_cnpj: "sim",
    document: "",
    company: "",
    city: "",
    state: "",
    message: "",
  });
  const por = (k: Campo, valor: string) => setV((a) => ({ ...a, [k]: valor }));
  const ehLojista = v.has_cnpj !== "nao";

  const [erros, setErros] = useState<Erros>({});
  const limparErro = (k: Campo) => {
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
  };

  // ---------- Consulta do CNPJ ----------
  // A última resposta e o CNPJ a que ela pertence. Mudou o CNPJ, a resposta deixa de
  // valer sozinha, e "buscando" é não ter resposta para o CNPJ da tela.
  const [consulta, setConsulta] = useState<{ cnpj: string; empresa: Empresa | null } | null>(null);
  // "Não é essa loja": a pessoa informa a loja e a cidade ela mesma.
  const [recusouEmpresa, setRecusouEmpresa] = useState(false);
  // "Corrigir" a loja no resumo: o passo da loja volta a aparecer, com o que foi encontrado.
  const [editarLoja, setEditarLoja] = useState(false);
  // A consulta em andamento e o seu resultado, para avancar() ler na hora (o estado do
  // React só chega na próxima renderização, que pode vir depois do await).
  const busca = useRef<Promise<void> | null>(null);
  const encontrada = useRef<{ cnpj: string; empresa: Empresa | null } | null>(null);
  const digitosDoc = somenteDigitos(v.document);
  const cnpjCompleto = !curto && ehLojista && digitosDoc.length === 14 && cnpjValido(digitosDoc);
  const respondido = consulta?.cnpj === digitosDoc;
  const empresa = cnpjCompleto && !recusouEmpresa && respondido ? consulta.empresa : null;
  const buscando = cnpjCompleto && !recusouEmpresa && !respondido;

  useEffect(() => {
    busca.current = null;
    if (!cnpjCompleto || recusouEmpresa || respondido) return;
    const controle = new AbortController();
    // Um instante de espera: quem cola o CNPJ dispara uma consulta só.
    const timer = window.setTimeout(() => {
      busca.current = fetch(`/api/cnpj/${digitosDoc}`, { signal: controle.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { encontrado?: boolean; empresa?: Empresa } | null) => {
          if (controle.signal.aborted) return;
          const achada = d?.encontrado && d.empresa ? d.empresa : null;
          encontrada.current = { cnpj: digitosDoc, empresa: achada };
          setConsulta({ cnpj: digitosDoc, empresa: achada });
          if (achada) {
            setV((a) => ({ ...a, company: achada.nomeFantasia || achada.razaoSocial, city: achada.cidade, state: achada.uf }));
            setErros((e) => ({ ...e, company: undefined, city: undefined, state: undefined }));
          }
        })
        .catch(() => {
          // Sem resposta: a pessoa informa a loja e a cidade no passo seguinte.
          if (controle.signal.aborted) return;
          encontrada.current = { cnpj: digitosDoc, empresa: null };
          setConsulta({ cnpj: digitosDoc, empresa: null });
        });
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controle.abort();
    };
  }, [cnpjCompleto, digitosDoc, recusouEmpresa, respondido]);

  // ---------- Já é cliente? ----------
  // CNPJ ou CPF completo e válido: pergunta ao CRM, pela rota do site (que tem a chave),
  // se é de um cliente da Corpo Sensual. A resposta fica guardada por documento, para o
  // "Continuar" do passo só esperar o que já está a caminho. Erro ou demora = não é.
  const router = useRouter();
  const tipoDoc = ehLojista ? "cnpj" : "cpf";
  const docCompleto = !curto && digitosDoc.length === (ehLojista ? 14 : 11) && documentoValido(digitosDoc, tipoDoc);
  const conferencia = useRef<{ doc: string; resposta: Promise<boolean> } | null>(null);
  const [conferindo, setConferindo] = useState(false);
  const conferirCliente = useCallback((doc: string, tipo: "cnpj" | "cpf"): Promise<boolean> => {
    if (conferencia.current?.doc === doc) return conferencia.current.resposta;
    const controle = new AbortController();
    const limite = window.setTimeout(() => controle.abort(), 6000);
    const resposta = fetch("/api/ja-e-cliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documento: doc, tipo }),
      signal: controle.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { cliente?: boolean } | null) => d?.cliente === true)
      .catch(() => false)
      .finally(() => window.clearTimeout(limite));
    conferencia.current = { doc, resposta };
    return resposta;
  }, []);

  useEffect(() => {
    if (!docCompleto) return;
    // Um instante de espera, como na consulta do CNPJ: quem cola o número pergunta uma vez só.
    const timer = window.setTimeout(() => void conferirCliente(digitosDoc, tipoDoc), 250);
    return () => window.clearTimeout(timer);
  }, [docCompleto, digitosDoc, tipoDoc, conferirCliente]);

  // ---------- Passos ----------
  const listaDePassos = useCallback(
    (lojaAutomatica: boolean): Passo[] => {
      const mensagem: Passo[] = withMessage ? ["mensagem"] : [];
      if (curto) return ["nome", "whatsapp", "loja", "email", ...mensagem];
      return ["nome", "whatsapp", "documento", ...(lojaAutomatica ? [] : (["loja"] as Passo[])), "email", ...mensagem];
    },
    [withMessage, curto],
  );
  const passos = listaDePassos(Boolean(empresa) && !recusouEmpresa && !editarLoja);
  const [passo, setPasso] = useState<Passo>("nome");
  const indice = Math.max(0, passos.indexOf(passo));
  const ultimo = indice === passos.length - 1;
  // Só anima a partir da segunda tela: o cartão não pode "entrar" ao carregar a página.
  const [direcao, setDirecao] = useState<"frente" | "tras" | "">("");
  // "Corrigir" no resumo: depois de acertar o campo, volta direto ao resumo.
  const retorno = useRef<Passo | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const focarAoTrocar = useRef(false);

  const irPara = useCallback((destino: Passo, sentido: "frente" | "tras") => {
    setDirecao(sentido);
    setPasso(destino);
    focarAoTrocar.current = true;
  }, []);

  // Trocou de passo: o primeiro campo da tela nova recebe o foco (no celular o teclado
  // já abre nele). Nunca ao montar: a página não pode rolar sozinha até o formulário.
  useEffect(() => {
    if (!focarAoTrocar.current) return;
    focarAoTrocar.current = false;
    form.current?.querySelector<HTMLElement>("[data-passo] .field")?.focus();
  }, [passo]);

  const validar = (p: Passo): Erros => {
    const e: Erros = {};
    if (p === "nome" && v.name.trim().length < 2) e.name = "Informe seu nome.";
    if (p === "whatsapp") {
      const d = somenteDigitos(v.whatsapp);
      if (d.length < 10 || d.length > 11) e.whatsapp = "Informe o WhatsApp com DDD.";
    }
    if (p === "documento") {
      if (digitosDoc.length === 0) e.document = ehLojista ? "Informe o CNPJ da loja." : "Informe o seu CPF.";
      else if (!documentoValido(v.document, ehLojista ? "cnpj" : "cpf")) e.document = ehLojista ? "CNPJ inválido. Confira os números." : "CPF inválido. Confira os números.";
    }
    if (p === "loja") {
      if (v.city.trim().length < 2) e.city = "Informe a cidade.";
      if (!UFS.includes(v.state.toUpperCase())) e.state = "Informe a UF.";
    }
    if (p === "email" && !EMAIL_SIMPLES.test(v.email.trim())) e.email = "Informe um e-mail válido.";
    // Mensagem obrigatória só no contato, onde ela é o assunto (a mesma regra do servidor).
    if (p === "mensagem" && ehContato && v.message.trim().length < 3) e.message = "Escreva a sua mensagem.";
    return e;
  };

  const focar = (campo: Campo) => form.current?.querySelector<HTMLElement>(`#${campo}`)?.focus();

  const avancar = async () => {
    const e = validar(passo);
    const falhou = ORDEM_DOS_CAMPOS.find((k) => e[k]);
    if (falhou) {
      setErros((a) => ({ ...a, ...e }));
      focar(falhou);
      return;
    }
    // Passo do documento: espera a conferência de cliente e, com CNPJ, a consulta dele
    // (no máximo o limite de cada rota), que diz se o passo da loja é preciso.
    if (passo === "documento") {
      if (docCompleto) {
        setConferindo(true);
        const [jaCliente] = await Promise.all([conferirCliente(digitosDoc, tipoDoc), busca.current]);
        if (jaCliente) {
          // Já é cliente: o cadastro para aqui e nada vai para o CRM. Só a origem vai ao GA.
          enviarEvento("ja_cliente", { lead_source: source });
          router.push("/ja-e-cliente");
          return;
        }
        setConferindo(false);
      } else if (busca.current) {
        await busca.current;
      }
    }
    if (retorno.current) {
      const destino = retorno.current;
      retorno.current = null;
      irPara(destino, "frente");
      return;
    }
    // Lista fresca: a consulta pode ter acabado de tirar (ou pôr) o passo da loja.
    const achada = encontrada.current?.cnpj === digitosDoc ? encontrada.current.empresa : null;
    const lista = listaDePassos(Boolean(achada) && !recusouEmpresa && !editarLoja);
    const proximo = lista[lista.indexOf(passo) + 1];
    if (proximo) irPara(proximo, "frente");
  };

  const voltar = () => {
    retorno.current = null;
    const anterior = passos[indice - 1];
    if (anterior) irPara(anterior, "tras");
  };

  const corrigir = (destino: Passo) => {
    if (destino === "loja") setEditarLoja(true);
    retorno.current = passo;
    irPara(destino, "tras");
  };

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
      // Deu certo: submitLead redireciona para o obrigado e nada abaixo roda.
      const resultado = await submitLead(prev, formData);
      // Erro de validação do servidor: a frase vai sob o campo e a pessoa volta ao passo
      // do primeiro campo que falhou. O aviso geral fica acima do botão.
      const e = resultado.errors;
      if (e) {
        setErros(e as Erros);
        const primeiro = ORDEM_DOS_CAMPOS.find((k) => e[k]);
        if (primeiro) {
          const destino = PASSO_DO_CAMPO[primeiro];
          if (destino === "loja") setEditarLoja(true);
          // Um campo que este cadastro nem pergunta (não deve acontecer): volta ao começo.
          const lista = listaDePassos(false);
          irPara(lista.includes(destino) ? destino : lista[0], "tras");
        }
      }
      return resultado;
    },
    initialLeadState,
  );

  // form_inicio: a pessoa começou a preencher (primeiro foco num campo), uma vez por
  // montagem. Só a origem, nada digitado; sem consentimento enviarEvento não faz nada.
  const comecou = useRef(false);
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

  // ---------- Textos de cada passo ----------
  const primeiroNome = v.name.trim().split(/\s+/)[0] ?? "";
  const nomeBonito = primeiroNome ? primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1) : "";
  const ondeComprar = (
    <Link href="/onde-comprar" className="text-ink underline underline-offset-2">
      veja onde comprar
    </Link>
  );

  const pergunta: Record<Passo, { titulo: string; ajuda?: ReactNode }> = {
    nome: { titulo: "Olá! Como você se chama?", ajuda: "Leva menos de um minuto. Seus dados ficam só com a nossa equipe comercial." },
    whatsapp: {
      titulo: nomeBonito ? `Prazer, ${nomeBonito}. Qual é o seu WhatsApp?` : "Qual é o seu WhatsApp?",
      ajuda: ehCompra
        ? "É por ele que as vendedoras enviam o catálogo e a tabela de preços."
        : ehRepresentante
          ? "É por ele que o nosso gestor comercial fala com você."
          : ehVarejo
            ? "É por ele que indicamos a loja mais perto de você."
            : "É por ele que respondemos.",
    },
    documento: ehLojista
      ? {
          titulo: ehCompra ? "Qual é o CNPJ da sua loja?" : "Qual é o seu CNPJ?",
          ajuda: "Com ele, buscamos o nome da loja e a cidade: você não precisa digitar.",
        }
      : {
          titulo: "Então informe o seu CPF",
          // Sem "pedido mínimo" nem condição nenhuma: isso é com a vendedora.
          ajuda: ehCompra ? (
            <>O CNPJ não é obrigatório: vendemos no atacado e avaliamos o seu caso. Se você é consumidor, {ondeComprar}.</>
          ) : (
            <>O CNPJ não é obrigatório. Se você é consumidor, {ondeComprar}.</>
          ),
        },
    loja: ehRepresentante
      ? { titulo: "Qual é a sua base?", ajuda: "A cidade de onde você atende. O gestor comercial confere a cobertura na sua região." }
      : ehVarejo
        ? { titulo: "Onde você está?", ajuda: "Com a cidade, indicamos a loja mais perto de você." }
        : ehLojista
          ? { titulo: "Sobre a sua loja", ajuda: "O nome da loja, a cidade e o estado." }
          : { titulo: "Onde você está?", ajuda: "A cidade define quem atende você." },
    email: {
      titulo: ehCompra || curto ? "Para terminar, qual é o seu e-mail?" : "Qual é o seu e-mail?",
      ajuda: ehCompra
        ? "Enviamos o catálogo em PDF e a tabela de preços também por ele."
        : ehRepresentante
          ? "Para o gestor comercial mandar o material de representação."
          : "Para responder por escrito, se você preferir.",
    },
    mensagem: { titulo: ehContato ? "Como podemos ajudar?" : "Quer contar mais alguma coisa?" },
  };
  const atual = pergunta[passo];

  const rotuloEmpresa = ehContato && !ehLojista ? "Loja ou empresa (opcional)" : "Nome da loja (opcional)";
  const docFormatado = ehLojista ? formatarCnpj(v.document) : formatarCpf(v.document);
  const lugar = [v.company.trim(), [v.city.trim(), v.state.toUpperCase()].filter(Boolean).join("/")].filter(Boolean).join(" · ");

  /** O que o passo atual mostra; o resto viaja em campos escondidos. */
  const visiveis: Record<Passo, Campo[]> = {
    nome: ["name"],
    whatsapp: ["whatsapp"],
    documento: ["document"],
    loja: curto ? ["city", "state"] : ["company", "city", "state"],
    email: ["email"],
    mensagem: ["message"],
  };
  const escondidos = (Object.keys(v) as Campo[]).filter((k) => !visiveis[passo].includes(k));
  // Cadastro curto não pergunta CNPJ: vai em branco, como o formulário antigo mandava.
  const valorEscondido = (k: Campo) => (k === "state" ? v.state.toUpperCase() : k === "has_cnpj" && curto ? "" : v[k]);

  return (
    <form
      ref={form}
      action={action}
      onFocusCapture={() => {
        if (!focoDoSite.current) aoComecar();
      }}
      onInputCapture={aoComecar}
      // Enter avança o passo; só no último envia. Enviando: um segundo toque (ou Enter)
      // não manda de novo. O botão não fica "disabled" para o foco do teclado não se perder.
      onSubmit={(e) => {
        if (!ultimo) {
          e.preventDefault();
          // Conferindo o cadastro: um segundo toque não pergunta de novo.
          if (!conferindo) void avancar();
          return;
        }
        if (pending) e.preventDefault();
      }}
      className="@container"
      noValidate
      data-sem-barra
    >
      <input type="hidden" name="source" value={source} />
      {escondidos.map((k) => (
        <input key={k} type="hidden" name={k} value={valorEscondido(k)} />
      ))}
      {/* Honeypot: fica invisível para pessoas e é preenchido por bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Progresso: um traço por passo, como numa conversa que anda. */}
      <div className="flex items-center gap-4">
        <ol className="flex flex-1 gap-1" aria-hidden>
          {passos.map((p, n) => (
            <li key={p} className={`h-[3px] flex-1 transition-colors duration-300 ${n <= indice ? "bg-ink" : "bg-line"}`} />
          ))}
        </ol>
        <p className="legenda tabular-nums">
          <span className="sr-only">Passo </span>
          {indice + 1} de {passos.length}
        </p>
      </div>

      {/* key: cada passo entra deslizando (globals.css, [data-passo]). */}
      <fieldset key={passo} className="mt-5 min-w-0" data-passo={direcao || undefined}>
        <legend className="t-sub max-w-[22ch]">{atual.titulo}</legend>
        {atual.ajuda && <p className="mt-2 max-w-md text-[15px] leading-[1.55] text-body">{atual.ajuda}</p>}

        <div className="mt-5 space-y-4">
          {passo === "nome" && (
            <Campo rotulo="Seu nome" nome="name" erro={erros.name} semRotulo>
              <input
                id="name"
                className="field"
                name="name"
                autoComplete="name"
                required
                aria-invalid={Boolean(erros.name)}
                aria-describedby={erros.name ? "name-error" : undefined}
                value={v.name}
                onChange={(e) => {
                  por("name", e.target.value);
                  limparErro("name");
                }}
                placeholder="Nome e sobrenome"
              />
            </Campo>
          )}

          {passo === "whatsapp" && (
            <Campo rotulo="WhatsApp com DDD" nome="whatsapp" erro={erros.whatsapp} semRotulo>
              <input
                id="whatsapp"
                className="field tabular-nums"
                type="tel"
                name="whatsapp"
                autoComplete="tel"
                inputMode="tel"
                required
                aria-invalid={Boolean(erros.whatsapp)}
                aria-describedby={erros.whatsapp ? "whatsapp-error" : undefined}
                value={v.whatsapp}
                onChange={(e) => {
                  aplicarMascara(e.target, formatarWhatsApp, (novo) => por("whatsapp", novo));
                  limparErro("whatsapp");
                }}
                placeholder="(32) 90000-9999"
              />
            </Campo>
          )}

          {passo === "documento" && (
            <>
              <Campo rotulo={ehLojista ? "CNPJ" : "CPF"} nome="document" erro={erros.document} semRotulo>
                <input
                  id="document"
                  className="field tabular-nums"
                  name="document"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  aria-invalid={Boolean(erros.document)}
                  aria-describedby={erros.document ? "document-error" : undefined}
                  value={v.document}
                  onChange={(e) => {
                    aplicarMascara(e.target, (valor) => formatarDocumento(valor, ehLojista ? "cnpj" : "cpf"), (novo) => por("document", novo));
                    limparErro("document");
                    setRecusouEmpresa(false);
                  }}
                  placeholder={ehLojista ? "00.000.000/0000-00" : "000.000.000-00"}
                  maxLength={ehLojista ? 18 : 14}
                />
              </Campo>

              {/* O que o CNPJ trouxe, para a pessoa conferir antes de seguir. */}
              {ehLojista && buscando && (
                <p className="legenda" aria-live="polite">
                  Buscando os dados da loja...
                </p>
              )}
              {ehLojista && empresa && !recusouEmpresa && (
                <div className="bg-areia px-4 py-3.5" aria-live="polite">
                  <p className="flex items-center gap-1.5 text-[13px] text-muted">
                    <Check width={14} height={14} strokeWidth={2} className="text-ink" />
                    Encontramos a sua loja
                  </p>
                  <p className="mt-1 text-[17px] font-medium leading-snug text-ink">{empresa.nomeFantasia || empresa.razaoSocial}</p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-body">
                    {empresa.nomeFantasia && empresa.razaoSocial ? `${empresa.razaoSocial} · ` : ""}
                    {empresa.cidade}/{empresa.uf}
                  </p>
                  <button
                    type="button"
                    className="link mt-3 text-[13px]"
                    onClick={() => {
                      setRecusouEmpresa(true);
                      setV((a) => ({ ...a, company: "", city: "", state: "" }));
                    }}
                  >
                    Não é essa loja
                  </button>
                </div>
              )}

              <p className="text-[14px] text-body">
                {ehLojista ? (
                  <button
                    type="button"
                    className="link"
                    onClick={() => {
                      setV((a) => ({ ...a, has_cnpj: "nao", document: "", company: "", city: "", state: "" }));
                      setRecusouEmpresa(false);
                      limparErro("document");
                      focar("document");
                    }}
                  >
                    Ainda não tenho CNPJ
                  </button>
                ) : (
                  <button
                    type="button"
                    className="link"
                    onClick={() => {
                      setV((a) => ({ ...a, has_cnpj: "sim", document: "" }));
                      limparErro("document");
                      focar("document");
                    }}
                  >
                    Tenho CNPJ
                  </button>
                )}
              </p>
            </>
          )}

          {passo === "loja" && (
            <>
              {!curto && (
                <Campo rotulo={rotuloEmpresa} nome="company" erro={erros.company}>
                  <input
                    id="company"
                    className="field"
                    name="company"
                    autoComplete="organization"
                    value={v.company}
                    onChange={(e) => {
                      por("company", e.target.value);
                      limparErro("company");
                    }}
                    placeholder="Ex: Loja Bem Dormir"
                  />
                </Campo>
              )}
              <div className="grid grid-cols-[1fr_6.5rem] gap-4">
                <Campo rotulo="Cidade" nome="city" erro={erros.city}>
                  <input
                    id="city"
                    className="field"
                    name="city"
                    autoComplete="address-level2"
                    required
                    aria-invalid={Boolean(erros.city)}
                    aria-describedby={erros.city ? "city-error" : undefined}
                    value={v.city}
                    onChange={(e) => {
                      por("city", e.target.value);
                      limparErro("city");
                    }}
                    placeholder="Ex: Muriaé"
                  />
                </Campo>
                <Campo rotulo="UF" nome="state" erro={erros.state}>
                  <select
                    id="state"
                    className="field"
                    name="state"
                    autoComplete="address-level1"
                    required
                    aria-invalid={Boolean(erros.state)}
                    aria-describedby={erros.state ? "state-error" : undefined}
                    value={v.state.toUpperCase()}
                    onChange={(e) => {
                      por("state", e.target.value);
                      limparErro("state");
                    }}
                  >
                    <option value="">UF</option>
                    {UFS.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>
            </>
          )}

          {passo === "email" && (
            <Campo rotulo="E-mail" nome="email" erro={erros.email} semRotulo>
              <input
                id="email"
                className="field"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                aria-invalid={Boolean(erros.email)}
                aria-describedby={erros.email ? "email-error" : undefined}
                value={v.email}
                onChange={(e) => {
                  por("email", e.target.value);
                  limparErro("email");
                }}
                placeholder={curto ? "voce@email.com" : "compras@sualoja.com"}
              />
            </Campo>
          )}

          {passo === "mensagem" && (
            <Campo rotulo="Mensagem" nome="message" erro={erros.message} semRotulo>
              <textarea
                id="message"
                className="field min-h-28 resize-y"
                name="message"
                required={ehContato}
                aria-invalid={Boolean(erros.message)}
                aria-describedby={erros.message ? "message-error" : undefined}
                value={v.message}
                onChange={(e) => {
                  por("message", e.target.value);
                  limparErro("message");
                }}
                placeholder={ehContato ? "Como podemos ajudar?" : "Conte um pouco sobre a sua loja ou o que você procura."}
              />
            </Campo>
          )}

          {/* Resumo no último passo: o que foi reunido, com "corrigir" em cada linha. */}
          {ultimo && (
            <div className="border-t border-line pt-4">
              <p className="legenda">Confira os seus dados</p>
              <ul className="mt-2 space-y-1.5 text-[14px] leading-[1.5] text-body">
                <Linha onCorrigir={() => corrigir("nome")} rotulo="nome">
                  <span className="text-ink">{v.name.trim()}</span>
                </Linha>
                <Linha onCorrigir={() => corrigir("whatsapp")} rotulo="WhatsApp">
                  WhatsApp <span className="tabular-nums text-ink">{v.whatsapp}</span>
                </Linha>
                {!curto && (
                  <Linha onCorrigir={() => corrigir("documento")} rotulo={ehLojista ? "CNPJ" : "CPF"}>
                    {ehLojista ? "CNPJ" : "CPF"} <span className="tabular-nums text-ink">{docFormatado}</span>
                  </Linha>
                )}
                {lugar && (
                  <Linha onCorrigir={() => corrigir("loja")} rotulo={curto ? "cidade" : "loja e cidade"}>
                    <span className="text-ink">{lugar}</span>
                  </Linha>
                )}
              </ul>
            </div>
          )}
        </div>
      </fieldset>

      {state.message && !state.ok && (
        <p role="alert" className="mt-4 rounded-field border border-erro/40 bg-erro/5 px-4 py-3 text-sm leading-relaxed text-erro">
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

      {/* Ações: "Voltar" discreto e o botão de seguir. No último passo o envio ocupa a
          largura toda (rótulos longos: "Quero receber a tabela de preços"). */}
      <div className={`mt-6 flex flex-col gap-3 ${ultimo ? "" : "@[24rem]:flex-row-reverse @[24rem]:items-center @[24rem]:justify-between"}`}>
        {ultimo ? (
          <button type="submit" className="btn btn-primary btn-lg w-full px-2.5 text-[15px] @[21rem]:px-6 @[21rem]:text-base" aria-disabled={pending || undefined}>
            {pending ? "Enviando..." : submitLabel}
            {!pending && <ArrowRight width={18} height={18} className="seta hidden @[23.5rem]:block" />}
          </button>
        ) : (
          <button type="submit" className="btn btn-primary btn-lg w-full @[24rem]:w-auto @[24rem]:min-w-[11rem]" aria-disabled={conferindo || undefined}>
            {conferindo ? "Conferindo..." : "Continuar"}
            {!conferindo && <ArrowRight width={18} height={18} className="seta" />}
          </button>
        )}
        {indice > 0 && (
          <button type="button" onClick={voltar} className="inline-flex min-h-11 items-center gap-1 self-start font-button text-[15px] text-muted transition-colors hover:text-ink">
            <ChevronLeft width={18} height={18} />
            Voltar
          </button>
        )}
      </div>

      {ultimo && (
        <>
          <p className="mt-4 flex gap-2 text-[13px] leading-relaxed text-muted">
            <Lock width={16} height={16} className="mt-0.5 flex-none" />
            <span>
              Ao enviar, você concorda com a nossa{" "}
              <Link href="/politicas/privacidade" className="text-ink underline underline-offset-2">
                política de privacidade
              </Link>
              . Usamos seus dados apenas para responder ao seu contato.
            </span>
          </p>
          {/* Só para quem vem comprar: no contato o formulário já é o canal; no representante
              e no varejo o caminho é o cadastro, e o telefone poria dígitos numa página que
              não pode ter número. Sem WhatsApp nem e-mail configurados a linha some. */}
          {ehCompra && (c.whatsappUrl || c.email) && (
            <p className="mt-2 text-[13px] text-muted">
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
        </>
      )}
    </form>
  );
}

/** Rótulo, campo e erro. Em passo de um campo só, a pergunta já é o rótulo (semRotulo: fica para o leitor de tela). */
function Campo({ rotulo, nome, erro, semRotulo = false, children }: { rotulo: string; nome: string; erro?: string; semRotulo?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={nome} className={semRotulo ? "sr-only" : "mb-1.5 block text-sm font-medium text-ink"}>
        {rotulo}
      </label>
      {children}
      {/* Sem role="alert": o erro é lido pelo aria-describedby quando o foco chega ao campo. */}
      {erro && (
        <p id={`${nome}-error`} className="mt-1.5 text-[13px] text-erro">
          {erro}
        </p>
      )}
    </div>
  );
}

/** Linha do resumo: o dado e o "corrigir" que leva ao passo dele. */
function Linha({ rotulo, onCorrigir, children }: { rotulo: string; onCorrigir: () => void; children: ReactNode }) {
  return (
    <li className="flex items-baseline justify-between gap-4">
      <span className="min-w-0 break-words">{children}</span>
      <button type="button" onClick={onCorrigir} className="link flex-none text-[13px] text-muted" aria-label={`Corrigir ${rotulo}`}>
        corrigir
      </button>
    </li>
  );
}
