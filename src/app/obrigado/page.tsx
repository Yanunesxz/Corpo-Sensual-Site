import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContatoWhatsApp } from "@/components/contato-whatsapp";
import { ArrowRight, Check } from "@/components/icons";
import { Passos } from "@/components/passos";
import { equipe, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cadastro recebido",
  robots: { index: false, follow: false },
};

const messages: Record<string, { title: string; text: string }> = {
  catalogo: {
    title: "Cadastro recebido",
    text: "Nossa equipe confere o seu cadastro e envia o catálogo digital com a tabela de atacado.",
  },
  colecao: {
    title: "Cadastro recebido",
    text: "Nossa equipe confere o seu cadastro e envia o catálogo digital com a tabela de atacado.",
  },
  "fabrica-de-pijamas": {
    title: "Recebemos o seu interesse",
    text: "Nossa equipe comercial vai falar com você para apresentar o catálogo, os preços e as condições.",
  },
  representante: {
    title: "Cadastro de representante recebido",
    text: "O nosso gestor comercial vai avaliar a sua região e falar com você.",
  },
  varejo: {
    title: "Recebemos o seu contato",
    text: "Vamos ver qual loja vende Corpo Sensual mais perto de você e responder pelo WhatsApp.",
  },
  contato: {
    title: "Mensagem recebida",
    text: "Obrigado pelo contato. Vamos responder pelo e-mail ou WhatsApp que você informou.",
  },
  default: {
    title: "Mensagem recebida",
    text: "Obrigado pelo contato. Em breve retornaremos.",
  },
};

/**
 * Origens em que, depois do envio, a pessoa escolhe a vendedora. Para cada uma: o
 * texto acima dos botões e o começo e o fim da mensagem do WhatsApp.
 */
const vendaPorOrigem: Record<string, { chamada: string; abertura: string; pedido: string }> = {
  catalogo: {
    chamada: "Agora escolha a sua vendedora no WhatsApp:",
    abertura: "Acabei de me cadastrar no site da Corpo Sensual.",
    pedido: "Quero receber o catálogo.",
  },
  colecao: {
    chamada: "Agora escolha a sua vendedora no WhatsApp:",
    abertura: "Acabei de me cadastrar no site da Corpo Sensual.",
    pedido: "Quero receber o catálogo.",
  },
  "fabrica-de-pijamas": {
    chamada: "Agora escolha a sua vendedora no WhatsApp:",
    abertura: "Acabei de me cadastrar no site da Corpo Sensual.",
    pedido: "Quero comprar da fábrica.",
  },
  // O contato serve a vários públicos: a chamada deixa claro que é para compra.
  contato: {
    chamada: "Quer falar sobre compra? Escolha uma vendedora no WhatsApp:",
    abertura: "Acabei de mandar uma mensagem pelo site da Corpo Sensual.",
    pedido: "",
  },
};

/**
 * Ordem das vendedoras, sorteada a cada visita para os contatos se dividirem entre
 * elas em vez de irem todos para quem aparece primeiro.
 *
 * Fica fora do componente de propósito. Esta é uma página de servidor, renderizada
 * uma vez por visita (é dinâmica porque depende de ?origem), então sortear aqui não
 * causa o problema que a regra de pureza do React previne, que é o componente
 * mudar de resultado ao ser renderizado de novo no navegador.
 */
function sortearVendedoras() {
  const lista = [...equipe.vendedoras];
  return Math.random() < 0.5 ? lista : lista.reverse();
}

/**
 * "O que acontece agora". Compra: três passos numerados. Representante: dois passos
 * com ponto (a página de representante não mostra número). Contato e padrão: nada.
 */
const passosPorOrigem: Record<string, { itens: { titulo: string; texto: string }[]; semNumeros: boolean }> = {
  compra: {
    semNumeros: false,
    itens: [
      { titulo: "Fale com a vendedora", texto: `Pelo WhatsApp, com a ${equipe.vendedoras[0].nome} ou a ${equipe.vendedoras[1].nome}.` },
      { titulo: "Receba o catálogo", texto: "Com a tabela de preços." },
      { titulo: "Monte o seu pedido", texto: "Com a sua vendedora, pelo WhatsApp." },
    ],
  },
  representante: {
    semNumeros: true,
    itens: [
      { titulo: "O gestor comercial avalia a sua região", texto: "Ele confere a cobertura no seu estado." },
      { titulo: "Conversa pelo WhatsApp", texto: "Ele apresenta as coleções e as condições de representação." },
    ],
  },
};

/** Origens de quem veio comprar (as mesmas do ORIGENS_DE_COMPRA do analytics). */
const ORIGENS_DE_COMPRA = new Set(["catalogo", "colecao", "fabrica-de-pijamas"]);

// Fotos de campanha usadas só como ilustração da faixa do Instagram.
const vitrine = [
  "/images/colecoes/delicias-1.jpg",
  "/images/colecoes/entrelacos-2.jpg",
  "/images/colecoes/delicias-4.jpg",
  "/images/colecoes/entrelacos-4.jpg",
];

