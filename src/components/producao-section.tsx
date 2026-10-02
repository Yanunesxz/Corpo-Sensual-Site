import Image from "next/image";
import Link from "next/link";
import { CampaignVideo } from "./campaign-video";
import { NumerosFabrica } from "./numeros-fabrica";
import { Trilho } from "./trilho";
import { ArrowRight } from "./icons";

/**
 * As etapas, na ordem em que aparecem no vídeo. As fotos são quadros do vídeo 4K da
 * produção (scripts/midia-campanha.json, lista "quadros"). Sem número nenhum: a seção
 * também aparece na página de representante.
 */
const ETAPAS = [
  {
    foto: "/images/producao/costura.jpg",
    alt: "Máquina de costura fechando uma peça de tecido azul",
    titulo: "Corte e costura",
  },
  {
    foto: "/images/producao/etiqueta.jpg",
    alt: "Mãos colocando a etiqueta da Corpo Sensual numa peça rosa",
    titulo: "Revisão e etiqueta",
  },
  {
    foto: "/images/producao/embalagem.jpg",
    alt: "Peça listrada dobrada e embalada, com a etiqueta da marca",
    titulo: "Embalagem",
  },
  {
    foto: "/images/producao/caixa.jpg",
    alt: "Caixa fechada com a fita da Corpo Sensual",
    titulo: "Caixa lacrada",
  },
];

type Props = {
  /** Versão em azul-noite, a "prova de estrutura" da home, da landing e do sobre. */
  escuro?: boolean;
  /** Fundo da versão clara (classe do Tailwind). Ignorado com `escuro`. */
  fundo?: string;
  /** Mostra os números da fábrica (25+, 210, 2, 3). NUNCA na página de representante. */
  numeros?: boolean;
  /** Botão no fim da seção (claro no escuro, tinta no claro). */
  cta?: { href: string; label: string };
  /** Sem `cta`, mostra "Conheça a fábrica →" (/sobre). Passe false no próprio /sobre. */
  comLink?: boolean;
  id?: string;
};

/**
 * "Da costura à caixa lacrada": o vídeo real da produção e as quatro etapas com foto,
 * numa tira de cinco quadros 4:5. No celular a tira é um trilho (cartões de 72%);
 * no desktop, cinco colunas. Ordem no celular: cabeçalho, tira, números.
 * Enxuta de propósito (era a seção mais alta depois do rodapé): um parágrafo só, só o
 * título sob cada quadro, números numa faixa de quatro colunas também no celular e o
 * botão só no desktop (abaixo de 1024 px a barra fixa já traz a mesma chamada).
 */
export function ProducaoSection({ escuro = false, fundo = "bg-sky-soft", numeros = false, cta, comLink = true, id }: Props) {
  const quadro = `relative aspect-[4/5] overflow-hidden ${escuro ? "bg-noite-hover" : "bg-sky"}`;

  return (
    <section
      id={id}
      // Reserva perto da altura real, com e sem a faixa de números: o botão "Quero ser representante"
      // desce até o cadastro passando por esta seção, e com a reserva errada (960 contra 757 px) parava
      // 200 px abaixo do título.
      className={`cv-auto ${numeros ? "[contain-intrinsic-size:auto_900px] md:[contain-intrinsic-size:auto_1014px] lg:[contain-intrinsic-size:auto_970px] min-[90rem]:[contain-intrinsic-size:auto_1005px]" : "[contain-intrinsic-size:auto_757px] md:[contain-intrinsic-size:auto_850px] lg:[contain-intrinsic-size:auto_860px] min-[90rem]:[contain-intrinsic-size:auto_898px]"} ${escuro ? "on-dark bg-noite text-noite-texto" : fundo}`}
    >
      <div className="wrap grid gap-y-8 py-12 md:gap-y-10 md:py-[5.5rem] lg:grid-cols-12 lg:items-end lg:gap-x-10 lg:gap-y-14 lg:py-[7.5rem]">
        <div className="lg:col-span-6 lg:row-start-1" data-reveal>
          <p className="eyebrow eyebrow-fio">Dentro da fábrica</p>
          <h2 className="t-titulo mt-3">Da costura à caixa lacrada, tudo na nossa fábrica</h2>
          <p className="lead mt-4 max-w-2xl">
            Corte, costura, revisão, etiqueta e embalagem acontecem aqui, em Muriaé, MG, com tecidos selecionados e tecnologia
            anti-pilling. O pedido sai em caixa lacrada com a fita da marca.
          </p>
        </div>

        {/* min-w-0: o trilho rola por dentro, sem alargar a grade. */}
        <div className="min-w-0 lg:col-span-12 lg:row-start-2">
          <Trilho ordenada rotulo="Etapas da produção, do vídeo à caixa lacrada" escuro={escuro} className="trilho-medio trilho-lg-grade [--colunas:5]">
            {/* No celular o vídeo abre o trilho (é o que mais prova a fábrica). No desktop vai para o
                fim: começa na máquina de costura e, ao lado de "Corte e costura", repetia a cena. */}
            <li data-reveal className="lg:order-last">
              <div className={quadro}>
                <CampaignVideo src="producao/da-costura-a-caixa" proporcao="4/5" legenda="Produção da Corpo Sensual: costura, etiqueta, embalagem e caixa lacrada" />
              </div>
              <h3 className="t-sub mt-3 text-[1.125rem] lg:mt-4 lg:text-[1.1875rem]">Vídeo da produção</h3>
            </li>
            {ETAPAS.map((e, i) => (
              <li key={e.titulo} data-reveal style={{ ["--atraso" as string]: `${(i + 1) * 80}ms` }}>
                <div className={quadro}>
                  <Image src={e.foto} alt={e.alt} fill sizes="(min-width: 1024px) 18vw, 72vw" className="object-cover" />
                </div>
                <h3 className="t-sub mt-3 text-[1.125rem] lg:mt-4 lg:text-[1.1875rem]">{e.titulo}</h3>
              </li>
            ))}
          </Trilho>
        </div>

        {numeros && (
          <NumerosFabrica
            escuro={escuro}
            // Entre 1024 e 1279 px as 6 colunas têm uns 440 px: em 4 colunas os numerais
            // encostam ("25+2102"). Ali ficam 2x2; em 4 colunas só a partir de 1280.
            className={`border-t pt-6 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:grid-cols-2 lg:border-t-0 lg:pt-0 xl:grid-cols-4 ${escuro ? "border-white/15" : "border-line"}`}
          />
        )}

        {cta ? (
          <div className="hidden lg:col-span-12 lg:block">
            <Link href={cta.href} className={`btn ${escuro ? "btn-light" : "btn-primary"} w-full sm:w-auto`}>
              {cta.label}
              <ArrowRight width={18} height={18} className="seta" />
            </Link>
          </div>
        ) : (
          comLink && (
            <div className="lg:col-span-12">
              <Link href="/sobre" className="link-seta">
                Conheça a fábrica
                <ArrowRight width={18} height={18} />
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  );
}
