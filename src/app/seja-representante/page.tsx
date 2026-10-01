import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlocoCadastro } from "@/components/bloco-cadastro";
import { Faq, type FaqItem } from "@/components/faq";
import { Figura } from "@/components/figura";
import { ArrowRight } from "@/components/icons";
import { Passos } from "@/components/passos";
import { ProducaoSection } from "@/components/producao-section";
import { SectionHeading } from "@/components/section-heading";
import { RepEstrutura } from "@/components/rep/estrutura";
import { altFoto } from "@/lib/content/alt-fotos";

export const metadata: Metadata = {
  title: "Seja representante de pijamas e moda íntima",
  description:
    "Seja representante comercial da Corpo Sensual, fábrica de pijamas e moda íntima em Muriaé, MG. Cadastre a sua região e a equipe comercial entra em contato.",
  alternates: { canonical: "/seja-representante" },
};

/*
 * Página de captação de representantes. Mostra o tamanho e a estrutura da empresa
 * pelo que se vê (campanha, coleções, vídeo da produção) e não por números: o texto
 * do <main> não pode ter dígito nenhum (nem anos, referências, valores, porcentagens,
 * prazos, nem numeração de passos). Por isso aqui não entram Condicoes nem
 * NumerosFabrica. Nada de comissão ou ganho: isso é conversa
 * do gerente comercial, e o CRM tem regra expressa de não prometer território.
 */

