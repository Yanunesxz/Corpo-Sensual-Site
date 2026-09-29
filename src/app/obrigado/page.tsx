import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContatoWhatsApp } from "@/components/contato-whatsapp";
import { equipe, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cadastro recebido",
  robots: { index: false, follow: false },
};

const messages: Record<string, { title: string; text: string }> = {
  catalogo: {
    title: "Cadastro recebido",
    text: "Nossa equipe confirma os dados da sua loja e envia o catálogo digital com a tabela de atacado.",
  },
  colecao: {
    title: "Cadastro recebido",
    text: "Nossa equipe confirma os dados da sua loja e envia o catálogo digital com a tabela de atacado.",
  },
  "fabrica-de-pijamas": {
    title: "Recebemos o seu interesse",
    text: "Nossa equipe comercial vai falar com você para apresentar o catálogo, os preços e as condições.",
  },
  representante: {
    title: "Cadastro de representante recebido",
    text: "O Fabian, nosso gerente comercial, vai avaliar a sua região e falar com você.",
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
    chamada: "Quer adiantar? Escolha com quem falar no WhatsApp:",
    abertura: "Acabei de me cadastrar no site da Corpo Sensual.",
    pedido: "Quero receber o catálogo.",
  },
  colecao: {
    chamada: "Quer adiantar? Escolha com quem falar no WhatsApp:",
    abertura: "Acabei de me cadastrar no site da Corpo Sensual.",
    pedido: "Quero receber o catálogo.",
  },
  "fabrica-de-pijamas": {
    chamada: "Quer adiantar? Escolha com quem falar no WhatsApp:",
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
  const vendedoras = sortearVendedoras();
  const c = site.contact;

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <h1 className="h-hero text-[2rem] md:text-[2.375rem]">{m.title}</h1>
          <p className="mt-6 text-lg leading-[1.3] text-body">{m.text}</p>
          <p className="mt-3 text-lg leading-[1.3] text-body">
            Retornamos em horário comercial{c.hours ? `, ${c.hours.toLowerCase()}` : ""}. Fique de olho no telefone e no e-mail
            informados.
          </p>

          {venda && (
            <div className="mt-8">
              <ContatoWhatsApp contatos={vendedoras} chamada={venda.chamada} abertura={venda.abertura} pedido={venda.pedido} />
            </div>
          )}

          {ehRepresentante && (
            <div className="mt-8">
              <ContatoWhatsApp
                contatos={[equipe.gerenteComercial]}
                chamada="Para adiantar, fale agora direto com o Fabian, nosso gerente comercial:"
                abertura="Acabei de me cadastrar no site da Corpo Sensual para ser representante."
                empresa="representacao"
              />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center">
            {!venda && !ehRepresentante && (
              <Link href="/colecoes" className="btn btn-dark w-full sm:w-auto">
                Ver as coleções
              </Link>
            )}
            <Link href="/ajuda" className="link self-start text-sm sm:self-auto">
              Já é cliente? Preciso de ajuda
            </Link>
            <Link href="/fabrica-de-pijamas#perguntas" className="link self-start text-sm sm:self-auto">
              Perguntas frequentes
            </Link>
          </div>
        </div>
      </section>

      {/* Faixa azul-clara do Instagram, como na página de obrigado do site atual */}
      {c.instagram && (
        <section className="bg-sky">
          <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
            <h2 className="h-display max-w-md text-3xl md:text-[2.5rem]">Siga o nosso perfil do Instagram</h2>
            <p className="mt-4 max-w-xl text-[1.125rem] leading-[1.6] text-body">
              Enquanto isso, acompanhe as novidades no Instagram{" "}
              <a href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noreferrer" className="link">
                @{c.instagram}
              </a>
              .
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {vitrine.map((src) => (
                <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-media bg-sky-soft">
                  <Image src={src} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
