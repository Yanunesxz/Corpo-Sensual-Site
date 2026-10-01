import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { Faq, type FaqItem } from "@/components/faq";
import { ProducaoSection } from "@/components/producao-section";
import { altFoto } from "@/lib/content/alt-fotos";

export const metadata: Metadata = {
  title: "Seja representante de pijamas e moda íntima",
  description:
    "Seja representante comercial da Corpo Sensual, fábrica de pijamas e moda íntima em Muriaé, MG. Cadastre a sua região e a equipe comercial entra em contato.",
  alternates: { canonical: "/seja-representante" },
};

/*
 * Página de captação de representantes. Mostra o tamanho e a estrutura da empresa
 * pelo que se vê (campanha, coleções, vídeo da produção) e não por números: nada de
 * anos de mercado, quantidade de referências, valores ou porcentagens aqui.
 * Nada de comissão, ganho ou exclusividade de região: isso é conversa do gerente
 * comercial, e o CRM tem regra expressa de não prometer território.
 */

/** A estrutura da empresa em quatro linhas, logo abaixo da abertura. */
const pilares = [
  { title: "Fábrica própria", text: "Corte, costura e embalagem em Muriaé, MG." },
  { title: "Coleção nova a cada estação", text: "Primavera/verão e outono/inverno." },
  { title: "Linha para a família", text: "Feminino, masculino e infantil." },
  { title: "Lojistas em todo o Brasil", text: "Venda no atacado para o país inteiro." },
];

/** Por que representar. Só o que a empresa sustenta. */
const motivos = [
  {
    title: "Direto de quem fabrica",
    description: "Fábrica própria em Muriaé, MG, polo nacional da moda íntima. Você vende de quem produz, sem intermediário no caminho.",
  },
  {
    title: "Sem pedido mínimo",
    description: "O lojista compra o valor que quiser. Fica mais fácil abrir cliente novo e voltar para repor.",
  },
  {
    title: "Uma linha para a família inteira",
    description: "Feminino, masculino e infantil na mesma coleção: um pedido abastece a seção de pijamas da loja.",
  },
  {
    title: "Coleção nova a cada estação",
    description: "Primavera/verão e outono/inverno. É o motivo certo para voltar a cada cliente com lançamento.",
  },
  {
    title: "Condições que fecham pedido",
    description: "Desconto no Pix, parcelamento sem juros no cartão, frete grátis conforme a região e referências a pronta entrega.",
  },
  {
    title: "Pedidos pelo app, no celular",
    description: "Catálogo com preços, pedidos e acompanhamento num app feito para o representante.",
  },
];

/** Fotos da campanha: a marca que o representante leva para a loja. */
const campanha = [
  "/images/colecoes/delicias-1.jpg",
  "/images/colecoes/entrelacos-3.jpg",
  "/images/categorias/masculino.jpg",
  "/images/colecoes/delicias-2.jpg",
];

const passos = [
  { title: "Cadastro", text: "Conte a sua região, há quanto tempo representa e quais marcas leva hoje." },
  {
    title: "Conversa com o Fabian",
    text: "Nosso gerente comercial fala com você pelo WhatsApp e apresenta as coleções, a tabela de preços e as condições de representação.",
  },
  {
    title: "Região combinada",
    text: "Com a região acertada, você apresenta as coleções aos lojistas e tira os pedidos pelo app.",
  },
];

/** As dúvidas que travam o cadastro. Respostas sem promessa: o resto é com o gerente comercial. */
const perguntas: FaqItem[] = [
  {
    q: "Como é a comissão?",
    a: "A comissão e as condições de representação são apresentadas pelo Fabian, nosso gerente comercial, na conversa depois do cadastro.",
  },
  {
    q: "A minha região está disponível?",
    a: "O Fabian confere a cobertura que a fábrica já tem no seu estado e combina a região de atuação com você.",
  },
  {
    q: "O lojista precisa fazer pedido mínimo?",
    a: "Não. O lojista compra o valor que quiser, com desconto no Pix, parcelamento sem juros no cartão e frete grátis a partir de um valor que varia conforme a região.",
  },
  {
    q: "Preciso ter CNPJ para representar?",
    a: "Informe no cadastro se tem CNPJ. Se ainda não tiver, cadastre-se com o CPF: o gerente comercial avalia cada caso.",
  },
];

/** O que o comercial precisa saber antes de conversar. Serve de roteiro para a mensagem. */
const oQuePrecisamos = [
  "A região que você atende hoje e as cidades que cobre",
  "Há quanto tempo trabalha com representação e em quais marcas",
  "Quantas lojas de moda íntima ou pijama você já visita",
];