/** Por que representar. Só o que a empresa sustenta. */
const motivos = [
  {
    titulo: "Direto de quem fabrica",
    texto: "Fábrica própria em Muriaé, MG, polo nacional da moda íntima. Você apresenta ao lojista a marca de quem produz.",
  },
  {
    titulo: "Sem pedido mínimo para o lojista",
    texto: "O lojista compra o valor que quiser. Fica mais fácil abrir cliente novo e voltar para repor.",
  },
  {
    titulo: "Uma linha para a família inteira",
    texto: "Feminino, masculino e infantil na mesma coleção: um pedido abastece a seção de pijamas da loja.",
  },
  {
    titulo: "Coleção nova a cada estação",
    texto: "Primavera/verão e outono/inverno. É o motivo certo para voltar a cada cliente com lançamento.",
  },
  {
    titulo: "Condições que ajudam a fechar pedido",
    texto: "Desconto no Pix, parcelamento sem juros no cartão, frete grátis conforme a região e referências a pronta entrega.",
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
  { titulo: "Cadastro", texto: "Conte a sua região, há quanto tempo representa e quais marcas leva hoje." },
  {
    titulo: "Conversa com o Fabian",
    texto: "Nosso gerente comercial fala com você pelo WhatsApp e apresenta as coleções, a tabela de preços e as condições de representação.",
  },
  { titulo: "Região combinada", texto: "Com a região acertada, você apresenta as coleções aos lojistas." },
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
const oQueContar = [
  "A região que você atende hoje e as cidades que cobre",
  "Há quanto tempo trabalha com representação e em quais marcas",
  "Quantas lojas de moda íntima ou pijama você já visita",
];

export default function RepresentantePage() {
  return (
    <>
      {/* 1. Capa dividida. No celular o texto vem antes da foto: título e botão na
          primeira tela. No desktop o texto alinha com a margem do .wrap mesmo em tela
          mais larga que 1440 px, e a foto sangra até a borda direita. */}
      <section className="bg-sky lg:grid lg:grid-cols-2" data-barra-depois>
        <div className="wrap pb-12 pt-10 md:pb-16 md:pt-14 lg:flex lg:items-center lg:py-20 lg:pl-[max(3rem,calc((100vw_-_1440px)/2_+_3rem))] lg:pr-14 xl:pr-20">
          <div className="max-w-[36rem]">
            <p className="eyebrow eyebrow-fio">Representação comercial</p>
            <h1 className="t-hero mt-4 max-w-[13ch] md:max-w-[18ch] lg:mt-5 lg:max-w-[13ch]">Leve a Corpo Sensual para as lojas da sua região</h1>
            <p className="lead mt-5 max-w-[32rem] lg:mt-6">
              Fábrica própria em Muriaé, MG, coleção nova a cada estação e uma linha que veste a família inteira. Você
              apresenta ao lojista uma marca pronta para vender.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8 lg:mt-10 lg:flex-col lg:items-start lg:gap-3 xl:flex-row xl:items-center xl:gap-8">
              <a href="#formulario" className="btn btn-primary btn-lg w-full whitespace-nowrap sm:w-auto" data-ga-local="hero">
                Quero ser representante
                <ArrowRight width={18} height={18} className="seta" />
              </a>
              <a href="#motivos" className="link-seta">
                Por que representar
                <ArrowRight width={18} height={18} />
              </a>
            </div>
            <p className="legenda mt-6 max-w-[22rem]">Depois do cadastro você fala direto com o Fabian, nosso gerente comercial.</p>
          </div>
        </div>
        <div className="relative aspect-[4/5] bg-sky-deep sm:aspect-[4/3] lg:aspect-auto lg:min-h-[max(36rem,min(calc(100svh_-_7rem),50rem))]">
          <Image
            src="/images/representante/casal.jpg"
            alt="Casal com pijama masculino azul-marinho e camisola azul com renda, na varanda à beira do lago, campanha Corpo Sensual"
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[center_22%]"
          />
        </div>
      </section>

      {/* 2. A estrutura da empresa, numa faixa com fio */}
      <RepEstrutura />

      {/* 3. Por que representar. A sexta casa da grade (desktop e tablet) é o botão:
          nada de buraco ao lado do quinto motivo. */}
      <section id="motivos" className="sec bg-paper">
        <div className="wrap">
          <SectionHeading
            title="Por que representar a Corpo Sensual"
            description="O que faz o lojista comprar na primeira visita e voltar na próxima estação."
          />
          {/* A lista some da caixa (contents) para os itens e o botão dividirem a mesma
              grade; o botão fica fora da <ul>, que continua com só os cinco motivos. */}
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:mt-14 lg:grid-cols-3 lg:gap-y-14">
            <ul className="contents">
              {motivos.map((m, i) => (
                <li key={m.titulo} className="border-t border-line pt-5" data-reveal style={{ ["--atraso" as string]: `${(i % 3) * 80}ms` }}>
                  <h3 className="t-sub">{m.titulo}</h3>
                  <p className="mt-2.5 max-w-[26rem] text-[15px] leading-[1.6] text-body">{m.texto}</p>
                </li>
              ))}
            </ul>
            <div className="flex items-end sm:pt-5" data-reveal style={{ ["--atraso" as string]: "160ms" }}>
              <a href="#formulario" className="btn btn-primary w-full sm:w-auto">
                Quero representar a marca
                <ArrowRight width={18} height={18} className="seta" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. A marca que ele vai apresentar: campanha a cada coleção */}
      <section className="sec bg-sky-soft">
        <div className="wrap">
          <SectionHeading
            eyebrow="A marca na sua pasta"
            title="Uma marca que se apresenta sozinha"
            description="Cada coleção ganha campanha fotografada e filmada e catálogo digital completo. Você chega na loja com uma marca de verdade, do catálogo ao pedido."
            link={{ href: "/colecoes", label: "Ver as coleções" }}
          />
          {/* Colunas pares descidas, como num lookbook: a grade não fica de catálogo. */}
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-3 md:gap-x-5 md:gap-y-5 lg:mt-14 lg:grid-cols-4 lg:gap-x-6">
            {campanha.map((url, i) => (
              <div key={url} className={i % 2 === 1 ? "mt-8 lg:mt-16" : ""} data-reveal style={{ ["--atraso" as string]: `${i * 80}ms` }}>
                <Figura
                  src={url}
                  alt={altFoto(url, "Foto de campanha da Corpo Sensual")}
                  sizes="(min-width: 1024px) 23vw, 46vw"
                  foco={url.includes("entrelacos-3") ? "object-[center_30%]" : "object-center"}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. A produção em vídeo: prova de estrutura sem número (e sem ordinal) */}
      <ProducaoSection fundo="bg-paper" numeros={false} comLink={false} />

      {/* 6. Como funciona e dúvidas, lado a lado no desktop. Os dois títulos dividem a
          primeira linha da grade (alinhados pela base), e os passos e as perguntas
          começam na mesma altura. No celular a ordem é a do DOM: título, passos, título, perguntas. */}
      <section className="sec bg-sky-soft">
        <div className="wrap grid lg:grid-cols-12 lg:items-end lg:gap-x-10" data-reveal>
          <h2 className="t-titulo lg:col-span-5 lg:row-start-1">Como funciona</h2>
          <Passos semNumeros itens={passos} className="mt-8 self-start lg:col-span-5 lg:row-start-2 lg:mt-12" />
          <h2 className="t-titulo mt-16 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mt-0">Dúvidas de quem quer representar</h2>
          <div className="mt-8 self-start lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:mt-12">
            <Faq items={perguntas} />
          </div>
        </div>
      </section>

      {/* 7. Cadastro: o mesmo formulário das outras páginas, que cria o lead no CRM.
          O id="formulario" fica na seção (a barra, o rodapé e os botões apontam para
          cá); o cartão leva outro id para não repetir. */}
      <section id="formulario" className="sec bg-sky" data-sem-barra>
        <div className="wrap grid gap-y-10 lg:grid-cols-12 lg:items-start lg:gap-x-10">
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <h2 className="t-titulo">Cadastre a sua região</h2>
            <p className="lead mt-4 max-w-xl">O Fabian, nosso gerente comercial, avalia o cadastro e fala com você pelo WhatsApp.</p>

            <h3 className="t-sub mt-10 lg:mt-12">O que contar no cadastro</h3>
            <ul className="mt-4 border-y border-line">
              {oQueContar.map((item) => (
                <li key={item} className="flex gap-3 border-b border-line py-3.5 text-[15px] leading-[1.55] text-ink last:border-b-0">
                  <span aria-hidden className="mt-[0.55rem] block h-1.5 w-1.5 flex-none rounded-full bg-noite" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[15px] leading-[1.6] text-body">
              É lojista e não representante?{" "}
              <Link href="/fabrica-de-pijamas" className="text-ink underline underline-offset-4 hover:decoration-2">
                Veja como comprar da fábrica
              </Link>
              .
            </p>
          </div>

          <BlocoCadastro
            id="cadastro-rep"
            source="representante"
            submitLabel="Quero representar a marca"
            withMessage
            className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7"
          />
        </div>
      </section>
    </>
  );
}
