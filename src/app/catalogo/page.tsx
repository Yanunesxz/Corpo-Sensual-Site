import type { Metadata } from "next";
import Image from "next/image";
import { BlocoCadastro } from "@/components/bloco-cadastro";
import { Faq } from "@/components/faq";
import { Passos } from "@/components/passos";
import { SectionHeading } from "@/components/section-heading";
import { altFoto } from "@/lib/content/alt-fotos";
import { faqCurto } from "@/lib/content/faq";
import { equipe, seasonLabel, site, TOTAL_REFERENCIAS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Receba o catálogo de pijamas no atacado",
  description:
    "Cadastre sua loja e receba o catálogo digital da Corpo Sensual com a nova coleção de pijamas, camisolas e moda íntima e a tabela de preços de atacado.",
  alternates: { canonical: "/catalogo" },
};

const FOTO = "/images/colecoes/delicias-3.jpg";

/* Sem repetir "com grade e tabela de preços", que o H1 logo acima já diz. */
const LEAD = `As ${TOTAL_REFERENCIAS} referências dos catálogos de verão e inverno, Delícias de Verão e Entrelaços. ${site.commercial.noCnpjNote}`;

const [nicoli, simone] = equipe.vendedoras;

/** O que acontece depois do envio: tira a dúvida "e agora, quem me liga?". */
const DEPOIS = [
  {
    titulo: "Você escolhe a vendedora",
    texto: `Logo depois do envio, você fala com a ${nicoli.nome} ou a ${simone.nome} pelo WhatsApp.`,
  },
  { titulo: "Recebe o catálogo", texto: `As ${TOTAL_REFERENCIAS} referências, com grade de tamanhos e tabela de preços.` },
  { titulo: "Monta o pedido", texto: "Sem pedido mínimo. O pedido sai da fábrica em até 15 dias úteis." },
];

/**
 * Para onde vão todos os botões "Receber catálogo". Nada para distrair: título, o
 * cadastro e, depois dele, o que acontece agora. Sem barra fixa, sem chamada no rodapé
 * e sem link de saída na abertura. O cartão começa direto pelos campos (o H1 já diz o
 * que é) e a lista ✓ das condições fica abaixo do botão: o primeiro campo aparece na
 * primeira tela do celular e do notebook.
 * Celular: abre com o título (o LCP é texto) e o formulário logo abaixo; a foto não
 * existe nem é baixada. Desktop: a foto fica presa à esquerda, no formato dela (4:5),
 * enquanto a pessoa preenche; o parágrafo de apoio some e os respiros apertam, para o
 * botão de envio aparecer na primeira tela de um monitor de 1680x830.
 */
export default function CatalogoPage() {
  return (
    <>
      <section className="bg-sky">
        <div className="wrap grid gap-y-6 pb-14 pt-6 md:pb-20 md:pt-12 lg:grid-cols-12 lg:gap-x-10 lg:pb-24 lg:pt-5">
          {/* Sem priority: no celular a foto fica escondida e o carregamento preguiçoso não a baixa. */}
          <div className="relative hidden overflow-hidden bg-sky-deep lg:sticky lg:top-[5.75rem] lg:col-span-5 lg:block lg:aspect-[4/5] lg:max-h-[calc(100svh-7rem)] lg:self-start">
            <Image
              src={FOTO}
              alt={altFoto(FOTO, "Mãe e filha de short doll azul-marinho à beira da piscina, coleção Delícias de Verão")}
              fill
              sizes="(min-width: 1024px) 40vw, 1px"
              className="object-cover object-[center_40%]"
            />
            <p className="tag absolute left-5 top-5">
              <span className="h-1.5 w-1.5 rounded-full bg-noite" aria-hidden />
              Delícias de Verão · {seasonLabel("verao", 2027)}
            </p>
          </div>

          <div className="lg:col-span-7 lg:pl-2 xl:pl-8">
            {/* No desktop o título fica menor (até 42 px), para o botão de envio caber na primeira tela. */}
            <h1>
              <span className="eyebrow">Catálogo digital de atacado</span>{" "}
              <span className="t-hero mt-3 block max-w-[16ch] max-[379px]:text-[1.875rem] lg:max-w-[20ch] lg:text-[clamp(2.125rem,1rem+1.6vw,2.625rem)]">
                Receba o catálogo com grade e tabela de preços
              </span>
            </h1>
            {/* Um nó de texto só: quando a Inter chega, as linhas quebram em outro lugar. Com
                vários nós ("210", a nota do CNPJ), o começo de cada um muda de lugar e o Chrome
                conta como deslocamento de layout (CLS). Com um nó, o começo fica parado. */}
            {/* Só até 1023 px. No desktop o que ele diz já está no cartão ("Ainda não" tem CNPJ),
                na lista abaixo do botão e em "O que acontece agora". */}
            <p className="lead mt-4 max-w-xl lg:hidden">{LEAD}</p>

            <BlocoCadastro
              condicoes="depois"
              source="catalogo"
              submitLabel="Quero receber o catálogo"
              nota={"*Nas demais regiões, o frete grátis vale a partir de R$ 2.000."}
              className="mt-6 lg:mt-4 lg:p-6"
            />
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="wrap sec grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Depois do cadastro" title="O que acontece agora" />
            <Passos itens={DEPOIS} className="mt-8 md:mt-10" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading eyebrow="Perguntas frequentes" title="Antes de se cadastrar" />
            <div className="mt-8 md:mt-10" data-reveal>
              <Faq items={faqCurto} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
