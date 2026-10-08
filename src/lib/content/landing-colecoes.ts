/**
 * Landing pages de coleção copiadas do Wix (www.corposensual.com.br/colecao-verao e
 * /colecao-inverno, capturadas em 08/10/2026), com as páginas de obrigado.
 *
 * Ficam FORA do site: sem menu, sem rodapé do site, fora do sitemap e com noindex,
 * como no Wix. Servem aos anúncios e links que já apontam para esses endereços.
 * Textos copiados letra por letra, inclusive "veráteis" e "custo-beneficio".
 *
 * As medidas (px no desktop, unidades de 1/320 da tela no celular) vêm da página do
 * Wix: onde verão e inverno diferem, o valor fica aqui; o resto está no CSS.
 */

export type ColecaoLanding = "verao" | "inverno";

/** Rotas das landing pages: sem cabeçalho, rodapé, barra fixa e WhatsApp do site. */
export const ROTAS_LANDING = ["/colecao-verao", "/colecao-inverno", "/colecao-verao-obrigado", "/colecao-inverno-obrigado"];

/** Link do rodapé do Wix: o WhatsApp da agência que fez o site (Sessu/Plumene). */
const WHATS_AGENCIA =
  "https://wa.me/5532987099388?text=Ol%C3%A1%2C%20vim%20atrav%C3%A9s%20do%20site%20PLUMENE%2C%20quero%20criar%20uma%20loja%20virtual.";
/** O mesmo número, com a mensagem "vim através do site Corpo Sensual" (rodapé do inverno). */
const WHATS_SITE_CS =
  "https://wa.me/5532987099388?text=Ol%C3%A1,%20vim%20atrav%C3%A9s%20do%20site%20Corpo%20Sensual.%20Quero%20saber%20mais%20sobre%20os%20seus%20servi%C3%A7os.";

/**
 * Arquivos dos catálogos, os mesmos do botão do obrigado no Wix.
 * O de inverno (PDF de 45 MB) mora no armazenamento de arquivos do Wix: continua
 * funcionando depois que o domínio vier para a Vercel, mas SOME quando o site do
 * Wix for excluído. Antes disso, suba o PDF no Google Drive e troque o link aqui.
 */
export const CATALOGO_VERAO = "https://drive.google.com/file/d/1Pl3JB0J2KDZvLxSwsETRM9UzAH6fF9Og/view?usp=sharing";
export const CATALOGO_INVERNO = "https://60a7494d-f2ed-4144-9f3d-24bae70d5bb6.filesusr.com/ugd/808368_ce23027037524b26acf949c217eafbde.pdf";

type Rodape = {
  /** Linhas da esquerda. */
  linhas: string[];
  /** "© 2024 Todos os direitos reservados" embaixo, à esquerda (inverno), sublinhado. */
  direitosEmbaixo?: { texto: string; href: string };
  /** O que fica à direita no desktop. */
  direita: { antes?: string; texto: string; href: string; sublinhado: boolean };
};

export type DadosLanding = {
  colecao: ColecaoLanding;
  titulo: string;
  /** Cores do Wix: fundo da capa e do formulário (a 50% sobre branco) e da faixa de texto. */
  corClara: string;
  corTexto: string;
  capa: {
    titulo: string;
    /** Subtítulo; "\n" é quebra de linha forçada, como no Wix. */
    texto: string;
    nota: string;
    /** "CNPJ" sublinhado na nota do inverno. */
    notaSublinhado?: string;
    foto: string;
    alt: string;
  };
  /** parallaxCelular: no Wix a faixa do verão tem parallax também no celular; a do inverno, não. */
  faixa: { foto: string; alt: string; posicao: string; parallaxCelular: boolean };
  apresentacao: { titulo: string; texto: string };
  galeria: {
    titulo: string;
    espacado: boolean;
    texto: string;
    fotos: { src: string; alt: string; foco: string }[];
  };
  formulario: { titulo: string; investimento: string };
  sobre: string;
  rodape: Rodape;
  /** Medidas que mudam entre as duas páginas (CSS custom properties). */
  medidas: Record<string, string>;
};

