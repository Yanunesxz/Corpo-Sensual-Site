import Link from "next/link";
import { CampaignVideo } from "@/components/campaign-video";

/** Etapas mostradas no vídeo, na mesma ordem em que aparecem. */
const ETAPAS = [
  { title: "Costura", description: "A peça é montada na nossa produção, em Muriaé, MG." },
  { title: "Revisão e etiqueta", description: "Cada peça é conferida e recebe a etiqueta com referência e tamanho." },
  { title: "Embalagem", description: "Embaladas uma a uma, prontas para ir direto à arara da sua loja." },
  { title: "Caixa lacrada", description: "O pedido é separado, encaixotado e lacrado com a fita da marca." },
];

type Props = {
  /** Classe de fundo da seção, para alternar com as seções vizinhas. */
  fundo?: string;
  /** Mostra o link para a página de lojistas. Não use na própria página de lojistas. */
  comLink?: boolean;
};

/**
 * "Da costura à caixa": o vídeo real da produção com as etapas ao lado.
 * É a prova de estrutura da empresa — a pessoa vê a peça sendo confeccionada,
 * embalada e despachada, sem precisar acreditar em texto.
 *
 * No celular a ordem é título, vídeo e etapas: o vídeo é vertical e, se viesse
 * primeiro, ocuparia a tela inteira antes de a pessoa saber o que está vendo.
 * No desktop ele volta para a coluna da esquerda, ao lado do texto.
 */
export function ProducaoSection({ fundo = "bg-sky-soft", comLink = true }: Props) {
  return (
    <section className={fundo}>
      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,21rem)_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
          {/* Ordem no DOM = ordem no celular: título, vídeo, etapas. No desktop o
              grid recoloca o vídeo na coluna da esquerda, ao lado dos dois textos. */}
          <div className="lg:col-start-2 lg:row-start-1">
            <p className="label">Dentro da fábrica</p>
            <h2 className="h-display mt-3 text-3xl md:text-[2.5rem]">Da costura à caixa</h2>
            <p className="mt-4 max-w-2xl text-[1.125rem] leading-[1.6]">
              O caminho de uma peça na nossa produção, do momento em que sai da máquina até o pedido lacrado e pronto
              para viajar. Fabricação própria, sem intermediário entre a costura e a sua loja.
            </p>
          </div>

          {/* Vídeo vertical. No celular fica estreito para caber com o texto na mesma tela. */}
          <div className="mx-auto w-full max-w-[18rem] overflow-hidden rounded-media bg-sky lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center">
            <CampaignVideo src="producao/da-costura-a-caixa" legenda="Produção da Corpo Sensual: costura, etiqueta, embalagem e expedição das peças" />
          </div>

          <div className="lg:col-start-2 lg:row-start-2 lg:self-start">
            <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {ETAPAS.map((e, i) => (
                <li key={e.title} className="border-t border-line pt-4">
                  <span className="label block text-[13px] tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h-display mt-1 text-xl md:text-[1.375rem]">{e.title}</h3>
                  <p className="mt-1.5 leading-[1.6]">{e.description}</p>
                </li>
              ))}
            </ol>

            {comLink && (
              <Link href="/fabrica-de-pijamas" className="link mt-8 inline-block text-[15px]">
                Conheça a fábrica
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
