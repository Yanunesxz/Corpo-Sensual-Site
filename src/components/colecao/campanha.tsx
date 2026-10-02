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
  /**
   * Fotos da capa da página (a larga e a do celular). No celular a galeria nunca repete
   * a foto da capa logo abaixo dela, e a foto da capa larga, quando está na galeria,
   * vira a grande (é a melhor da coleção).
   */
  capas?: { tela?: string | null; celular?: string | null };
};

/*
 * Composição de revista no desktop, em duas linhas de 12 colunas:
 *   linha 1: foto grande (7) + foto menor (5) apoiada na base;
 *   linha 2: foto menor (5) presa no topo + foto grande (7).
 * As grandes são quadradas e as menores 4:5, então as alturas diferem e o olho
 * desce em zigue-zague. No celular, três fotos: uma grande, na largura toda (a campanha
 * começa pela foto, não por miniaturas), e duas menores lado a lado. A quarta fica de fora.
 */
const QUADROS = [
  { li: "lg:col-span-7", proporcao: "aspect-[4/5] lg:aspect-square", tela: "(min-width: 1440px) 770px, (min-width: 1024px) 53vw" },
  { li: "lg:col-span-5 lg:self-end", proporcao: "aspect-[4/5]", tela: "(min-width: 1440px) 540px, (min-width: 1024px) 37vw" },
  { li: "lg:col-span-5 lg:self-start", proporcao: "aspect-[4/5]", tela: "(min-width: 1440px) 540px, (min-width: 1024px) 37vw" },
  { li: "lg:col-span-7", proporcao: "aspect-[4/5] lg:aspect-square", tela: "(min-width: 1440px) 770px, (min-width: 1024px) 53vw" },
];

/** Lugar de cada foto no celular (pela ordem visual, com order): a grande, as duas menores, ou fora. */
const NO_CELULAR = [
  { li: "max-lg:order-1 max-lg:col-span-2", largura: "100vw" },
  { li: "max-lg:order-2", largura: "46vw" },
  { li: "max-lg:order-3", largura: "46vw" },
];
const FORA_DO_CELULAR = { li: "max-lg:hidden", largura: "1px" };

/**
 * Ponto de interesse de cada foto no recorte quadrado do desktop. As fotos 2:3 do
 * inverno perdem um terço da altura no quadrado: sem isto a testa sai cortada.
 */
const FOCO: Record<string, string> = {
  "/images/colecoes/entrelacos-3.jpg": "object-[center_4%]",
  "/images/colecoes/entrelacos-1.jpg": "object-[center_30%]",
};

/** Campanha da coleção: quatro fotos em composição e, se houver, os filmes. */
export function CampanhaColecao({ nome, fotos, videos, capas }: Props) {
  const quadros = fotos.slice(0, QUADROS.length);
  // Celular: sem a foto da capa do celular; a da capa larga (se estiver aqui) na frente.
  const ordemCelular = [...new Set([capas?.tela, ...quadros])]
    .filter((u): u is string => typeof u === "string" && quadros.includes(u) && u !== capas?.celular)
    .slice(0, NO_CELULAR.length);
  return (
    <>
      <SectionHeading eyebrow="Campanha" title={videos.length > 0 ? "Campanha fotografada e filmada" : "Campanha fotografada"} />

      {quadros.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-3 md:gap-5 lg:mt-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10">
          {quadros.map((url, i) => {
            const celular = NO_CELULAR[ordemCelular.indexOf(url)] ?? FORA_DO_CELULAR;
            return (
              <li key={url} className={`${QUADROS[i].li} ${celular.li}`} data-reveal style={{ ["--atraso" as string]: `${(i % 2) * 80}ms` }}>
                <Figura
                  src={url}
                  alt={altFoto(url, `${nome}, campanha ${i + 1}`)}
                  sizes={`${QUADROS[i].tela}, ${celular.largura}`}
                  proporcao={QUADROS[i].proporcao}
                  foco={FOCO[url] ?? "object-[center_22%]"}
                />
              </li>
            );
          })}
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