export default function RepresentantePage() {
  return (
    <>
      {/* Abertura: proposta e botão à esquerda, foto de campanha à direita. No celular
          o texto vem antes da foto, para o botão aparecer sem rolar. */}
      <section className="grid bg-sky lg:grid-cols-2" data-barra-depois>
        <div className="px-5 py-14 md:px-12 md:py-20 lg:flex lg:flex-col lg:justify-center lg:px-16">
          <p className="label">Seja representante</p>
          <h1 className="h-hero mt-3 max-w-xl text-[2rem] md:text-[2.375rem]">Leve a Corpo Sensual para as lojas da sua região</h1>
          <p className="mt-5 max-w-lg text-[1.0625rem] leading-[1.6] text-body">
            Fábrica própria em Muriaé, MG, coleção nova a cada estação e uma linha que veste a família inteira. Você
            apresenta ao lojista uma marca pronta para vender, com condições que ajudam a fechar o pedido.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <a href="#formulario" className="btn btn-dark w-full sm:w-auto">
              Quero ser representante
            </a>
            <a href="#motivos" className="link self-start text-base sm:self-auto">
              Por que representar
            </a>
          </div>
          <p className="mt-4 text-sm text-body">Depois do cadastro você fala direto com o nosso gerente comercial.</p>
        </div>
        <div className="relative aspect-[4/3] bg-sky-soft sm:aspect-[16/10] lg:aspect-auto lg:min-h-[85svh]">
          <Image
            src="/images/representante/casal.jpg"
            alt="Casal com pijama masculino azul-marinho e camisola azul com renda, na varanda à beira do lago, campanha Corpo Sensual"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[center_22%]"
          />
        </div>
      </section>

      {/* A estrutura da empresa, em uma faixa */}
      <section className="border-b border-line">
        <ul className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:py-12 lg:grid-cols-4">
          {pilares.map((p) => (
            <li key={p.title}>
              <p className="h-display text-lg md:text-xl">{p.title}</p>
              <p className="mt-1 text-sm leading-[1.5] text-body md:text-[15px]">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="motivos" className="wrap scroll-mt-20 py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className="h-display text-3xl md:text-[2.5rem]">Por que representar a Corpo Sensual</h2>
          <p className="mt-4 text-[1.0625rem] leading-[1.6] text-body">
            O que faz o lojista comprar na primeira visita e voltar a comprar na próxima estação.
          </p>
        </div>
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {motivos.map((m) => (
            <li key={m.title} className="border-t border-line pt-4">
              <h3 className="h-display text-xl md:text-[1.375rem]">{m.title}</h3>
              <p className="mt-1.5 text-[15px] leading-[1.6] text-body">{m.description}</p>
            </li>
          ))}
        </ul>
        <a href="#formulario" className="btn btn-dark mt-10 w-full sm:w-auto">
          Quero representar a marca
        </a>
      </section>

      {/* A marca que ele vai apresentar: campanha profissional a cada coleção */}
      <section className="bg-sky-soft">
        <div className="wrap py-14 md:py-20">
          <div className="max-w-2xl">
            <p className="label">A marca na sua pasta</p>
            <h2 className="h-display mt-3 text-3xl md:text-[2.5rem]">Uma marca que se apresenta sozinha</h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.6] text-body">
              Cada coleção ganha campanha fotografada e catálogo digital completo, com todas as referências e a grade.
              Você chega na loja com uma marca de verdade, do catálogo ao pedido.
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {campanha.map((url) => (
              <li key={url} className="zoom-img relative aspect-[4/5] overflow-hidden rounded-media bg-sky">
                <Image src={url} alt={altFoto(url, "Foto de campanha da Corpo Sensual")} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </li>
            ))}
          </ul>
          <Link href="/colecoes" className="link mt-8 inline-block text-base">
            Ver as coleções
          </Link>
        </div>
      </section>

      {/* A produção em vídeo: prova de estrutura sem precisar de número */}
      <ProducaoSection fundo="bg-paper" comLink={false} />

      <section className="bg-sky-soft">
        <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="h-display text-3xl md:text-[2.5rem]">Como funciona</h2>
            <ol className="mt-8 flex flex-col gap-6">
              {passos.map((p, i) => (
                <li key={p.title} className="border-t border-line pt-4">
                  <span className="label block text-[13px] tabular-nums opacity-85">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h-display mt-1 text-xl md:text-[1.375rem]">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-body">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="h-display text-3xl md:text-[2.5rem]">Dúvidas de quem quer representar</h2>
            <div className="mt-8">
              <Faq items={perguntas} />
            </div>
          </div>
        </div>
      </section>

      {/* Cadastro: o mesmo formulário das outras páginas, que cria o lead no CRM */}
      <section id="formulario" className="scroll-mt-16 bg-sky">
        <div className="wrap grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="h-display text-3xl md:text-[2.5rem]">Cadastre a sua região</h2>
            <p className="mt-4 max-w-xl text-[1.0625rem] leading-[1.6] text-body">
              Leva um minuto. O Fabian, nosso gerente comercial, avalia o cadastro e fala com você pelo WhatsApp.
            </p>

            <h3 className="h-display mt-10 text-2xl">O que contar no cadastro</h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {oQuePrecisamos.map((item) => (
                <li key={item} className="py-3.5 text-[15px] leading-[1.6]">
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-body">
              É lojista e não representante?{" "}
              <Link href="/fabrica-de-pijamas" className="underline">
                Veja como comprar da fábrica
              </Link>
              .
            </p>
          </div>

          <div>
            <LeadForm source="representante" submitLabel="Quero representar a marca" withMessage />
          </div>
        </div>
      </section>
    </>
  );
}
