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
    updatedAt: "2026-09-29",
    intro:
      `A ${empresa} respeita a sua privacidade. Esta política explica quais dados coletamos neste site, como usamos e quais são os seus direitos, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).`,
    sections: [
      {
        heading: "Quais dados coletamos",
        paragraphs: [
          "Dados que você informa nos formulários: nome, e-mail, WhatsApp, se possui CNPJ, o número do CNPJ ou do CPF, nome da loja, cidade, estado e a mensagem que você escrever.",
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
          "Google, pelo Google Analytics, com dados de navegação (páginas vistas, origem da visita, tipo de aparelho e cliques), somente se você aceitar os cookies de estatística. Esses dados podem ser tratados fora do Brasil. O Google não recebe o que você preenche nos formulários.",
        ],
      },
      {
        heading: "Seus direitos",
        paragraphs: [
          "Você pode solicitar a qualquer momento a confirmação, acesso, correção ou exclusão dos seus dados, além de revogar o consentimento. Basta entrar em contato pela página de contato do site ou pelos canais indicados no rodapé.",
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
    updatedAt: "2026-09-29",
    intro:
      "Cookies são pequenos arquivos gravados no seu navegador. Este site só grava cookies de estatística se você clicar em Aceitar no aviso que aparece na primeira visita.",
    sections: [
      {
        heading: "O que o site guarda sem pedir aceite",
        paragraphs: [
          "A sua resposta ao aviso de cookies, por 12 meses, para ele não aparecer de novo em toda página.",
          "Só nesta aba, até você fechar: a campanha pela qual você chegou (parâmetros UTM de anúncios e links), que segue junto com o cadastro que você enviar.",
          "Depois que você envia um formulário, e só nesta aba: o nome, a loja, a cidade e o estado que você digitou, para montar a mensagem do WhatsApp na página seguinte. Esses dados não vão para o Google e somem quando a aba fecha.",
        ],
      },
      {
        heading: "Estatística (Google Analytics), só com o seu aceite",
        paragraphs: [
          "Conta as visitas, as páginas vistas, de onde a visita veio (busca, anúncio, Instagram), o tipo de aparelho, a cidade aproximada e os cliques nos botões de catálogo e de WhatsApp. Os cookies _ga e _ga_* ficam no navegador por até 2 anos.",
          ...(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSAO
            ? ["Quando você chega por um anúncio do Google, o mesmo aceite permite registrar se o cadastro foi enviado, para sabermos quais anúncios trazem lojistas. Não usamos esses dados para anúncios personalizados."]
            : []),
          "Nunca enviamos ao Google o seu nome, e-mail, telefone, CNPJ, CPF ou o que você escrever nos formulários.",
          "O Google Analytics é um serviço do Google, que pode tratar esses dados fora do Brasil. Saiba mais em policies.google.com/privacy.",
        ],
      },
      {
        heading: "Como mudar a sua escolha",
        paragraphs: [
          "Use o link Preferências de cookies, no rodapé de qualquer página, para aceitar ou recusar quando quiser. Ao recusar, paramos a medição e apagamos os cookies do Google Analytics deste site.",
          "Você também pode apagar os cookies nas configurações do seu navegador.",
        ],
      },
    ],
  },
  {
    slug: "trocas-e-devolucoes",
    title: "Política de Trocas e Devoluções",
    shortTitle: "Trocas e devoluções",
    updatedAt: "2026-09-29",
    intro:
      "Vendemos para lojistas (atacado). As condições abaixo valem para pedidos feitos por meio dos nossos representantes.",
    sections: [
      {
        heading: "Defeitos de fabricação",
        paragraphs: [
          "Peças com defeito de fabricação podem ser trocadas mediante comunicação ao representante ou pela página de contato do site em até 15 dias após o recebimento, com foto do defeito e número do pedido.",
        ],
      },
      {
        heading: "Divergência no pedido",
        paragraphs: [
          "Se você receber itens diferentes do pedido (referência, tamanho ou quantidade), avise em até 15 dias após o recebimento para providenciarmos a correção.",
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
    updatedAt: "2026-09-11",
    intro: "Os pedidos são despachados da nossa fábrica em Muriaé, MG, para todo o Brasil.",
    sections: [
      {
        heading: "Prazos",
        paragraphs: [
          "O pedido sai da nossa fábrica em até 15 dias úteis. Temos referências a pronta entrega e, conforme a composição do pedido, o envio pode ocorrer no mesmo dia. O prazo de transporte é somado a esse e depende da transportadora e da região de entrega.",
        ],
      },
      {
        heading: "Frete e acompanhamento",
        paragraphs: [
          "O frete é grátis a partir de R$ 1.200,00 para a região Sudeste e a partir de R$ 2.000,00 para as demais regiões. Abaixo desses valores, o frete é calculado por pedido, de acordo com o peso e o destino. Após o despacho, enviamos o código de rastreamento para acompanhamento.",
        ],
      },
    ],
  },
  {
    slug: "termos",
    title: "Termos e Condições",
    shortTitle: "Termos e condições",
    updatedAt: "2026-09-29",
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
          "As vendas são realizadas no atacado, por meio de representantes comerciais. Aceitamos Pix, boleto e cartão; no Pix há 5% de desconto e no cartão o parcelamento é sem juros. Não há valor mínimo de pedido. Preços e demais condições são informados pelo representante.",
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