export default async function ObrigadoPage({ searchParams }: PageProps<"/obrigado">) {
  const { origem } = await searchParams;
  // Object.hasOwn e não `in`: `in` aceita nomes herdados como "constructor", e um
  // ?origem forjado assim derrubava a página com erro 500.
  const key = typeof origem === "string" && Object.hasOwn(messages, origem) ? origem : "default";
  const m = messages[key];
  const venda = Object.hasOwn(vendaPorOrigem, key) ? vendaPorOrigem[key] : null;
  const ehRepresentante = key === "representante";
  const ehCompra = ORIGENS_DE_COMPRA.has(key);
  const vendedoras = sortearVendedoras();
  const c = site.contact;

  const temPainel = Boolean(venda) || ehRepresentante;
  const passos = ehCompra ? passosPorOrigem.compra : ehRepresentante ? passosPorOrigem.representante : null;
  // Rótulo acima do título. Some quando repetiria o próprio título ("Cadastro recebido"
  // em cima de "Cadastro recebido"): o ícone de confirmação já faz esse papel.
  const rotulo = key === "contato" || key === "default" ? "Mensagem recebida" : "Cadastro recebido";
  const mostraRotulo = rotulo.toLowerCase() !== m.title.toLowerCase();

  const links = (
    <div className="flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10">
      {/* Contato e padrão: o próximo passo é conhecer as coleções. No contato o painel das
          vendedoras já tem os botões cheios, então este fica de contorno (um cheio por bloco). */}
      {!ehCompra && !ehRepresentante && (
        <Link href="/colecoes" className={`btn ${temPainel ? "btn-outline" : "btn-primary"} mb-5 w-full sm:mb-0 sm:mr-2 sm:w-auto`}>
          Ver as coleções
          <ArrowRight width={18} height={18} className="seta" />
        </Link>
      )}
      <Link href="/ajuda" className="link-seta">
        Já é cliente? Preciso de ajuda
        <ArrowRight width={18} height={18} />
      </Link>
      <Link href="/fabrica-de-pijamas#perguntas" className="link-seta">
        Perguntas frequentes
        <ArrowRight width={18} height={18} />
      </Link>
    </div>
  );

  return (
    <>
      <section className="wrap pb-16 pt-10 md:pb-20 md:pt-16 lg:pb-28 lg:pt-24">
        {/* 1. Confirmação e 2. escolha no WhatsApp: lado a lado no desktop, o painel à direita. */}
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
          <div className={temPainel ? "lg:col-span-6" : "lg:col-span-8"}>
            <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-full bg-noite text-white md:h-14 md:w-14">
              <Check width={26} height={26} strokeWidth={2} />
            </span>
            {mostraRotulo && <p className="eyebrow mt-7 md:mt-8">{rotulo}</p>}
            {/* No desktop um degrau abaixo do t-hero: a ação da página é o WhatsApp ao lado, não o título. */}
            <h1 className={`t-hero max-w-[16ch] lg:text-[clamp(2.25rem,1.4rem+1.6vw,3.25rem)] ${mostraRotulo ? "mt-3" : "mt-6 md:mt-8"}`}>{m.title}</h1>
            <p className="lead mt-5 max-w-xl md:mt-6">{m.text}</p>
            <p className="mt-4 max-w-xl text-[15px] leading-[1.6] text-body">
              Retornamos em horário comercial{c.hours ? `, ${c.hours.toLowerCase()}` : ""}. Fique de olho no telefone e no e-mail
              informados.
            </p>
          </div>

          {temPainel && (
            <div className="bg-sky px-5 py-7 sm:p-8 lg:col-span-5 lg:col-start-8 lg:self-center lg:p-10">
              {venda && <ContatoWhatsApp contatos={vendedoras} chamada={venda.chamada} abertura={venda.abertura} pedido={venda.pedido} />}
              {ehRepresentante && (
                <ContatoWhatsApp
                  contatos={[equipe.gerenteComercial]}
                  chamada="Para adiantar, fale agora direto com o nosso gestor comercial:"
                  abertura="Acabei de me cadastrar no site da Corpo Sensual para ser representante."
                  empresa="representacao"
                />
              )}
            </div>
          )}
        </div>

        {/* 3. O que acontece agora (compra e representante) e 4. links. */}
        {passos ? (
          <div className="mt-14 grid gap-y-8 border-t border-line pt-10 md:mt-16 lg:mt-24 lg:pt-14 xl:grid-cols-12 xl:gap-x-10" data-reveal>
            <h2 className="eyebrow eyebrow-fio xl:col-span-3 xl:self-start xl:pt-3">O que acontece agora</h2>
            <div className="xl:col-span-9">
              <Passos itens={passos.itens} semNumeros={passos.semNumeros} layout="linha" />
              <div className="mt-10 border-t border-line pt-6 lg:mt-14">{links}</div>
            </div>
          </div>
        ) : (
          <div className="mt-10 md:mt-12">{links}</div>
        )}
      </section>

      {/* 5. Faixa azul-clara do Instagram, como na página de obrigado do site atual */}
      {c.instagram && (
        <section className="sec bg-sky">
          <div className="wrap">
            <div className="grid gap-y-4 lg:grid-cols-12 lg:items-end lg:gap-x-10" data-reveal>
              <h2 className="t-titulo max-w-[14ch] lg:col-span-6">Siga o nosso perfil do Instagram</h2>
              <p className="lead max-w-md lg:col-span-5 lg:col-start-8 lg:pb-1">
                Enquanto isso, acompanhe as novidades no Instagram{" "}
                <a href={`https://www.instagram.com/${c.instagram}/`} target="_blank" rel="noreferrer" className="link text-ink">
                  @{c.instagram}
                </a>
                .
              </p>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-5">
              {vitrine.map((src, i) => (
                <li key={src} className="relative aspect-[4/5] overflow-hidden bg-sky-deep" data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
                  <Image src={src} alt="" fill sizes="(min-width: 1440px) 324px, (min-width: 768px) 23vw, 45vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
