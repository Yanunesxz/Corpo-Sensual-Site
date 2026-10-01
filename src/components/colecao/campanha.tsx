import { altFoto } from "@/lib/content/alt-fotos";
import { Figura } from "@/components/figura";
import { SectionHeading } from "@/components/section-heading";
import { Trilho } from "@/components/trilho";
import { VideoPerto } from "./video-perto";

type Video = { src: string; legenda: string; comAudio?: boolean };

type Props = {
  /** Nome da coleção, para o texto alternativo de reserva. */
  nome: string;
  /** Fotos de campanha da coleção (as quatro primeiras entram na composição). */
  fotos: string[];
  /** Filmes da campanha. Sem filme, o título diz só "fotografada". */
  videos: Video[];
};

/*
 * Composição de revista no desktop, em duas linhas de 12 colunas:
 *   linha 1: foto grande (7) + foto menor (5) apoiada na base;
 *   linha 2: foto menor (5) presa no topo + foto grande (7).
 * As grandes são quadradas e as menores 4:5, então as alturas diferem e o olho
 * desce em zigue-zague. No celular, duas colunas 4:5 iguais.
 */
const QUADROS = [
  {
    li: "lg:col-span-7",
    proporcao: "aspect-[4/5] lg:aspect-square",
    sizes: "(min-width: 1440px) 770px, (min-width: 1024px) 53vw, 46vw",
  },
  {
    li: "lg:col-span-5 lg:self-end",
    proporcao: "aspect-[4/5]",
    sizes: "(min-width: 1440px) 540px, (min-width: 1024px) 37vw, 46vw",
  },
  {
    li: "lg:col-span-5 lg:self-start",
    proporcao: "aspect-[4/5]",
    sizes: "(min-width: 1440px) 540px, (min-width: 1024px) 37vw, 46vw",
  },
  {
    li: "lg:col-span-7",
    proporcao: "aspect-[4/5] lg:aspect-square",
    sizes: "(min-width: 1440px) 770px, (min-width: 1024px) 53vw, 46vw",
  },
];

/**
 * Ponto de interesse de cada foto no recorte quadrado do desktop. As fotos 2:3 do
 * inverno perdem um terço da altura no quadrado: sem isto a testa sai cortada.
 */
const FOCO: Record<string, string> = {
  "/images/colecoes/entrelacos-3.jpg": "object-[center_4%]",
  "/images/colecoes/entrelacos-1.jpg": "object-[center_30%]",
};

/** Campanha da coleção: quatro fotos em composição e, se houver, os filmes. */
export function CampanhaColecao({ nome, fotos, videos }: Props) {
  const quadros = fotos.slice(0, QUADROS.length);
  return (
    <>
      <SectionHeading eyebrow="Campanha" title={videos.length > 0 ? "Campanha fotografada e filmada" : "Campanha fotografada"} />

      {quadros.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-3 md:gap-5 lg:mt-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10">
          {quadros.map((url, i) => (
            <li key={url} className={QUADROS[i].li} data-reveal style={{ ["--atraso" as string]: `${(i % 2) * 80}ms` }}>
              <Figura
                src={url}
                alt={altFoto(url, `${nome}, campanha ${i + 1}`)}
                sizes={QUADROS[i].sizes}
                proporcao={QUADROS[i].proporcao}
                foco={FOCO[url] ?? "object-[center_22%]"}
              />
            </li>
          ))}
        </ul>
      )}

      {videos.length > 0 && (
        // Celular: trilho de cartões médios, um vídeo tocando por vez. Desktop: quatro colunas.
        <div className="mt-10 md:mt-12 lg:mt-16" data-reveal>
          <Trilho rotulo="Filmes da campanha" className="trilho-medio trilho-lg-grade [--colunas:4] lg:gap-x-10">
            {videos.map((v) => (
              <li key={v.src}>
                <VideoPerto src={v.src} legenda={v.legenda} comAudio={v.comAudio !== false} />
              </li>
            ))}
          </Trilho>
        </div>
      )}
    </>
  );
}
