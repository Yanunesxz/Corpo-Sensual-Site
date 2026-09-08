/**
 * Textos das páginas institucionais (/politicas/[slug]).
 * São modelos iniciais: revise com o responsável jurídico antes de publicar
 * e mantenha a data de atualização em dia.
 */

export type Politica = {
  slug: string;
  title: string;
  shortTitle: string;
  updatedAt: string; // AAAA-MM-DD
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
};

const empresa = "Confecções Corpo Sensual Ltda";

export const politicas: Politica[] = [
  {
    slug: "privacidade",
    title: "Política de Privacidade",
    shortTitle: "Privacidade",
    updatedAt: "2026-09-08",
    intro:
      `A ${empresa} respeita a sua privacidade. Esta política explica quais dados coletamos neste site, como usamos e quais são os seus direitos, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).`,
    sections: [
      {
        heading: "Quais dados coletamos",
        paragraphs: [
          "Dados que você informa nos formulários: nome, e-mail, WhatsApp, se possui CNPJ, nome da loja, cidade e estado.",
          "Dados de navegação: página de origem, parâmetros de campanha (UTM) e informações técnicas básicas, como tipo de dispositivo e navegador.",
        ],
      },
      {
        heading: "Para que usamos",
        paragraphs: [
          "Entrar em contato comercial para envio do catálogo, condições de revenda e informações sobre coleções.",
          "Medir o desempenho das nossas campanhas e melhorar o site.",
          "Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.",
        ],
      },
      {
        heading: "Com quem compartilhamos",
        paragraphs: [
          "Fornecedores que operam nossa infraestrutura (hospedagem do site e banco de dados) e ferramentas de comunicação, sempre limitados ao necessário para prestar o serviço.",
          "Nossos representantes comerciais da sua região, para dar continuidade ao atendimento.",
        ],
      },
      {
        heading: "Seus direitos",
        paragraphs: [
          "Você pode solicitar a qualquer momento a confirmação, acesso, correção ou exclusão dos seus dados, além de revogar o consentimento. Basta entrar em contato pelos canais indicados no rodapé do site.",
        ],
      },
      {
        heading: "Retenção e segurança",
        paragraphs: [
          "Mantemos os dados pelo tempo necessário ao atendimento comercial e às obrigações legais. Adotamos medidas técnicas e organizacionais para proteger as informações contra acesso não autorizado.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Política de Cookies",
    shortTitle: "Cookies",
    updatedAt: "2026-09-08",
    intro:
      "Cookies são pequenos arquivos gravados no seu navegador. Usamos apenas o essencial para o funcionamento do site e para medir resultados de campanhas.",
    sections: [
      {
        heading: "Cookies que utilizamos",
        paragraphs: [
          "Essenciais: necessários para o site funcionar corretamente, como preferências de navegação.",
          "Estatísticos e de campanha: ajudam a entender de onde vêm as visitas (por exemplo, parâmetros UTM de anúncios) para melhorar nossa comunicação.",
        ],
      },
      {
        heading: "Como gerenciar",
        paragraphs: [
          "Você pode bloquear ou apagar cookies nas configurações do seu navegador. Algumas funcionalidades podem deixar de funcionar corretamente.",
        ],
      },
    ],
  },
  {
    slug: "trocas-e-devolucoes",
    title: "Política de Trocas e Devoluções",
    shortTitle: "Trocas e devoluções",
    updatedAt: "2026-09-08",
    intro:
      "Vendemos para lojistas (atacado). As condições abaixo valem para pedidos feitos por meio dos nossos representantes ou da plataforma B2B.",
    sections: [
      {
        heading: "Defeitos de fabricação",
        paragraphs: [
          "Peças com defeito de fabricação podem ser trocadas mediante comunicação ao representante ou ao nosso atendimento em até 30 dias após o recebimento, com foto do defeito e número do pedido.",
        ],
      },
      {
        heading: "Divergência no pedido",
        paragraphs: [
          "Se você receber itens diferentes do pedido (referência, tamanho ou quantidade), avise em até 7 dias após o recebimento para providenciarmos a correção.",
        ],
      },
      {
        heading: "Condições",
        paragraphs: [
          "As peças devem estar sem uso, com etiquetas e embalagem originais. Trocas por preferência de modelo ou cor são avaliadas caso a caso pelo representante.",
        ],
      },
    ],
  },
  {
    slug: "envio",
    title: "Política de Envio",
    shortTitle: "Envio",
    updatedAt: "2026-09-08",
    intro: "Os pedidos são despachados da nossa fábrica em Muriaé, MG, para todo o Brasil.",
    sections: [
      {
        heading: "Prazos",
        paragraphs: [
          "O prazo de produção e envio é informado pelo representante no fechamento do pedido e varia conforme a coleção e a quantidade. O prazo de transporte depende da transportadora e da região de entrega.",
        ],
      },
      {
        heading: "Frete e acompanhamento",
        paragraphs: [
          "O valor do frete é calculado por pedido, de acordo com o peso e o destino. Após o despacho, enviamos o código de rastreamento para acompanhamento.",
        ],
      },
    ],
  },
  {
    slug: "termos",
    title: "Termos e Condições",
    shortTitle: "Termos e condições",
    updatedAt: "2026-09-08",
    intro: `Ao utilizar este site você concorda com os termos abaixo. O site é mantido pela ${empresa}.`,
    sections: [
      {
        heading: "Uso do site",
        paragraphs: [
          "O conteúdo deste site (textos, imagens, marca e catálogo) pertence à Corpo Sensual e não pode ser reproduzido sem autorização.",
          "As informações de produtos são ilustrativas. Cores e estampas podem variar conforme o lote e a tela do dispositivo.",
        ],
      },
      {
        heading: "Relação comercial",
        paragraphs: [
          "As vendas são realizadas no atacado, para pessoas jurídicas, por meio de representantes comerciais e da plataforma B2B. Preços, condições de pagamento e pedidos mínimos são informados pelo representante.",
        ],
      },
      {
        heading: "Alterações",
        paragraphs: [
          "Podemos atualizar estes termos a qualquer momento. A data da última atualização fica indicada no topo desta página.",
        ],
      },
    ],
  },
];

export function getPolitica(slug: string): Politica | undefined {
  return politicas.find((p) => p.slug === slug);
}