const RODAPE_LINHAS = ["CORPO SENSUAL LTDA - CNPJ 07.564.390/0001-71", "Rua São Geraldo, 190 Dornelas - Muriaé MG"];

export const LANDING: Record<ColecaoLanding, DadosLanding> = {
  verao: {
    colecao: "verao",
    titulo: "Coleção de Verão",
    corClara: "#f3faff",
    corTexto: "#e6f5fe",
    capa: {
      titulo: "A nova coleção de verão já está disponível",
      texto: "Baixe o catálogo e confira as novidades da primavera/ verão 2027",
      nota: "Venda exclusiva no atacado para lojas e revendedoras.",
      foto: "/images/lp/verao/capa.jpg",
      alt: "Modelo de regata rosa com fones de ouvido, coleção Delícias de Verão",
    },
    faixa: { foto: "/images/lp/verao/faixa.jpg", alt: "Modelo de short rosa canelado sentada numa toalha listrada", posicao: "50% 50%", parallaxCelular: true },
    apresentacao: {
      titulo: "Delícias de Verão",
      texto:
        "Entre pausas gostosas ao ar livre e pequenos momentos do dia a dia, a nova coleção traduz as delícias da estação em peças leves, confortáveis e veráteis para viver o verão com naturalidade.",
    },
    galeria: {
      titulo: "Pijamas para cada momento do dia",
      espacado: true,
      texto: "Uma coleção repleta de opções para sua loja crescer.",
      // Ponto de foco de cada foto, o mesmo do Wix (fp_x_y).
      fotos: [
        { src: "/images/lp/verao/galeria-1.jpg", alt: "Mãe e filha de short doll azul-marinho à mesa, na beira da piscina", foco: "46% 39%" },
        { src: "/images/lp/verao/galeria-2.jpg", alt: "Modelo de regata rosa e short florido na areia", foco: "66% 24%" },
        { src: "/images/lp/verao/galeria-3.jpg", alt: "Modelo de conjunto salmão com bolsa de palha no jardim", foco: "52% 22%" },
        { src: "/images/lp/verao/galeria-4.jpg", alt: "Pijama curto da coleção Delícias de Verão", foco: "51% 24%" },
        { src: "/images/lp/verao/galeria-5.jpg", alt: "Pijama curto da coleção Delícias de Verão", foco: "45% 34%" },
        { src: "/images/lp/verao/galeria-6.jpg", alt: "Pijama curto da coleção Delícias de Verão", foco: "45% 22%" },
        { src: "/images/lp/verao/galeria-7.jpg", alt: "Pijama curto da coleção Delícias de Verão", foco: "57% 36%" },
      ],
    },
    formulario: { titulo: "Baixe o novo catálogo!", investimento: "Investimento mínimo de R$ 600,00" },
    sobre:
      "Mais de 25 anos de história dedicadas ao bem estar, confeccionando conforto e estilo, combinados a tecidos de boa qualidade, e modelagem moderna com excelente custo-beneficio.",
    rodape: {
      linhas: RODAPE_LINHAS,
      direita: { texto: "© 2024 Todos os direitos reservados", href: WHATS_AGENCIA, sublinhado: false },
    },
    medidas: {
      // Desktop (px)
      "--capa-h": "825px",
      "--capa-topo": "133px",
      "--capa-p": "9px",
      "--capa-btn": "29px",
      "--capa-nota-w": "254px",
      "--capa-foto-top": "90px",
      "--capa-foto-left": "594px",
      "--capa-foto-w": "506px",
      "--capa-foto-h": "618px",
      "--texto-w": "577px",
      "--galeria-mt": "70px",
      "--form-titulo-w": "357px",
      // Celular (unidades de 1/320)
      "--m-capa-h1": "27",
      "--m-capa-foto-x": "17",
      "--m-capa-foto-w": "286",
      "--m-texto-h": "340",
      "--m-texto-topo": "81",
      "--m-galeria-h": "569",
      "--m-galeria-topo": "50",
    },
  },
  inverno: {
    colecao: "inverno",
    titulo: "Coleção Outono Inverno - Corpo Sensual",
    corClara: "#fdfdfd",
    corTexto: "#fafafa",
    capa: {
      titulo: "Nova Coleção Outono/ Inverno",
      texto: "Confira os lançamentos da nova\ncoleção outono/ inverno 2026.",
      nota: "Venda exclusiva para lojas físicas com CNPJ ativo.",
      notaSublinhado: "CNPJ",
      foto: "/images/lp/inverno/capa.jpg",
      alt: "Mãe e filha com pijama listrado de corações e laço branco no cabelo, coleção Entrelaços",
    },
    faixa: { foto: "/images/lp/inverno/faixa.jpg", alt: "Mãe e filha de mãos dadas com pijama listrado de corações", posicao: "50% 50%", parallaxCelular: false },
    apresentacao: {
      titulo: "Entrelaços",
      texto:
        "Nossa coleção nasce do encontro entre pessoas, rotinas e histórias! Uma coleção que valoriza o conforto, o ritmo do dia a dia e os momentos simples que criam laços.\n\nTecidos aconchegantes, com estética acolhedora e modelagem pensada para abraçar o corpo.",
    },
    galeria: {
      titulo: "Do primeiro ao último look do dia",
      espacado: false,
      texto: "Uma coleção completa de pijamas para sua loja crescer.",
      fotos: [1, 2, 3, 4, 5, 6].map((n) => ({
        src: `/images/lp/inverno/galeria-${n}.jpg`,
        alt: "Pijama de inverno da coleção Entrelaços",
        foco: "50% 50%",
      })),
    },
    formulario: { titulo: "Receba acesso a nova coleção", investimento: "Investimento mínimo de R$ 1.200,00" },
    sobre:
      "Confeccionamos conforto e estilo, combinados a tecidos de boa qualidade, modelagem moderna e atemporal com excelente custo-beneficio. Já são mais de 25 anos de história dedicadas ao bem-estar.",
    rodape: {
      linhas: RODAPE_LINHAS,
      direitosEmbaixo: { texto: "© 2024 Todos os direitos reservados", href: WHATS_SITE_CS },
      direita: { antes: "Desenvolvido por ", texto: "Sessu", href: WHATS_AGENCIA, sublinhado: true },
    },
    medidas: {
      "--capa-h": "700px",
      "--capa-topo": "120px",
      "--capa-p": "15px",
      "--capa-btn": "32px",
      "--capa-nota-w": "231px",
      "--capa-foto-top": "106px",
      "--capa-foto-left": "596px",
      "--capa-foto-w": "400px",
      "--capa-foto-h": "488px",
      "--texto-w": "589px",
      "--galeria-mt": "37px",
      "--form-titulo-w": "308px",
      "--m-capa-h1": "30",
      "--m-capa-foto-x": "20",
      "--m-capa-foto-w": "275",
      "--m-texto-h": "319",
      "--m-texto-topo": "37",
      "--m-galeria-h": "549",
      "--m-galeria-topo": "70",
    },
  },
};

/** Páginas de obrigado: o botão leva ao arquivo do catálogo. */
export const OBRIGADO: Record<
  ColecaoLanding,
  {
    titulo: string;
    chamada: string;
    espacado: boolean;
    catalogo: string;
    foto: string;
    alt: string;
    corFundo: string;
    rodape: Rodape;
  }
> = {
  verao: {
    titulo: "Coleção de Verão",
    chamada: "Baixe agora mesmo nosso novo catálogo!",
    espacado: true,
    catalogo: CATALOGO_VERAO,
    foto: "/images/lp/verao/capa.jpg",
    alt: "Modelo de regata rosa com fones de ouvido, coleção Delícias de Verão",
    corFundo: "#f3faff",
    rodape: LANDING.verao.rodape,
  },
  inverno: {
    titulo: "Baixe o Catálogo!",
    chamada: "Baixe agora mesmo nosso catálogo!",
    espacado: false,
    catalogo: CATALOGO_INVERNO,
    foto: "/images/lp/inverno/obrigado.jpg",
    alt: "Modelo de regata azul e short estampado numa espreguiçadeira à beira da piscina",
    corFundo: "#ffffff",
    rodape: LANDING.inverno.rodape,
  },
};
